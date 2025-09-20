import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { signOut } from '@/lib/actions';

export default async function DashboardPage() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Ini adalah halaman dashboard yang terproteksi.</p>
      <form action={signOut}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
