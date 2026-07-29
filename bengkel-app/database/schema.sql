-- ============================================================
-- APLIKASI BOOKING SERVIS BENGKEL
-- Schema Database untuk Supabase (PostgreSQL)
-- Jalankan file ini di SQL Editor Supabase secara berurutan
-- ============================================================

-- Aktifkan ekstensi UUID jika belum aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TABEL USERS
-- Menyimpan semua akun pengguna dengan role berbasis RBAC.
-- password_hash disimpan sebagai bcrypt hash, BUKAN plain text.
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    no_hp         VARCHAR(20),
    role          VARCHAR(20)  NOT NULL DEFAULT 'pelanggan'
                               CHECK (role IN ('pelanggan', 'admin', 'super_admin')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index untuk mempercepat pencarian login berdasarkan email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- ============================================================
-- 2. TABEL KENDARAAN
-- Setiap pelanggan bisa memiliki lebih dari 1 kendaraan.
-- ON DELETE CASCADE: jika user dihapus, kendaraannya ikut terhapus.
-- ============================================================
CREATE TABLE IF NOT EXISTS kendaraan (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plat_nomor  VARCHAR(20) NOT NULL,
    merk        VARCHAR(50) NOT NULL,
    tipe        VARCHAR(50) NOT NULL,
    tahun       SMALLINT    NOT NULL CHECK (tahun >= 1900 AND tahun <= 2100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk mempercepat query kendaraan milik user tertentu
CREATE INDEX IF NOT EXISTS idx_kendaraan_user_id ON kendaraan(user_id);

-- ============================================================
-- 3. TABEL LAYANAN
-- Master data jenis servis yang tersedia di bengkel.
-- Hanya super_admin yang boleh CRUD tabel ini.
-- ============================================================
CREATE TABLE IF NOT EXISTS layanan (
    id                    UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_layanan          VARCHAR(100)   NOT NULL,
    deskripsi             TEXT,
    harga                 NUMERIC(12, 2) NOT NULL CHECK (harga >= 0),
    estimasi_waktu_menit  INT            NOT NULL CHECK (estimasi_waktu_menit > 0),
    is_active             BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. TABEL BOOKINGS
-- Inti dari sistem: setiap booking terhubung ke user, kendaraan,
-- dan berisi status alur kerja bengkel.
-- kode_booking dibuat otomatis (format: BKG-YYYYMMDD-XXXX).
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode_booking     VARCHAR(30)    NOT NULL UNIQUE,
    user_id          UUID           NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    kendaraan_id     UUID           NOT NULL REFERENCES kendaraan(id) ON DELETE RESTRICT,
    tanggal_booking  DATE           NOT NULL,
    jam_booking      TIME           NOT NULL,
    status           VARCHAR(20)    NOT NULL DEFAULT 'Menunggu'
                                    CHECK (status IN ('Menunggu', 'Diproses', 'Selesai', 'Dibatalkan')),
    total_harga      NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_harga >= 0),
    catatan_keluhan  TEXT,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Index untuk query yang paling sering dipakai
CREATE INDEX IF NOT EXISTS idx_bookings_user_id        ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_kendaraan_id   ON bookings(kendaraan_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status         ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_tanggal        ON bookings(tanggal_booking);

-- ============================================================
-- 5. TABEL BOOKING_DETAILS
-- Relasi many-to-many antara booking dan layanan.
-- Satu booking bisa memiliki banyak layanan.
-- harga_satuan di-snapshot saat booking dibuat (tidak berubah
-- walaupun harga layanan di-update kemudian).
-- ============================================================
CREATE TABLE IF NOT EXISTS booking_details (
    id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id   UUID           NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    layanan_id   UUID           NOT NULL REFERENCES layanan(id) ON DELETE RESTRICT,
    harga_satuan NUMERIC(12, 2) NOT NULL CHECK (harga_satuan >= 0),
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    -- Mencegah layanan yang sama ditambahkan dua kali dalam 1 booking
    UNIQUE (booking_id, layanan_id)
);

CREATE INDEX IF NOT EXISTS idx_booking_details_booking_id ON booking_details(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_details_layanan_id ON booking_details(layanan_id);

-- ============================================================
-- 6. TABEL PEMBAYARAN
-- Dikelola oleh admin/kasir setelah servis selesai.
-- admin_id mencatat siapa yang memproses pembayaran.
-- ============================================================
CREATE TABLE IF NOT EXISTS pembayaran (
    id             UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id     UUID           NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE RESTRICT,
    admin_id       UUID           NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    metode         VARCHAR(30)    NOT NULL CHECK (metode IN ('Tunai', 'Transfer', 'QRIS', 'Debit')),
    total_tagihan  NUMERIC(12, 2) NOT NULL CHECK (total_tagihan >= 0),
    status_bayar   VARCHAR(20)    NOT NULL DEFAULT 'Belum Lunas'
                                  CHECK (status_bayar IN ('Belum Lunas', 'Lunas')),
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pembayaran_booking_id ON pembayaran(booking_id);
CREATE INDEX IF NOT EXISTS idx_pembayaran_admin_id   ON pembayaran(admin_id);

-- ============================================================
-- FUNGSI & TRIGGER
-- ============================================================

-- Trigger: otomatis update kolom updated_at saat row diubah
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_pembayaran_updated_at
    BEFORE UPDATE ON pembayaran
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FUNGSI: Generate kode booking otomatis
-- Format: BKG-YYYYMMDD-0001 (reset per tanggal)
-- ============================================================
CREATE OR REPLACE FUNCTION generate_kode_booking()
RETURNS TEXT AS $$
DECLARE
    today       TEXT;
    today_count INT;
    kode        TEXT;
BEGIN
    today := TO_CHAR(NOW(), 'YYYYMMDD');
    SELECT COUNT(*) + 1
    INTO   today_count
    FROM   bookings
    WHERE  tanggal_booking = CURRENT_DATE;
    kode := 'BKG-' || today || '-' || LPAD(today_count::TEXT, 4, '0');
    RETURN kode;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- DATA SEED: Super Admin default & beberapa layanan contoh
-- Password untuk super_admin: "SuperAdmin123!" (bcrypt hash)
-- Ganti hash ini dengan hash asli dari aplikasimu sebelum deploy
-- ============================================================
INSERT INTO users (nama, email, password_hash, no_hp, role)
VALUES (
    'Super Admin',
    'superadmin@bengkel.com',
    '$2b$12$placeholder_hash_ganti_dengan_bcrypt_asli',
    '081200000000',
    'super_admin'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO layanan (nama_layanan, deskripsi, harga, estimasi_waktu_menit) VALUES
    ('Ganti Oli Mesin',      'Penggantian oli mesin standar',             75000,  30),
    ('Servis Rem',           'Pemeriksaan dan penggantian kampas rem',    120000,  60),
    ('Tune Up',              'Servis lengkap filter udara, busi, oli',   250000, 120),
    ('Ganti Ban',            'Penggantian ban (harga belum termasuk ban)', 50000,  45),
    ('Cek Aki & Kelistrikan','Pengecekan sistem kelistrikan kendaraan',   85000,  60),
    ('Cuci Motor/Mobil',     'Cuci standar dengan sabun dan lap kering',  30000,  20)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Rekomendasi untuk Supabase
-- Aktifkan jika menggunakan Supabase Auth langsung dari client.
-- Untuk arsitektur dengan Backend (Express) sebagai perantara,
-- RLS bisa dinonaktifkan dan otorisasi dilakukan di middleware.
-- ============================================================
-- ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE kendaraan      ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE booking_details ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pembayaran     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE layanan        ENABLE ROW LEVEL SECURITY;
