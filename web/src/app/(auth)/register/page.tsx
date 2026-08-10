'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wrench } from 'lucide-react'
import { register } from '@/app/actions/auth'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleRegister = async (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const result = await register(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="flex justify-center">
          <Wrench className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-foreground">Daftar Akun Baru</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Masuk di sini
          </Link>
        </p>
      </div>
      <div className="bg-card p-8 shadow-sm border border-border rounded-xl">
        <form className="space-y-6" action={handleRegister}>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground">Nama Lengkap</label>
            <div className="mt-1">
              <Input
                type="text"
                name="nama"
                required
                placeholder="John Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Email</label>
            <div className="mt-1">
              <Input
                type="email"
                name="email"
                required
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Nomor Telepon</label>
            <div className="mt-1">
              <Input
                type="tel"
                name="noTelepon"
                placeholder="08123456789"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Password</label>
            <div className="mt-1">
              <Input
                type="password"
                name="password"
                required
                placeholder="********"
              />
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Memproses...' : 'Daftar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
