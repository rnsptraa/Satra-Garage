import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, ShieldCheck, Wrench, ChevronRight, Star } from 'lucide-react'
import { getSession } from '@/lib/auth'

export default async function CustomerHomePage() {
  const session = await getSession();
  const layanan = [
    { id: '1', namaLayanan: 'Servis Rutin Ringan', deskripsi: 'Ganti oli, cek kampas rem, busi, dan tegangan aki dengan presisi.', harga: 150000, estimasiWaktu: 60, popular: true },
    { id: '2', namaLayanan: 'Servis Besar / Berat', deskripsi: 'Bongkar mesin (turun mesin), ganti piston, dan restorasi performa.', harga: 750000, estimasiWaktu: 360, popular: false },
    { id: '3', namaLayanan: 'Ganti Oli Mesin', deskripsi: 'Ganti oli mesin standar pabrik dengan jaminan pelumas orisinil.', harga: 65000, estimasiWaktu: 30, popular: false }
  ];

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-background text-foreground">
      
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[85vh] flex flex-col items-center justify-end overflow-hidden">
        {/* Banner Image */}
        <Image src="/banner.png" alt="Banner Bengkel" fill className="object-cover object-center" priority />
        
        {/* Action Buttons overlaying the bottom of the banner */}
        <div className="relative z-10 w-full bg-gradient-to-t from-background via-background/90 to-transparent pt-40 pb-12 px-6 flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/booking">
              <Button className="w-full sm:w-auto text-lg h-14 px-10 shadow-[8px_8px_0px_rgba(220,38,38,0.5)] hover:shadow-[12px_12px_0px_rgba(220,38,38,0.7)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 rounded-none skew-x-[-10deg] border-2 border-primary" size="lg">
                <span className="skew-x-[10deg] font-black uppercase flex items-center">Booking Sekarang <ChevronRight className="ml-2 h-5 w-5" /></span>
              </Button>
            </Link>
            {!session && (
              <Link href="/register">
                <Button variant="outline" className="w-full sm:w-auto text-lg h-14 px-10 rounded-none border-2 border-foreground bg-card shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:bg-foreground hover:text-background hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 skew-x-[-10deg]" size="lg">
                  <span className="skew-x-[10deg] font-black uppercase">Daftar Member</span>
                </Button>
              </Link>
            )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative w-full -mt-8 z-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-primary text-primary-foreground border-4 border-foreground shadow-[16px_16px_0px_rgba(0,0,0,0.1)] skew-x-[-5deg] overflow-hidden">
            <div className="flex flex-col items-center justify-center p-8 text-center hover:bg-foreground hover:text-background transition-colors border-b-4 md:border-b-0 md:border-r-4 border-foreground skew-x-[5deg]">
              <span className="text-4xl md:text-5xl font-black mb-2 italic">500<span className="text-destructive">+</span></span>
              <span className="text-sm font-black tracking-widest uppercase">Kendaraan Diservis</span>
            </div>
            <div className="flex flex-col items-center justify-center p-8 text-center hover:bg-foreground hover:text-background transition-colors border-b-4 md:border-b-0 md:border-r-4 border-foreground skew-x-[5deg]">
              <span className="text-4xl md:text-5xl font-black mb-2 italic">99<span className="text-destructive">%</span></span>
              <span className="text-sm font-black tracking-widest uppercase">Pelanggan Puas</span>
            </div>
            <div className="flex flex-col items-center justify-center p-8 text-center hover:bg-foreground hover:text-background transition-colors skew-x-[5deg]">
              <span className="text-4xl md:text-5xl font-black mb-2 italic">15<span className="text-destructive">+</span></span>
              <span className="text-sm font-black tracking-widest uppercase">Mekanik Master</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-32 relative bg-card relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 flex flex-col items-center">
            <h2 className="text-4xl font-black tracking-tighter md:text-6xl uppercase italic text-foreground border-b-8 border-primary pb-2 inline-block">Standar <span className="text-primary">Eksklusif</span></h2>
            <p className="mt-6 text-foreground/70 md:text-xl max-w-2xl mx-auto font-bold uppercase tracking-wider">Performa Maksimal Tanpa Kompromi.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex flex-col items-center text-center space-y-6 p-10 bg-background border-4 border-foreground hover:-translate-y-3 transition-transform duration-300 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] skew-x-[-3deg]">
              <div className="p-6 bg-primary text-primary-foreground border-4 border-foreground skew-x-[3deg]">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-foreground skew-x-[3deg]">Zero Waiting Time</h3>
              <p className="text-foreground/70 font-bold skew-x-[3deg]">Datang sesuai jadwal VIP Anda dan langsung ditangani di pit khusus tanpa antre.</p>
            </div>
            <div className="group flex flex-col items-center text-center space-y-6 p-10 bg-background border-4 border-foreground hover:-translate-y-3 transition-transform duration-300 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] skew-x-[-3deg]">
              <div className="p-6 bg-primary text-primary-foreground border-4 border-foreground skew-x-[3deg]">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-foreground skew-x-[3deg]">Master Technicians</h3>
              <p className="text-foreground/70 font-bold skew-x-[3deg]">Ditangani secara eksklusif oleh teknisi tersertifikasi dengan standar balap.</p>
            </div>
            <div className="group flex flex-col items-center text-center space-y-6 p-10 bg-background border-4 border-foreground hover:-translate-y-3 transition-transform duration-300 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] skew-x-[-3deg]">
              <div className="p-6 bg-primary text-primary-foreground border-4 border-foreground skew-x-[3deg]">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-foreground skew-x-[3deg]">Absolute Transparency</h3>
              <p className="text-foreground/70 font-bold skew-x-[3deg]">Rincian performa dan biaya 100% transparan, tanpa biaya tersembunyi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="w-full py-32 bg-primary relative overflow-hidden text-primary-foreground border-y-4 border-foreground">
        
        {/* Decorative racing stripes */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 transform translate-x-1/2 -skew-x-[45deg] bg-foreground" />
        <div className="absolute top-0 right-32 w-16 h-full opacity-20 transform translate-x-1/2 -skew-x-[45deg] bg-foreground" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-20">
            <h2 className="text-4xl font-black tracking-tighter md:text-6xl uppercase italic text-primary-foreground border-b-8 border-foreground pb-2 inline-block">Layanan <span className="text-foreground">Signature</span></h2>
            <p className="max-w-[800px] text-primary-foreground/90 md:text-xl font-bold tracking-wider uppercase">
              Upgrade Performa Maksimal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {layanan?.map((item) => (
              <div key={item.id} className={`group relative flex flex-col justify-between overflow-hidden bg-background text-foreground transition-all duration-300 hover:-translate-y-3 skew-x-[-3deg] border-4 border-foreground ${item.popular ? 'shadow-[12px_12px_0px_rgba(239,68,68,1)]' : 'shadow-[8px_8px_0px_rgba(0,0,0,0.2)]'}`}>
                {item.popular && (
                  <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-black px-6 py-2 uppercase tracking-wider flex items-center skew-x-[15deg] translate-x-4">
                    <Star className="w-3 h-3 mr-1 fill-current" /> Rekomendasi
                  </div>
                )}
                
                <div className="p-8 skew-x-[3deg]">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black uppercase italic text-foreground group-hover:text-primary transition-colors">{item.namaLayanan}</h3>
                  </div>
                  <p className="text-foreground/80 mb-8 font-bold line-clamp-3">{item.deskripsi}</p>
                  
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-4xl font-black italic text-foreground tracking-tight">
                      Rp {Number(item.harga).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm font-black uppercase tracking-wider text-background bg-foreground w-fit px-4 py-2 border-2 border-foreground skew-x-[-10deg]">
                    <span className="skew-x-[10deg] flex items-center"><Clock className="mr-2 h-4 w-4" /> Est. {item.estimasiWaktu} Menit</span>
                  </div>
                </div>
                
                <div className="p-8 pt-0 mt-auto skew-x-[3deg]">
                  <Link href="/booking" className="w-full">
                    <Button className={`w-full h-14 rounded-none border-2 border-foreground text-md font-black uppercase italic transition-all duration-300 skew-x-[-10deg] ${item.popular ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-[4px_4px_0px_rgba(0,0,0,0.2)]' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]'}`}>
                      <span className="skew-x-[10deg]">Pilih Layanan Ini</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Official Partners Section */}
      <section className="w-full py-24 bg-background relative border-b-4 border-foreground overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase italic tracking-widest text-foreground">Official <span className="text-primary">Partners</span></h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Suku cadang performa tinggi berstandar kompetisi.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {[
              { name: 'BRT', file: 'brt1.png' }, 
              { name: 'UMA RACING', file: 'uma-racing.png' }, 
              { name: 'TDR RACING', file: 'tdr.png' }, 
              { name: 'FIM PISTON', file: 'fim.png' }, 
              { name: 'KAWAHARA', file: 'kawahara.png' },
              { name: 'KYB', file: 'kyb.png' },
              { name: 'DAYTONA', file: 'daytona.png' },
              { name: 'YSS', file: 'yss.png' }
            ].map((brand) => (
              <div key={brand.name} className="group relative flex items-center justify-center w-32 h-20 md:w-40 md:h-24">
                <div className="relative w-full h-full opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 group-hover:-translate-y-3 transition-all duration-500 ease-out cursor-pointer">
                  <Image src={`/brands/${brand.file}`} alt={brand.name} fill className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      {!session && (
        <section className="w-full py-32 relative overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary -skew-x-[45deg] translate-x-1/4 opacity-10 pointer-events-none" />
          
          <div className="container relative z-10 mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter text-foreground uppercase italic border-y-8 border-primary py-4 inline-block">
              Tingkatkan Performa.<br/>Sekarang.
            </h2>
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto font-bold uppercase tracking-widest">
              Bergabunglah dengan kaum elite pecinta kecepatan.
            </p>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-foreground hover:text-background border-4 border-foreground h-20 px-16 text-2xl rounded-none font-black italic shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_rgba(0,0,0,0.1)] skew-x-[-15deg] transition-all duration-300">
                <span className="skew-x-[15deg]">Daftar Member VIP</span>
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
