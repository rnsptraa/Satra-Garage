import { Request, Response } from 'express';
import { pool } from '../lib/db';
import { RowDataPacket } from 'mysql2';

export const getRiwayat = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(`
      SELECT b.id, b.tanggal_booking, b.status, b.catatan, k.plat_nomor, k.merk, k.tipe, l.nama_layanan, l.harga,
      t.total_bayar, t.metode_pembayaran, t.status_pembayaran, t.id as transaksi_id, t.tanggal_bayar
      FROM booking b
      JOIN kendaraan k ON b.kendaraan_id = k.id
      JOIN layanan l ON b.layanan_id = l.id
      LEFT JOIN transaksi t ON b.id = t.booking_id
      WHERE b.pelanggan_id = ?
      ORDER BY b.tanggal_booking DESC
    `, [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const getKendaraan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(`
      SELECT id, plat_nomor, merk, tipe, tahun, createdAt
      FROM kendaraan
      WHERE user_id = ?
      ORDER BY createdAt DESC
    `, [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};
