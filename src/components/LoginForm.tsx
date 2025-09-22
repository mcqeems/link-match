'use client';

import { signInWithEmail } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

const initialState = { error: null as string | null, success: false };

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(signInWithEmail, initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.success) router.push('/');
  }, [state.success, router]);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h1 className="font-mono font-bold md:text-5xl text-2xl mb-2">Login</h1>
      <p className="mb-2 md:mb-4">Login to your account.</p>
      <form
        onSubmit={() => setIsLoading(true)}
        action={formAction}
        className="space-y-4 flex flex-col w-full max-w-xl bg-secondary p-4 rounded-lg"
      >
        <label htmlFor="email" className="font-bold">
          Email
        </label>
        <input className="input w-full" name="email" type="email" required />

        <label htmlFor="email" className="font-bold">
          Password
        </label>
        <input className="input w-full" name="password" type="password" required minLength={6} />

        <button
          className="btn btn-sm md:btn-md bg-primary hover:bg-primary/75 max-w-[200px] self-center"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <span className="loading loading-spinner loading-md"></span> : null}
          Sign In
        </button>

        {state.error && <p className="text-red-500 mt-2 text-center">{state.error}</p>}
      </form>
    </div>
  );
}
