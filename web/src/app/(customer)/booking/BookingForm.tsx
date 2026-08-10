'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createBookingAction } from '@/app/actions/booking'

type Layanan = {
  id: string;
  nama_layanan: string;
  harga: number;
}

export default function BookingForm({ layananList }: { layananList: Layanan[] }) {
  const [error, setError] = useState<string | null>(null)
  const [successCode, setSuccessCode] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccessCode(null)
    startTransition(async () => {
      const result = await createBookingAction(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success && result.bookingId) {
        setSuccessCode(result.bookingId)
      }
    })
  }

  if (successCode) {
    return (
      <div className="bg-background p-10 border-4 border-foreground shadow-[12px_12px_0px_rgba(0,0,0,0.1)] w-full max-w-2xl mx-auto text-center space-y-6 skew-x-[-2deg]">
        <div className="mx-auto w-24 h-24 bg-primary text-primary-foreground border-4 border-foreground flex items-center justify-center mb-6 skew-x-[5deg]">
          <svg className="w-12 h-12 skew-x-[-5deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black italic uppercase text-foreground skew-x-[2deg]">Booking VIP <span className="text-primary">Berhasil!</span></h2>
        <p className="text-foreground/80 font-bold skew-x-[2deg]">Tunjukkan KODE EKSKLUSIF di bawah ini kepada pit crew atau admin saat Anda tiba di garasi.</p>
        
        <div className="bg-foreground py-8 border-4 border-primary my-8 skew-x-[5deg]">
          <span className="text-5xl font-black italic tracking-[0.2em] text-primary skew-x-[-5deg] block">{successCode}</span>
        </div>
        
        <Button onClick={() => window.location.href = '/'} className="mt-4 bg-background text-foreground hover:bg-primary hover:text-primary-foreground border-4 border-foreground h-14 px-8 text-lg rounded-none font-black uppercase italic shadow-[6px_6px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 skew-x-[2deg]">
          <span className="skew-x-[2deg]">Kembali ke Basecamp</span>
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-6 bg-background p-10 border-4 border-foreground shadow-[12px_12px_0px_rgba(0,0,0,0.1)] w-full max-w-2xl mx-auto" action={handleSubmit}>
      {error && (
        <div className="bg-destructive text-destructive-foreground font-bold p-4 border-4 border-destructive skew-x-[-2deg]">
          <span className="block skew-x-[2deg]">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Pilih Layanan</label>
          <select name="layanan_id" required className="flex h-12 w-full items-center justify-between border-2 border-foreground bg-background px-4 py-2 text-sm font-bold ring-offset-background focus:outline-none focus:ring-0 focus:border-primary transition-colors">
            <option value="">-- Pilih Layanan --</option>
            {layananList.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nama_layanan} (Rp {Number(l.harga).toLocaleString('id-ID')})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Tanggal Booking</label>
          <Input type="date" name="tanggal_booking" required className="h-12 border-2 border-foreground font-bold focus-visible:ring-0 focus-visible:border-primary rounded-none" />
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Jam Booking</label>
          <Input type="time" name="jam_booking" required className="h-12 border-2 border-foreground font-bold focus-visible:ring-0 focus-visible:border-primary rounded-none" />
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Merk Kendaraan</label>
          <Input type="text" name="merk_kendaraan" placeholder="Misal: Honda" required className="h-12 border-2 border-foreground font-bold focus-visible:ring-0 focus-visible:border-primary rounded-none" />
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Tipe Kendaraan</label>
          <Input type="text" name="tipe_kendaraan" placeholder="Misal: Vario 150" required className="h-12 border-2 border-foreground font-bold focus-visible:ring-0 focus-visible:border-primary rounded-none" />
        </div>

        <div>
          <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Nomor Polisi (Plat)</label>
          <Input type="text" name="plat_nomor" placeholder="Misal: B 1234 ABC" required className="h-12 border-2 border-foreground font-bold focus-visible:ring-0 focus-visible:border-primary rounded-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-black uppercase tracking-wider text-foreground mb-2">Keluhan Tambahan (Opsional)</label>
        <textarea name="keluhan" rows={3} className="flex w-full border-2 border-foreground bg-background px-4 py-3 text-sm font-bold ring-offset-background placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary transition-colors resize-none" placeholder="Tuliskan keluhan atau catatan khusus balap Anda di sini..."></textarea>
      </div>

      <Button type="submit" className="w-full h-16 text-xl font-black uppercase italic rounded-none bg-primary text-primary-foreground border-4 border-foreground hover:bg-foreground hover:text-primary hover:-translate-y-1 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-all duration-300 skew-x-[-10deg]" disabled={isPending}>
        <span className="skew-x-[10deg]">{isPending ? 'Mengunci Pit...' : 'Konfirmasi Booking'}</span>
      </Button>
    </form>
  )
}
