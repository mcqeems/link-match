import Form from '@/components/contact/Form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Hubungi tim LinkMatch untuk pertanyaan, umpan balik, atau bantuan penggunaan platform.',
};

export default function Contact() {
  return <Form />;
}
