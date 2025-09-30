import { redirect } from 'next/navigation';
import { fetchProfileInfo } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ProfileCard from '@/components/profile/ProfileCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Lihat profil Anda di LinkMatch termasuk informasi, pengalaman, dan preferensi karier.',
};

export default async function Profile() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session) {
    redirect('/');
  }

  if (session) {
    const profileInfo = await fetchProfileInfo();
    const role = profileInfo?.User.roles?.name;
    if (!role || role === undefined) {
      redirect('/');
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <ProfileCard mode="personal" />
      </div>
    </div>
  );
}
