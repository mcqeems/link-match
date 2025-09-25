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

interface PropsTypes {
  mode: 'personal' | 'public';
}

function SocialLinks({ profileInfo }: { profileInfo: NonNullable<Awaited<ReturnType<typeof fetchProfileInfo>>> }) {
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

export async function PersonalCard() {
  const profileInfo = await fetchProfileInfo();

  if (!profileInfo) {
    return (
      <div className="card bg-secondary shadow-xl w-full max-w-4xl mx-auto text-center p-10">
        <IconUserCircle size={64} className="mx-auto text-base-content/30" />
        <h2 className="mt-4 text-2xl font-bold">Profil tidak ditemukan</h2>
        <p className="text-base-content/70">Gagal memuat data profil. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  const { User, headline, description, experiences, categories } = profileInfo;
  const { name, email, image_url, roles } = User;

  return (
    <div className="card bg-secondary shadow-xl w-full max-w-4xl mx-auto">
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
            <p className="text-xl text-white/75 mt-1">{headline || null}</p>
            <p className="text-md text-white/75 mb-1">{categories?.name}</p>
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
          <ExpandableText text={description} maxLength={300} placeholder="Anda belum menambahkan deskripsi." />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <IconBriefcase />
            Pengalaman
          </h2>
          <ExpandableText text={experiences} maxLength={300} placeholder="Anda belum menambahkan pengalaman." />
        </div>
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
