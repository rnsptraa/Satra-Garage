'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Car, Wrench, Calendar, Banknote, LogOut, Menu, X } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-primary text-primary-foreground border-b-4 border-foreground">
        <Link href="/admin/dashboard" className="font-black text-xl uppercase italic tracking-tighter skew-x-[-10deg]">
           <span className="skew-x-[10deg]">SATRA <span className="text-foreground">GARAGE+</span></span>
        </Link>
        <button onClick={toggle} className="p-2 bg-background text-foreground border-2 border-foreground skew-x-[-10deg] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
           <div className="skew-x-[10deg]">
             {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </div>
        </button>
      </div>

      {/* Sidebar (Desktop fixed, Mobile absolute/fixed with toggle) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r-4 border-foreground shadow-[8px_0px_0px_rgba(0,0,0,0.1)] flex flex-col transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex h-20 items-center justify-center border-b-4 border-foreground px-6 bg-primary text-primary-foreground">
          <Link href="/admin/dashboard" className="flex items-center gap-3 font-black text-2xl uppercase italic tracking-tighter skew-x-[-10deg]">
            <span className="skew-x-[10deg] flex items-center">
              SATRA <span className="text-foreground ml-2">GARAGE+</span>
            </span>
          </Link>
        </div>
        
        <div className="md:hidden flex h-20 items-center justify-between border-b-4 border-foreground px-6 bg-primary text-primary-foreground">
          <span className="font-black text-xl uppercase italic tracking-tighter skew-x-[-10deg]">
            <span className="skew-x-[10deg]">MENU</span>
          </span>
          <button onClick={close} className="p-2"><X className="w-6 h-6" /></button>
        </div>
        
        <nav className="flex-1 overflow-auto py-8">
          <ul className="grid gap-4 px-6">
            <li>
              <Link href="/admin/dashboard" onClick={close} className={`flex items-center gap-4 border-2 border-transparent px-4 py-3 text-sm font-black uppercase tracking-widest hover:border-foreground hover:bg-foreground hover:text-background transition-all skew-x-[-5deg] ${pathname === '/admin/dashboard' ? 'bg-foreground text-background' : ''}`}>
                <span className="skew-x-[5deg] flex items-center gap-4"><LayoutDashboard className="h-5 w-5" /> Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/booking" onClick={close} className={`flex items-center gap-4 border-2 border-transparent px-4 py-3 text-sm font-black uppercase tracking-widest hover:border-foreground hover:bg-foreground hover:text-background transition-all skew-x-[-5deg] ${pathname === '/admin/dashboard/booking' ? 'bg-foreground text-background' : ''}`}>
                <span className="skew-x-[5deg] flex items-center gap-4"><Calendar className="h-5 w-5" /> Booking</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/kasir" onClick={close} className={`flex items-center gap-4 border-2 border-transparent px-4 py-3 text-sm font-black uppercase tracking-widest hover:border-foreground hover:bg-primary hover:text-primary-foreground transition-all skew-x-[-5deg] ${pathname === '/admin/dashboard/kasir' ? 'bg-primary text-primary-foreground' : ''}`}>
                <span className="skew-x-[5deg] flex items-center gap-4"><Banknote className="h-5 w-5" /> Kasir (POS)</span>
              </Link>
            </li>
            
            <li className="my-4 border-t-4 border-foreground w-1/2 mx-auto"></li>
            
            <li>
              <Link href="/admin/dashboard/pelanggan" onClick={close} className={`flex items-center gap-4 border-2 border-transparent px-4 py-3 text-sm font-black uppercase tracking-widest hover:border-foreground hover:bg-foreground hover:text-background transition-all skew-x-[-5deg] ${pathname === '/admin/dashboard/pelanggan' ? 'bg-foreground text-background' : ''}`}>
                <span className="skew-x-[5deg] flex items-center gap-4"><Users className="h-5 w-5" /> Pelanggan</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/kendaraan" onClick={close} className={`flex items-center gap-4 border-2 border-transparent px-4 py-3 text-sm font-black uppercase tracking-widest hover:border-foreground hover:bg-foreground hover:text-background transition-all skew-x-[-5deg] ${pathname === '/admin/dashboard/kendaraan' ? 'bg-foreground text-background' : ''}`}>
                <span className="skew-x-[5deg] flex items-center gap-4"><Car className="h-5 w-5" /> Kendaraan</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/layanan" onClick={close} className={`flex items-center gap-4 border-2 border-transparent px-4 py-3 text-sm font-black uppercase tracking-widest hover:border-foreground hover:bg-foreground hover:text-background transition-all skew-x-[-5deg] ${pathname === '/admin/dashboard/layanan' ? 'bg-foreground text-background' : ''}`}>
                <span className="skew-x-[5deg] flex items-center gap-4"><Wrench className="h-5 w-5" /> Layanan</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-6 border-t-4 border-foreground bg-muted">
          <form action={logout}>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground border-4 border-foreground h-12 font-black uppercase italic shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all skew-x-[-10deg]">
              <span className="skew-x-[10deg] flex items-center gap-2"><LogOut className="h-5 w-5" /> Keluar</span>
            </button>
          </form>
        </div>
      </aside>
      
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={close} />
      )}
    </>
  )
}
