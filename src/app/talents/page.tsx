import { redirect } from 'next/navigation';
import { fetchProfileInfo } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import Talents from '@/components/talents/Talents';

export default async function TalentsPage() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (session) {
    const profileInfo = await fetchProfileInfo();
    const role = profileInfo?.User.roles?.name;
    if (!role || role === undefined) {
      redirect('/');
    }
  }

  if (!session) {
    redirect('/');
  }

  return (
    <Suspense>
      <Talents />
    </Suspense>
  );
}
