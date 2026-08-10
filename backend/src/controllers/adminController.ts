import { Request, Response } from 'express';
import { pool } from '../lib/db';
import { RowDataPacket } from 'mysql2';

export const getStats = async (req: Request, res: Response) => {
  try {
    const [[bookingCount]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM booking WHERE status != "Selesai" AND status != "Dibatalkan"');
    const [[layananCount]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM layanan');
    const [[pelangganCount]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users WHERE role = "PELANGGAN"');
    
    res.json({
      bookingMenunggu: bookingCount.count,
      totalLayanan: layananCount.count,
      totalPelanggan: pelangganCount.count
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.id, b.tanggal_booking, b.status, u.nama as pelanggan_nama, k.plat_nomor, l.nama_layanan
      FROM booking b
      JOIN users u ON b.pelanggan_id = u.id
      JOIN kendaraan k ON b.kendaraan_id = k.id
      JOIN layanan l ON b.layanan_id = l.id
      ORDER BY b.tanggal_booking DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nama, email, no_telepon, createdAt 
      FROM users WHERE role = 'PELANGGAN'
      ORDER BY createdAt DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT k.id, k.plat_nomor, k.merk, k.tipe, k.tahun, u.nama as pemilik
      FROM kendaraan k
      JOIN users u ON k.user_id = u.id
      ORDER BY k.createdAt DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM layanan ORDER BY createdAt DESC`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};
