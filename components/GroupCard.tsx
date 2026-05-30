import React from 'react';
import { Group } from '../types';

interface GroupCardProps {
  group: Group;
  onJoin: (groupId: string) => void;
  isJoined: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onJoin, isJoined }) => {
  return (
    <div className="bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <img
        src={group.image}
        alt={group.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-dark-text dark:text-dark-mode-text mb-2">{group.name}</h3>
        <p className="text-text-base dark:text-dark-mode-text-base text-sm mb-4">{group.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {group.interests.map((interest, index) => (
            <span
              key={index}
              className="bg-light-background dark:bg-dark-mode-input-bg text-accent-sky dark:text-accent-sky-dark text-xs px-2 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
        <button
          onClick={() => onJoin(group.id)}
          className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
            isJoined ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-secondary-mint dark:bg-secondary-mint-dark hover:bg-primary-teal dark:hover:bg-primary-teal-dark'
          }`}
          disabled={isJoined}
        >
          {isJoined ? 'Joined' : 'Join Group'}
        </button>
      </div>
    </div>
  );
};