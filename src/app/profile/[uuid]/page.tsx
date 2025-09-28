import ProfileCard from '@/components/profile/ProfileCard';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchProfileInfo } from '@/lib/data';
import { Suspense } from 'react';

export async function PageParam(params: { uuid: string }) {
  const param = await params;
  return param.uuid;
}

export default async function PublicProfile({ params }: { params: { uuid: string } }) {
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

  const uuid = await PageParam(params);

  return (
    <div className="min-h-screen py-8 px-4 mt-12">
      <div className="max-w-7xl mx-auto">
        <Suspense>
          <ProfileCard mode="public" uuid={uuid} />
        </Suspense>
      </div>
    </div>
  );
}
