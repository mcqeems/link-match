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
    <div className="min-h-dvh md:mt-8">
      {/* Hero Section */}
      <section className="hero bg-accent/20 text-base-content relative">
        <div className="hero-content max-w-6xl mx-auto flex-col py-32 px-6">
          <div className="text-center space-y-6">
            <div className="badge badge-outline">AI-Powered Talent Matching</div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight font-mono">Magic Matcher</h1>
            <p className="opacity-80 text-lg max-w-2xl">
              Temukan talenta yang tepat dengan kekuatan AI. Cukup deskripsikan kebutuhan Anda, dan biarkan Magic
              Matcher menemukan kandidat terbaik menggunakan semantic search.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="tabs tabs-boxed bg-accent/20 border border-gray-700 justify-center mb-8">
            <button
              onClick={() => setCurrentView('search')}
              className={`tab tab-lg gap-2 ${currentView === 'search' ? 'tab-active' : ''}`}
            >
              <IconSearch className="w-5 h-5" />
              Pencarian
            </button>
            <button
              onClick={() => currentView !== 'search' && setCurrentView('cards')}
              disabled={!matches.length}
              className={`tab tab-lg gap-2 ${
                currentView === 'cards' ? 'tab-active' : ''
              } ${!matches.length ? 'tab-disabled' : ''}`}
            >
              <IconSparkles className="w-5 h-5" />
              Hasil ({matches.length})
            </button>
            <button
              onClick={handleViewHistory}
              className={`tab tab-lg gap-2 ${currentView === 'history' ? 'tab-active' : ''}`}
            >
              <IconHistory className="w-5 h-5" />
              Riwayat
            </button>
          </div>

          {/* Content Cards */}
          <div className="space-y-8">
            {currentView === 'search' && (
              <div className="card bg-accent/20 border border-gray-700">
                <div className="card-body space-y-8">
                  <PromptInput
                    onSearchComplete={handleSearchComplete}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                  <WelcomeSection />
                </div>
              </div>
            )}

            {currentView === 'cards' && matches.length > 0 && matchRequest && (
              <div className="card bg-accent/20 border border-gray-700">
                <div className="card-body">
                  <TalentCards
                    matches={matches}
                    matchRequest={matchRequest}
                    onBackToSearch={handleBackToSearch}
                    onUpdateMatch={setMatches}
                  />
                </div>
              </div>
            )}

            {currentView === 'history' && (
              <div className="card bg-accent/20 border border-gray-700">
                <div className="card-body">
                  <MatchHistory />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
