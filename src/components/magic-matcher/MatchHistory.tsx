'use client';

import { useState, useEffect } from 'react';
import { IconSparkles, IconHeart, IconX, IconCalendar, IconLoader2, IconSearch } from '@tabler/icons-react';

interface MatchHistoryItem {
  id: number;
  prompt: string;
  status: string;
  created_at: string;
  total_matches: number;
  swiped_count: number;
  right_swipes: number;
}

export function MatchHistory() {
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/magic-match/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchDetails = async (matchRequestId: number) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/magic-match/matches?match_request_id=${matchRequestId}`);
      if (response.ok) {
        const data = await response.json();
        setMatchDetails(data);
        setSelectedMatch(matchRequestId);
      }
    } catch (error) {
      console.error('Failed to fetch match details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="card bg-accent/10 border border-gray-700 w-full max-w-md">
          <div className="card-body text-center">
            <IconSearch className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
            <h2 className="card-title justify-center text-2xl mb-4">Belum Ada Riwayat</h2>
            <p className="opacity-75 mb-6">
              Anda belum melakukan pencarian magic matches. Mulai pencarian pertama untuk melihat hasilnya di sini.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* History List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Riwayat Pencarian</h2>

          {history.map((item) => (
            <div
              key={item.id}
              className={`card bg-accent/10 border cursor-pointer transition-all hover:shadow-lg ${
                selectedMatch === item.id ? 'border-primary shadow-lg' : 'border-gray-700 hover:border-primary/50'
              }`}
              onClick={() => fetchMatchDetails(item.id)}
            >
              <div className="card-body p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconSparkles className="w-5 h-5 text-secondary-content flex-shrink-0" />
                    <div
                      className={`badge badge-sm ${item.status === 'completed' ? 'badge-success' : 'badge-warning'}`}
                    >
                      {item.status === 'completed' ? 'Selesai' : 'Proses'}
                    </div>
                  </div>

                  <div className="flex items-center opacity-60 text-sm">
                    <IconCalendar className="w-4 h-4 mr-1" />
                    {formatDate(item.created_at)}
                  </div>
                </div>

                <p className="font-medium mb-3 line-clamp-2">{item.prompt}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="opacity-75">{item.total_matches} kandidat</span>

                    {item.swiped_count > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center text-success gap-1">
                          <IconHeart className="w-4 h-4" />
                          {item.right_swipes}
                        </div>
                        <div className="flex items-center text-error gap-1">
                          <IconX className="w-4 h-4" />
                          {item.swiped_count - item.right_swipes}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-accent text-sm font-medium">Lihat Detail →</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Match Details */}
        <div className="lg:sticky lg:top-6">
          {loadingDetails ? (
            <div className="card bg-accent/10 border border-gray-700">
              <div className="card-body flex items-center justify-center">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            </div>
          ) : selectedMatch && matchDetails ? (
            <div className="card bg-accent/10 border border-gray-700">
              <div className="card-body">
                <h3 className="card-title text-lg">Detail Hasil</h3>
                <p className="opacity-75 text-sm">{matchDetails.match_request.prompt}</p>

                {/* Stats */}
                <div className="stats stats-vertical lg:stats-horizontal shadow mt-4">
                  <div className="stat">
                    <div className="stat-value text-primary text-xl">{matchDetails.total_matches}</div>
                    <div className="stat-title text-xs">Total</div>
                  </div>

                  <div className="stat">
                    <div className="stat-value text-success text-xl">{matchDetails.right_swipes}</div>
                    <div className="stat-title text-xs">Disukai</div>
                  </div>

                  <div className="stat">
                    <div className="stat-value text-error text-xl">
                      {matchDetails.swiped_count - matchDetails.right_swipes}
                    </div>
                    <div className="stat-title text-xs">Dilewati</div>
                  </div>
                </div>

                {/* Match List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {matchDetails.matches.map((match: any) => (
                    <div
                      key={match.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center flex-shrink-0">
                        {match.talent.image_url || match.talent.image ? (
                          <img
                            src={match.talent.image_url || match.talent.image}
                            alt={match.talent.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">{match.talent.name.charAt(0)}</span>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">{match.talent.name}</h4>

                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{Math.round(match.similarity_score * 100)}%</span>

                            {match.swipe && (
                              <span
                                className={`p-1 rounded-full ${
                                  match.swipe.direction === 'right' ? 'text-green-600' : 'text-red-400'
                                }`}
                              >
                                {match.swipe.direction === 'right' ? (
                                  <IconHeart className="w-4 h-4" />
                                ) : (
                                  <IconX className="w-4 h-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {match.talent.headline && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{match.talent.headline}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <IconSparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                Select a search from the history to view detailed match results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
