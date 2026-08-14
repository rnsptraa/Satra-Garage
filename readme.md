# 🏁 Satra Garage+

Satra Garage+ adalah sistem terintegrasi (Web dan Mobile) untuk bengkel otomotif dan spesialis racing #1 di Sentul. Proyek ini memfasilitasi pelanggan untuk melakukan *booking* layanan bengkel, memantau riwayat servis, serta memudahkan admin dan mekanik dalam mengelola operasional bengkel secara digital.

## 🚀 Fitur Utama

### 📱 Mobile App (Pelanggan & Mekanik)
- **Otentikasi**: Login dan Registrasi member.
- **Booking Servis**: Fitur *booking* tanpa antri untuk berbagai layanan (Tune Up, Engine Build, ECU Remapping).
- **Riwayat Transaksi**: Pemantauan histori servis kendaraan secara digital selamanya.
- **Katalog Layanan & Sparepart**: Menampilkan layanan unggulan dan *official partners* suku cadang performa tinggi (BRT, UMA Racing, TDR, dll).
- **Admin Panel (Mobile)**: Manajemen kasir, transaksi harian, serta master data (pelanggan, kendaraan, layanan).

### 💻 Web App (Dashboard Admin & Landing)
- Panel administrasi terpusat untuk memantau aktivitas operasional bengkel secara real-time.
- Database management and query menggunakan ORM modern.

## 🛠️ Teknologi yang Digunakan

**Mobile (Aplikasi Native):**
- [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- [React Navigation v7](https://reactnavigation.org/)
- [Lucide React Native](https://lucide.dev/) (Untuk Ikon)
- AsyncStorage (Penyimpanan Sesi Lokal)
- Backend Terintegrasi (Supabase Client)

**Web (Dashboard & API):**
- [Next.js](https://nextjs.org/) / React
- [Prisma ORM](https://www.prisma.io/)
- [Supabase](https://supabase.com/) (PostgreSQL Database)

## 📦 Panduan Instalasi & Penggunaan

Pastikan komputer/laptop Anda sudah terinstal **Node.js** dan **Git**.

### 1. Clone Repository
```bash
git clone https://github.com/rnsptraa/Satra-Garage.git
cd Satra-Garage
```

### 2. Konfigurasi Database & Environment (.env)
Aplikasi ini terhubung dengan Supabase. Buat file `.env` di folder `mobile` dan `.env.local` di folder `web` dengan format berikut:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Menjalankan Aplikasi Mobile
```bash
cd mobile
npm install
npm run start
# atau
npx expo start
```
*Scan QR code menggunakan aplikasi **Expo Go** di HP Anda, atau tekan `a` untuk membuka di Android Emulator, dan `i` untuk iOS Simulator.*

### 4. Menjalankan Web Dashboard
```bash
cd web
npm install
npx prisma generate
npx prisma db push  # (Untuk sinkronisasi skema database awal)
npm run dev
```
*Buka browser dan kunjungi URL `http://localhost:3000`.*

---
© 2026 SATRA GARAGE+. PERFORMANCE UNLEASHED.
