import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  no_telepon: z.string().min(9, 'Nomor telepon minimal 9 digit').optional(),
})

export const kendaraanSchema = z.object({
  plat_nomor: z.string().min(3, 'Plat nomor tidak valid'),
  merk: z.string().min(2, 'Merk tidak valid'),
  tipe: z.string().min(2, 'Tipe tidak valid'),
  tahun: z.coerce.number().min(1950, 'Tahun tidak valid').max(new Date().getFullYear(), 'Tahun tidak valid'),
})

export const layananSchema = z.object({
  nama_layanan: z.string().min(3, 'Nama layanan minimal 3 karakter'),
  deskripsi: z.string().optional(),
  harga: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  estimasi_waktu: z.coerce.number().min(1, 'Estimasi waktu minimal 1 menit'),
})

export const bookingSchema = z.object({
  kendaraan_id: z.string().uuid('Kendaraan harus dipilih'),
  layanan_id: z.string().uuid('Layanan harus dipilih'),
  tanggal_booking: z.string().min(1, 'Tanggal booking harus diisi'),
  catatan: z.string().optional(),
})

export const transaksiSchema = z.object({
  booking_id: z.string().uuid('Booking tidak valid'),
  total_bayar: z.coerce.number().min(0, 'Total bayar tidak valid'),
  metode_pembayaran: z.string().min(1, 'Metode pembayaran harus diisi'),
  status_pembayaran: z.enum(['Lunas', 'Belum Lunas']),
})
