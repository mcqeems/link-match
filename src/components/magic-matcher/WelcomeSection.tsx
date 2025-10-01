'use client';

import { IconSparkles, IconRocket, IconHeart, IconTarget } from '@tabler/icons-react';

export function WelcomeSection() {
  return (
    <div className="mb-12">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6">
          <IconSparkles className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Magic Matcher
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Transform your hiring process with AI-powered talent discovery. Describe your ideal candidate in natural
          language, and watch as our intelligent system finds the perfect matches with personalized explanations.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <IconRocket className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Search</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Our advanced AI understands context and finds candidates based on meaning, not just keywords
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <IconHeart className="w-8 h-8 text-pink-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Matching</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Swipe through candidates with Tinder-style interface and AI-generated match explanations
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <IconTarget className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Precision Results</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Get similarity scores and detailed explanations for every match to make informed decisions
            </p>
          </div>
        </div>
      </div>

      {/* Demo section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Ready to find your perfect match?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Start by describing your ideal candidate below. Be as specific or general as you'd like!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ Great Examples:</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>"Senior React developer with 5+ years experience"</li>
              <li>"Creative UI/UX designer who loves mobile apps"</li>
              <li>"Data scientist with Python and ML expertise"</li>
              <li>"Marketing expert specializing in social media"</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 Pro Tips:</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>• Mention specific technologies or skills</li>
              <li>• Include experience level (junior/senior)</li>
              <li>• Add personality traits or work style</li>
              <li>• Be as detailed as you want!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
