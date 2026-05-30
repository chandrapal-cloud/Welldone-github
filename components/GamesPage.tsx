import React from 'react';

export const GamesPage: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md max-w-4xl mx-auto text-center">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <h2 className="text-3xl font-bold text-dark-text dark:text-dark-mode-text mb-4">Games Tab (Coming Soon!)</h2>
      <p className="text-lg text-text-base dark:text-dark-mode-text-base mb-6">
        Engage in fun and emotionally intelligent games to boost your well-being.
      </p>
      <div className="bg-light-background dark:bg-dark-mode-input-bg p-8 rounded-lg">
        <p className="text-gray-700 dark:text-dark-mode-text-base">
          Future features: Emotion-based games and activities, leaderboards and rewards, game history and progress tracking.
        </p>
      </div>
    </div>
  );
};