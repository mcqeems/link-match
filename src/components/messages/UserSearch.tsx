'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { searchUsers } from '@/lib/data';
import { createOrFindConversation } from '@/lib/actions';
import { IconSearch, IconUserCircle } from '@tabler/icons-react';
import type { User } from './types';

interface UserSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSearch({ isOpen, onClose }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const results = await searchUsers(searchQuery.trim());
        setSearchResults(results as User[]);
      } catch (error) {
        console.error('Search error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat mencari pengguna';
        setError(`Pencarian gagal: ${errorMessage}`);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeout = setTimeout(performSearch, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSelectUser = async (user: User) => {
    try {
      setIsSearching(true);
      const result = await createOrFindConversation(user.id);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.conversationId) {
        onClose();
        router.push(`/messages?id=${result.conversationId}`);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Terjadi kesalahan saat membuat percakapan');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Mulai Percakapan Baru</h3>
          <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle">
            ✕
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="form-control mb-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Cari pengguna berdasarkan nama, email, atau headline..."
              className="input w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full p-3 rounded-lg hover:bg-base-200 flex items-center gap-3 text-left transition-colors"
                >
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <Image
                        src={user.image_url || '/profile_image_default.png'}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.name}</p>
                    <p className="text-sm text-base-content/70 truncate">
                      {user.profile?.headline || user.roles?.name || 'User'}
                    </p>
                    <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="text-center py-8 text-base-content/60">
              <IconUserCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p>Tidak ada pengguna ditemukan</p>
              <p className="text-xs mt-1">Coba gunakan kata kunci yang berbeda</p>
            </div>
          ) : (
            <div className="text-center py-8 text-base-content/60">
              <IconSearch size={48} className="mx-auto mb-2 opacity-50" />
              <p>Ketik untuk mencari pengguna</p>
              <p className="text-xs mt-1">Cari berdasarkan nama, email, atau headline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
