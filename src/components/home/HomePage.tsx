'use client';

import Link from 'next/link';
import Image from 'next/image';
import Squares from '@/components/SquaresBG';
import { IconMessage, IconSparkles, IconUserCog } from '@tabler/icons-react';

export default async function HomePage() {
  return (
    <div className="min-h-dvh md:mt-8">
      {/* Hero Section */}
      <section className="hero bg-accent/20/20 text-base-content relative">
        <Squares
          speed={0.3}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#2b5069"
          hoverFillColor="#406e8d"
          // Optional: tweak fades for a smoother edge
          fadeBottomPx={140}
          fadeSidesPx={24}
        />
        <div className="hero-content max-w-4xl mx-auto flex-col lg:flex-row gap-10 py-64 px-6">
          <div className="flex-1 space-y-6 flex flex-col justify-center items-center text-center">
            <div className="badge badge-outline">Smart Talent Matching</div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight font-mono text-foreground">LinkMatch</h1>
            <p className="opacity-80 text-lg text-foreground">
              Platform yang mempertemukan Recruiter dan Talenta dengan pencocokan berbasis AI. LinkMatch memanfaatkan
              Semantic Search untuk memahami kebutuhan peran dan profil talenta bukan sekadar kata kunci.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-up" className="btn btn-accent rounded-2xl md:min-w-[175px]">
                Mulai
              </Link>
              <Link href="/about" className="btn btn-accent btn-outline rounded-2xl md:min-w-[175px]">
                Tentang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Technology */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="badge badge-outline">AI Technology</div>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 font-mono">Powered by AWS Bedrock</h2>
            <p className="opacity-75 mt-2 max-w-4xl mx-auto">
              LinkMatch memanfaatkan AWS Bedrock untuk embedding dan pencarian semantik. Mesin kami memahami konteks
              deskripsi pekerjaan serta pengalaman talenta, lalu menyusun peringkat kandidat yang paling relevan untuk
              kebutuhan Anda.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="collapse collapse-arrow bg-accent/20 border border-gray-700">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">Semantic Candidate Discovery</div>
                <div className="collapse-content opacity-80">
                  <p>
                    Kandidat ditemukan lewat semantic search mencocokkan makna dan konteks, bukan sekadar <i>keyword</i>
                    .
                  </p>
                </div>
              </div>
              <div className="collapse collapse-arrow bg-accent/20 border border-gray-700">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">Context-aware Ranking</div>
                <div className="collapse-content opacity-80">
                  <p>
                    Sistem menyusun peringkat kandidat berdasarkan kesesuaian terhadap peran, tumpukan teknologi, dan
                    preferensi yang Anda tulis.
                  </p>
                </div>
              </div>
              <div className="collapse collapse-arrow bg-accent/20 border border-gray-700">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium">Keandalan AWS Bedrock</div>
                <div className="collapse-content opacity-80">
                  <p>
                    Infrastruktur aman dan dapat diskalakan di AWS. Menggunakan Bedrock untuk embedding, penalaran, dan
                    orkestrasi pencarian.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-2 flex-wrap">
                <div className="badge badge-outline">AWS Bedrock</div>
                <div className="badge badge-outline">Semantic Search</div>
                <div className="badge badge-outline">Embeddings</div>
                <div className="badge badge-outline">RAG</div>
                <div className="badge badge-outline">Scalable</div>
              </div>
            </div>

            <div className="bg-accent/20 border border-gray-700 p-6 rounded-lg flex flex-wrap gap-6 items-center justify-center">
              <Image className="object-contain" src="/aws.webp" alt="Amazon Web Service" width={168} height={168} />
              <Image className="object-contain" src="/bedrock.webp" alt="Amazon Bedrock" width={168} height={168} />
              <Image className="object-contain" src="/claude.webp" alt="Claude AI" width={168} height={168} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-mono">Kenapa LinkMatch?</h2>
            <p className="opacity-75 mt-2 max-w-2xl mx-auto">
              Hemat waktu mencari kandidat atau peluang kerja. LinkMatch menyajikan rekomendasi yang relevan sejak awal,
              sehingga Anda bisa fokus pada percakapan dan keputusan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card bg-accent/20 border border-gray-700">
              <div className="card-body">
                <div className="flex justify-center items-center">
                  <IconSparkles size={50} />
                </div>
                <h3 className="card-title mt-2">Pencocokan Berbasis AI</h3>
                <p className="opacity-75">
                  Algoritma semantik menilai keterkaitan pengalaman, teknologi, dan konteks kebutuhan peran Anda.
                </p>
              </div>
            </div>

            <div className="card bg-accent/20 border border-gray-700">
              <div className="card-body">
                <div className="flex justify-center items-center">
                  <IconUserCog size={50} />
                </div>
                <h3 className="card-title mt-2">Profil Pintar</h3>
                <p className="opacity-75">
                  Talenta menonjol dengan profil yang ringkas namun informatif: keahlian, pengalaman, portofolio, dan
                  preferensi kerja.
                </p>
              </div>
            </div>

            <div className="card bg-accent/20 border border-gray-700">
              <div className="card-body">
                <div className="flex justify-center items-center">
                  <IconMessage size={50} />
                </div>
                <h3 className="card-title mt-2">Pesan Terintegrasi</h3>
                <p className="opacity-75">
                  Bangun komunikasi lebih cepat. Hubungi kandidat atau recruiter langsung dari platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-accent/20/20 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-mono">Bagaimana Cara Kerjanya?</h2>
            <p className="opacity-75 mt-2 max-w-2xl mx-auto">
              LinkMatch menggabungkan AI dan pencarian semantik untuk mempercepat proses rekrutmen dan pencarian kerja.
              Berikut alurnya untuk Recruiter.
            </p>
          </div>
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            <li className="step step-accent" data-content="1">
              <div>
                <h4 className="font-semibold">Buat Akun</h4>
                <p className="text-sm opacity-70">Lengkapi profil dan kebutuhan perusahaan Anda.</p>
              </div>
            </li>
            <li className="step step-accent" data-content="2">
              <div>
                <h4 className="font-semibold">Tulis Kebutuhan</h4>
                <p className="text-sm opacity-70">Masukkan prompt/perintah: peran, stack, dan kriteria penting.</p>
              </div>
            </li>
            <li className="step step-accent" data-content="3">
              <div>
                <h4 className="font-semibold">Dapatkan Rekomendasi</h4>
                <p className="text-sm opacity-70">
                  Tinjau kandidat teratas yang sudah diurutkan berdasarkan kesesuaian.
                </p>
              </div>
            </li>
            <li className="step step-accent" data-content="4">
              <div>
                <h4 className="font-semibold">Hubungi Talenta</h4>
                <p className="text-sm opacity-70">
                  Lanjutkan via pesan di LinkMatch atau kontak yang tersedia untuk proses berikutnya.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-mono">Testimoni</h2>
            <p className="opacity-75 mt-2 max-w-2xl mx-auto">Cerita dari pengguna yang telah merasakan manfaatnya.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card bg-accent/20 border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full overflow-hidden">
                      <Image
                        src="/iceng.jpg" // letakkan file di public/avatars/raka.png
                        alt="Nur Ihsan"
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Nur Ihsan</div>
                    <div className="text-sm opacity-70">Project Manager di PT PPTIK UNIDA</div>
                  </div>
                </div>
                <p className="mt-4 opacity-80">
                  “Rekomendasinya sangat relevan. Saya bisa shortlist kandidat 3x lebih cepat dibanding proses manual.”
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card bg-accent/20 border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full overflow-hidden">
                      <Image
                        src="/yono.jpg" // letakkan file di public/avatars/aulia.png
                        alt="Rizky Cahyono Putra"
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Rizky Cahyono Putra</div>
                    <div className="text-sm opacity-70">Software Engineer di PT INFOTIS</div>
                  </div>
                </div>
                <p className="mt-4 opacity-80">
                  “Profil saya mudah ditemukan oleh recruiter yang tepat. Notifikasi match-nya akurat dan informatif.”
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card bg-accent/20 border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full overflow-hidden">
                      <Image
                        src="/dafi.png" // letakkan file di public/avatars/sari.png
                        alt="Dafi Al-Haq"
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">Dafi Al-Haq</div>
                    <div className="text-sm opacity-70">Network Engineer di PT PPTIK UNIDA</div>
                  </div>
                </div>
                <p className="mt-4 opacity-80">
                  “Dengan prompt singkat, saya langsung mendapatkan kandidat yang sesuai budaya tim dan kebutuhan role.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Free to Use */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="badge badge-success badge-outline">Tidak ada biaya tambahan</div>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 font-mono">100% Gratis Digunakan</h2>
            <p className="opacity-75 mt-2 max-w-2xl mx-auto">
              Semua fitur inti LinkMatch dapat dipakai tanpa biaya. Rekruter bisa memposting kebutuhan dan mendapatkan
              rekomendasi talenta, sementara talenta bisa membuat profil dan terlihat oleh pencarian tanpa biaya
              tersembunyi.
            </p>
          </div>

          <div className="flex justify-center items-center">
            <div className="card bg-accent/20 border border-gray-700 w-full md:max-w-[350px]">
              <div className="card-body">
                <h3 className="card-title">Gratis Selamanya</h3>
                <p className="opacity-90">Mulai dalam hitungan detik dan nikmati semua kemampuan utama.</p>
                <div className="stats bg-accent/20 text-accent-content mt-2">
                  <div className="stat">
                    <div className="stat-title">Biaya Bulanan</div>
                    <div className="stat-value text-blue-200">Rp 0</div>
                    <div className="stat-desc">Tanpa kartu kredit. Tanpa batasan dasar.</div>
                  </div>
                </div>
                <div className="card-actions mt-4">
                  <Link href="/sign-up" className="btn btn-secondary">
                    Mulai Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-7xl w-full mx-auto">
          <div className="md:alert flex flex-col rounded-lg shadow-lg p-4 bg-accent/20 md:bg-accent/20 gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-2xl">Siap memulai?</h3>
              <div className="text-sm opacity-90">Bergabung sekarang dan temukan kecocokan terbaik Anda.</div>
            </div>
            <div className="flex flex-col md:flex-row gap-2 justify-self-end">
              <Link href="/sign-up" className="btn btn-accent">
                Daftar
              </Link>
              <Link href="/sign-in" className="btn btn-accent btn-outline">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
