import React from 'react';
import { LocalExpert } from '../types';

interface LocalExpertCardProps {
  expert: LocalExpert;
  onViewProfile: (id: string) => void;
}

export const LocalExpertCard: React.FC<LocalExpertCardProps> = ({ expert, onViewProfile }) => {
  return (
    <div className="bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md p-4 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <img
        src={expert.avatar}
        alt={expert.name}
        className="w-20 h-20 rounded-full object-cover border-2 border-primary-teal dark:border-primary-teal-dark mb-3"
      />
      <h3 className="text-lg font-bold text-dark-text dark:text-dark-mode-text mb-1">{expert.name}</h3>
      <p className="text-secondary-mint dark:text-secondary-mint-dark text-sm font-medium mb-2">
        {expert.expertise.join(', ')}
      </p>
      <p className="text-text-base dark:text-dark-mode-text-base text-xs mb-4 line-clamp-3">{expert.bioSnippet}</p>
      <button
        onClick={() => onViewProfile(expert.id)}
        className="mt-auto bg-primary-teal dark:bg-primary-teal-dark text-white px-4 py-2 rounded-lg shadow hover:bg-secondary-mint dark:hover:bg-secondary-mint-dark transition-colors text-sm font-semibold"
      >
        View Profile
      </button>
    </div>
  );
};