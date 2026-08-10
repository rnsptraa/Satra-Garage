'use server'

import prisma from '@/lib/prisma'
import { createSession, destroySession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan Password wajib diisi' }
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { error: 'Email atau password salah' }
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return { error: 'Email atau password salah' }
  }

  await createSession(user.id, user.role)
  redirect('/')
}

export async function register(formData: FormData) {
  const nama = formData.get('nama') as string
  const email = formData.get('email') as string
  const noTelepon = formData.get('noTelepon') as string
  const password = formData.get('password') as string

  if (!email || !password || !nama) {
    return { error: 'Nama, Email, dan Password wajib diisi' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: 'Email sudah terdaftar' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      nama,
      email,
      no_telepon: noTelepon,
      password: hashedPassword,
      role: 'PELANGGAN',
    },
  })

  await createSession(user.id, user.role)
  redirect('/')
}

export async function logout() {
  await destroySession()
  redirect('/login')
}
