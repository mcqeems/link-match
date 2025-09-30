import { redirect } from 'next/navigation';
import { fetchProfileInfo, fetchUserConversations } from '@/lib/data';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import MessagesPage from '@/components/messages/MessagesPage';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Messages',
  description: 'Kelola percakapan Anda dengan kandidat atau recruiter melalui pesan di LinkMatch.',
};

export default async function Messages() {
  const currentHeaders = await headers();
  const session = await auth.api.getSession({
    headers: currentHeaders,
  });

  if (!session) {
    redirect('/');
  }

  const profileInfo = await fetchProfileInfo();
  const role = profileInfo?.User.roles?.name;
  if (!role || role === undefined) {
    redirect('/');
  }

  // Fetch initial conversations
  let initialConversations: any[] = [];
  try {
    initialConversations = await fetchUserConversations();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    initialConversations = [];
  }

  return (
    <div className="h-screen pt-16">
      <Suspense>
        <MessagesPage initialConversations={initialConversations} currentUserId={session.user.id} />
      </Suspense>
    </div>
  );
}
