'use client';

import { useState, useRef } from 'react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const currentMatch = matches[currentIndex];
  const remainingMatches = matches.length - currentIndex;

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isSwaping || !currentMatch) return;

    setIsSwaping(true);
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

      // Show animation and move to next card
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwipeDirection(null);
        setIsSwaping(false);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
    } catch (error) {
      console.error('Failed to swipe:', error);
      setIsSwaping(false);
      setSwipeDirection(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSwaping) return;
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSwaping || dragStart.x === 0) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Limit vertical movement and emphasize horizontal
    setDragOffset({
      x: deltaX,
      y: deltaY * 0.1,
    });
  };

  const handleMouseUp = () => {
    if (isSwaping) return;

    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else {
      // Snap back
      setDragOffset({ x: 0, y: 0 });
    }
    setDragStart({ x: 0, y: 0 });
  };

  const getCardStyle = () => {
    const rotation = dragOffset.x * 0.1;
    const scale = isSwaping ? 0.95 : 1;

    let translateX = dragOffset.x;
    if (swipeDirection === 'left') translateX = -window.innerWidth;
    if (swipeDirection === 'right') translateX = window.innerWidth;

    return {
      transform: `translate(${translateX}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
      transition: isSwaping || (dragStart.x === 0 && dragOffset.x === 0) ? 'transform 0.3s ease-out' : 'none',
    };
  };

  if (currentIndex >= matches.length) {
    const rightSwipes = matches.filter((m) => m.swipe?.direction === 'right').length;
    const leftSwipes = matches.filter((m) => m.swipe?.direction === 'left').length;

    return (
      <div className="text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-lg mx-auto border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconHeart className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🎉 All Done!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You've reviewed all {matches.length} matches for your search.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <IconHeart className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-green-600">{rightSwipes}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Matches Liked</p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <IconX className="w-6 h-6 text-red-600 mr-2" />
                <span className="text-2xl font-bold text-red-600">{leftSwipes}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Profiles Passed</p>
            </div>
          </div>

          {rightSwipes > 0 && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                💬 Great choices! You can now message your {rightSwipes} liked candidate{rightSwipes !== 1 ? 's' : ''}
                to start conversations.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={onBackToSearch}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              🔍 Start New Search
            </button>

            {rightSwipes > 0 && (
              <button
                onClick={() => (window.location.href = '/messages')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                💬 Go to Messages
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentMatch) return null;

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToSearch}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <IconArrowLeft className="w-5 h-5" />
          <span>Back to Search</span>
        </button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} of {matches.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / matches.length) * 100}%` }}
        />
      </div>

      {/* Card Stack */}
      <div className="relative h-[600px]">
        {/* Next card (behind) */}
        {currentIndex + 1 < matches.length && (
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform scale-95 opacity-50"
            style={{ zIndex: 1 }}
          />
        )}

        {/* Current card */}
        <div
          ref={cardRef}
          className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing select-none"
          style={{ ...getCardStyle(), zIndex: 2 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Swipe Indicators */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
              dragOffset.x > 50 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: 3 }}
          >
            <div className="bg-green-500 text-white rounded-full p-4 transform rotate-12">
              <IconHeart className="w-8 h-8" />
            </div>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity ${
              dragOffset.x < -50 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: 3 }}
          >
            <div className="bg-red-500 text-white rounded-full p-4 transform -rotate-12">
              <IconX className="w-8 h-8" />
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 h-full flex flex-col">
            {/* Profile Image */}
            <div className="flex-shrink-0 mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                {currentMatch.talent.image_url || currentMatch.talent.image ? (
                  <img
                    src={currentMatch.talent.image_url || currentMatch.talent.image}
                    alt={currentMatch.talent.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">{currentMatch.talent.name.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{currentMatch.talent.name}</h2>
              {currentMatch.talent.headline && (
                <p className="text-gray-600 dark:text-gray-300 text-sm">{currentMatch.talent.headline}</p>
              )}
              {currentMatch.talent.category && (
                <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full mt-2">
                  {currentMatch.talent.category}
                </span>
              )}
            </div>

            {/* Similarity Score */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full px-3 py-1">
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {Math.round(currentMatch.similarity_score * 100)}% Match
                </span>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 flex-grow">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Why this is a good match:</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{currentMatch.ai_explanation}</p>
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
      <div className="flex justify-center space-x-8 mt-8">
        <button
          onClick={() => handleSwipe('left')}
          disabled={isSwaping}
          className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          <IconX className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleSwipe('right')}
          disabled={isSwaping}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          <IconHeart className="w-6 h-6" />
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Swipe or drag left to pass, right to match</p>
      </div>
    </div>
  );
}
