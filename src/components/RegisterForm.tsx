'use client';

import { useFormState } from 'react-dom';
import { signUpWithEmail } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const initialState = { error: null as string | null, success: false };

export default function SignUpForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(signUpWithEmail, initialState);

  useEffect(() => {
    if (state.success) router.push('/dashboard');
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-4">
      <label>
        Name
        <input name="name" type="text" required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required />
      </label>
      <button type="submit">Sign Up</button>

      {state.error && <p className="text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
