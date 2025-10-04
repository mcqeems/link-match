'use client';

import { useFormStatus } from 'react-dom';
import { IconLoader2 } from '@tabler/icons-react';
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
          <span className="loading loading-spinner loading-sm"></span> {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
