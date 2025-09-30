import SignUpForm from '@/components/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Daftar ke LinkMatch untuk mulai terhubung dengan recruiter atau menemukan talenta terbaik.',
};

export default function SignUpPage() {
  return (
    <>
      <SignUpForm />
    </>
  );
}
