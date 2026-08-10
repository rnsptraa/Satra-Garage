'use server'

import { createSession, destroySession } from '@/lib/auth'
import { redirect } from 'next/navigation'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan Password wajib diisi' }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if (!res.ok) {
      return { error: data.error || 'Terjadi kesalahan saat login' }
    }

    await createSession(data.user.id, data.user.role)
    
    if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
      redirect('/admin/dashboard')
    } else {
      redirect('/')
    }
  } catch (err: any) {
    console.error(err)
    if (err.message === 'NEXT_REDIRECT') throw err
    return { error: 'Gagal terhubung ke server backend' }
  }
}

export async function register(formData: FormData) {
  const nama = formData.get('nama') as string
  const email = formData.get('email') as string
  const noTelepon = formData.get('noTelepon') as string
  const password = formData.get('password') as string

  if (!email || !password || !nama) {
    return { error: 'Nama, Email, dan Password wajib diisi' }
  }

  try {
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nama, no_telepon: noTelepon })
    })

    const data = await res.json()
    if (!res.ok) {
      return { error: data.error || 'Terjadi kesalahan saat registrasi' }
    }

    await createSession(data.user.id, 'PELANGGAN')
    redirect('/')
  } catch (err: any) {
    console.error(err)
    if (err.message === 'NEXT_REDIRECT') throw err
    return { error: 'Gagal terhubung ke server backend' }
  }
}

export async function logout() {
  await destroySession()
  redirect('/login')
}
