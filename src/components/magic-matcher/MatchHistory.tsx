'use client';

import { useState, useEffect } from 'react';
import {
  IconSparkles,
  IconHeart,
  IconX,
  IconCalendar,
  IconLoader2,
  IconSearch,
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconThumbUp,
} from '@tabler/icons-react';

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
  const [filteredHistory, setFilteredHistory] = useState<MatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [matchDetails, setMatchDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ITEMS_LIMIT = 5; // Show only 5 items initially

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/magic-match/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setFilteredHistory(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter functionality
  useEffect(() => {
    let filtered = history;

    if (searchTerm) {
      filtered = filtered.filter((item) => item.prompt.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sort by date (newest first)
    filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredHistory(filtered);
  }, [history, searchTerm]);

  const fetchMatchDetails = async (matchRequestId: number) => {
    setLoadingDetails(true);
    setSelectedMatch(matchRequestId);
    setIsModalOpen(true);

    try {
      const response = await fetch(`/api/magic-match/matches?match_request_id=${matchRequestId}`);
      if (response.ok) {
        const data = await response.json();
        setMatchDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch match details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} minggu lalu`;
    return `${Math.ceil(diffDays / 30)} bulan lalu`;
  };

  const displayedHistory = showAll ? filteredHistory : filteredHistory.slice(0, ITEMS_LIMIT);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
    setMatchDetails(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg text-foreground"></span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <div className="card bg-accent/10 border border-gray-700 w-full max-w-md">
          <div className="card-body text-center">
            <div className="avatar mb-4">
              <div className="w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <IconSearch className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="card-title justify-center text-xl mb-2">Mulai Petualangan Anda!</h2>
            <p className="opacity-75 mb-4 text-sm">
              Belum ada riwayat. Magic Matcher siap membantu Anda menemukan talenta terbaik.
            </p>
            <button onClick={() => (window.location.href = '/magic-matcher')} className="btn btn-primary btn-sm gap-2">
              <IconSparkles className="w-4 h-4" />
              Mulai Pencarian
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Riwayat</h2>
          <p className="opacity-75 text-sm">
            {history.length} pencarian • {history.filter((h) => h.status === 'completed').length} selesai
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-row w-full gap-2 sm:w-64">
          <input
            type="text"
            placeholder="Cari riwayat..."
            className="input input-bordered input-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-square btn-sm btn-primary">
            <IconSearch className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="card bg-accent/10 border border-gray-700">
            <div className="card-body text-center py-8">
              <IconSearch className="w-12 h-12 opacity-50 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Tidak Ada Hasil</h3>
              <p className="opacity-75 text-sm">Coba ubah kata kunci pencarian Anda.</p>
            </div>
          </div>
        ) : (
          <>
            {displayedHistory.map((item) => (
              <div
                key={item.id}
                className="card bg-accent/10 border border-gray-700 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => fetchMatchDetails(item.id)}
              >
                <div className="card-body p-4">
                  <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`badge badge-xs ${
                              item.status === 'completed'
                                ? 'badge-success'
                                : item.status === 'failed'
                                  ? 'badge-error'
                                  : 'badge-warning'
                            }`}
                          >
                            {item.status === 'completed'
                              ? 'Selesai'
                              : item.status === 'failed'
                                ? 'Gagal'
                                : item.status === 'processing'
                                  ? 'Memproses'
                                  : 'Menunggu'}
                          </div>
                          <span className="text-xs opacity-60">{formatRelativeDate(item.created_at)}</span>
                        </div>
                        <button className="btn btn-ghost btn-xs gap-1">
                          <IconEye className="w-3 h-3" />
                          Detail
                        </button>
                      </div>

                      <p className="text-sm font-medium mb-3 line-clamp-2 leading-relaxed">{item.prompt}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{item.total_matches}</span>
                          <span className="opacity-60">kandidat</span>
                        </div>
                        {item.swiped_count > 0 && (
                          <>
                            <div className="flex items-center gap-1 text-success">
                              <IconHeart className="w-3 h-3" />
                              <span>{item.right_swipes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-error">
                              <IconX className="w-3 h-3" />
                              <span>{item.swiped_count - item.right_swipes}</span>
                            </div>
                          </>
                        )}

                        {/* Progress */}
                        {item.total_matches > 0 && (
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                              <span className="opacity-60">Progress</span>
                              <span>{Math.round((item.swiped_count / item.total_matches) * 100)}%</span>
                            </div>
                            <progress
                              className="progress progress-primary w-full h-1"
                              value={item.swiped_count}
                              max={item.total_matches}
                            ></progress>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show More/Less Button */}
            {filteredHistory.length > ITEMS_LIMIT && (
              <div className="text-center">
                <button onClick={() => setShowAll(!showAll)} className="btn btn-outline btn-info btn-sm gap-2">
                  {showAll ? (
                    <>
                      <IconChevronUp className="w-4 h-4" />
                      Tampilkan Lebih Sedikit
                    </>
                  ) : (
                    <>
                      <IconChevronDown className="w-4 h-4" />
                      Tampilkan Semua ({filteredHistory.length - ITEMS_LIMIT} lagi)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal for Match Details */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <IconSparkles className="w-5 h-5 text-primary" />
                Detail Pencarian ke-{selectedMatch}
              </h3>
              <button className="btn btn-sm btn-circle btn-ghost" onClick={closeModal}>
                <IconX className="w-4 h-4" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex items-center justify-center py-16">
                <span className="loading loading-spinner loading-lg text-foreground"></span>
              </div>
            ) : matchDetails ? (
              <div className="space-y-6">
                {/* Prompt */}
                <div className="alert bg-accent">
                  <div>
                    <h4 className="font-semibold mb-1">Pencarian:</h4>
                    <p className="text-sm">{matchDetails.match_request.prompt}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="stats shadow w-full">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <IconSearch className="w-6 h-6" />
                    </div>
                    <div className="stat-title text-xs">Total Kandidat</div>
                    <div className="stat-value text-primary text-2xl">{matchDetails.total_matches}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-success">
                      <IconThumbUp className="w-6 h-6" />
                    </div>
                    <div className="stat-title text-xs">Disukai</div>
                    <div className="stat-value text-success text-2xl">{matchDetails.right_swipes}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-error">
                      <IconX className="w-6 h-6" />
                    </div>
                    <div className="stat-title text-xs">Dilewati</div>
                    <div className="stat-value text-error text-2xl">
                      {matchDetails.swiped_count - matchDetails.right_swipes}
                    </div>
                  </div>
                </div>

                {/* Match List */}
                <div>
                  <h4 className="font-semibold mb-3">Daftar Kandidat</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {matchDetails.matches.map((match: any) => (
                      <div
                        key={match.id}
                        className="flex items-center gap-3 p-3 bg-accent/10 border border-gray-700 rounded-lg"
                      >
                        <div className="avatar placeholder">
                          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-full w-10">
                            <img
                              src={match.talent.image_url || match.talent.image || '/profile_image_default.png'}
                              alt={match.talent.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium truncate">{match.talent.name}</h5>
                            <div className="flex items-center gap-2">
                              <div className="badge badge-primary badge-sm">
                                {Math.round(match.similarity_score * 100)}%
                              </div>
                              {match.swipe && (
                                <div
                                  className={`p-1 rounded-full ${
                                    match.swipe.direction === 'right' ? 'text-success' : 'text-error'
                                  }`}
                                >
                                  {match.swipe.direction === 'right' ? (
                                    <IconHeart className="w-4 h-4" />
                                  ) : (
                                    <IconX className="w-4 h-4" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {match.talent.headline && (
                            <p className="text-sm opacity-75 truncate">{match.talent.headline}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="opacity-75">Gagal memuat detail pencarian.</p>
              </div>
            )}

            <div className="modal-action">
              <button className="btn btn-primary" onClick={closeModal}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
