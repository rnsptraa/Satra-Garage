import { CalendarClock, CheckCircle, Clock } from 'lucide-react';

async function getBookings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/bookings`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminBookingPage() {
  const bookings = await getBookings();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">Daftar Booking</h1>
        <p className="text-muted-foreground mt-2 font-medium">Manajemen antrean servis kendaraan.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Kode Booking</th>
                <th className="px-6 py-4">Tanggal & Jam</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Kendaraan (Plat)</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Tidak ada data booking.</td>
                </tr>
              ) : (
                bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-black text-primary">{b.id}</td>
                    <td className="px-6 py-4">
                      {new Date(b.tanggal_booking).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                      <span className="text-muted-foreground text-xs">{new Date(b.tanggal_booking).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-6 py-4">{b.pelanggan_nama}</td>
                    <td className="px-6 py-4">{b.plat_nomor}</td>
                    <td className="px-6 py-4">{b.nama_layanan}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                        b.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                        b.status === 'Dibatalkan' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
