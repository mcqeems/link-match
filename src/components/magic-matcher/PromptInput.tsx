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
    'I need a senior React developer with TypeScript experience',
    'Looking for a UI/UX designer with mobile app experience',
    'Need a data scientist with Python and machine learning skills',
    'Seeking a marketing specialist with social media expertise',
    'Looking for a DevOps engineer with AWS and Docker experience',
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Input Area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Describe your ideal talent
          </label>

          <div className="relative">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., I'm looking for a senior full-stack developer with React, Node.js, and AWS experience who can lead a small team..."
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />

            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <div className="text-sm text-gray-400">{prompt.length}/500</div>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-red-600 dark:text-red-400 text-sm flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                {error}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-green-600 dark:text-green-400 text-sm flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                {successMessage}
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={isLoading || !prompt.trim()}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <IconLoader2 className="w-5 h-5 animate-spin" />
                <span>{successMessage ? 'Preparing matches...' : 'Finding Matches...'}</span>
              </>
            ) : (
              <>
                <IconSparkles className="w-5 h-5" />
                <span>Find Magic Matches</span>
              </>
            )}
          </button>

          <button
            onClick={handleRefreshData}
            disabled={isRefreshing || isLoading}
            className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isRefreshing ? (
              <>
                <IconLoader2 className="w-4 h-4 animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <IconRefresh className="w-4 h-4" />
                <span>Refresh Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
          Or try these examples:
        </h3>

        <div className="space-y-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-start space-x-3">
                <IconSearch className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{example}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <IconLoader2 className="w-5 h-5 animate-spin" />
            <span>AI is analyzing your requirements...</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This may take a few moments as we search through profiles and generate explanations
          </p>
        </div>
      )}
    </div>
  );
}
