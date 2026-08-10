'use server'

import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api'

export async function searchBooking(bookingId: string) {
  const session = await getSession()
  
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Akses ditolak. Hanya admin yang bisa mencari booking.' }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/booking/${bookingId}`, {
      cache: 'no-store'
    })

    const data = await res.json()
    
    if (!res.ok) {
      return { error: data.error || 'Terjadi kesalahan saat mencari booking' }
    }

    return { success: true, booking: data }
  } catch (err) {
    console.error(err)
    return { error: 'Gagal terhubung ke server backend' }
  }
}

export async function processPayment(bookingId: string, totalBayar: number) {
  const session = await getSession()
  
  if (!session || session.role !== 'ADMIN') {
    return { error: 'Akses ditolak.' }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/booking/${bookingId}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_id: session.userId,
        total_bayar: totalBayar,
        metode_pembayaran: 'Tunai'
      })
    })

    const data = await res.json()
    
    if (!res.ok) {
      return { error: data.error || 'Terjadi kesalahan saat memproses pembayaran' }
    }

    revalidatePath('/admin/booking')
    return { success: true, message: data.message }
  } catch (err) {
    console.error(err)
    return { error: 'Gagal terhubung ke server backend' }
  }
}
