'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import UserSearch from './UserSearch';
import { fetchUserConversations, fetchConversationMessages, fetchConversationDetails } from '@/lib/data';
import { deleteConversation } from '@/lib/actions';
import type { Conversation, Message, User } from './types';

interface MessagesPageProps {
  initialConversations: Conversation[];
  currentUserId: string;
}

export default function MessagesPage({ initialConversations, currentUserId }: MessagesPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showMobileConversations, setShowMobileConversations] = useState(true);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [isPollingMessages, setIsPollingMessages] = useState(false);
  const currentMessagesRef = useRef<Message[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationId = searchParams.get('id');

  // Load conversation messages when conversation ID changes
  useEffect(() => {
    const loadConversationData = async () => {
      if (!conversationId) {
        setSelectedConversation(null);
        setMessages([]);
        setOtherUser(null);
        setShowMobileConversations(true);
        return;
      }

      const id = parseInt(conversationId);
      if (isNaN(id)) return;

      setIsLoadingMessages(true);
      setShowMobileConversations(false);

      try {
        // Load conversation details and messages in parallel
        const [conversationDetails, conversationMessages] = await Promise.all([
          fetchConversationDetails(id),
          fetchConversationMessages(id),
        ]);

        // Find the other participant
        const otherParticipant = conversationDetails.conversation_participants.find(
          (participant) => participant.user_id !== currentUserId
        );

        setSelectedConversation(conversationDetails as Conversation);
        setMessages(conversationMessages as Message[]);
        currentMessagesRef.current = conversationMessages as Message[];
        setOtherUser(otherParticipant?.User || null);
      } catch (error) {
        console.error('Error loading conversation:', error);
        // Handle error - maybe show a toast or redirect
        router.push('/messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadConversationData();
  }, [conversationId, currentUserId, router]);

  // Refresh conversations periodically (simple polling for now)
  useEffect(() => {
    const refreshConversations = async () => {
      try {
        const updatedConversations = await fetchUserConversations();
        setConversations(updatedConversations as unknown as Conversation[]);
      } catch (error) {
        console.error('Error refreshing conversations:', error);
      }
    };

    // Refresh every 30 seconds
    const interval = setInterval(refreshConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh active conversation messages periodically
  useEffect(() => {
    if (!conversationId) return;

    const refreshActiveMessages = async () => {
      const id = parseInt(conversationId);
      if (isNaN(id)) return;

      try {
        setIsPollingMessages(true);
        console.log('Polling: Refreshing messages for conversation', id);
        const updatedMessages = await fetchConversationMessages(id);

        // Only update if there are new messages (compare with ref)
        const currentMessages = currentMessagesRef.current;
        if (
          updatedMessages.length !== currentMessages.length ||
          (updatedMessages.length > 0 &&
            currentMessages.length > 0 &&
            updatedMessages[updatedMessages.length - 1]?.id !== currentMessages[currentMessages.length - 1]?.id)
        ) {
          console.log('New messages detected, updating UI');
          setMessages(updatedMessages as Message[]);
          currentMessagesRef.current = updatedMessages as Message[];
        }
      } catch (error) {
        console.error('Error refreshing active conversation messages:', error);
      } finally {
        setIsPollingMessages(false);
      }
    };

    // Refresh messages every 5 seconds for active conversation (more frequent for better UX)
    const interval = setInterval(refreshActiveMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId]); // Remove messages dependency to avoid excessive polling

  const handleDeleteConversation = async (conversationIdToDelete: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) {
      return;
    }

    try {
      const result = await deleteConversation(conversationIdToDelete);
      if (result.success) {
        // Remove from local state
        setConversations((prev) => prev.filter((c) => c.id !== conversationIdToDelete));

        // If this was the selected conversation, clear selection
        if (selectedConversation?.id === conversationIdToDelete) {
          router.push('/messages');
        }
      } else {
        alert(result.error || 'Gagal menghapus percakapan');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Terjadi kesalahan saat menghapus percakapan');
    }
  };

  const handleBackToConversations = () => {
    setShowMobileConversations(true);
    router.push('/messages');
  };

  const refreshMessages = useCallback(async () => {
    if (!conversationId) return;

    const id = parseInt(conversationId);
    if (isNaN(id)) return;

    console.log('Refreshing messages for conversation:', id);

    try {
      const updatedMessages = await fetchConversationMessages(id);
      setMessages(updatedMessages as Message[]);
      currentMessagesRef.current = updatedMessages as Message[];

      // Also refresh conversations to update last message
      const updatedConversations = await fetchUserConversations();
      setConversations(updatedConversations as unknown as Conversation[]);

      console.log('Messages refreshed successfully');
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  }, [conversationId]);

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex bg-base-200">
        {/* Conversation List - Hidden on mobile when a conversation is selected */}
        <div
          className={`
          w-full lg:w-80 lg:flex-shrink-0 border-r border-base-300 bg-base-100
          ${showMobileConversations ? 'block' : 'hidden lg:block'}
        `}
        >
          <ConversationList
            conversations={conversations}
            onDeleteConversation={handleDeleteConversation}
            onNewConversation={() => setShowUserSearch(true)}
            isLoading={false}
          />
        </div>

        {/* Message Thread - Hidden on mobile when no conversation is selected */}
        <div
          className={`
        flex-1 flex flex-col
        ${showMobileConversations ? 'hidden lg:flex' : 'flex'}
      `}
        >
          {conversationId ? (
            isLoadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-4 text-base-content/70">Memuat percakapan...</p>
                </div>
              </div>
            ) : (
              <MessageThread
                conversationId={parseInt(conversationId)}
                messages={messages}
                otherUser={otherUser}
                currentUserId={currentUserId}
                onBack={handleBackToConversations}
                onDeleteConversation={() => handleDeleteConversation(parseInt(conversationId))}
                onMessageSent={refreshMessages}
                isPolling={isPollingMessages}
              />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center bg-base-100">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-2xl font-semibold mb-3">Selamat datang di Pesan</h3>
                <p className="text-base-content/70 mb-6">
                  Pilih percakapan dari sidebar atau mulai percakapan baru untuk memulai chatting.
                </p>
                <div className="text-sm text-base-content/60">
                  <p>
                    💡 <strong>Tips:</strong>
                  </p>
                  <ul className="mt-2 space-y-1 text-left">
                    <li>• Klik "Baru" untuk memulai percakapan</li>
                    <li>• Tekan Enter untuk mengirim pesan</li>
                    <li>• Gunakan Shift+Enter untuk baris baru</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Search Modal */}
      <UserSearch isOpen={showUserSearch} onClose={() => setShowUserSearch(false)} />
    </>
  );
}
