
import React from 'react';
import { SuggestedDatingMatch, User } from '../types';

interface DatingMatchCardProps {
  match: SuggestedDatingMatch;
  currentUser: User | null;
  allUsers: User[];
  onViewProfile: (userId: string) => void;
  onSendRequest: (userId: string) => void;
}

export const DatingMatchCard: React.FC<DatingMatchCardProps> = ({
  match,
  allUsers,
  onViewProfile,
  onSendRequest
}) => {
  const realUser = allUsers.find(u => u.id === match.id);

  // Helper for color coding the match score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-brand-pink';
    if (score >= 75) return 'text-purple-500';
    return 'text-blue-500';
  };

  return (
    <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden group">
      
      {/* Visual Match Gradient Top */}
      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${match.compatibilityScore >= 90 ? 'from-pink-500 to-purple-500' : 'from-blue-400 to-teal-400'}`}></div>

      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-3">
          <img 
            src={realUser?.avatar || 'https://picsum.photos/100/100?random=date'} 
            alt={match.name} 
            className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-dark-mode-card-bg shadow-lg cursor-pointer"
            onClick={() => onViewProfile(match.id)}
          />
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-dark-mode-card-bg px-2 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 flex items-center">
            <i className={`fas fa-heart mr-1 ${getScoreColor(match.compatibilityScore)}`}></i>
            <span className={`font-bold text-sm ${getScoreColor(match.compatibilityScore)}`}>{match.compatibilityScore}%</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{match.name}</h3>
        <p className="text-brand-teal text-sm font-medium uppercase tracking-wide">{realUser?.occupation || 'Wellness Enthusiast'}</p>
      </div>

      <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-2xl mb-4 text-center">
        <p className="text-sm text-gray-700 dark:text-gray-200 italic leading-relaxed">
          "{match.reason}"
        </p>
      </div>

      <div className="mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">AI Icebreaker</p>
        <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-center">
           <p className="text-sm text-gray-600 dark:text-gray-400">"{match.icebreaker}"</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <button
          onClick={() => onSendRequest(match.id)}
          className="bg-brand-pink text-white py-2.5 rounded-xl font-bold shadow-md hover:bg-pink-500 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-heart"></i> Connect
        </button>
        <button
          onClick={() => onViewProfile(match.id)}
          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Profile
        </button>
      </div>
    </div>
  );
};
