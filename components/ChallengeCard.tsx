
import React from 'react';
import { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  isJoined: boolean;
  onClick?: () => void; // Prop for card click interaction
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin, isJoined, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full ${onClick ? 'cursor-pointer transform hover:-translate-y-1 group' : ''}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={challenge.image}
          alt={challenge.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">View Details</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-dark-text dark:text-dark-mode-text leading-tight">{challenge.name}</h3>
            {isJoined && (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Joined</span>
            )}
        </div>
        
        <p className="text-text-base dark:text-dark-mode-text-base text-sm mb-4 line-clamp-2">{challenge.description}</p>
        
        <div className="mt-auto">
            <div className="flex justify-between items-center mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1 text-primary-teal dark:text-primary-teal-dark">
                <i className="fas fa-trophy"></i> {challenge.reward}
            </span>
            <span className="flex items-center gap-1">
                <i className="fas fa-users"></i> {challenge.participants.length}
            </span>
            </div>
            
            <button
            onClick={(e) => {
                e.stopPropagation(); // Prevent opening the modal when clicking the button
                if (!isJoined) onJoin(challenge.id);
            }}
            className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                isJoined 
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-default' 
                : 'bg-accent-sky dark:bg-accent-sky-dark text-white hover:bg-blue-600 dark:hover:bg-accent-sky shadow-md hover:shadow-lg'
            }`}
            disabled={isJoined}
            >
            {isJoined ? 'Active Challenge' : 'Join Now'}
            </button>
        </div>
      </div>
    </div>
  );
};
