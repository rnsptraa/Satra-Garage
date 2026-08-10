import { pool } from './src/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function seedAdmin() {
  try {
    const adminEmail = 'admin@satra.com';
    const adminPassword = 'admin'; // simple password for local dev
    const adminName = 'Administrator';

    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    
    // @ts-ignore
    if (rows.length > 0) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const userId = crypto.randomUUID();

    await pool.query(
      'INSERT INTO users (id, email, password, nama, role) VALUES (?, ?, ?, ?, ?)',
      [userId, adminEmail, hashedPassword, adminName, 'ADMIN']
    );

    console.log('Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
