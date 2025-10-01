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
        <IconLoader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
          <IconSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Search History</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't made any magic matches yet. Start your first search to see results here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* History List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search History</h2>

          {history.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 transition-all cursor-pointer ${
                selectedMatch === item.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => fetchMatchDetails(item.id)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <IconSparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <IconCalendar className="w-4 h-4 mr-1" />
                    {formatDate(item.created_at)}
                  </div>
                </div>

                <p className="text-gray-900 dark:text-white font-medium mb-3 line-clamp-2">{item.prompt}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 dark:text-gray-300">{item.total_matches} matches</span>

                    {item.swiped_count > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-green-600">
                          <IconHeart className="w-4 h-4 mr-1" />
                          {item.right_swipes}
                        </div>
                        <div className="flex items-center text-red-600">
                          <IconX className="w-4 h-4 mr-1" />
                          {item.swiped_count - item.right_swipes}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">View Details →</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Match Details */}
        <div className="lg:sticky lg:top-6">
          {loadingDetails ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <div className="flex items-center justify-center">
                <IconLoader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            </div>
          ) : selectedMatch && matchDetails ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Match Details</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{matchDetails.match_request.prompt}</p>
              </div>

              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{matchDetails.total_matches}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Matches</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{matchDetails.right_swipes}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Liked</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {matchDetails.swiped_count - matchDetails.right_swipes}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Passed</div>
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
                                  match.swipe.direction === 'right' ? 'text-green-600' : 'text-red-600'
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
