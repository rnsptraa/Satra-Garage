import { Request, Response } from 'express';
import { pool } from '../lib/db';
import { RowDataPacket } from 'mysql2';
import crypto from 'crypto';

export const getLayanan = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM layanan ORDER BY nama_layanan ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil data layanan' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { 
      pelanggan_id, 
      layanan_id, 
      tanggal_booking, 
      jam_booking, 
      merk_kendaraan, 
      tipe_kendaraan, 
      plat_nomor, 
      keluhan 
    } = req.body;

    if (!pelanggan_id || !layanan_id || !tanggal_booking || !jam_booking || !merk_kendaraan || !tipe_kendaraan || !plat_nomor) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi!' });
    }

    // Combine date and time for MySQL DATETIME
    const datetimeBooking = `${tanggal_booking} ${jam_booking}:00`;

    // Generate unique short code for booking (e.g. BKG-A1B2C3)
    const uniqueCode = 'BKG-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // Find or create kendaraan
    let kendaraanId;
    const [existingKendaraan] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM kendaraan WHERE plat_nomor = ?',
      [plat_nomor]
    );

    if (existingKendaraan.length > 0) {
      kendaraanId = existingKendaraan[0].id;
    } else {
      kendaraanId = crypto.randomUUID();
      await pool.query(
        'INSERT INTO kendaraan (id, user_id, plat_nomor, merk, tipe, tahun) VALUES (?, ?, ?, ?, ?, ?)',
        [kendaraanId, pelanggan_id, plat_nomor, merk_kendaraan, tipe_kendaraan, new Date().getFullYear()]
      );
    }

    await pool.query(
      `INSERT INTO booking (id, pelanggan_id, kendaraan_id, layanan_id, tanggal_booking, catatan, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'Menunggu')`,
      [uniqueCode, pelanggan_id, kendaraanId, layanan_id, datetimeBooking, keluhan || null]
    );

    res.status(201).json({ message: 'Booking berhasil dibuat', bookingId: uniqueCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat booking' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         b.id, b.tanggal_booking, b.status, b.catatan,
         u.nama as pelanggan_nama, u.email as pelanggan_email, u.no_telepon as pelanggan_telepon,
         k.plat_nomor, k.merk, k.tipe,
         l.nama_layanan, l.harga, l.estimasi_waktu
       FROM booking b
       JOIN users u ON b.pelanggan_id = u.id
       JOIN kendaraan k ON b.kendaraan_id = k.id
       JOIN layanan l ON b.layanan_id = l.id
       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Kode Booking tidak ditemukan' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mencari data booking' });
  }
};

export const payBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { admin_id, total_bayar, metode_pembayaran } = req.body;

    if (!admin_id || !total_bayar) {
      return res.status(400).json({ error: 'Admin ID dan Total Bayar wajib diisi' });
    }

    // Check if transaction already exists
    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM transaksi WHERE booking_id = ?', [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Booking ini sudah dibayar' });
    }

    const transaksiId = crypto.randomUUID();

    await pool.query(
      `INSERT INTO transaksi (id, booking_id, admin_id, total_bayar, metode_pembayaran, status_pembayaran) 
       VALUES (?, ?, ?, ?, ?, 'Lunas')`,
      [transaksiId, id, admin_id, total_bayar, metode_pembayaran || 'Tunai']
    );

    await pool.query('UPDATE booking SET status = ? WHERE id = ?', ['Selesai', id]);

    res.json({ message: 'Pembayaran berhasil dan booking diselesaikan', transaksiId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses pembayaran' });
  }
};
