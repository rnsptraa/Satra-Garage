import BookingForm from './BookingForm'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api'

export default async function BookingPage() {
  let layananList = []
  
  try {
    const res = await fetch(`${BACKEND_URL}/booking/layanan`, {
      // no-store ensures we always get fresh data (or we can revalidate)
      cache: 'no-store'
    })
    if (res.ok) {
      layananList = await res.json()
    }
  } catch (error) {
    console.error("Gagal mengambil data layanan", error)
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Buat Jadwal Servis</h1>
        <p className="text-muted-foreground text-lg">
          Isi formulir di bawah ini untuk mengatur jadwal servis kendaraan Anda. Tim kami akan segera mempersiapkan kebutuhan Anda.
        </p>
      </div>

      <BookingForm layananList={layananList} />
    </div>
  )
}
