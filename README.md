<div align="center">
  <img src="public/LinkMatch_HD.png" alt="LinkMatch Logo" width="300"/>
  
  <p><strong>Platform Jaringan Profesional Bertenaga AI</strong></p>
  <p>Pencocokan talenta cerdas menggunakan AWS Bedrock dan teknologi pencarian semantik</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock-orange)](https://aws.amazon.com/bedrock/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.16.2-2D3748)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
</div>

## 🌟 Ringkasan

LinkMatch adalah platform jaringan profesional inovatif yang merevolusi cara rekruter dan talenta profesional terhubung. Dibuat untuk AWS Hackathon, platform ini menggabungkan teknologi AI terdepan dengan pengalaman pengguna yang intuitif untuk menciptakan hubungan profesional yang bermakna.

Platform ini menjembatani kesenjangan antara pencarian kerja tradisional dan penemuan talenta bertenaga AI modern, memungkinkan rekruter untuk mendeskripsikan kandidat ideal mereka dalam bahasa alami dan menerima pencocokan yang cerdas dan personal.

## ✨ Fitur Utama

### 🤖 AI Magic Matcher

- **Pencarian Bahasa Alami**: Deskripsikan kandidat ideal Anda dalam bahasa Indonesia
- **Pemahaman Semantik**: AI memahami konteks dan makna, bukan hanya kata kunci
- **Interface Gaya Tinder**: Geser kandidat dengan animasi yang halus
- **Penjelasan Kecocokan**: Penjelasan yang dihasilkan AI mengapa setiap kandidat cocok
- **Skor Kesamaan**: Pencocokan berbasis persentase dengan algoritma canggih
- **Riwayat Kecocokan**: Pelacakan lengkap pencarian dan keputusan

### 👤 Manajemen Profil Komprehensif

- **Profil Berbasis Peran**: Pengalaman terpisah untuk Rekruter dan Talenta
- **Pembuatan Profil Kaya**: Pengalaman kerja detail, keahlian, dan preferensi
- **Klasifikasi Kategori**: Kategorisasi talenta yang terorganisir
- **Integrasi Sosial**: Koneksi LinkedIn, GitHub, dan portofolio
- **Kontrol Visibilitas Profil**: Tampilan profil publik dan pribadi

### 💬 Sistem Pesan Cerdas

- **Komunikasi Real-Time**: Pesan instan antar pengguna yang cocok
- **Manajemen Percakapan**: Thread chat terorganisir dan riwayat
- **Pencarian Pengguna**: Temukan dan terhubung dengan profesional lain
- **Percakapan Berbasis Kecocokan**: Transisi mulus dari pencocokan ke pesan

### 🔍 Penemuan Talenta Canggih

- **Jelajahi Semua Talenta**: Direktori talenta komprehensif
- **Filter Kategori**: Filter berdasarkan kategori profesional
- **Fungsionalitas Pencarian**: Temukan talenta spesifik berdasarkan kata kunci
- **Paginasi**: Penjelajahan efisien untuk kumpulan talenta besar

### 🔐 Autentikasi Aman

- **Integrasi Better Auth**: Sistem autentikasi modern dan aman
- **Verifikasi Email**: Akun pengguna terverifikasi
- **Manajemen Sesi**: Sesi pengguna yang aman
- **Akses Berbasis Peran**: Level akses berbeda untuk Rekruter dan Talenta

### 📱 Pengalaman Pengguna Modern

- **Desain Responsif**: Pengalaman sempurna di semua perangkat
- **Mode Gelap/Terang**: Pergantian tema dengan next-themes
- **UI Interaktif**: Animasi dan transisi yang halus
- **Aksesibilitas**: Dibangun dengan praktik terbaik aksesibilitas

## � Stack Teknologi

### Frontend

- **Next.js 15.5.3** - Framework React dengan App Router
- **React 19.1.0** - Library antarmuka pengguna
- **TypeScript 5.0** - JavaScript dengan type-safe
- **Tailwind CSS 4.0** - Framework CSS utility-first
- **DaisyUI 5.1.13** - Library komponen untuk Tailwind
- **Tabler Icons** - Library ikon modern

### Backend & AI

- **AWS Bedrock** - Model dasar AI
  - Claude 3 Haiku untuk generasi teks
  - Titan Embeddings untuk pencarian semantik
- **Prisma 6.16.2** - Klien database type-safe
- **PostgreSQL** - Database utama
- **Better Auth 1.3.13** - Sistem autentikasi

### Alat Pengembangan

- **TypeScript** - Type safety dan pengalaman developer
- **ESLint** - Code linting dan formatting
- **Prisma Studio** - Manajemen database
- **TSX** - Eksekusi TypeScript untuk script

## 🚀 Memulai

### Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- **Node.js** (v18.0.0 atau lebih tinggi)
- **npm** atau **yarn** package manager
- **PostgreSQL** database
- **AWS Account** dengan akses Bedrock
- **Git** untuk version control

### Pengaturan Environment

1. **Clone repository**

   ```bash
   git clone https://github.com/mcqeems/link-match.git
   cd link-match
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Variabel Environment**

   Buat file `.env.local` di direktori root:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/linkmatch"
   DIRECT_URL="postgresql://username:password@localhost:5432/linkmatch"

   # AWS Bedrock
   AWS_REGION="ap-southeast-2"
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"

   # Authentication
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"

   # Email (for notifications)
   EMAIL_SERVER_HOST="your-smtp-host"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email"
   EMAIL_SERVER_PASSWORD="your-email-password"
   EMAIL_FROM="noreply@yourdomain.com"

   # App Configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Pengaturan Database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Jalankan migrasi database
   npx prisma migrate dev

   # Seed database (opsional)
   npm run dev
   ```

5. **Konfigurasi AWS Bedrock**

   Pastikan akun AWS Anda memiliki akses ke:
   - **Claude 3 Haiku** model
   - **Titan Embeddings G1 - Text** model

   Minta akses melalui konsol AWS Bedrock jika diperlukan.

### Menjalankan Aplikasi

1. **Mode Pengembangan**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

2. **Build untuk Produksi**

   ```bash
   npm run build
   npm start
   ```

3. **Script Berguna**

   ```bash
   # Generate embeddings untuk profil yang ada
   npm run generate-embeddings

   # Seed test data
   npm run seed-test-data

   # Test kredensial AWS
   npm run test-credentials

   # List model yang tersedia
   npm run list-models
   ```

## 📁 Struktur Proyek

```
linkmatch/
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma          # Database schema definition
│   ├── migrations/            # Database migration files
│   └── seed.ts               # Database seeding script
├── public/                    # Static assets
│   ├── LinkMatch_Logo.webp   # Application logo
│   └── ...                   # Other images and assets
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   │   ├── magic-match/  # Magic Matcher endpoints
│   │   │   └── embeddings/   # Embedding generation
│   │   ├── magic-matcher/    # AI matching interface
│   │   ├── profile/          # Profile management
│   │   ├── talents/          # Talent discovery
│   │   ├── messages/         # Messaging system
│   │   └── ...              # Other pages
│   ├── components/           # Reusable React components
│   │   ├── magic-matcher/    # AI matching components
│   │   ├── profile/          # Profile components
│   │   ├── messages/         # Messaging components
│   │   └── ...              # Other components
│   ├── lib/                  # Utility libraries
│   │   ├── bedrock.ts        # AWS Bedrock integration
│   │   ├── semantic-search.ts # Semantic search logic
│   │   ├── auth.ts           # Authentication configuration
│   │   └── data.ts           # Database queries
│   ├── scripts/              # Utility scripts
│   └── types/                # TypeScript type definitions
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
└── README.md                 # This file
```

## 🔧 Dokumentasi API

### Magic Matcher Endpoints

#### `POST /api/magic-match`

Generate pencocokan talenta bertenaga AI dari deskripsi bahasa alami.

**Request Body:**

```json
{
  "prompt": "Saya butuh developer React senior dengan pengalaman TypeScript"
}
```

**Response:**

```json
{
  "match_request_id": 123,
  "matches": [
    {
      "id": 456,
      "talent": {
        "id": "user-uuid",
        "name": "John Doe",
        "headline": "Senior Frontend Developer",
        "similarity_score": 85.5,
        "ai_explanation": "John adalah kecocokan yang sangat baik karena..."
      }
    }
  ],
  "total_matches": 10,
  "prompt_analysis": "Pencarian yang ditingkatkan fokus pada keahlian React dan TypeScript..."
}
```

#### `POST /api/magic-match/swipe`

Record keputusan swipe pengguna (kiri/kanan).

#### `GET /api/magic-match/matches/:id`

Ambil informasi kecocokan detail.

#### `GET /api/magic-match/history`

Dapatkan riwayat pencarian dan kecocokan pengguna.

### Profile Endpoints

#### `GET /api/profiles`

Ambil profil pengguna dengan opsi filtering.

#### `PUT /api/profiles/:id`

Update informasi profil pengguna.

## 🌐 Deployment

### Deployment Vercel (Direkomendasikan)

1. **Connect Repository**
   - Import repository GitHub Anda ke Vercel
   - Konfigurasi variabel environment di dashboard Vercel

2. **Variabel Environment**
   Set semua variabel environment yang diperlukan di Vercel:
   - String koneksi database
   - Kredensial AWS
   - Secret autentikasi

3. **Database**
   - Gunakan layanan PostgreSQL terkelola (Supabase, Railway, atau AWS RDS)
   - Jalankan migrasi: `npx prisma migrate deploy`

4. **Deploy**
   ```bash
   npm run build
   ```

### Deployment AWS

1. **Amplify Hosting**
   - Connect repository GitHub
   - Konfigurasi pengaturan build
   - Set variabel environment

2. **Deployment EC2**
   - Setup environment Node.js
   - Install dependencies
   - Konfigurasi reverse proxy (Nginx)
   - Setup sertifikat SSL

### Deployment Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Berkontribusi

Kami menyambut kontribusi dari komunitas! Berikut cara Anda dapat membantu:

### Alur Kerja Pengembangan

1. **Fork Repository**

   ```bash
   git fork https://github.com/mcqeems/link-match.git
   ```

2. **Buat Feature Branch**

   ```bash
   git checkout -b feature/fitur-keren
   ```

3. **Buat Perubahan Anda**
   - Ikuti praktik terbaik TypeScript
   - Tambahkan test untuk fitur baru
   - Update dokumentasi sesuai kebutuhan

4. **Commit Perubahan Anda**

   ```bash
   git commit -m "feat: tambah fitur keren"
   ```

   Gunakan pesan commit konvensional:
   - `feat:` untuk fitur baru
   - `fix:` untuk perbaikan bug
   - `docs:` untuk dokumentasi
   - `style:` untuk formatting
   - `refactor:` untuk refactoring kode
   - `test:` untuk menambah test

5. **Push dan Buat Pull Request**
   ```bash
   git push origin feature/fitur-keren
   ```

### Panduan Gaya Kode

- **TypeScript**: Semua kode harus ditulis dalam TypeScript
- **Formatting**: Gunakan Prettier untuk formatting kode
- **Linting**: Ikuti aturan ESLint
- **Komponen**: Gunakan komponen fungsional dengan hooks
- **Penamaan**: Gunakan nama deskriptif untuk variabel dan fungsi

### Testing

- Tulis unit test untuk fungsi utility
- Tambahkan integration test untuk API endpoints
- Test komponen dengan React Testing Library
- Pastikan semua test lolos sebelum submit PR

### Proses Pull Request

1. Pastikan deskripsi PR Anda menjelaskan perubahan dengan jelas
2. Sertakan screenshot untuk perubahan UI
3. Update dokumentasi jika diperlukan
4. Minta review dari maintainer
5. Tangani feedback dan buat perubahan yang diperlukan

### Issues dan Laporan Bug

Ketika melaporkan bug, mohon sertakan:

- Deskripsi jelas tentang masalah
- Langkah-langkah untuk reproduksi
- Perilaku yang diharapkan vs aktual
- Screenshot (jika berlaku)
- Detail environment

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Penghargaan

- **AWS Bedrock** untuk menyediakan kemampuan AI yang kuat
- **Tim Next.js** untuk framework React yang luar biasa
- **Tim Prisma** untuk toolkit database yang sangat baik
- **Vercel** untuk platform deployment yang mulus
- **Komunitas Open Source** untuk tools dan library yang luar biasa

## 📞 Dukungan

- **GitHub Issues**: [Laporkan bug atau minta fitur](https://github.com/mcqeems/link-match/issues)
- **Dokumentasi**: Periksa README ini dan komentar kode
- **Komunitas**: Bergabunglah dengan diskusi kami di GitHub Discussions

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk AWS Hackathon</p>
  <p>© 2025 Tim LinkMatch. Semua hak dilindungi.</p>
</div>
