async function getServices() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/services`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminLayananPage() {
  const services = await getServices();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">Daftar Layanan Bengkel</h1>
        <p className="text-muted-foreground mt-2 font-medium">Manajemen paket servis dan harga.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Layanan</th>
                <th className="px-6 py-4">Deskripsi</th>
                <th className="px-6 py-4">Harga (Rp)</th>
                <th className="px-6 py-4">Est. Waktu (Menit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">Tidak ada data layanan.</td>
                </tr>
              ) : (
                services.map((s: any) => (
                  <tr key={s.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-black text-primary">{s.nama_layanan}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{s.deskripsi}</td>
                    <td className="px-6 py-4 text-green-600 font-bold">Rp {Number(s.harga).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">{s.estimasi_waktu || '-'}</td>
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
