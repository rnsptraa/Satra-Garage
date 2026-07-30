import Link from 'next/link'
import { Wrench } from 'lucide-react'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center mx-auto px-4">
          <div className="flex flex-1 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="font-bold inline-block">SATRA GARAGE+</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/kendaraan" className="transition-colors hover:text-foreground/80 text-foreground/60">Kendaraan</Link>
              <Link href="/booking" className="transition-colors hover:text-foreground/80 text-foreground/60">Booking</Link>
              <Link href="/riwayat" className="transition-colors hover:text-foreground/80 text-foreground/60">Riwayat</Link>
            </nav>
            <div className="flex items-center space-x-4">
               <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">Login</Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex-col flex">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
          <p className="text-sm leading-loose text-muted-foreground">
            Built for maximum efficiency.
          </p>
        </div>
      </footer>
    </div>
  )
}
