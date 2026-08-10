async function getCustomers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/customers`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function AdminPelangganPage() {
  const customers = await getCustomers();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">Daftar Pelanggan</h1>
        <p className="text-muted-foreground mt-2 font-medium">Manajemen data pengguna terdaftar.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted text-muted-foreground font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Pelanggan</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">No Telepon</th>
                <th className="px-6 py-4">Bergabung Pada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">Tidak ada data pelanggan.</td>
                </tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{c.nama}</td>
                    <td className="px-6 py-4">{c.email}</td>
                    <td className="px-6 py-4">{c.no_telepon || '-'}</td>
                    <td className="px-6 py-4">
                      {new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
