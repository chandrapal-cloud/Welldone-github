
import React, { useContext, useState } from 'react';
import { User } from '../types';
import { AppContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  user: User;
  currentUser: User | null;
  className?: string;
}

const PROFILE_THEMES: Record<string, { gradient: string; accent: string; button: string; ring: string; lightBg: string }> = {
  default: { 
    gradient: 'from-cyan-500 to-blue-600', 
    accent: 'text-cyan-600', 
    button: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700',
    ring: 'ring-cyan-500',
    lightBg: 'bg-cyan-50 dark:bg-cyan-900/20'
  },
  sunset: { 
    gradient: 'from-orange-400 to-pink-600', 
    accent: 'text-pink-600', 
    button: 'bg-gradient-to-r from-orange-400 to-pink-600 hover:from-orange-500 hover:to-pink-700',
    ring: 'ring-pink-500',
    lightBg: 'bg-pink-50 dark:bg-pink-900/20'
  },
  forest: { 
    gradient: 'from-emerald-500 to-teal-800', 
    accent: 'text-emerald-600', 
    button: 'bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800',
    ring: 'ring-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  berry: { 
    gradient: 'from-pink-500 to-purple-700', 
    accent: 'text-purple-600', 
    button: 'bg-gradient-to-r from-pink-500 to-purple-700 hover:from-pink-600 hover:to-purple-800',
    ring: 'ring-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-900/20'
  },
  midnight: { 
    gradient: 'from-indigo-600 to-violet-900', 
    accent: 'text-indigo-600', 
    button: 'bg-gradient-to-r from-indigo-600 to-violet-900 hover:from-indigo-700 hover:to-violet-950',
    ring: 'ring-indigo-500',
    lightBg: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, currentUser, className }) => {
  const context = useContext(AppContext);
  const sendFriendRequest = context?.sendFriendRequest;
  const acceptFriendRequest = context?.acceptFriendRequest;
  const declineFriendRequest = context?.declineFriendRequest;
  const startDirectMessage = context?.startDirectMessage;
  const unfriend = context?.unfriend;
  const updateUserProfile = context?.updateUserProfile;
  const friendRequests = context?.friendRequests || [];
  const allUsers = context?.allUsers || [];
  const navigate = useNavigate();

  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isAvatarZoomed, setIsAvatarZoomed] = useState(false);
  
  // State for click animation
  const [isClicking, setIsClicking] = useState(false);

  const isViewingSelf = currentUser?.id === user.id;

  // Theme Resolution
  const themeKey = (user.theme && PROFILE_THEMES[user.theme]) ? user.theme : 'default';
  const currentTheme = PROFILE_THEMES[themeKey];

  // Relationship Status Logic
  const isFriends = currentUser?.friends?.includes(user.id) || false;
  const outgoingRequest = currentUser 
    ? friendRequests.find(req => req.senderId === currentUser.id && req.receiverId === user.id && req.status === 'pending')
    : undefined;
  const incomingRequest = currentUser
    ? friendRequests.find(req => req.receiverId === currentUser.id && req.senderId === user.id && req.status === 'pending')
    : undefined;

  // Calculate Mutual Friends
  const mutualFriendIds = !isViewingSelf && currentUser
    ? currentUser.friends.filter(friendId => user.friends.includes(friendId))
    : [];
  
  // Resolve Mutual Friend Objects (for avatars)
  const mutualFriends = mutualFriendIds.map(id => allUsers.find(u => u.id === id)).filter(Boolean) as User[];

  // Handlers
  const handleCardClick = () => {
    setIsClicking(true);
    // Add a small delay to allow the animation to play before navigation
    setTimeout(() => {
        navigate(`/users/${user.id}`);
    }, 300);
  };

  const handleThemeSelect = (key: string) => {
    if (currentUser && updateUserProfile) {
        updateUserProfile({ ...currentUser, theme: key }, { silent: true, skipRedirect: true });
        setIsThemePickerOpen(false);
    }
  };

  const handleSendRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sendFriendRequest && currentUser) {
      sendFriendRequest(user.id);
    }
  };

  const handleCancelRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (declineFriendRequest && outgoingRequest) {
        declineFriendRequest(outgoingRequest.id);
    }
  };

  const handleConfirmRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (acceptFriendRequest && incomingRequest) {
        acceptFriendRequest(incomingRequest.id);
    }
  };

  const handleDeleteRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (declineFriendRequest && incomingRequest) {
        declineFriendRequest(incomingRequest.id);
    }
  };

  const handleUnfriend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unfriend && currentUser) {
      if (window.confirm(`Are you sure you want to remove ${user.name} as a friend?`)) {
        unfriend(user.id);
      }
    }
  };

  const handleEditProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/edit-profile');
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (startDirectMessage && currentUser && user.id) {
        startDirectMessage(user.id);
    }
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAvatarZoomed(true);
  };

  const closeAvatarZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAvatarZoomed(false);
  };

  return (
    <>
      {isAvatarZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in cursor-default" onClick={closeAvatarZoom}>
            <img 
                src={user.avatar} 
                alt={user.name} 
                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl animate-scale-up border-4 border-white" 
                onClick={(e) => e.stopPropagation()}
            />
            <button 
                onClick={closeAvatarZoom}
                className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors"
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
      )}

      <div 
        className={`group relative bg-white dark:bg-dark-mode-card-bg rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 h-full cursor-pointer 
        transform transition-all duration-300 ease-out
        ${isClicking ? 'scale-95 opacity-90 ring-4 ring-primary-teal/20' : 'hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1'}
        ${className || ''}`}
        onClick={handleCardClick}
      >
        
        {/* Decorative Banner with Theme Gradient */}
        <div className={`h-32 bg-gradient-to-br ${currentTheme.gradient} relative overflow-hidden`}>
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           {/* Abstract Shape Overlay */}
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
           
           {/* Theme Picker Trigger */}
           {isViewingSelf && (
              <div className="absolute top-4 right-4 z-10">
                  <button 
                      onClick={(e) => { e.stopPropagation(); setIsThemePickerOpen(!isThemePickerOpen); }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 flex items-center justify-center text-white transition-all shadow-sm ring-1 ring-white/30"
                      title="Customize Theme"
                  >
                     <i className="fas fa-palette"></i>
                  </button>
                  
                  {isThemePickerOpen && (
                      <div className="absolute top-10 right-0 bg-white dark:bg-dark-mode-card-bg p-3 rounded-xl shadow-xl border border-gray-100 dark:border-gray-600 w-48 animate-fade-in z-20" onClick={e => e.stopPropagation()}>
                          <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-1">Card Theme</p>
                          <div className="grid grid-cols-5 gap-2">
                              {Object.keys(PROFILE_THEMES).map(key => (
                                  <button
                                      key={key}
                                      onClick={() => handleThemeSelect(key)}
                                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${PROFILE_THEMES[key].gradient} shadow-sm hover:scale-110 transition-transform ring-2 ring-offset-1 ${themeKey === key ? 'ring-gray-400 dark:ring-gray-500' : 'ring-transparent'}`}
                                      title={key.charAt(0).toUpperCase() + key.slice(1)}
                                  />
                              ))}
                          </div>
                      </div>
                  )}
              </div>
           )}
        </div>

        {/* Card Body - Centered Layout */}
        <div className="px-6 pb-6 flex-grow flex flex-col items-center relative z-10 -mt-16">
          
          {/* Avatar */}
          <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
              <div className="p-1.5 bg-white dark:bg-dark-mode-card-bg rounded-full shadow-lg cursor-zoom-in" onClick={handleAvatarClick}>
                  <img
                      src={user.avatar}
                      alt={`${user.name}'s avatar`}
                      className={`w-28 h-28 rounded-full object-cover shadow-sm bg-gray-200`}
                  />
              </div>
              {/* Relationship Badge */}
              {isFriends && (
                 <div className="absolute bottom-2 right-0 bg-green-500 text-white w-7 h-7 flex items-center justify-center rounded-full border-2 border-white dark:border-dark-mode-card-bg shadow-md" title="Friend">
                    <i className="fas fa-check text-xs"></i>
                 </div>
              )}
          </div>

          {/* User Info */}
          <div className="text-center w-full mb-4">
              <h2 className={`text-2xl font-heading font-black text-gray-900 dark:text-white leading-tight mb-1 group-hover:${currentTheme.accent} transition-colors`}>
                  {user.name}
              </h2>
              {user.occupation && (
                  <p className={`text-xs font-bold uppercase tracking-widest ${currentTheme.accent} opacity-80`}>
                      {user.occupation}
                  </p>
              )}
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-clamp-2 mt-3 px-2 min-h-[2.5em] leading-relaxed">
                  {user.bio || 'No bio available.'}
              </p>
          </div>

          {/* Interests Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
              {user.interests.slice(0, 3).map((interest, index) => (
              <span
                  key={index}
                  className={`px-3 py-1 ${currentTheme.lightBg} ${currentTheme.accent} text-[10px] font-bold uppercase tracking-wide rounded-full`}
              >
                  {interest}
              </span>
              ))}
              {user.interests.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 dark:bg-dark-mode-input-bg text-gray-400 text-[10px] rounded-full">+{user.interests.length - 3}</span>
              )}
          </div>

          {/* Mutual Friends Display */}
          {!isViewingSelf && mutualFriends.length > 0 && (
              <div className="flex items-center gap-2 mb-6 bg-gray-50 dark:bg-dark-mode-input-bg/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700/50">
                  <div className="flex -space-x-2 overflow-hidden">
                      {mutualFriends.slice(0, 3).map(friend => (
                          <img 
                              key={friend.id} 
                              src={friend.avatar} 
                              alt={friend.name} 
                              className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-dark-mode-card-bg object-cover"
                          />
                      ))}
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                      {mutualFriends.length} Mutual
                  </span>
              </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-auto w-full pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
              {isViewingSelf ? (
                  <button
                      onClick={handleEditProfile}
                      className="col-span-2 w-full py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl transition-colors"
                  >
                      Edit Profile
                  </button>
              ) : (
                  <>
                      {/* Left Button: Relationship Action */}
                      {isFriends ? (
                          <button
                              onClick={handleUnfriend}
                              className="py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                              <i className="fas fa-user-minus"></i> Unfriend
                          </button>
                      ) : outgoingRequest ? (
                          <button
                              onClick={handleCancelRequest}
                              className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-bold rounded-xl transition-colors"
                          >
                              Cancel
                          </button>
                      ) : incomingRequest ? (
                          <button
                              onClick={handleConfirmRequest}
                              className={`py-3 ${currentTheme.button} text-white text-sm font-bold rounded-xl transition-all shadow-md`}
                          >
                              Confirm
                          </button>
                      ) : (
                          <button
                              onClick={handleSendRequest}
                              className={`py-3 ${currentTheme.button} text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2`}
                          >
                              <i className="fas fa-user-plus"></i> Connect
                          </button>
                      )}

                      {/* Right Button: Message - Available to all */}
                      <button
                          onClick={handleMessage}
                          className="py-3 bg-white dark:bg-dark-mode-input-bg border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-white hover:border-gray-300 dark:hover:border-gray-500 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                          <i className="far fa-comment-alt"></i> Message
                      </button>
                  </>
              )}
          </div>

        </div>
      </div>
    </>
  );
};
