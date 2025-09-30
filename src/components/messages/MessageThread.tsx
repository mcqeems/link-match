'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Image from 'next/image';
import { useActionState } from 'react';
import { sendMessage } from '@/lib/actions';
import { useToast } from '@/components/notifications/ToastProvider';
import { IconSend, IconArrowLeft, IconDotsVertical, IconTrash, IconUserCircle } from '@tabler/icons-react';
import Link from 'next/link';
import type { Message, User } from './types';

interface MessageThreadProps {
  conversationId: number;
  messages: Message[];
  otherUser: User | null;
  currentUserId: string;
  onBack?: () => void;
  onDeleteConversation?: () => void;
  onMessageSent?: () => void;
  isPolling?: boolean;
  className?: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

function MessageBubble({ message, isOwnMessage, showAvatar = true }: MessageBubbleProps) {
  const formatTime = (dateString: string | Date | null) => {
    if (!dateString) return '';

    try {
      return new Date(dateString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar slot: always reserve space for other user's messages to keep bubbles aligned */}
        {!isOwnMessage && (
          <div className="mr-2 flex-shrink-0">
            {showAvatar ? (
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  <Image
                    src={message.User.image_url || '/profile_image_default.png'}
                    alt={message.User.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              // Placeholder keeps the same width/height so subsequent bubbles align with the first
              <div className="w-8 h-8" />
            )}
          </div>
        )}

        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div
            className={`
              px-4 py-2 rounded-2xl break-words
              ${isOwnMessage ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'}
            `}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <span className="text-xs text-base-content/60">{formatTime(message.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageInputProps {
  conversationId: number;
  currentUserId: string;
  onMessageSent?: () => void;
}

function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const toast = useToast();
  const [message, setMessage] = useState('');
  const [state, formAction, isPendingAction] = useActionState(sendMessage, { error: null, success: false });
  const [isPending, startTransition] = useTransition();
  const [submissionCount, setSubmissionCount] = useState(0);
  const processedCount = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Trigger refresh when we have a new successful submission
    if (state.success && submissionCount > processedCount.current) {
      console.log('Message sent successfully, triggering refresh. Submission count:', submissionCount);
      setMessage('');
      onMessageSent?.();
      processedCount.current = submissionCount;
    }
  }, [state.success, submissionCount, onMessageSent]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending || isPendingAction) return;

    const formData = new FormData();
    formData.append('conversationId', conversationId.toString());
    formData.append('content', message.trim());

    // Increment submission count to track new submissions
    setSubmissionCount((prev) => prev + 1);

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className=" p-4 bg-base-100">
      {/* error toasts handled via effect */}

      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="Ketik pesan..."
          className="textarea textarea-bordered flex-1 resize-none min-h-[40px] max-h-32"
          rows={1}
          maxLength={1000}
          disabled={isPending || isPendingAction}
        />
        <button
          type="submit"
          disabled={!message.trim() || isPending || isPendingAction}
          className={`btn btn-primary btn-square ${isPending || isPendingAction ? 'loading' : ''}`}
        >
          {isPending || isPendingAction ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <IconSend size={20} />
          )}
        </button>
      </form>

      <div className="text-xs text-base-content/60 mt-1 text-right">{message.length}/1000</div>
    </div>
  );
}

export default function MessageThread({
  conversationId,
  messages,
  otherUser,
  currentUserId,
  onBack,
  onDeleteConversation,
  onMessageSent,
  isPolling = false,
  className = '',
}: MessageThreadProps) {
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDrawer, setShowDeleteDrawer] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Open a bottom drawer instead of using browser confirm
  const handleDeleteConversation = () => {
    setShowDeleteDrawer(true);
  };

  const confirmDeleteConversation = () => {
    toast.info('Deleting conversation...');
    onDeleteConversation?.();
    toast.success('Conversation deleted');
    setShowDeleteDrawer(false);
    setShowMenu(false);
  };

  // Close drawer on Escape key
  useEffect(() => {
    if (!showDeleteDrawer) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDeleteDrawer(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDeleteDrawer]);

  if (!otherUser) {
    return (
      <div className={`flex flex-col h-full bg-base-100 ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <IconUserCircle size={64} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Percakapan tidak ditemukan</h3>
            <p className="text-base-content/70">Pilih percakapan dari daftar atau mulai percakapan baru</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-base-100 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="btn btn-ghost btn-sm btn-circle lg:hidden">
              <IconArrowLeft size={20} />
            </button>
          )}
          <Link className="flex items-center gap-3" href={`/profile/${otherUser.id}`}>
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={otherUser.image_url || '/profile_image_default.png'}
                  alt={otherUser.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold">{otherUser.name}</h3>
              <p className="text-sm text-base-content/70">
                {otherUser.profile?.headline || otherUser.roles?.name}
                {isPolling && <span className="ml-2 text-xs text-primary-light"> ⟳ </span>}
              </p>
            </div>
          </Link>
        </div>

        {onDeleteConversation && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="btn btn-ghost btn-sm btn-circle">
              <IconDotsVertical size={20} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 z-10 min-w-[200px]">
                <div className="menu bg-accent rounded-box shadow-lg">
                  <li>
                    <button
                      onClick={handleDeleteConversation}
                      className="text-red-200 hover:bg-error/75 transition-colors"
                    >
                      <IconTrash size={16} />
                      Hapus Percakapan
                    </button>
                  </li>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="divider"></div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="avatar mb-4">
              <div className="w-16 h-16 rounded-full">
                <Image
                  src={otherUser.image_url || '/profile_image_default.png'}
                  alt={otherUser.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            </div>
            <h4 className="font-semibold mb-2">Mulai percakapan dengan {otherUser.name}</h4>
            <p className="text-base-content/70">Kirim pesan untuk memulai percakapan</p>
            <p className="text-red-500 text-sm mt-4">
              * Apabila anda tidak jadi untuk memulai percakapan harap dihapus.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === currentUserId;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showAvatar = !prevMessage || prevMessage.sender_id !== message.sender_id;

              return (
                <MessageBubble key={message.id} message={message} isOwnMessage={isOwnMessage} showAvatar={showAvatar} />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={currentUserId}
        onMessageSent={() => {
          onMessageSent?.();
          setTimeout(scrollToBottom, 100);
        }}
      />

      {/* Click outside to close menu */}
      {showMenu && <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />}

      {/* Delete confirmation modal (center) with dark backdrop */}
      <div
        className={`fixed inset-0 z-50 ${showDeleteDrawer ? '' : 'pointer-events-none'}`}
        aria-hidden={!showDeleteDrawer}
      >
        {/* Backdrop: 75% black */}
        <div
          className={`absolute inset-0 bg-black/75 transition-opacity ${showDeleteDrawer ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowDeleteDrawer(false)}
        />
        {/* Centered modal */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-full max-w-md transform rounded-2xl bg-base-200 p-5 shadow-2xl transition-all duration-200 ease-out ${showDeleteDrawer ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-3">
              <div className="text-error mt-0.5">
                <IconTrash size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">Hapus Percakapan?</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  Tindakan ini akan menghapus seluruh pesan dalam percakapan ini untuk anda dan yang tersangkut.
                  Tindakan tidak dapat dibatalkan.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button className="btn btn-ghost" onClick={() => setShowDeleteDrawer(false)}>
                    Batal
                  </button>
                  <button className="btn btn-error" onClick={confirmDeleteConversation}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className=" label text-xs text-center block mb-2">Pesan direfresh setiap 30 detik sekali.</p>
    </div>
  );
}
