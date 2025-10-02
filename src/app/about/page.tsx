import { redirect } from 'next/navigation';
import { fetchProfileInfo } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconCheck, IconWorld } from '@tabler/icons-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Pelajari misi, visi, dan teknologi di balik LinkMatch—platform pencocokan talenta dan recruiter berbasis AI.',
};

export default async function About() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  // Pertahankan perilaku: jika user sudah login namun belum melengkapi role,
  // arahkan kembali ke beranda untuk menyelesaikan profil.
  if (session) {
    const profileInfo = await fetchProfileInfo();
    const role = profileInfo?.User.roles?.name;
    if (!role || role === undefined) {
      redirect('/');
    }
  }

  return (
    <div className="min-h-dvh md:mt-12 mt-4">
      {/* Banner ringkas (berbeda dari hero ber-latar animasi) */}
      <section>
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">
          <h1 className="text-3xl md:text-5xl font-bold font-mono">Tentang LinkMatch</h1>
          <p className="opacity-80 mt-3 max-w-3xl">
            LinkMatch mempertemukan Recruiter dan Talenta melalui pencarian semantik dan orkestrasi AI. Fokus kami
            adalah relevansi, transparansi, dan efisiensi—agar keputusan bisa diambil lebih cepat dan tepat.
          </p>
          <span className="divider"></span>
        </div>
      </section>

      {/* Visi & Misi (split layout) */}
      <section id="visi-misi" className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card h-full bg-accent/20 border border-gray-700">
            <div className="card-body">
              <h2 className="card-title">Visi</h2>
              <p className="opacity-75">
                Menjadi jembatan paling tepercaya antara perusahaan dan talenta, dengan pengalaman pencarian yang
                manusiawi—memahami konteks, potensi, dan preferensi.
              </p>
              <ul className="list-disc pl-5 space-y-1 opacity-80">
                <li>Menonjolkan relevansi di atas kata kunci.</li>
                <li>Membantu keputusan yang cepat dan adil.</li>
                <li>Memperkuat kolaborasi lewat percakapan bermakna.</li>
              </ul>
            </div>
          </div>
          <div className="card h-full bg-accent/20 border border-gray-700">
            <div className="card-body">
              <h2 className="card-title">Misi</h2>
              <p className="opacity-75">Menyajikan rekomendasi kandidat dan peluang kerja yang akurat sejak awal.</p>
              <div className="stats stats-vertical md:stats-horizontal w-full bg-base-200 border border-gray-700">
                <div className="stat">
                  <div className="stat-title">Waktu shortlist</div>
                  <div className="stat-value">-3x</div>
                  <div className="stat-desc">Dibanding proses manual</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Kepuasan match</div>
                  <div className="stat-value">98%</div>
                  <div className="stat-desc">Umpan balik pengguna</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teknologi Inti (dua kolom berbeda gaya) */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-accent/20 border border-gray-700 p-6 rounded-lg flex flex-wrap gap-6 items-center justify-center">
            <Image className="object-contain" src="/aws.webp" alt="Amazon Web Service" width={168} height={168} />
            <Image className="object-contain" src="/bedrock.webp" alt="Amazon Bedrock" width={168} height={168} />
            <Image className="object-contain" src="/claude.webp" alt="Claude AI" width={168} height={168} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold font-mono">Didukung AWS Bedrock & Semantic Search</h2>
            <p className="opacity-75">Inti teknologi kami:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <IconCheck />
                Embedding untuk memahami makna teks
              </li>
              <li className="flex items-center gap-2">
                <IconCheck />
                Pencarian semantik kontekstual
              </li>
              <li className="flex items-center gap-2">
                <IconCheck />
                Ranking kandidat berbasis kesesuaian
              </li>
              <li className="flex items-center gap-2">
                <IconCheck />
                Reliabilitas dan skala melalui AWS Bedrock
              </li>
            </ul>
            <div className="flex gap-2 flex-wrap pt-2">
              <div className="badge badge-outline">AWS Bedrock</div>
              <div className="badge badge-outline">Semantic Search</div>
              <div className="badge badge-outline">Embeddings</div>
              <div className="badge badge-outline">Ranking</div>
              <div className="badge badge-outline">Scalable</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai-nilai (berbeda dari kartu misi) */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="card bg-accent/20 border border-gray-700">
            <div className="card-body">
              <div className="badge badge-primary">Relevansi</div>
              <h3 className="card-title">Fokus pada Kesesuaian</h3>
              <p className="opacity-75">Memahami konteks dan kebutuhan, bukan hanya kata kunci.</p>
            </div>
          </div>
          <div className="card bg-accent/20 border border-gray-700">
            <div className="card-body">
              <div className="badge badge-primary">Transparansi</div>
              <h3 className="card-title">Alasan yang Jelas</h3>
              <p className="opacity-75">Mengapa kandidat direkomendasikan, dijelaskan secara ringkas.</p>
            </div>
          </div>
          <div className="card bg-accent/20 border border-gray-700">
            <div className="card-body">
              <div className="badge badge-primary">Efisiensi</div>
              <h3 className="card-title">Cepat ke Inti</h3>
              <p className="opacity-75">Hadirkan shortlist relevan lebih awal untuk menghemat waktu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ringkas */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 font-mono">FAQ</h2>
          <div className="space-y-3">
            <div className="collapse collapse-arrow bg-accent/20 border border-gray-700">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">Apakah LinkMatch gratis?</div>
              <div className="collapse-content opacity-80">
                <p>Ya, fitur inti dapat digunakan secara gratis tanpa biaya tersembunyi.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-accent/20 border border-gray-700">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">Apakah AI menggantikan proses interview?</div>
              <div className="collapse-content opacity-80">
                <p>Tidak. AI membantu menyaring dan memberi rekomendasi — keputusan tetap pada manusia.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-accent/20 border border-gray-700">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-medium">Bagaimana privasi data dijaga?</div>
              <div className="collapse-content opacity-80">
                <p>Infrastruktur berjalan di atas AWS dengan praktik keamanan dan isolasi data yang baik.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Card */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 font-mono">Pengembang</h2>
          <div className="card bg-accent/20 border border-gray-700">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full overflow-hidden">
                    {/* Ganti dengan foto developer Anda di public/avatars/developer.png */}
                    <Image src="/developer.webp" alt="Developer LinkMatch" width={64} height={64} />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-lg">Developer LinkMatch</div>
                  <div className="text-sm opacity-70">Full-stack Developer</div>
                </div>
              </div>
              <p className="mt-4 opacity-80">
                Saya membangun LinkMatch untuk membantu perusahaan dan talenta bertemu lebih cepat melalui teknologi
                pencarian semantik dan orkestrasi AI yang andal.
              </p>
              <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-4">
                <Link
                  className="rounded-full bg-transparent hover:bg-gray-500 transition-colors p-2"
                  href="https://www.linkedin.com/in/mcqeems/"
                >
                  <IconBrandLinkedin size={24} />
                </Link>
                <Link
                  className="rounded-full bg-transparent hover:bg-gray-500 transition-colors p-2"
                  href="https://github.com/mcqeems"
                >
                  <IconBrandGithub size={24} />
                </Link>
                <Link
                  className="rounded-full bg-transparent hover:bg-gray-500 transition-colors p-2"
                  href="https://www.instagram.com/mcqeems/"
                >
                  <IconBrandInstagram size={24} />
                </Link>
                <Link
                  className="rounded-full bg-transparent hover:bg-gray-500 transition-colors p-2"
                  href="https://www.qeem.site"
                >
                  <IconWorld size={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
