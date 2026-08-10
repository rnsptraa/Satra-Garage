'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function RiwayatTable({ riwayat }: { riwayat: any[] }) {
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null)

  return (
    <>
      <div className="bg-background border-4 border-foreground shadow-[12px_12px_0px_rgba(0,0,0,0.1)] p-1 skew-x-[1deg] max-w-6xl mx-auto">
        <div className="overflow-x-auto skew-x-[-1deg] p-4">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-foreground text-background font-black tracking-widest border-b-4 border-primary">
              <tr>
                <th className="px-6 py-4">Kode / Waktu</th>
                <th className="px-6 py-4">Kendaraan</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Total & Pembayaran</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-foreground font-bold">
              {riwayat.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-lg italic">Belum ada riwayat servis. Waktunya ngebut ke bengkel!</td>
                </tr>
              ) : (
                riwayat.map((r: any) => (
                  <tr key={r.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-black text-primary text-lg">{r.id}</div>
                      <div className="text-xs text-muted-foreground uppercase">{new Date(r.tanggal_booking).toLocaleString('id-ID')}</div>
                    </td>
                    <td className="px-6 py-4 uppercase">
                      {r.merk} {r.tipe}<br/>
                      <span className="text-primary tracking-widest">{r.plat_nomor}</span>
                    </td>
                    <td className="px-6 py-4 uppercase">{r.nama_layanan}</td>
                    <td className="px-6 py-4">
                      <div className="font-black italic text-lg">Rp {Number(r.harga).toLocaleString('id-ID')}</div>
                      {r.status_pembayaran === 'Lunas' ? (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 uppercase">{r.metode_pembayaran}</span>
                      ) : (
                        <span className="text-xs bg-red-200 text-red-800 px-2 py-1 uppercase">BELUM LUNAS</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-4 py-2 text-xs font-black uppercase tracking-widest border-2 skew-x-[-10deg] ${
                        r.status === 'Selesai' ? 'bg-green-500 text-white border-green-700' :
                        r.status === 'Diproses' ? 'bg-blue-500 text-white border-blue-700' :
                        r.status === 'Dibatalkan' ? 'bg-red-500 text-white border-red-700' :
                        'bg-amber-400 text-black border-amber-600'
                      }`}>
                        <span className="skew-x-[10deg] block">{r.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {r.status_pembayaran === 'Lunas' && r.transaksi_id && (
                        <Button onClick={() => setSelectedReceipt(r)} variant="outline" className="text-xs font-black uppercase italic border-2 border-foreground rounded-none skew-x-[-5deg] hover:bg-foreground hover:text-background">
                          <span className="skew-x-[5deg]">Lihat Struk</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Popup for Receipt */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-white text-black p-10 max-w-md w-full border-4 border-black shadow-[16px_16px_0px_rgba(0,0,0,0.2)] font-mono relative overflow-y-auto max-h-screen">
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-4 right-4 text-xl font-black bg-destructive text-destructive-foreground w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors print:hidden">
              X
            </button>
            
            <div className="text-center mb-8 border-b-2 border-dashed border-black pb-6 mt-4">
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">SATRA <span className="text-primary">GARAGE+</span></h1>
              <p className="text-sm font-bold mt-2">Jl. Balap No. 99, Jakarta</p>
              <p className="text-sm font-bold">Telp: 0812-3456-7890</p>
            </div>
            
            <div className="space-y-2 mb-6 text-sm font-bold">
              <div className="flex justify-between"><span>TANGGAL:</span> <span>{new Date(selectedReceipt.tanggal_bayar).toLocaleDateString('id-ID')}</span></div>
              <div className="flex justify-between"><span>WAKTU:</span> <span>{new Date(selectedReceipt.tanggal_bayar).toLocaleTimeString('id-ID')}</span></div>
              <div className="flex justify-between"><span>KODE BKG:</span> <span>{selectedReceipt.id}</span></div>
              <div className="flex justify-between"><span>NO. TRX:</span> <span>{selectedReceipt.transaksi_id.substring(0, 8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span>METODE:</span> <span className="uppercase">{selectedReceipt.metode_pembayaran}</span></div>
            </div>
            
            <div className="border-y-2 border-dashed border-black py-4 mb-6 space-y-4">
              <div className="font-bold">
                <p className="uppercase">{selectedReceipt.nama_layanan}</p>
                <p className="text-xs text-gray-600 uppercase">{selectedReceipt.merk} {selectedReceipt.tipe} ({selectedReceipt.plat_nomor})</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8 text-xl font-black">
              <span>TOTAL:</span>
              <span>Rp {Number(selectedReceipt.harga).toLocaleString('id-ID')}</span>
            </div>
            
            <div className="text-center text-sm font-bold border-t-2 border-dashed border-black pt-6">
              <p className="uppercase text-green-700 font-black text-xl mb-2">LUNAS</p>
              <p>TERIMA KASIH</p>
              <p className="mt-1 text-xs">Pilihan tepat kaum elite pecinta kecepatan.</p>
            </div>
            
            <Button onClick={() => window.print()} className="w-full mt-8 rounded-none border-2 border-black font-black uppercase hover:bg-black hover:text-white transition-colors print:hidden">
              Cetak Struk Fisik
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
