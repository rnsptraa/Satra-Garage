import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

// Create a connection pool using the DATABASE_URL
export const pool = mysql.createPool(connectionString);
