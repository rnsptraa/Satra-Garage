'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    <div className="mx-auto w-full max-w-md space-y-8 mt-10 mb-10">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary p-2 border-4 border-foreground skew-x-[-10deg] shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
            <div className="relative w-16 h-16 skew-x-[10deg]">
              <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
            </div>
          </div>
        </div>
        <h2 className="text-4xl font-black uppercase italic text-foreground tracking-tighter">Daftar <span className="text-primary">Member</span></h2>
        <p className="mt-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary hover:text-foreground transition-colors underline decoration-2 underline-offset-4">
            Masuk di sini
          </Link>
        </p>
      </div>
      <div className="bg-background p-10 border-4 border-foreground shadow-[12px_12px_0px_rgba(0,0,0,0.1)] skew-x-[-2deg]">
        <form className="space-y-6 skew-x-[2deg]" action={handleRegister}>
          {error && (
            <div className="bg-destructive text-destructive-foreground font-bold p-4 border-4 border-destructive skew-x-[-2deg] mb-6">
              <span className="block skew-x-[2deg] uppercase">{error}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Nama Lengkap</label>
            <div className="mt-1">
              <Input
                type="text"
                name="nama"
                required
                placeholder="JOHN DOE"
                className="h-14 border-2 border-foreground font-bold uppercase focus-visible:ring-0 focus-visible:border-primary rounded-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Email</label>
            <div className="mt-1">
              <Input
                type="email"
                name="email"
                required
                placeholder="EMAIL@EXAMPLE.COM"
                className="h-14 border-2 border-foreground font-bold uppercase focus-visible:ring-0 focus-visible:border-primary rounded-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Nomor Telepon</label>
            <div className="mt-1">
              <Input
                type="tel"
                name="noTelepon"
                placeholder="08123456789"
                className="h-14 border-2 border-foreground font-bold uppercase focus-visible:ring-0 focus-visible:border-primary rounded-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Password</label>
            <div className="mt-1">
              <Input
                type="password"
                name="password"
                required
                placeholder="********"
                className="h-14 border-2 border-foreground font-bold focus-visible:ring-0 focus-visible:border-primary rounded-none"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full h-16 text-xl font-black uppercase italic rounded-none bg-primary text-primary-foreground border-4 border-foreground hover:bg-foreground hover:text-primary hover:-translate-y-1 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-all duration-300 skew-x-[-5deg]" disabled={isPending}>
              <span className="skew-x-[5deg]">{isPending ? 'MENGHUBUNGKAN...' : 'GABUNG SEKARANG'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
