import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../lib/db';
import { z } from 'zod';
import crypto from 'crypto';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-me-in-production';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nama: z.string().min(2),
  no_telepon: z.string().optional(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Check if user exists
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [validatedData.email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const userId = crypto.randomUUID();

    // Insert new user
    await pool.query(
      'INSERT INTO users (id, email, password, nama, no_telepon, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, validatedData.email, hashedPassword, validatedData.nama, validatedData.no_telepon || null, 'PELANGGAN']
    );

    res.status(201).json({ message: 'Registrasi berhasil', user: { id: userId, email: validatedData.email, nama: validatedData.nama } });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user by email
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [validatedData.email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role
      }
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
