import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { CheckCircle2, Clock, ShieldCheck, Wrench } from 'lucide-react'

export default async function CustomerHomePage() {
  const layanan = await prisma.layanan.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-vehicles.png"
            alt="Luxury Car and Sports Motorcycle"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-background/30 sm:bg-transparent" /> 
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Booking Servis Pintar & Cepat
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Performa Maksimal,<br/> 
              <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Tanpa Antre Panjang.</span>
            </h1>
            
            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
              Platform booking bengkel modern untuk mobil dan motor premium Anda. Atur jadwal servis dengan mudah, transparan, dan terpercaya.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/booking">
                <Button className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-all rounded-full" size="lg">
                  Booking Sekarang
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-background/50 backdrop-blur-sm" size="lg">
                  Daftar Member
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats / Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-border/50 mt-10">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">500+</span>
                <span className="text-sm text-muted-foreground">Kendaraan Diservis</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">98%</span>
                <span className="text-sm text-muted-foreground">Pelanggan Puas</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-foreground">15+</span>
                <span className="text-sm text-muted-foreground">Mekanik Ahli</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Mengapa Memilih SATRA GARAGE+?</h2>
            <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">Standar layanan tertinggi untuk menjaga kendaraan Anda tetap dalam kondisi prima.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-2xl shadow-sm border border-border/50 transition-transform hover:-translate-y-1">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Hemat Waktu</h3>
              <p className="text-muted-foreground">Tidak perlu antre berjam-jam. Datang sesuai jadwal booking Anda dan langsung ditangani.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-2xl shadow-sm border border-border/50 transition-transform hover:-translate-y-1">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Mekanik Tersertifikasi</h3>
              <p className="text-muted-foreground">Kendaraan Anda ditangani oleh teknisi profesional yang berpengalaman di bidangnya.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card rounded-2xl shadow-sm border border-border/50 transition-transform hover:-translate-y-1">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">Transparan</h3>
              <p className="text-muted-foreground">Estimasi biaya dan waktu pengerjaan jelas di awal tanpa ada biaya tersembunyi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
              <Wrench className="h-4 w-4 mr-2" />
              Layanan Kami
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">Solusi Lengkap Kendaraan Anda</h2>
            <p className="max-w-[800px] text-muted-foreground md:text-xl">
              Pilih paket layanan yang sesuai dengan kebutuhan perawatan kendaraan Anda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {layanan?.map((item) => (
              <div key={item.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
                <div className="p-8">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold">{item.namaLayanan}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 line-clamp-3">{item.deskripsi}</p>
                  
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-3xl font-bold text-foreground">
                      Rp {Number(item.harga).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      Estimasi: {item.estimasiWaktu} menit
                    </li>
                  </ul>
                </div>
                
                <div className="p-8 pt-0 mt-auto">
                  <Link href="/booking" className="w-full">
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Pilih Layanan
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Merawat Kendaraan Anda?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan pelanggan yang telah mempercayakan perawatan kendaraannya kepada SATRA GARAGE+.
          </p>
          <Link href="/register">
            <Button className="bg-white text-primary hover:bg-white/90 h-14 px-10 text-lg rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              Mulai Sekarang Gratis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
