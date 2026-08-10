async function getVehicles() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/vehicles`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminKendaraanPage() {
  const vehicles = await getVehicles();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">Daftar Kendaraan</h1>
        <p className="text-muted-foreground mt-2 font-medium">Database kendaraan pelanggan yang terdaftar.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Plat Nomor</th>
                <th className="px-6 py-4">Merk</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Tahun</th>
                <th className="px-6 py-4">Pemilik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Tidak ada data kendaraan.</td>
                </tr>
              ) : (
                vehicles.map((v: any) => (
                  <tr key={v.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-black text-primary">{v.plat_nomor}</td>
                    <td className="px-6 py-4">{v.merk}</td>
                    <td className="px-6 py-4">{v.tipe}</td>
                    <td className="px-6 py-4">{v.tahun || '-'}</td>
                    <td className="px-6 py-4 font-bold">{v.pemilik}</td>
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
