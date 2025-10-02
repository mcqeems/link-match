# Magic Matcher - Pencocokan Talenta Bertenaga AI

## Ringkasan

Magic Matcher adalah fitur inovatif yang menggunakan AI dan pencarian semantik untuk mengubah deskripsi bahasa alami menjadi rekomendasi talenta yang personal. Pengguna dapat mendeskripsikan kandidat ideal mereka dalam bahasa Indonesia, dan sistem akan menemukan kecocokan terbaik menggunakan layanan AI AWS Bedrock.

## Fitur

- 🤖 **Pencarian Bertenaga AI**: Mengubah prompt bahasa alami menjadi pencarian talenta yang cerdas
- 🔍 **Pencarian Semantik**: Menemukan kandidat berdasarkan makna, bukan hanya kata kunci
- 💝 **Pencocokan Gaya Tinder**: Geser kandidat dengan animasi yang halus
- 📊 **Penjelasan Kecocokan**: Penjelasan yang dihasilkan AI mengapa setiap kandidat cocok
- 📈 **Skor Kesamaan**: Skor pencocokan berbasis persentase
- 📱 **Ramah Mobile**: Desain responsif yang bekerja di semua perangkat
- 📚 **Riwayat Kecocokan**: Lacak semua pencarian dan keputusan Anda sebelumnya

## Arsitektur

### Komponen Backend

1. **Skema Database** (`prisma/schema.prisma`)
   - `match_requests`: Menyimpan prompt pencarian pengguna
   - `talent_matches`: Menyimpan kecocokan yang dihasilkan AI
   - `match_swipes`: Melacak keputusan geser pengguna
   - `profile_embeddings`: Penyimpanan vektor untuk pencarian semantik

2. **Integrasi AWS Bedrock** (`src/lib/bedrock.ts`)
   - Generasi teks menggunakan Claude 3 Haiku
   - Generasi embedding menggunakan Titan Embeddings
   - Analisis dan peningkatan prompt

3. **Pencarian Semantik** (`src/lib/semantic-search.ts`)
   - Kalkulasi kesamaan vektor
   - Generasi embedding profil
   - Pencocokan cosine similarity

4. **Route API**
   - `POST /api/magic-match`: Generate kecocokan dari prompt
   - `POST /api/magic-match/swipe`: Rekam keputusan geser
   - `GET /api/magic-match/matches`: Ambil detail kecocokan
   - `GET /api/magic-match/history`: Dapatkan riwayat pencarian

### Komponen Frontend

1. **MagicMatcherPage** (`src/components/magic-matcher/MagicMatcherPage.tsx`)
   - Container utama dengan navigasi
   - Manajemen state untuk berbagai tampilan

2. **PromptInput** (`src/components/magic-matcher/PromptInput.tsx`)
   - Interface input bahasa alami
   - Contoh prompt dan saran

3. **TalentCards** (`src/components/magic-matcher/TalentCards.tsx`)
   - Interface kartu yang dapat digeser
   - Animasi dan gestur yang halus
   - Tampilan informasi kecocokan

4. **MatchHistory** (`src/components/magic-matcher/MatchHistory.tsx`)
   - Hasil pencarian historis
   - Statistik dan analitik

## Pengaturan AWS Bedrock

### Prasyarat

1. **Akun AWS**: Anda memerlukan akun AWS yang aktif
2. **Izin IAM**: Izin yang tepat untuk layanan Bedrock
3. **Akses Model**: Minta akses ke model yang diperlukan

### Model AWS Bedrock yang Diperlukan

#### 1. Amazon Titan Embeddings G1 - Text

- **Model ID**: `amazon.titan-embed-text-v1`
- **Tujuan**: Generate embedding vektor untuk pencarian semantik
- **Input**: Konten teks (deskripsi profil, keahlian, dll.)
- **Output**: Embedding vektor 1536-dimensi

#### 2. Anthropic Claude 3 Haiku

