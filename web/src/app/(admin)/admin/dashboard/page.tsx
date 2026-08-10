import prisma from '@/lib/prisma'

export default async function AdminDashboardPage() {
  const pendingBookings = await prisma.booking.count({
    where: { status: 'Menunggu' },
  })
    
  const totalServices = await prisma.layanan.count()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold text-sm text-muted-foreground tracking-tight">Booking Menunggu</h3>
          <div className="mt-2 text-3xl font-bold">{pendingBookings || 0}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold text-sm text-muted-foreground tracking-tight">Total Layanan</h3>
          <div className="mt-2 text-3xl font-bold">{totalServices || 0}</div>
        </div>
      </div>
    </div>
  )
}
