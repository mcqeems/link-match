import ProfileStarter from '@/components/home/ProfileStarter';
import HomePage from '@/components/home/HomePage';
import { fetchProfileInfo } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function Home() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (session) {
    const profileInfo = await fetchProfileInfo();
    const role = profileInfo?.User.roles?.name;
    if (role === undefined) {
      return <ProfileStarter />;
    }
  }

  return <HomePage />;
}
