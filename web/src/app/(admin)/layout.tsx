import Link from 'next/link'
import { LayoutDashboard, Users, Car, Wrench, Calendar, Banknote } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background flex flex-col">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-lg">
            <Wrench className="h-5 w-5 text-primary" />
            <span className="">SATRA GARAGE+ Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <ul className="grid gap-1 px-4">
            <li>
              <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/booking" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                <Calendar className="h-4 w-4" />
                Booking
              </Link>
            </li>
            <li>
              <Link href="/admin/kasir" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                <Banknote className="h-4 w-4" />
                Kasir
              </Link>
            </li>
            <li className="my-2 border-t border-border"></li>
            <li>
              <Link href="/admin/pelanggan" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                <Users className="h-4 w-4" />
                Pelanggan
              </Link>
            </li>
            <li>
              <Link href="/admin/kendaraan" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                <Car className="h-4 w-4" />
                Kendaraan
              </Link>
            </li>
            <li>
              <Link href="/admin/layanan" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                <Wrench className="h-4 w-4" />
                Layanan
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  )
}
