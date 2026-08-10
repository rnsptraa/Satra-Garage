-- ==============================================================================
-- DATABASE MYSQL SCHEMA UNTUK BENGKEL
-- ==============================================================================

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS tugas_bengkel;
USE tugas_bengkel;

-- ==============================================================================
-- 1. DROP TABLES (Hapus tabel jika sudah ada, urutan dari child ke parent)
-- ==============================================================================
DROP TABLE IF EXISTS transaksi;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS layanan;
DROP TABLE IF EXISTS kendaraan;
DROP TABLE IF EXISTS users;

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- a. Table: users
CREATE TABLE users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) UNIQUE NOT NULL,
  password VARCHAR(191) NOT NULL,
  nama VARCHAR(191) NOT NULL,
  no_telepon VARCHAR(191),
  role ENUM('PELANGGAN', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'PELANGGAN',
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

-- b. Table: kendaraan
CREATE TABLE kendaraan (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  plat_nomor VARCHAR(191) UNIQUE NOT NULL,
  merk VARCHAR(191) NOT NULL,
  tipe VARCHAR(191) NOT NULL,
  tahun INT,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_kendaraan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- c. Table: layanan
CREATE TABLE layanan (
  id VARCHAR(191) PRIMARY KEY,
  nama_layanan VARCHAR(191) NOT NULL,
  deskripsi VARCHAR(191),
  harga DECIMAL(65, 30) NOT NULL,
  estimasi_waktu INT, -- dalam menit
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)
);

-- d. Table: booking
CREATE TABLE booking (
  id VARCHAR(191) PRIMARY KEY,
  pelanggan_id VARCHAR(191) NOT NULL,
  kendaraan_id VARCHAR(191) NOT NULL,
  layanan_id VARCHAR(191) NOT NULL,
  tanggal_booking DATETIME(3) NOT NULL,
  status ENUM('Menunggu', 'Diproses', 'Selesai', 'Dibatalkan') DEFAULT 'Menunggu',
  catatan TEXT,
  createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_booking_pelanggan FOREIGN KEY (pelanggan_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_booking_kendaraan FOREIGN KEY (kendaraan_id) REFERENCES kendaraan(id) ON DELETE CASCADE,
  CONSTRAINT fk_booking_layanan FOREIGN KEY (layanan_id) REFERENCES layanan(id) ON DELETE CASCADE
);

-- e. Table: transaksi
CREATE TABLE transaksi (
  id VARCHAR(191) PRIMARY KEY,
  booking_id VARCHAR(191) UNIQUE NOT NULL,
  admin_id VARCHAR(191),
  total_bayar DECIMAL(65, 30) NOT NULL,
  metode_pembayaran VARCHAR(191),
  status_pembayaran ENUM('Lunas', 'Belum Lunas') DEFAULT 'Lunas',
  tanggal_bayar DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_transaksi_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE,
  CONSTRAINT fk_transaksi_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==============================================================================
-- 3. SEED DATA (Data Awal Layanan)
-- ==============================================================================
INSERT INTO layanan (id, nama_layanan, deskripsi, harga, estimasi_waktu) VALUES
(UUID(), 'Servis Rutin Ringan', 'Ganti oli, cek kampas rem, busi, dan tegangan aki.', 150000.00, 60),
(UUID(), 'Servis Besar / Berat', 'Bongkar mesin (turun mesin), ganti piston, dll.', 750000.00, 360),
(UUID(), 'Ganti Oli Mesin', 'Ganti oli mesin standar pabrik.', 65000.00, 30),
(UUID(), 'Ganti Kampas Rem', 'Ganti kampas rem depan atau belakang.', 85000.00, 45),
(UUID(), 'Tune Up Injeksi', 'Pembersihan injektor, throttle body, reset ECU.', 200000.00, 90);
