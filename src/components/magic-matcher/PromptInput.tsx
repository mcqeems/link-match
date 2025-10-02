'use client';

import { useState } from 'react';
import { IconSearch, IconSparkles, IconLoader2, IconRefresh } from '@tabler/icons-react';
import { TalentMatch, MatchRequest } from './MagicMatcherPage';

interface PromptInputProps {
  onSearchComplete: (matches: TalentMatch[], matchRequest: MatchRequest) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function PromptInput({ onSearchComplete, isLoading, setIsLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description of your ideal talent');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/magic-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search for matches');
      }

      const data = await response.json();

      // Handle case when no matches are found
      if (data.matches.length === 0) {
        setError(data.message || 'Tidak ada talenta yang sesuai dengan kriteria pencarian Anda.');
        return;
      }

      setSuccessMessage(`Menemukan ${data.matches.length} kandidat yang cocok! 🎉`);

      // Small delay to show success message
      setTimeout(() => {
        onSearchComplete(data.matches, {
          id: data.match_request_id,
          prompt: prompt.trim(),
          status: 'completed',
          created_at: new Date().toISOString(),
        });
      }, 800);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search for matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/embeddings', {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh data');
      }

      const data = await response.json();
      setSuccessMessage(`Refreshed embeddings for ${data.updated} profiles! ✨`);

      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Refresh error:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const examplePrompts = [
    'Saya membutuhkan pengembang React senior dengan pengalaman TypeScript',
    'Mencari desainer UI/UX dengan pengalaman aplikasi seluler',
    'Membutuhkan ilmuwan data (data scientist) dengan keahlian Python dan machine learning',
    'Mencari spesialis pemasaran dengan keahlian media sosial',
    'Mencari insinyur DevOps dengan pengalaman AWS dan Docker',
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Main Input Area */}
      <div className="card bg-accent/10 border border-gray-700">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Deskripsikan Talenta Ideal Anda</h3>

          <div className="form-control">
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Contoh: Saya mencari senior full-stack developer dengan pengalaman React, Node.js, dan AWS yang bisa memimpin tim kecil..."
                className="textarea textarea-bordered w-full h-32 resize-none bg-base-100"
                disabled={isLoading}
              />

              <div className="absolute bottom-3 right-3">
                <div className="badge badge-ghost text-xs">{prompt.length}/500</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mt-4">
              <span className="text-sm">❌ {error}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success mt-4">
              <span className="text-sm">✅ {successMessage}</span>
            </div>
          )}

          <div className="card-actions justify-center mt-6">
            <button
              onClick={handleSearch}
              disabled={isLoading || !prompt.trim()}
              className="btn btn-success btn-wide gap-2"
            >
              {isLoading ? (
                <>
                  <IconLoader2 className="w-5 h-5 animate-spin" />
                  {successMessage ? 'Menyiapkan hasil...' : 'Mencari kandidat...'}
                </>
              ) : (
                <>
                  <IconSparkles className="w-5 h-5" />
                  Mulai
                </>
              )}
            </button>

            <button
              onClick={handleRefreshData}
              disabled={isRefreshing || isLoading}
              className="btn btn-outline btn-info gap-2"
            >
              {isRefreshing ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  Refresh...
                </>
              ) : (
                <>
                  <IconRefresh className="w-4 h-4" />
                  Refresh Data
                </>
              )}
            </button>
          </div>
          {isLoading && (
            <div className="card bg-info/20 border border-info/30 mt-2">
              <div className="card-body text-center">
                <div className="flex items-center justify-center gap-3 text-info">
                  <span className="loading loading-spinner loading-md text-foreground" />
                  <span className="font-medium">AI sedang mencari kandidat yang cocok...</span>
                </div>
                <p className="text-sm opacity-75 mt-2">
                  Ini mungkin membutuhkan beberapa saat saat kami mencari profil dan menghasilkan penjelasan
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center mt-4">
            <p className="text-white/75 text-center text-xs">
              Gunakan refresh data sebelum memakai magic matcher untuk hasil yang lebih akurat.
            </p>
          </div>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="card bg-accent/10 border border-gray-700">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Atau coba contoh ini:</h3>

          <div className="space-y-3">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="btn btn-ghost hover:bg-black/40 btn-sm w-full text-left justify-start h-auto min-h-fit p-3 normal-case"
              >
                <div className="flex items-start gap-3">
                  <IconSearch className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm opacity-75 text-left">{example}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
    </div>
  );
}
