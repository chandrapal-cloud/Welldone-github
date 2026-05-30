
import React, { useContext } from 'react';
import { SuggestedTravelBuddy, User, FriendRequest } from '../types';
import { AppContext } from '../App';

interface TravelBuddyCardProps {
  buddy: SuggestedTravelBuddy;
  currentUser: User | null;
  allUsers: User[]; 
  friendRequests: FriendRequest[];
  onSendFriendRequest: (receiverId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const TravelBuddyCard: React.FC<TravelBuddyCardProps> = ({
  buddy,
  currentUser,
  allUsers,
  friendRequests,
  onSendFriendRequest,
  onViewProfile,
}) => {
  const context = useContext(AppContext);
  const startDirectMessage = context?.startDirectMessage;

  const realUser = allUsers.find(u => u.id === buddy.id);

  const isFriends = currentUser && realUser?.friends?.includes(currentUser.id) || false;
  const hasSentRequest = currentUser && realUser
    ? friendRequests.some(
        (req) => (req.senderId === currentUser.id && req.receiverId === realUser.id && req.status === 'pending') ||
                 (req.senderId === realUser.id && req.receiverId === currentUser.id && req.status === 'pending')
      )
    : false;
  
  const handleSendRequest = () => {
    if (realUser) {
      onSendFriendRequest(realUser.id);
    }
  };

  const handleMessage = () => {
    if (realUser && startDirectMessage) {
        startDirectMessage(realUser.id);
    }
  };

  const getUserAvatar = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    return user ? user.avatar : `https://picsum.photos/100/100?random=${userId.charCodeAt(0)}`;
  };

  return (
    <div className="bg-white dark:bg-dark-mode-card-bg rounded-[2rem] shadow-md border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 group h-full">
      
      {/* Match Score */}
      <div className="w-full flex justify-end mb-2">
          <span className="text-[10px] font-black bg-brand-mint/20 text-brand-teal px-2 py-1 rounded-full uppercase tracking-tighter">
              {buddy.matchScore}% Match
          </span>
      </div>

      {/* Avatar */}
      <div className="relative mb-4">
          <img
              src={getUserAvatar(buddy.id)}
              alt={buddy.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-gray-800 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onViewProfile(buddy.id)}
          />
          {isFriends && (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  <i className="fas fa-check text-[10px]"></i>
              </div>
          )}
      </div>

      {/* Name & Designation (Strictly below name as requested) */}
      <div className="mb-4 w-full">
          <h3 
            className="text-xl font-black text-gray-900 dark:text-white cursor-pointer hover:text-brand-teal transition-colors truncate"
            onClick={() => onViewProfile(buddy.id)}
          >
              {buddy.name}
          </h3>
          <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mt-0.5 truncate">
              {realUser?.occupation || 'Traveler'}
          </p>
      </div>
      
      {/* Bio Snippet / Reason */}
      <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-4 rounded-2xl w-full mb-6 flex-grow flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm italic leading-relaxed line-clamp-3">
              "{buddy.reason}"
          </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 w-full mt-auto">
        <button
            onClick={handleMessage}
            className="flex items-center justify-center gap-2 bg-brand-blue text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-600 transition-colors"
            title="Send Direct Message"
        >
            <i className="far fa-comment-alt"></i> Message
        </button>

        {isFriends ? (
            <button disabled className="bg-green-100 text-green-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1 cursor-default opacity-80">
                <i className="fas fa-check"></i> Friends
            </button>
        ) : hasSentRequest ? (
            <button disabled className="bg-orange-100 text-orange-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1 cursor-default opacity-80">
                <i className="fas fa-clock"></i> Pending
            </button>
        ) : (
            <button
                onClick={handleSendRequest}
                className="bg-brand-teal text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
            >
                <i className="fas fa-user-plus"></i> Connect
            </button>
        )}
      </div>
    </div>
  );
};
