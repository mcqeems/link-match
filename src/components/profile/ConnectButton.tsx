'use client';

import { useActionState, useEffect, useState } from 'react';
import { requestConnectionAction } from '@/lib/actions';
import { useToast } from '@/components/notifications/ToastProvider';
import SubmitButton from '@/components/SubmitButton';
import { IconMailUp } from '@tabler/icons-react';

type FormState = { error: string | null; success: boolean };

export default function ConnectButton({ otherUserId }: { otherUserId: string }) {
  const toast = useToast();
  const [state, formAction] = useActionState<FormState, FormData>(requestConnectionAction, {
    error: null,
    success: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    if (state.success) {
      toast.success('Connection request sent.');
      setSubmitted(false);
    } else if (state.error) {
      toast.error(state.error);
      setSubmitted(false);
    }
  }, [state.success, state.error, submitted, toast]);

  const onSubmit = (formData: FormData) => {
    setSubmitted(true);
    formAction(formData);
  };

  return (
    <form action={onSubmit}>
      <input type="hidden" name="otherUserId" value={otherUserId} />
      <SubmitButton pendingText="Mengirim...">
        <IconMailUp size={16} />
        Connect
      </SubmitButton>
    </form>
  );
}
