import LoginForm from '@/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Masuk ke akun LinkMatch Anda untuk melanjutkan percakapan dan pengelolaan profil.',
};

export default function SignInPage() {
  return (
    <>
      <LoginForm />
    </>
  );
}
