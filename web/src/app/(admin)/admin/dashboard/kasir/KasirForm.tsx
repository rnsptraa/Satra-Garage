'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSession } from '@/lib/auth'

export default function KasirForm({ adminId }: { adminId: string }) {
  const [bookingCode, setBookingCode] = useState('')
  const [bookingData, setBookingData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [receipt, setReceipt] = useState<any>(null)

  const searchBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setBookingData(null)
    setReceipt(null)
    
    if (!bookingCode) return;
    
    setIsSearching(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/booking/${bookingCode}`)
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Booking tidak ditemukan')
      } else {
        setBookingData(data)
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan atau koneksi API.')
    } finally {
      setIsSearching(false)
    }
  }

  const processPayment = async () => {
    if (!bookingData) return;
    setIsPaying(true)
    setError(null)
    
    try {
      // In a real app, we get admin session from backend or pass it
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${apiUrl}/api/booking/${bookingCode}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: adminId, // Real Admin ID from session
          total_bayar: bookingData.harga,
          metode_pembayaran: 'Tunai'
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Gagal memproses pembayaran')
      } else {
        setReceipt({
          ...bookingData,
          transaksiId: data.transaksiId,
          tanggalBayar: new Date().toISOString()
        })
        setBookingData(null)
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan atau koneksi API.')
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Search Box */}
      <div className="bg-card p-6 rounded-xl border shadow-sm max-w-xl">
        <form onSubmit={searchBooking} className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-foreground mb-2">Masukkan Kode Booking</label>
            <Input 
              type="text" 
              placeholder="Contoh: BKG-A1B2C3" 
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
              className="h-12 text-lg font-bold uppercase tracking-widest border-2 focus-visible:ring-0 focus-visible:border-primary"
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={isSearching} className="h-12 px-8 font-black uppercase shadow-md bg-primary hover:bg-primary/90">
              {isSearching ? 'Mencari...' : 'Cari Data'}
            </Button>
          </div>
        </form>
        {error && <div className="mt-4 text-destructive font-bold">{error}</div>}
      </div>

      {/* Booking Details (Before Payment) */}
      {bookingData && (
        <div className="bg-card p-8 rounded-xl border-4 border-foreground shadow-[8px_8px_0px_rgba(0,0,0,0.1)] max-w-3xl">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-foreground pb-4">Detail Booking: <span className="text-primary">{bookingData.id}</span></h2>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-lg">
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase">Pelanggan</p>
              <p className="font-black text-foreground">{bookingData.pelanggan_nama}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase">Kendaraan</p>
              <p className="font-black text-foreground">{bookingData.merk} {bookingData.tipe} ({bookingData.plat_nomor})</p>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase">Layanan</p>
              <p className="font-black text-foreground">{bookingData.nama_layanan}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase">Status Saat Ini</p>
              <p className="font-black text-foreground">{bookingData.status}</p>
            </div>
          </div>

          <div className="bg-muted p-6 border-2 border-foreground flex justify-between items-center mb-8">
            <span className="font-black uppercase text-xl text-foreground">Total Tagihan</span>
            <span className="font-black italic text-4xl text-primary">Rp {Number(bookingData.harga).toLocaleString('id-ID')}</span>
          </div>

          {bookingData.status === 'Selesai' ? (
            <div className="bg-green-100 text-green-700 font-bold p-4 border-2 border-green-700 text-center uppercase">
              Transaksi Ini Sudah Dibayar.
            </div>
          ) : (
            <Button onClick={processPayment} disabled={isPaying} className="w-full h-16 text-xl font-black uppercase italic rounded-none bg-green-600 hover:bg-green-700 text-white border-4 border-foreground shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-all duration-300 skew-x-[-5deg]">
              <span className="skew-x-[5deg]">{isPaying ? 'Memproses Pembayaran...' : 'Terima Pembayaran & Cetak Struk'}</span>
            </Button>
          )}
        </div>
      )}

      {/* Receipt (Struk) */}
      {receipt && (
        <div className="bg-white text-black p-10 max-w-md mx-auto border-4 border-black shadow-[16px_16px_0px_rgba(0,0,0,0.2)] font-mono">
          <div className="text-center mb-8 border-b-2 border-dashed border-black pb-6">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">SATRA <span className="text-primary">GARAGE+</span></h1>
            <p className="text-sm font-bold mt-2">Jl. Balap No. 99, Jakarta</p>
            <p className="text-sm font-bold">Telp: 0812-3456-7890</p>
          </div>
          
          <div className="space-y-2 mb-6 text-sm font-bold">
            <div className="flex justify-between"><span>TANGGAL:</span> <span>{new Date(receipt.tanggalBayar).toLocaleDateString('id-ID')}</span></div>
            <div className="flex justify-between"><span>WAKTU:</span> <span>{new Date(receipt.tanggalBayar).toLocaleTimeString('id-ID')}</span></div>
            <div className="flex justify-between"><span>KASIR:</span> <span>ADMIN</span></div>
            <div className="flex justify-between"><span>KODE BKG:</span> <span>{receipt.id}</span></div>
            <div className="flex justify-between"><span>NO. TRX:</span> <span>{receipt.transaksiId.substring(0, 8).toUpperCase()}</span></div>
          </div>
          
          <div className="border-y-2 border-dashed border-black py-4 mb-6 space-y-4">
            <div className="font-bold">
              <p className="uppercase">{receipt.nama_layanan}</p>
              <p className="text-xs text-gray-600 uppercase">{receipt.merk} {receipt.tipe} ({receipt.plat_nomor})</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-8 text-xl font-black">
            <span>TOTAL:</span>
            <span>Rp {Number(receipt.harga).toLocaleString('id-ID')}</span>
          </div>
          
          <div className="text-center text-sm font-bold border-t-2 border-dashed border-black pt-6">
            <p>TERIMA KASIH</p>
            <p className="mt-1 text-xs">Pilihan tepat kaum elite pecinta kecepatan.</p>
          </div>
          
          <Button onClick={() => window.print()} className="w-full mt-8 rounded-none border-2 border-black font-black uppercase hover:bg-black hover:text-white transition-colors print:hidden">
            Cetak Struk Fisik
          </Button>
        </div>
      )}
    </div>
  )
}
