'use client';

import { useState } from 'react';
import { PromptInput } from './PromptInput';
import { TalentCards } from './TalentCards';
import { MatchHistory } from './MatchHistory';
import { WelcomeSection } from './WelcomeSection';
import { IconSparkles, IconHistory, IconSearch } from '@tabler/icons-react';

export interface TalentMatch {
  id: number;
  talent: {
    id: string;
    name: string;
    image_url?: string;
    image?: string;
    headline?: string;
    description?: string;
    experiences?: string;
    category?: string;
    skills: string[];
    website?: string;
    linkedin?: string;
    github?: string;
  };
  similarity_score: number;
  ai_explanation: string;
  created_at: string;
  swipe?: {
    direction: 'left' | 'right';
    created_at: string;
  };
}

export interface MatchRequest {
  id: number;
  prompt: string;
  status: string;
  created_at: string;
}

export function MagicMatcherPage() {
  const [currentView, setCurrentView] = useState<'search' | 'cards' | 'history'>('search');
  const [matches, setMatches] = useState<TalentMatch[]>([]);
  const [matchRequest, setMatchRequest] = useState<MatchRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchComplete = (newMatches: TalentMatch[], newMatchRequest: MatchRequest) => {
    setMatches(newMatches);
    setMatchRequest(newMatchRequest);
    setCurrentView('cards');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setMatches([]);
    setMatchRequest(null);
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentView('search')}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  currentView === 'search'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <IconSearch className="w-4 h-4 mr-2" />
                Search
              </button>
              <button
                onClick={() => currentView !== 'search' && setCurrentView('cards')}
                disabled={!matches.length}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  currentView === 'cards'
                    ? 'bg-purple-600 text-white shadow-md'
                    : matches.length
                      ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <IconSparkles className="w-4 h-4 mr-2" />
                Matches ({matches.length})
              </button>
              <button
                onClick={handleViewHistory}
                className={`flex items-center px-4 py-2 rounded-full transition-all ${
                  currentView === 'history'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <IconHistory className="w-4 h-4 mr-2" />
                History
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentView === 'search' && (
            <>
              <WelcomeSection />
              <PromptInput onSearchComplete={handleSearchComplete} isLoading={isLoading} setIsLoading={setIsLoading} />
            </>
          )}

          {currentView === 'cards' && matches.length > 0 && matchRequest && (
            <TalentCards
              matches={matches}
              matchRequest={matchRequest}
              onBackToSearch={handleBackToSearch}
              onUpdateMatch={setMatches}
            />
          )}

          {currentView === 'history' && <MatchHistory />}
        </div>
      </div>
    </div>
  );
}
