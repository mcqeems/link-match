import { redirect } from 'next/navigation';
import { fetchProfileInfo } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function Messages() {
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
    <div className="h-dvh flex justify-center items-center ">
      <p className="text-4xl">Messages</p>
    </div>
  );
}
