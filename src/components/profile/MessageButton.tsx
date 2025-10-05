'use client';

import { useFormStatus } from 'react-dom';
import { IconMessage } from '@tabler/icons-react';
import { createConversationAndRedirect } from '@/lib/actions';

interface MessageButtonProps {
  otherUserId: string;
  className?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-accent btn-sm" disabled={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2 text-white/75">
          <span className="loading loading-spinner loading-sm text-white/75"></span>
          Mengirim...
        </span>
      ) : (
        <>
          <IconMessage className="text-base-content" size={16} />
          <p className="text-base-content"> Kirim Pesan</p>
        </>
      )}
    </button>
  );
}

export default function MessageButton({ otherUserId, className = '' }: MessageButtonProps) {
  return (
    <form action={createConversationAndRedirect.bind(null, otherUserId)} className={className}>
      <SubmitButton />
    </form>
  );
}
