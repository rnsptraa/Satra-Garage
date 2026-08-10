'use server'

import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api'

export async function createBookingAction(formData: FormData) {
  const session = await getSession()
  
  if (!session || !session.userId) {
    redirect('/login')
  }

  const layanan_id = formData.get('layanan_id') as string
  const tanggal_booking = formData.get('tanggal_booking') as string
  const jam_booking = formData.get('jam_booking') as string
  const merk_kendaraan = formData.get('merk_kendaraan') as string
  const tipe_kendaraan = formData.get('tipe_kendaraan') as string
  const plat_nomor = formData.get('plat_nomor') as string
  const keluhan = formData.get('keluhan') as string

  if (!layanan_id || !tanggal_booking || !jam_booking || !merk_kendaraan || !tipe_kendaraan || !plat_nomor) {
    return { error: 'Harap lengkapi semua data wajib.' }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pelanggan_id: session.userId,
        layanan_id,
        tanggal_booking,
        jam_booking,
        merk_kendaraan,
        tipe_kendaraan,
        plat_nomor,
        keluhan
      })
    })

    const data = await res.json()
    if (!res.ok) {
      return { error: data.error || 'Terjadi kesalahan saat memproses booking' }
    }

    // Return success and bookingId so the client can show the success UI
    return { success: true, bookingId: data.bookingId }
  } catch (err: any) {
    console.error(err)
    if (err.message === 'NEXT_REDIRECT') throw err
    return { error: 'Gagal terhubung ke server backend' }
  }
}
