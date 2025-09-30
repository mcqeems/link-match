import { redirect } from 'next/navigation';
import { fetchProfileInfo } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import Talents from '@/components/talents/Talents';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talents',
  description: 'Jelajahi daftar Talenta di LinkMatch dan temukan kandidat yang paling relevan untuk kebutuhan Anda.',
};

export default async function TalentsPage({
  searchParams,
}: {
  searchParams?: { page?: string; category?: string; q?: string };
}) {
  const param = await searchParams;
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

  const page = Number(param?.page ?? 1) || 1;
  const category = param?.category ? Number(param.category) : undefined;
  const q = param?.q ?? undefined;

  return (
    <Suspense>
      <Talents page={page} category={category} q={q} />
    </Suspense>
  );
}
