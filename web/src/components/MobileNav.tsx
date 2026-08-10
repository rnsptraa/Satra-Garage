'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function MobileNav({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)

  return (
    <div className="md:hidden flex items-center">
      <button onClick={toggle} className="p-2 bg-primary text-primary-foreground border-2 border-foreground skew-x-[-10deg] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="skew-x-[10deg]">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-background/95 backdrop-blur-sm border-t-4 border-foreground">
          <nav className="flex flex-col h-full p-6 space-y-6 overflow-y-auto">
            <Link href="/" onClick={close} className="text-xl font-black uppercase italic tracking-widest border-b-2 border-primary/20 pb-2">Beranda</Link>
            <Link href="/#layanan" onClick={close} className="text-xl font-black uppercase italic tracking-widest border-b-2 border-primary/20 pb-2">Layanan</Link>
            <Link href="/booking" onClick={close} className="text-xl font-black uppercase italic tracking-widest border-b-2 border-primary/20 pb-2">Booking</Link>
            
            {session && (
              <>
                <Link href="/kendaraan" onClick={close} className="text-xl font-black uppercase italic tracking-widest border-b-2 border-primary/20 pb-2">Kendaraan</Link>
                <Link href="/riwayat" onClick={close} className="text-xl font-black uppercase italic tracking-widest border-b-2 border-primary/20 pb-2">Riwayat</Link>
              </>
            )}

            <div className="pt-6 mt-auto">
               {session ? (
                 <div className="flex flex-col gap-4">
                   {session.role === 'ADMIN' && (
                     <Link href="/admin/dashboard" className="text-center font-black uppercase text-primary border-4 border-primary px-4 py-3 rounded-none transition-colors skew-x-[-10deg]">
                       <span className="skew-x-[10deg] flex items-center justify-center gap-2"><LayoutDashboard className="w-5 h-5" /> Dasbor Admin</span>
                     </Link>
                   )}
                   <form action={logout}>
                     <button type="submit" className="w-full text-center font-black uppercase text-white bg-destructive px-5 py-3 rounded-none border-4 border-foreground skew-x-[-10deg] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                       <span className="skew-x-[10deg] flex items-center justify-center gap-2"><LogOut className="w-5 h-5" /> Keluar</span>
                     </button>
                   </form>
                 </div>
               ) : (
                 <Link href="/login" onClick={close} className="block text-center text-lg font-black uppercase bg-primary text-primary-foreground px-8 py-4 rounded-none border-4 border-foreground shadow-[8px_8px_0px_rgba(0,0,0,1)] skew-x-[-10deg]">
                   <span className="inline-block skew-x-[10deg]">Member Login</span>
                 </Link>
               )}
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
