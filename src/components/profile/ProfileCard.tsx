import { fetchProfileInfo } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import {
  IconWorld,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
  IconInfoCircle,
  IconBriefcase,
  IconEdit,
  IconUserCircle,
} from '@tabler/icons-react';
import ExpandableText from './ExpandableText';

// Tipe untuk props, tetap sama
interface PropsTypes {
  mode: 'personal' | 'public';
  // Anda bisa menambahkan props lain jika diperlukan, misalnya userId untuk profil publik
}

// Komponen untuk menampilkan link sosial media, agar kode lebih rapi
function SocialLinks({ profileInfo }: { profileInfo: NonNullable<Awaited<ReturnType<typeof fetchProfileInfo>>> }) {
  // Array untuk memudahkan me-render link sosial media
  const socialLinks = [
    { href: profileInfo.website, icon: <IconWorld size={24} />, label: 'Website' },
    { href: profileInfo.linkedin, icon: <IconBrandLinkedin size={24} />, label: 'LinkedIn' },
    { href: profileInfo.github, icon: <IconBrandGithub size={24} />, label: 'GitHub' },
    { href: profileInfo.instagram, icon: <IconBrandInstagram size={24} />, label: 'Instagram' },
  ];

  return (
    <div className="flex justify-center md:justify-start gap-4 mt-4">
      {socialLinks.map(
        (link) =>
          // Hanya render ikon jika link-nya ada
          link.href && (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle hover:bg-base-content/10"
              aria-label={link.label}
            >
              {link.icon}
            </Link>
          )
      )}
    </div>
  );
}

// Komponen untuk kartu profil personal (milik sendiri)
export async function PersonalCard() {
  const profileInfo = await fetchProfileInfo();

  // Tampilan jika profil tidak ditemukan
  if (!profileInfo) {
    return (
      <div className="card bg-secondary shadow-xl w-full max-w-4xl mx-auto text-center p-10">
        <IconUserCircle size={64} className="mx-auto text-base-content/30" />
        <h2 className="mt-4 text-2xl font-bold">Profil tidak ditemukan</h2>
        <p className="text-base-content/70">Gagal memuat data profil. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  const { User, headline, description, experiences } = profileInfo;
  const { name, email, image_url, roles } = User;

  return (
    <div className="card bg-secondary shadow-xl w-full max-w-4xl mx-auto my-auto">
      <div className="card-body p-6 md:p-10">
        {/* Bagian Header Profil */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="avatar">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <Image
                src={image_url || '/profile_image_default.png'}
                alt={`Foto profil ${name}`}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-2">
              <h1 className="card-title text-3xl font-bold">{name}</h1>
              <Link href="/profile/edit" className="btn btn-outline btn-accent  btn-sm">
                <IconEdit size={16} />
                Edit Profil
              </Link>
            </div>
            <p className="text-xl text-white/75 mt-1">{headline || 'Headline belum diatur'}</p>
            <p className="text-sm text-base-content/70">{email}</p>
            {roles?.name && (
              <div className="mt-3">
                <span className="badge badge-accent font-semibold capitalize">{roles.name}</span>
              </div>
            )}
            <SocialLinks profileInfo={profileInfo} />
          </div>
        </div>

        <div className="divider my-6" />

        {/* Bagian Deskripsi */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <IconInfoCircle />
            Tentang Saya
          </h2>
          <ExpandableText text={description} maxLength={300} placeholder="Pengguna ini belum menambahkan deskripsi." />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <IconBriefcase />
            Pengalaman
          </h2>
          <ExpandableText text={experiences} maxLength={300} placeholder="Pengguna ini belum menambahkan pengalaman." />
        </div>
        {/* ▲▲▲ AKHIR PERUBAHAN ▲▲▲ */}
      </div>
    </div>
  );
}

// Komponen utama yang akan memilih kartu mana yang akan ditampilkan
export default function ProfileCard({ mode }: PropsTypes) {
  if (mode === 'personal') {
    return <PersonalCard />;
  }

  // Di sini Anda bisa menambahkan logika untuk 'public' card nanti
  // if (mode === 'public') {
  //   return <PublicCard />;
  // }

  return null;
}