- **Model ID**: `anthropic.claude-3-haiku-20240307-v1:0`
- **Tujuan**: Generate penjelasan kecocokan dan analisis prompt
- **Input**: Prompt terstruktur dengan data talenta dan requirement
- **Output**: Penjelasan dan analisis yang dapat dibaca manusia

### Langkah-langkah Pengaturan AWS

#### 1. Minta Akses Model

1. Pergi ke [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigasi ke "Model access" di sidebar kiri
3. Klik "Request model access"
4. Pilih model berikut:
   - ✅ Amazon Titan Embeddings G1 - Text
   - ✅ Anthropic Claude 3 Haiku
5. Submit permintaan (biasanya disetujui secara instan)

#### 2. Buat IAM Policy

Buat IAM policy dengan JSON berikut:

\`\`\`json
{
"Version": "2012-10-17",
"Statement": [
{
"Effect": "Allow",
"Action": [
"bedrock:InvokeModel",
"bedrock:InvokeModelWithResponseStream"
],
"Resource": [
"arn:aws:bedrock:*::foundation-model/amazon.titan-embed-text-v1",
"arn:aws:bedrock:*::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
]
}
]
}
\`\`\`

#### 3. Buat IAM User atau Role

1. Buat IAM user baru untuk aplikasi
2. Attach policy yang dibuat di atas
3. Generate access key untuk user
4. Simpan kredensial dengan aman

#### 4. Konfigurasi Variabel Environment

Tambahkan berikut ke file `.env` Anda:

\`\`\`env

# Konfigurasi AWS Bedrock

AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your_access_key_here"
AWS_SECRET_ACCESS_KEY="your_secret_key_here"
\`\`\`

### Ketersediaan Region

AWS Bedrock tersedia di region berikut:

- `us-east-1` (N. Virginia) - **Direkomendasikan**
- `us-west-2` (Oregon)
- `eu-west-1` (Ireland)
- `ap-southeast-1` (Singapore)
- `ap-northeast-1` (Tokyo)

## Instalasi dan Pengaturan

### 1. Install Dependencies

\`\`\`bash
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/credential-providers
\`\`\`

### 2. Jalankan Migrasi Database

\`\`\`bash
npx prisma migrate dev --name add_magic_matcher_tables
\`\`\`

### 3. Generate Embedding Profil

Sebelum menggunakan Magic Matcher, generate embedding untuk profil yang ada:

\`\`\`bash
npm run generate-embeddings
\`\`\`

### 4. Konfigurasi Environment

Salin `.env.example` ke `.env` dan isi kredensial AWS Anda:

\`\`\`bash
cp .env.example .env
\`\`\`

## Alur Penggunaan

### 1. Input Pengguna

- Pengguna navigasi ke `/magic-matcher`
- Memasukkan deskripsi bahasa alami dari talenta ideal mereka
- Sistem memvalidasi dan memproses input

### 2. Pemrosesan AI

- AWS Bedrock menganalisis prompt
- Mengekstrak keahlian kunci, level pengalaman, dan requirement
- Meningkatkan query pencarian dengan sinonim dan istilah terkait

### 3. Pencarian Semantik

- Generate embedding untuk prompt yang ditingkatkan
- Membandingkan dengan embedding profil yang tersimpan
- Menghitung skor kesamaan menggunakan cosine similarity

### 4. Generasi Kecocokan

- AI menghasilkan penjelasan personal untuk setiap kecocokan
- Membuat record talent match di database
- Mengembalikan hasil berperingkat ke frontend

### 5. Pencocokan Interaktif

- Pengguna menggeser kandidat gaya Tinder
- Geser kanan = tertarik, Geser kiri = tidak tertarik
- Geseran direkam dan dapat membuat percakapan

### 6. Riwayat dan Analitik

- Semua pencarian dan keputusan disimpan
- Pengguna dapat meninjau kecocokan dan keputusan masa lalu
- Statistik menunjukkan tingkat keberhasilan pencocokan

## Contoh Prompt

Berikut adalah beberapa contoh prompt yang bekerja dengan baik dengan Magic Matcher:

- "Saya butuh developer React senior dengan pengalaman TypeScript"
- "Mencari UI/UX designer dengan pengalaman aplikasi mobile"
- "Butuh data scientist dengan keahlian Python dan machine learning"
- "Mencari spesialis marketing dengan keahlian social media"
- "Mencari DevOps engineer dengan pengalaman AWS dan Docker"

## Endpoint API

### POST `/api/magic-match`

Generate matches from a natural language prompt.

**Request:**
\`\`\`json
{
"prompt": "I need a senior React developer with TypeScript experience"
}
\`\`\`

**Response:**
\`\`\`json
{
"match_request_id": 123,
"matches": [...],
"total_matches": 15,
"prompt_analysis": {...}
}
\`\`\`

### POST `/api/magic-match/swipe`

Record a swipe decision.

**Request:**
\`\`\`json
{
"talent_match_id": 456,
"swipe_direction": "right"
}
\`\`\`

### GET `/api/magic-match/matches?match_request_id=123`

Dapatkan hasil kecocokan detail.

### GET `/api/magic-match/history`

Dapatkan riwayat pencarian pengguna dengan statistik.

## Pertimbangan Performa

### 1. Generasi Embedding

- Embedding dihasilkan secara asinkron
- Rate limiting: Delay 200ms antar panggilan API
- Batch processing untuk setup awal

### 2. Pencarian Vektor

- Cosine similarity in-memory (cocok untuk dataset kecil)
- Untuk produksi: Pertimbangkan menggunakan AWS OpenSearch atau Pinecone

### 3. Caching

- Embedding profil di-cache di database
- Penjelasan AI dihasilkan fresh untuk setiap pencarian

## Estimasi Biaya

### Harga AWS Bedrock (us-east-1)

#### Titan Embeddings G1 - Text

- **Input**: $0.0001 per 1K token
- **Contoh**: 100 profil × 500 token = 50K token = $0.005

#### Claude 3 Haiku

- **Input**: $0.00025 per 1K token
- **Output**: $0.00125 per 1K token
- **Contoh**: 20 kecocokan × 300 token = 6K token input + 4K token output = $0.0065

**Total biaya per pencarian**: ~$0.01 - $0.02

## Troubleshooting

### Common Issues

1. **Model Access Denied**
   - Ensure models are approved in Bedrock console
   - Check IAM permissions

2. **Embedding Generation Fails**
   - Verify AWS credentials
   - Check region configuration
   - Monitor rate limits

3. **No Search Results**
   - Ensure profiles have embeddings generated
   - Check database connections
   - Verify embedding similarity thresholds

### Debug Mode

Enable debug logging by setting:
\`\`\`env
NODE_ENV=development
\`\`\`

## Peningkatan Masa Depan

1. **Integrasi Vector Database**: Ganti pencarian in-memory dengan vector DB yang proper
2. **Filter Lanjutan**: Tambahkan filter untuk lokasi, level pengalaman, dll.
3. **Machine Learning**: Tingkatkan pencocokan berdasarkan feedback pengguna
4. **Update Real-time**: Dukungan WebSocket untuk update kecocokan live
5. **Aplikasi Mobile**: Implementasi React Native

## Pertimbangan Keamanan

1. **Kredensial AWS**: Jangan pernah ekspos kredensial di kode frontend
2. **Rate Limiting**: Implementasikan rate limiting yang tepat untuk endpoint API
3. **Privasi Data**: Pastikan kepatuhan dengan regulasi perlindungan data
4. **Validasi Input**: Sanitasi semua input pengguna sebelum diproses

## Berkontribusi

Ketika berkontribusi ke Magic Matcher:

1. Ikuti gaya kode yang ada
2. Tambahkan unit test untuk fitur baru
3. Update dokumentasi
4. Test dengan integrasi AWS Bedrock yang sesungguhnya
5. Pertimbangkan implikasi performa

## Dukungan

Untuk masalah dan pertanyaan:

1. Periksa bagian troubleshooting
2. Tinjau dokumentasi AWS Bedrock
3. Buka GitHub issues untuk bug
4. Hubungi tim pengembang untuk request fitur
