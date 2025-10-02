'use client';

import { useState, useRef, useEffect } from 'react';
import {
  IconArrowLeft,
  IconHeart,
  IconX,
  IconExternalLink,
  IconBrandLinkedin,
  IconBrandGithub,
} from '@tabler/icons-react';
import { TalentMatch, MatchRequest } from './MagicMatcherPage';

interface TalentCardsProps {
  matches: TalentMatch[];
  matchRequest: MatchRequest;
  onBackToSearch: () => void;
  onUpdateMatch: (matches: TalentMatch[]) => void;
}

export function TalentCards({ matches, matchRequest, onBackToSearch, onUpdateMatch }: TalentCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isSwaping, setIsSwaping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Track container size and mobile state
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      setIsMobile(window.innerWidth < 768);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const currentMatch = matches[currentIndex];
  const remainingMatches = matches.length - currentIndex;

  // Calculate swipe limits based on container size
  const getSwipeLimits = () => {
    const maxSwipe = Math.min(containerWidth * 0.8, isMobile ? 250 : 350);
    const threshold = Math.min(containerWidth * 0.3, isMobile ? 80 : 120);
    return { maxSwipe, threshold };
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isSwaping || isAnimating || !currentMatch) return;

    setIsSwaping(true);
    setIsAnimating(true);
    setSwipeDirection(direction);

    try {
      const response = await fetch('/api/magic-match/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          talent_match_id: currentMatch.id,
          swipe_direction: direction,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record swipe');
      }

      const data = await response.json();

      // Update the match with swipe data
      const updatedMatches = [...matches];
      updatedMatches[currentIndex] = {
        ...currentMatch,
        swipe: {
          direction,
          created_at: data.swipe.created_at,
        },
      };
      onUpdateMatch(updatedMatches);

      // Wait for animation to complete before moving to next card
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
        setIsSwaping(false);
        setIsAnimating(false);
        setDragOffset({ x: 0, y: 0 });
      }, 400); // Match animation duration
    } catch (error) {
      console.error('Failed to swipe:', error);
      setIsSwaping(false);
      setIsAnimating(false);
      setSwipeDirection(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSwaping || isAnimating) return;
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSwaping || isAnimating || dragStart.x === 0) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const { maxSwipe } = getSwipeLimits();

    // Limit horizontal movement to prevent overlapping
    const limitedDeltaX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));

    // Limit vertical movement and emphasize horizontal
    setDragOffset({
      x: limitedDeltaX,
      y: deltaY * 0.1, // Reduced vertical movement
    });
  };

  const handleMouseUp = () => {
    if (isSwaping || isAnimating) return;

    const { threshold } = getSwipeLimits();
    if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else {
      // Smooth snap back animation
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart({ x: 0, y: 0 });
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSwaping || isAnimating) return;
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSwaping || isAnimating || dragStart.x === 0) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    const { maxSwipe } = getSwipeLimits();

    // Limit horizontal movement to prevent overlapping
    const limitedDeltaX = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));

    setDragOffset({
      x: limitedDeltaX,
      y: deltaY * 0.1,
    });
  };

  const handleTouchEnd = () => {
    if (isSwaping || isAnimating) return;

    const { threshold } = getSwipeLimits();
    if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart({ x: 0, y: 0 });
  };

  const getCardStyle = () => {
    const rotation = Math.max(-15, Math.min(15, dragOffset.x * 0.08)); // Limit rotation
    const scale = isSwaping ? 0.95 : 1;
    const { maxSwipe } = getSwipeLimits();

    let translateX = dragOffset.x;
    let opacity = 1;

    // During swipe animation, move card completely off screen
    if (swipeDirection === 'left') {
      translateX = -(containerWidth || window.innerWidth);
      opacity = 0;
    }
    if (swipeDirection === 'right') {
      translateX = containerWidth || window.innerWidth;
      opacity = 0;
    }

    // Add fade effect based on drag distance
    if (!isSwaping && Math.abs(dragOffset.x) > 0) {
      const fadeAmount = Math.abs(dragOffset.x) / maxSwipe;
      opacity = Math.max(0.7, 1 - fadeAmount * 0.3);
    }

    return {
      transform: `translate(${translateX}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
      opacity,
      transition:
        isSwaping || isAnimating || (dragStart.x === 0 && dragOffset.x === 0)
          ? 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          : 'none',
    };
  };

  if (currentIndex >= matches.length) {
    const rightSwipes = matches.filter((m) => m.swipe?.direction === 'right').length;
    const leftSwipes = matches.filter((m) => m.swipe?.direction === 'left').length;

    return (
      <div className="flex justify-center py-12">
        <div className="card bg-accent/10 border border-gray-700 w-full max-w-lg">
          <div className="card-body text-center">
            <div className="mb-6">
              <div className="avatar">
                <div className="w-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <IconHeart className="w-10 h-10 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-2 mt-4">🎉 Selesai!</h2>
              <p className="opacity-75 mb-6">
                Anda telah meninjau semua {matches.length} kandidat untuk pencarian Anda.
              </p>
            </div>

            {/* Statistics */}
            <div className="stats stats-horizontal shadow mb-8">
              <div className="stat">
                <div className="stat-figure text-success">
                  <IconHeart className="w-8 h-8" />
                </div>
                <div className="stat-value text-success">{rightSwipes}</div>
                <div className="stat-title">Disukai</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-error">
                  <IconX className="w-8 h-8" />
                </div>
                <div className="stat-value text-error">{leftSwipes}</div>
                <div className="stat-title">Dilewati</div>
              </div>
            </div>

            {rightSwipes > 0 && (
              <div className="alert alert-info mb-6">
                <span className="text-sm">
                  💬 Pilihan yang bagus! Anda sekarang dapat mengirim pesan kepada {rightSwipes} kandidat yang disukai
                  untuk memulai percakapan.
                </span>
              </div>
            )}

            <div className="card-actions flex-col w-full gap-3">
              <button onClick={onBackToSearch} className="btn btn-primary btn-wide">
                🔍 Mulai Pencarian Baru
              </button>

              {rightSwipes > 0 && (
                <button onClick={() => (window.location.href = '/messages')} className="btn btn-success btn-wide">
                  💬 Buka Pesan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentMatch) return null;

  return (
    <div className="max-w-md mx-auto px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={onBackToSearch}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <IconArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Search</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} of {matches.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 sm:mb-6">
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / matches.length) * 100}%` }}
        />
      </div>

      {/* Card Stack Container */}
      <div ref={containerRef} className="relative h-[500px] sm:h-[600px] overflow-hidden rounded-2xl">
        {/* Next card (behind) */}
        {currentIndex + 1 < matches.length && (
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform scale-95 opacity-50 border border-gray-200 dark:border-gray-700"
            style={{ zIndex: 1 }}
          />
        )}

        {/* Current card */}
        <div
          ref={cardRef}
          className="absolute inset-0 card bg-accent/10 border border-gray-700 shadow-xl cursor-grab active:cursor-grabbing select-none touch-none"
          style={{ ...getCardStyle(), zIndex: 2 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe Indicators */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
              dragOffset.x > (isMobile ? 30 : 50) ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
            }`}
            style={{ zIndex: 3 }}
          >
            <div className="bg-green-500 shadow-lg text-white rounded-full p-3 sm:p-4 transform rotate-12">
              <IconHeart className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
              dragOffset.x < -(isMobile ? 30 : 50) ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
            }`}
            style={{ zIndex: 3 }}
          >
            <div className="bg-red-500 shadow-lg text-white rounded-full p-3 sm:p-4 transform -rotate-12">
              <IconX className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 sm:p-6 h-full flex flex-col">
            {/* Profile Image */}
            <div className="flex-shrink-0 mb-3 sm:mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                {currentMatch.talent.image_url || currentMatch.talent.image ? (
                  <img
                    src={currentMatch.talent.image_url || currentMatch.talent.image}
                    alt={currentMatch.talent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg sm:text-xl">{currentMatch.talent.name.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {currentMatch.talent.name}
              </h2>
              {currentMatch.talent.headline && (
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2">
                  {currentMatch.talent.headline}
                </p>
              )}
              {currentMatch.talent.category && (
                <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full mt-2">
                  {currentMatch.talent.category}
                </span>
              )}
            </div>

            {/* Similarity Score */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full px-3 py-1">
                <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300">
                  {Math.round(currentMatch.similarity_score * 100)}% Cocok
                </span>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3 sm:mb-4 flex-grow overflow-y-auto">
              <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm mb-2">
                Mengapa kandidat ini cocok:
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                {currentMatch.ai_explanation}
              </p>
            </div>

            {/* Skills */}
            {currentMatch.talent.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Skills:</h3>
                <div className="flex flex-wrap gap-1">
                  {currentMatch.talent.skills.slice(0, 6).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {currentMatch.talent.skills.length > 6 && (
                    <span className="text-gray-500 text-xs">+{currentMatch.talent.skills.length - 6} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex justify-center space-x-4 mb-4">
              {currentMatch.talent.linkedin && (
                <a
                  href={currentMatch.talent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <IconBrandLinkedin className="w-5 h-5" />
                </a>
              )}
              {currentMatch.talent.github && (
                <a
                  href={currentMatch.talent.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <IconBrandGithub className="w-5 h-5" />
                </a>
              )}
              {currentMatch.talent.website && (
                <a
                  href={currentMatch.talent.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <IconExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 mt-8">
        <button
          onClick={() => handleSwipe('left')}
          disabled={isSwaping}
          className="btn btn-circle btn-lg btn-error shadow-lg hover:scale-105 disabled:scale-100"
        >
          <IconX className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleSwipe('right')}
          disabled={isSwaping}
          className="btn btn-circle btn-lg btn-success shadow-lg hover:scale-105 disabled:scale-100"
        >
          <IconHeart className="w-6 h-6" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Geser kiri untuk lewati, kanan untuk menyukai</p>
      </div>
    </div>
  );
}
