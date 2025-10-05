'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
// Using built-in date formatting to avoid external dependency
import { IconMessages, IconSearch, IconPlus, IconUserCircle, IconTrash } from '@tabler/icons-react';
import type { Conversation, User } from './types';

interface ConversationListProps {
  conversations: Conversation[];
  onDeleteConversation?: (conversationId: number) => void;
  onNewConversation?: () => void;
  isLoading?: boolean;
  unreadCounts?: { [conversationId: number]: number };
}

export default function ConversationList({
  conversations,
  onDeleteConversation,
  onNewConversation,
  isLoading = false,
  unreadCounts = {},
}: ConversationListProps) {
  const searchParams = useSearchParams();
  const activeConversationId = searchParams.get('id');

  const formatMessageTime = (dateString: string | Date | null) => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = (now.getTime() - date.getTime()) / 1000;

      if (diffInSeconds < 60) {
        return 'Baru saja';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} menit lalu`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} jam lalu`;
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} hari lalu`;
      } else {
        return date.toLocaleDateString('id-ID');
      }
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-accent">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="skeleton w-10 h-10 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-3 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full bg-base-200">
        {/* Header */}
        <div className="p-4 bg-base-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <IconMessages size={24} />
              Messages
            </h2>
            <button onClick={() => onNewConversation?.()} className="btn btn-success btn-sm">
              <IconPlus size={16} />
              Baru
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto motion-preset-fade-md">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <IconMessages size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Belum ada percakapan</h3>
              <p className="text-base-content/70 mb-4">Mulai percakapan dengan mengklik tombol "Baru" di atas</p>
              <button onClick={() => onNewConversation?.()} className="btn btn-accent btn-sm">
                <IconPlus size={16} />
                Mulai Percakapan
              </button>
            </div>
          ) : (
            <div className="divide-y divide-base-300">
              {conversations.map((conversation) => {
                const isActive = activeConversationId === conversation.id.toString();
                const otherUser = conversation.otherParticipant;
                const lastMessage = conversation.lastMessage;
                const unreadCount = unreadCounts[conversation.id] || 0;

                return (
                  <Link
                    key={conversation.id}
                    href={`/messages?id=${conversation.id}`}
                    className={`block p-4 hover:bg-base-100 transition-colors ${isActive ? 'bg-primary/10 border-r-2 border-b-0 border-accent' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="avatar relative">
                        <div className="w-12 h-12 rounded-full">
                          <Image
                            src={otherUser?.image_url || '/profile_image_default.png'}
                            alt={otherUser?.name || 'Unknown User'}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className={`font-semibold text-sm truncate ${unreadCount > 0 ? 'text-white' : ''}`}>
                            {otherUser?.name || 'Unknown User'}
                          </h3>
                          {lastMessage && (
                            <span className="text-xs text-base-content/60 ml-2 flex-shrink-0">
                              {formatMessageTime(lastMessage.created_at)}
                            </span>
                          )}
                        </div>

                        {lastMessage ? (
                          <p className="text-sm text-base-content/70 truncate">
                            {lastMessage.sender_id === otherUser?.id ? '' : 'Anda: '}
                            {lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm text-base-content/50 italic">Percakapan dimulai</p>
                        )}
                      </div>

                      {onDeleteConversation && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="btn btn-ghost btn-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IconTrash size={14} />
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
