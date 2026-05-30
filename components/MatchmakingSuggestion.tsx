
import React, { useContext } from 'react';
import { MatchmakingResult, User, Group } from '../types';
import { AppContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';

interface MatchmakingSuggestionProps {
  suggestions: MatchmakingResult;
  allUsers: User[];
  allGroups: Group[];
  onJoinGroup: (groupId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const MatchmakingSuggestion: React.FC<MatchmakingSuggestionProps> = ({
  suggestions,
  allUsers,
  allGroups,
  onJoinGroup,
  onViewProfile,
}) => {
  const context = useContext(AppContext);
  const currentUser = context?.currentUser;
  const sendFriendRequest = context?.sendFriendRequest;
  const friendRequests = context?.friendRequests || [];
  const navigate = useNavigate();

  // Helper to resolve AI suggestion name to real user
  const findUserByAIName = (aiName: string): User | undefined => {
    return allUsers.find(u => u.name.toLowerCase() === aiName.toLowerCase());
  };

  const findGroupByAIName = (aiName: string): Group | undefined => {
    return allGroups.find(g => g.name.toLowerCase() === aiName.toLowerCase());
  };

  // Helper to generate a dynamic reason based on actual shared data
  const getEnhancedReason = (targetUser: User, aiReason: string) => {
    if (!currentUser) return aiReason;

    // Identify shared interests
    const sharedInterests = targetUser.interests.filter(i => currentUser.interests.includes(i));
    
    // Identify shared or similar goals (simple string inclusion check)
    const sharedGoals = targetUser.goals.filter(g => 
        currentUser.goals.some(cg => 
            cg.title.toLowerCase().includes(g.title.toLowerCase()) || 
            g.title.toLowerCase().includes(cg.title.toLowerCase())
        )
    );

    const matchDetails = [];
    if (sharedInterests.length > 0) {
        matchDetails.push(`Bond over ${sharedInterests.slice(0, 3).join(', ')}`);
    }
    if (sharedGoals.length > 0) {
        matchDetails.push(`shares your goal: "${sharedGoals[0].title}"`);
    }

    // If we found specific matches, construct a specific reason.
    // We append the AI reason to add personality/context, but ensure the hard data is first.
    if (matchDetails.length > 0) {
        const detailsString = matchDetails.join(' and ');
        // capitalize first letter
        const formattedDetails = detailsString.charAt(0).toUpperCase() + detailsString.slice(1);
        return `${formattedDetails}. ${aiReason}`;
    }

    return aiReason;
  };

  // The first user is the "Daily Match"
  const dailyMatchUser = suggestions.users.length > 0 ? findUserByAIName(suggestions.users[0].name) : undefined;
  const dailyMatchReason = suggestions.users.length > 0 ? suggestions.users[0].reason : '';
  
  const otherSuggestedUsers = suggestions.users.slice(1);

  // Mock Match Score Calculator
  const calculateMatchScore = (user: User) => {
    if (!currentUser) return 0;
    const shared = user.interests.filter(i => currentUser.interests.includes(i));
    // Base 70 + 5 per interest
    return Math.min(98, 70 + (shared.length * 10));
  };

  const renderActionButtons = (targetUser: User, variant: 'icon' | 'full' = 'icon') => {
      const isFriends = currentUser?.friends?.includes(targetUser.id) || false;
      const hasSentRequest = currentUser
        ? friendRequests.some(
            (req) => req.senderId === currentUser.id && req.receiverId === targetUser.id && req.status === 'pending'
          )
        : false;
      const hasIncomingRequest = currentUser 
        ? friendRequests.some(
             (req) => req.receiverId === currentUser.id && req.senderId === targetUser.id && req.status === 'pending'
        ) : false;
      
      if (isFriends) {
          return (
             <span className={`inline-flex items-center rounded-full font-medium bg-green-100 text-green-800 border border-green-200 ${variant === 'full' ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'}`}>
                <i className="fas fa-check mr-1"></i> Friends
             </span>
          )
      }
      if (hasSentRequest) {
          return (
             <span className={`inline-flex items-center rounded-full font-medium bg-orange-100 text-orange-800 border border-orange-200 ${variant === 'full' ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'}`}>
                <i className="fas fa-clock mr-1"></i> Pending
             </span>
          )
      }
      if (hasIncomingRequest) {
        return (
           <button
             onClick={(e) => { e.stopPropagation(); navigate('/connections'); }}
             className={`inline-flex items-center rounded-full font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors ${variant === 'full' ? 'px-6 py-2.5 text-sm' : 'px-3 py-1 text-xs'}`}
           >
              <i className="fas fa-reply mr-1"></i> Respond
           </button>
        )
      }

      if (variant === 'full') {
        return (
            <button
                onClick={(e) => { e.stopPropagation(); sendFriendRequest?.(targetUser.id); }}
                className="px-6 py-2.5 rounded-xl bg-brand-teal text-white font-bold hover:bg-secondary-mint transition-colors shadow-md flex items-center gap-2"
            >
                <i className="fas fa-user-plus"></i> Send Request
            </button>
        );
      }

      return (
        <button
            onClick={(e) => { e.stopPropagation(); sendFriendRequest?.(targetUser.id); }}
            className="p-2 rounded-full bg-brand-teal text-white hover:bg-secondary-mint transition-colors shadow-sm"
            title="Send Friend Request"
        >
            <i className="fas fa-user-plus"></i>
        </button>
      )
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Daily Match Hero Card */}
      {dailyMatchUser && currentUser && (
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-dark-mode-card-bg shadow-xl border border-gray-100 dark:border-gray-700">
           {/* Decorative Background Elements */}
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-blue/20 blur-3xl opacity-60"></div>
           <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 rounded-full bg-gradient-to-tr from-brand-pink/20 to-purple-500/20 blur-3xl opacity-60"></div>
           
           <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
              {/* Left: Avatar & Score */}
              <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => onViewProfile(dailyMatchUser.id)}>
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-r from-brand-teal to-brand-blue shadow-lg">
                      <img 
                        src={dailyMatchUser.avatar} 
                        alt={dailyMatchUser.name} 
                        className="w-full h-full rounded-full object-cover border-4 border-white dark:border-dark-mode-card-bg"
                      />
                  </div>
                  <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                      <div className="bg-white dark:bg-dark-mode-input-bg px-3 py-1 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center gap-1">
                          <i className="fas fa-fire text-orange-500 animate-pulse"></i>
                          <span className="text-sm font-bold text-gray-800 dark:text-white">{calculateMatchScore(dailyMatchUser)}% Match</span>
                      </div>
                  </div>
              </div>

              {/* Right: Info & Actions */}
              <div className="flex-grow text-center md:text-left">
                  <div className="mb-2">
                     <span className="inline-block py-1 px-3 rounded-full bg-gradient-to-r from-brand-teal to-brand-blue text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                        Daily Top Pick
                     </span>
                  </div>
                  
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-brand-teal transition-colors" onClick={() => onViewProfile(dailyMatchUser.id)}>
                      {dailyMatchUser.name}
                  </h3>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                      {dailyMatchUser.interests.slice(0, 3).map((interest, i) => (
                          <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                              {interest}
                          </span>
                      ))}
                  </div>

                  <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-6 backdrop-blur-sm">
                      <p className="text-gray-700 dark:text-gray-300 italic text-sm md:text-base">
                          <i className="fas fa-quote-left text-brand-teal/40 mr-2 text-xl"></i>
                          {getEnhancedReason(dailyMatchUser, dailyMatchReason)}
                      </p>
                  </div>

                  <div className="flex gap-3 justify-center md:justify-start items-center">
                       <button
                          onClick={() => onViewProfile(dailyMatchUser.id)}
                          className="px-6 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                       >
                          View Profile
                       </button>
                       {renderActionButtons(dailyMatchUser, 'full')}
                  </div>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* People You Might Like */}
        <div className="flex flex-col gap-4">
             <h4 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                 <i className="fas fa-users text-indigo-500"></i> People You Might Like
             </h4>
             
             {otherSuggestedUsers.length > 0 ? (
                 otherSuggestedUsers.map(suggestedUser => {
                    const userProfile = findUserByAIName(suggestedUser.name);
                    if (!userProfile) return null;
                    return (
                        <div key={suggestedUser.id} className="group bg-white dark:bg-dark-mode-card-bg p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex items-start gap-4">
                            <div className="relative">
                                <img 
                                    src={userProfile.avatar} 
                                    alt={userProfile.name} 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-600 cursor-pointer"
                                    onClick={() => onViewProfile(userProfile.id)}
                                />
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-dark-mode-input-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-100 dark:border-gray-600 shadow-sm text-green-600">
                                    {calculateMatchScore(userProfile)}%
                                </div>
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="flex justify-between items-start">
                                    <h5 
                                        className="font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-brand-teal"
                                        onClick={() => onViewProfile(userProfile.id)}
                                    >
                                        {userProfile.name}
                                    </h5>
                                    {renderActionButtons(userProfile, 'icon')}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                    {getEnhancedReason(userProfile, suggestedUser.reason)}
                                </p>
                            </div>
                        </div>
                    )
                 })
             ) : (
                 <div className="text-center p-8 bg-white dark:bg-dark-mode-card-bg rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                     <p className="text-gray-400">No more suggestions for today.</p>
                 </div>
             )}
        </div>

        {/* Recommended Groups */}
        <div className="flex flex-col gap-4">
             <h4 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                 <i className="fas fa-layer-group text-brand-pink"></i> Recommended Groups
             </h4>
             
             {suggestions.groups.length > 0 ? (
                 suggestions.groups.map(suggestedGroup => {
                     const groupDetails = findGroupByAIName(suggestedGroup.name);
                     const isJoined = groupDetails && currentUser ? groupDetails.members.includes(currentUser.id) : false;

                     return (
                         <div key={suggestedGroup.id} className="group bg-white dark:bg-dark-mode-card-bg p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex items-start gap-4">
                             <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                 <img 
                                    src={groupDetails?.image || 'https://picsum.photos/100/100?random=g'} 
                                    alt={suggestedGroup.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                 />
                             </div>
                             <div className="flex-grow min-w-0">
                                 <div className="flex justify-between items-start">
                                     <h5 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                                         {suggestedGroup.name}
                                     </h5>
                                     {groupDetails && (
                                         <button
                                            onClick={() => onJoinGroup(groupDetails.id)}
                                            disabled={isJoined}
                                            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
                                                isJoined
                                                ? 'bg-gray-100 text-gray-400 cursor-default'
                                                : 'bg-brand-pink text-white hover:bg-pink-400 shadow-sm'
                                            }`}
                                         >
                                            {isJoined ? 'Joined' : 'Join'}
                                         </button>
                                     )}
                                 </div>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                     {suggestedGroup.reason}
                                 </p>
                             </div>
                         </div>
                     )
                 })
             ) : (
                <div className="text-center p-8 bg-white dark:bg-dark-mode-card-bg rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                     <p className="text-gray-400">No group suggestions.</p>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
