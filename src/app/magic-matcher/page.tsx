import { Metadata } from 'next';
import { MagicMatcherPage } from '@/components/magic-matcher/MagicMatcherPage';
import { fetchProfileInfo } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Forbidden from '@/components/magic-matcher/Forbidden';

export const metadata: Metadata = {
  title: 'Magic Matcher',
  description: 'Find the perfect talent match using AI-powered search',
};

export default async function MagicMatcher() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session) {
    redirect('/sign-in');
  }

  if (session) {
    const profileInfo = await fetchProfileInfo();
    const role = profileInfo?.User.roles?.name;
    if (!role || role === undefined) {
      redirect('/');
    }
    if (role === 'Talenta') {
      return <Forbidden />;
    }
  }
  return <MagicMatcherPage />;
}
