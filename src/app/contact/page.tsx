'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/notifications/ToastProvider';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});
  const { success, error } = useToast();

  const recipient = 'mcqeemsofficial@gmail.com';

  const mailtoHref = useMemo(() => {
    const parts: string[] = [];
    if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
    const bodyLines = [
      name ? `Nama: ${name}` : undefined,
      email ? `Email: ${email}` : undefined,
      message ? `\nPesan:\n${message}` : undefined,
    ].filter(Boolean) as string[];
    if (bodyLines.length) parts.push(`body=${encodeURIComponent(bodyLines.join('\n'))}`);
    const query = parts.length ? `?${parts.join('&')}` : '';
    return `mailto:${recipient}${query}`;
  }, [name, email, subject, message]);

  const validate = () => {
    const next: { name?: string; email?: string; subject?: string; message?: string } = {};
    if (!subject.trim()) next.subject = 'Subjek wajib diisi';
    if (!message.trim()) next.message = 'Pesan wajib diisi';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Format email tidak valid';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error('Periksa kembali isian formulir.');
      return;
    }
    success('Membuka aplikasi email Anda…');
    setTimeout(() => {
      window.location.href = mailtoHref;
    }, 75);
  };

  return (
    <div className="min-h-dvh py-16 px-6 md:mt-8 mt-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Hubungi Kami</h1>
          <p className="opacity-75 mt-2">Kirimkan pesan singkat, kami akan merespons secepatnya.</p>
        </div>

        <div className="card bg-accent/20 border border-base-300">
          <form className="card-body" onSubmit={onSubmit} noValidate>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Nama</span>
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="label-text-alt text-error">{errors.name}</span>}
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  placeholder="nama@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="label-text-alt text-error">{errors.email}</span>}
              </label>
            </div>

            <label className="form-control mt-3">
              <div className="label">
                <span className="label-text">
                  Subjek <span className="text-error">*</span>
                </span>
              </div>
              <input
                type="text"
                className={`input input-bordered w-full ${errors.subject ? 'input-error' : ''}`}
                placeholder="Topik pesan"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              {errors.subject && <span className="label-text-alt text-error">{errors.subject}</span>}
            </label>

            <label className="form-control mt-3">
              <div className="label">
                <span className="label-text">
                  Pesan <span className="text-error">*</span>
                </span>
              </div>
              <textarea
                className={`textarea textarea-bordered w-full min-h-40 ${errors.message ? 'textarea-error' : ''}`}
                placeholder="Tulis pesan Anda di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              {errors.message && <span className="label-text-alt text-error">{errors.message}</span>}
            </label>

            <div className="card-actions mt-4 justify-between items-center">
              <Link href="/" className="btn btn-outline btn-error">
                Kembali
              </Link>
              <button type="submit" className="btn btn-success">
                Kirim via Email
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm opacity-60 mt-3">
          Tombol “Kirim via Email” akan membuka aplikasi email Anda dengan subjek dan isi yang sudah terisi otomatis.
        </p>
      </div>
    </div>
  );
}
