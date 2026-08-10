import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Car, Wrench } from 'lucide-react'

async function getKendaraan(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/customer/vehicles/${userId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function KendaraanPage() {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect('/login');
  }

  const kendaraan = await getKendaraan(session.userId);

  return (
    <div className="container mx-auto px-6 py-12 flex-1">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase text-foreground">Garasi <span className="text-primary">Saya</span></h1>
        <p className="mt-4 font-bold uppercase tracking-wider text-muted-foreground">Koleksi mesin performa Anda.</p>
      </div>

      {kendaraan.length === 0 ? (
        <div className="text-center py-20 bg-background border-4 border-foreground shadow-[12px_12px_0px_rgba(0,0,0,0.1)] skew-x-[-2deg] max-w-2xl mx-auto">
          <div className="skew-x-[2deg]">
            <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-black uppercase mb-2">Garasi Kosong</h2>
            <p className="font-bold text-muted-foreground">Anda belum memiliki kendaraan terdaftar.</p>
            <p className="text-sm mt-4 text-foreground">Kendaraan akan otomatis terdaftar saat Anda melakukan booking servis pertama kali.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kendaraan.map((k: any) => (
            <div key={k.id} className="group relative flex flex-col justify-between overflow-hidden bg-background border-4 border-foreground shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(220,38,38,0.4)] transition-all duration-300 skew-x-[-2deg]">
              <div className="p-8 skew-x-[2deg]">
                <div className="flex justify-between items-start mb-6 border-b-2 border-foreground pb-4">
                  <div className="bg-primary/20 p-3 rounded-none border-2 border-primary">
                    <Car className="w-8 h-8 text-primary" />
                  </div>
                  <span className="bg-foreground text-background font-black italic uppercase px-3 py-1 text-sm tracking-widest">{k.tahun || 'N/A'}</span>
                </div>
                
                <h3 className="text-3xl font-black uppercase text-foreground mb-1">{k.merk}</h3>
                <p className="text-xl font-bold text-muted-foreground uppercase tracking-widest mb-6">{k.tipe}</p>
                
                <div className="bg-muted p-4 border-2 border-foreground text-center">
                  <span className="text-2xl font-black tracking-[0.2em] uppercase text-primary">{k.plat_nomor}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
