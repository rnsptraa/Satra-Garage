import { Users, Wrench, CalendarClock } from 'lucide-react';

async function getStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/stats`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-black text-foreground">Overview Dashboard</h1>
        <p className="text-muted-foreground mt-2 font-medium">Ringkasan performa bengkel hari ini.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Booking Menunggu</h3>
            <div className="mt-2 text-4xl font-black text-primary">{stats?.bookingMenunggu || 0}</div>
          </div>
          <div className="p-4 bg-primary/10 rounded-full">
            <CalendarClock className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Total Pelanggan</h3>
            <div className="mt-2 text-4xl font-black text-primary">{stats?.totalPelanggan || 0}</div>
          </div>
          <div className="p-4 bg-blue-500/10 rounded-full">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Total Layanan</h3>
            <div className="mt-2 text-4xl font-black text-primary">{stats?.totalLayanan || 0}</div>
          </div>
          <div className="p-4 bg-amber-500/10 rounded-full">
            <Wrench className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
