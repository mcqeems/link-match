import { redirect } from 'next/navigation';
import { fetchProfileInfo, getCategories } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import { Suspense } from 'react';

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
