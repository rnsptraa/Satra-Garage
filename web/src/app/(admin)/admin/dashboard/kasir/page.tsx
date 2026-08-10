import KasirForm from './KasirForm';
import { getSession } from '@/lib/auth';

export default async function AdminKasirPage() {
  const session = await getSession();
  
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-foreground">Point of Sale (Kasir)</h1>
        <p className="text-muted-foreground mt-2 font-medium">Selesaikan transaksi dan cetak struk pembayaran.</p>
      </div>

      <KasirForm adminId={session?.userId || ''} />
    </div>
  )
}
