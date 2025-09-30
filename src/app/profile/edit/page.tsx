import { redirect } from 'next/navigation';
import { fetchProfileInfo, getCategories } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile',
  description: 'Perbarui profil LinkMatch Anda: headline, kategori, dan informasi penting lainnya.',
};

export default async function ProfileEdit() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session) {
    redirect('/sign-in');
  }

  const [profileInfo, categories] = await Promise.all([fetchProfileInfo(), getCategories()]);

  if (!profileInfo) {
    redirect('/');
  }

  return (
    <div className="my-24">
      <Suspense>
        <ProfileEditForm profileInfo={profileInfo} categories={categories} />
      </Suspense>
    </div>
  );
}
