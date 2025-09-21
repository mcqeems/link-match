'use client';

import { useActionState } from 'react';
import { signInWithEmail } from '@/lib/actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();

  const initialState = { error: null as string | null, success: false };
  const [state, formAction] = useActionState(signInWithEmail, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/');
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      <button type="submit">Sign In</button>

      {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
