import Link from 'next/link'
import Image from 'next/image'
import { Wrench, LogOut, LayoutDashboard, MapPin, Phone, Clock } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { logout } from '@/app/actions/auth'
import MobileNav from '@/components/MobileNav'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b-4 border-primary bg-card shadow-md">
        <div className="container flex h-20 items-center mx-auto px-6">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-1 group-hover:scale-105 transition-transform">
                <Image src="/logo.jpg" alt="Sattra Garage Logo" width={45} height={45} className="object-contain" />
              </div>
              <span className="font-black italic text-xl tracking-tighter text-foreground uppercase">SATRA <span className="text-primary">GARAGE+</span></span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8 text-sm md:text-base font-bold uppercase tracking-wider">
              <Link href="/" className="text-foreground/80 hover:text-primary hover:border-b-2 hover:border-primary pb-1 transition-all">Beranda</Link>
              <Link href="/#layanan" className="text-foreground/80 hover:text-primary hover:border-b-2 hover:border-primary pb-1 transition-all">Layanan</Link>
              <Link href="/booking" className="text-foreground/80 hover:text-primary hover:border-b-2 hover:border-primary pb-1 transition-all">Booking</Link>
              
              {session && (
                <>
                  <Link href="/kendaraan" className="text-foreground/80 hover:text-primary hover:border-b-2 hover:border-primary pb-1 transition-all">Kendaraan</Link>
                  <Link href="/riwayat" className="text-foreground/80 hover:text-primary hover:border-b-2 hover:border-primary pb-1 transition-all">Riwayat</Link>
                </>
              )}
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
               {session ? (
                 <div className="flex items-center gap-4">
                   {session.role === 'ADMIN' && (
                     <Link href="/admin/dashboard" className="text-sm font-black uppercase text-primary hover:bg-primary hover:text-primary-foreground border-2 border-primary px-4 py-2 rounded-none transition-colors flex items-center gap-2 skew-x-[-10deg]">
                       <span className="skew-x-[10deg] flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Admin</span>
                     </Link>
                   )}
                   <form action={logout}>
                     <button type="submit" className="text-sm font-black uppercase text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-none transition-colors flex items-center gap-2 skew-x-[-10deg] shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                       <span className="skew-x-[10deg] flex items-center gap-2"><LogOut className="w-4 h-4" /> Keluar</span>
                     </button>
                   </form>
                 </div>
               ) : (
                 <Link href="/login" className="text-sm font-black uppercase bg-primary text-primary-foreground px-8 py-3 rounded-none hover:bg-primary/90 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 skew-x-[-10deg]">
                   <span className="inline-block skew-x-[10deg]">Member Login</span>
                 </Link>
               )}
            </div>
            
            <MobileNav session={session} />
          </div>
        </div>
      </header>
      <main className="flex-1 flex-col flex">{children}</main>
      <footer className="border-t-8 border-primary bg-foreground text-background pt-16 pb-8 overflow-hidden relative">
        {/* Background decorative racing stripes */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 transform translate-x-1/3 -skew-x-[45deg] bg-white pointer-events-none" />
        <div className="absolute top-0 right-40 w-16 h-full opacity-10 transform translate-x-1/3 -skew-x-[45deg] bg-white pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="md:col-span-1 space-y-4">
              <Link href="/" className="flex items-center space-x-3 mb-6 inline-block">
                <div className="flex items-center gap-2 bg-background p-2 w-fit skew-x-[-10deg]">
                  <Image src="/logo.jpg" alt="Sattra Garage Logo" width={40} height={40} className="object-contain skew-x-[10deg]" />
                  <span className="font-black italic text-2xl tracking-tighter text-foreground uppercase skew-x-[10deg] pr-2">SATRA <span className="text-primary">GARAGE+</span></span>
                </div>
              </Link>
              <p className="text-sm font-bold text-background/70 uppercase tracking-wider leading-relaxed">
                Pusat perawatan otomotif premium dengan standar balap untuk kaum elite pecinta kecepatan.
              </p>
              <div className="flex gap-4 pt-4">
                <a href="#" className="bg-primary/20 hover:bg-primary p-2 border-2 border-primary transition-colors skew-x-[-10deg] font-black italic px-4"><span className="skew-x-[10deg] block">IG</span></a>
                <a href="#" className="bg-primary/20 hover:bg-primary p-2 border-2 border-primary transition-colors skew-x-[-10deg] font-black italic px-4"><span className="skew-x-[10deg] block">FB</span></a>
                <a href="#" className="bg-primary/20 hover:bg-primary p-2 border-2 border-primary transition-colors skew-x-[-10deg] font-black italic px-4"><span className="skew-x-[10deg] block">X</span></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-black uppercase italic tracking-widest border-b-4 border-primary pb-2 inline-block">Menu <span className="text-primary">Cepat</span></h4>
              <ul className="space-y-3 text-sm font-bold uppercase tracking-wider text-background/80">
                <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary">/</span> Beranda</Link></li>
                <li><Link href="/#layanan" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary">/</span> Layanan</Link></li>
                <li><Link href="/booking" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary">/</span> Booking</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors flex items-center gap-2"><span className="text-primary">/</span> Daftar Member</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-xl font-black uppercase italic tracking-widest border-b-4 border-primary pb-2 inline-block">Hubungi <span className="text-primary">Kami</span></h4>
              <ul className="space-y-4 text-sm font-bold text-background/80">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span className="uppercase tracking-wide leading-relaxed">Jl. Balap No. 99, Sirkuit Sentul, Bogor, Jawa Barat 16810</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="uppercase tracking-widest">+62 812 3456 7890</span>
                </li>
              </ul>
            </div>

            {/* Operational Hours */}
            <div className="space-y-6">
              <h4 className="text-xl font-black uppercase italic tracking-widest border-b-4 border-primary pb-2 inline-block">Jam <span className="text-primary">Operasional</span></h4>
              <ul className="space-y-3 text-sm font-bold uppercase tracking-wider">
                <li className="flex justify-between items-center border-b border-background/20 pb-2">
                  <span className="text-background/80">Senin - Jumat</span>
                  <span className="text-primary">08:00 - 20:00</span>
                </li>
                <li className="flex justify-between items-center border-b border-background/20 pb-2">
                  <span className="text-background/80">Sabtu</span>
                  <span className="text-primary">07:00 - 18:00</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-background/80">Minggu</span>
                  <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs skew-x-[-10deg]"><span className="block skew-x-[10deg]">RACE DAY (TUTUP)</span></span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t-2 border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-widest text-background/50">
              &copy; {new Date().getFullYear()} SATRA GARAGE+. PERFORMANCE UNLEASHED.
            </p>
            <div className="text-xs font-bold uppercase tracking-widest text-background/50 flex gap-4">
              <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

