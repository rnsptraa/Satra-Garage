-- ==============================================================================
-- 1. EXTENSIONS & TYPES
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- Drop existing tables to avoid 'relation already exists' errors when re-running
DROP TABLE IF EXISTS public.transaksi CASCADE;
DROP TABLE IF EXISTS public.booking CASCADE;
DROP TABLE IF EXISTS public.layanan CASCADE;
DROP TABLE IF EXISTS public.kendaraan CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- a. Table: users
-- Extending Supabase auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  no_telepon TEXT,
  role TEXT DEFAULT 'pelanggan' CHECK (role IN ('pelanggan', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- b. Table: kendaraan
CREATE TABLE public.kendaraan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plat_nomor TEXT NOT NULL UNIQUE,
  merk TEXT NOT NULL,
  tipe TEXT NOT NULL,
  tahun INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- c. Table: layanan
CREATE TABLE public.layanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_layanan TEXT NOT NULL,
  deskripsi TEXT,
  harga NUMERIC NOT NULL,
  estimasi_waktu INTEGER, -- in minutes
  created_at TIMESTAMPTZ DEFAULT now()
);

-- d. Table: booking
CREATE TABLE public.booking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pelanggan_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  kendaraan_id UUID NOT NULL REFERENCES public.kendaraan(id) ON DELETE CASCADE,
  layanan_id UUID NOT NULL REFERENCES public.layanan(id) ON DELETE CASCADE,
  tanggal_booking TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Menunggu' CHECK (status IN ('Menunggu', 'Diproses', 'Selesai', 'Dibatalkan')),
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- e. Table: transaksi
CREATE TABLE public.transaksi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.booking(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Cashier who processed payment
  total_bayar NUMERIC NOT NULL,
  metode_pembayaran TEXT, -- e.g., Tunai, QRIS
  status_pembayaran TEXT DEFAULT 'Lunas' CHECK (status_pembayaran IN ('Lunas', 'Belum Lunas')),
  tanggal_bayar TIMESTAMPTZ DEFAULT now()
);


-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kendaraan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaksi ENABLE ROW LEVEL SECURITY;

-- users Table Policies
-- 1. Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
-- 2. Admins and Super Admins can read all users
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
-- 3. Super Admins can insert/update/delete users
CREATE POLICY "Super Admins can modify users" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
  );

-- kendaraan Table Policies
-- 1. Customers can read their own vehicles
CREATE POLICY "Customers can read own vehicles" ON public.kendaraan
  FOR SELECT USING (auth.uid() = user_id);
-- 2. Customers can insert/update/delete their own vehicles
CREATE POLICY "Customers can modify own vehicles" ON public.kendaraan
  FOR ALL USING (auth.uid() = user_id);
-- 3. Admins and Super Admins can read/modify all vehicles
CREATE POLICY "Admins can access all vehicles" ON public.kendaraan
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- layanan Table Policies
-- 1. Everyone can read services
CREATE POLICY "Everyone can read services" ON public.layanan
  FOR SELECT USING (true);
-- 2. Only Admins and Super Admins can modify services
CREATE POLICY "Admins can modify services" ON public.layanan
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- booking Table Policies
-- 1. Customers can read their own bookings
CREATE POLICY "Customers can read own bookings" ON public.booking
  FOR SELECT USING (auth.uid() = pelanggan_id);
-- 2. Customers can create own bookings
CREATE POLICY "Customers can create own bookings" ON public.booking
  FOR INSERT WITH CHECK (auth.uid() = pelanggan_id);
-- 3. Customers can update own bookings (e.g. cancel)
CREATE POLICY "Customers can update own bookings" ON public.booking
  FOR UPDATE USING (auth.uid() = pelanggan_id);
-- 4. Admins and Super Admins can read/modify all bookings
CREATE POLICY "Admins can access all bookings" ON public.booking
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- transaksi Table Policies
-- 1. Customers can read their own transactions
CREATE POLICY "Customers can read own transactions" ON public.transaksi
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.booking WHERE booking.id = transaksi.booking_id AND booking.pelanggan_id = auth.uid())
  );
-- 2. Admins and Super Admins can read/modify all transactions
CREATE POLICY "Admins can access all transactions" ON public.transaksi
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );


-- ==============================================================================
-- 4. TRIGGERS
-- ==============================================================================
-- Auto insert to public.users when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, nama, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'nama', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'pelanggan')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==============================================================================
-- 5. SEED DATA (Services)
-- ==============================================================================
INSERT INTO public.layanan (nama_layanan, deskripsi, harga, estimasi_waktu) VALUES
('Servis Rutin Ringan', 'Ganti oli, cek kampas rem, busi, dan tegangan aki.', 150000, 60),
('Servis Besar / Berat', 'Bongkar mesin (turun mesin), ganti piston, dll.', 750000, 360),
('Ganti Oli Mesin', 'Ganti oli mesin standar pabrik.', 65000, 30),
('Ganti Kampas Rem', 'Ganti kampas rem depan atau belakang.', 85000, 45),
('Tune Up Injeksi', 'Pembersihan injektor, throttle body, reset ECU.', 200000, 90)
ON CONFLICT DO NOTHING;
