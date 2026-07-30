import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  const { count: pendingBookings } = await supabase
    .from('booking')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Menunggu')
    
  const { count: totalServices } = await supabase
    .from('layanan')
    .select('*', { count: 'exact', head: true })

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
