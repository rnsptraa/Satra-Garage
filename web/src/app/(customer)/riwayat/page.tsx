import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import RiwayatTable from './RiwayatTable'

async function getRiwayat(userId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/customer/history/${userId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function RiwayatPage() {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect('/login');
  }

  const riwayat = await getRiwayat(session.userId);

  return (
    <div className="container mx-auto px-6 py-12 flex-1">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase text-foreground">Riwayat <span className="text-primary">Servis</span></h1>
        <p className="mt-4 font-bold uppercase tracking-wider text-muted-foreground">Log performa kendaraan Anda.</p>
      </div>

      <RiwayatTable riwayat={riwayat} />
    </div>
  )
}
