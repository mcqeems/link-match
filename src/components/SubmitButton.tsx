'use client';

import { useFormStatus } from 'react-dom';
import type { PropsWithChildren } from 'react';

type Props = {
  className?: string;
  pendingText?: string;
  disabled?: boolean;
};

export default function SubmitButton({
  children,
  className = '',
  pendingText = 'Processing...',
  disabled,
}: PropsWithChildren<Props>) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`btn btn-accent btn-sm ${className}`}
      disabled={pending || disabled}
      aria-busy={pending}
      title="Mengirim email kepada user ini."
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="loading loading-spinner loading-sm text-white/75"></span>{' '}
          <p className="text-white/75">{pendingText}</p>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
