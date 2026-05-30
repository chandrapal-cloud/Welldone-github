
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

export const ConnectionsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  const [searchQuery, setSearchQuery] = useState('');

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const {
    currentUser,
    allUsers,
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    startDirectMessage
  } = context;

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Please log in to view your connections.</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary-teal text-white px-6 py-2 rounded-lg hover:bg-secondary-mint transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  // --- Logic for Connections ---
  const friendsList = allUsers.filter(u => currentUser.friends.includes(u.id));
  const filteredFriends = friendsList.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f.occupation && f.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- Logic for Requests ---
  const incomingRequests = friendRequests.filter(
    (req) => req.receiverId === currentUser.id && req.status === 'pending'
  );
  const outgoingRequests = friendRequests.filter(
    (req) => req.senderId === currentUser.id && req.status === 'pending'
  );

  const handleMessage = (userId: string) => {
    if (startDirectMessage) {
      startDirectMessage(userId);
    }
  };

  const getUserDetails = (userId: string) => allUsers.find((u) => u.id === userId);

  // Helper to identify mutual interests
  const getMutualInterests = (friendInterests: string[]) => {
    return friendInterests.filter(i => currentUser.interests.includes(i));
  };

  const handleSyncContacts = () => {
      // Navigate to settings integrations tab to connect/sync
      navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg font-sans pb-20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              My Connections
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Manage your wellness circle and buddy network.
            </p>
          </div>
          
          {/* Stats Pills */}
          <div className="flex gap-4">
            <div className="bg-white dark:bg-dark-mode-card-bg px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[100px]">
               <span className="text-2xl font-bold text-brand-blue">{friendsList.length}</span>
               <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Buddies</span>
            </div>
             <div className="bg-white dark:bg-dark-mode-card-bg px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[100px]">
               <span className="text-2xl font-bold text-brand-pink">{incomingRequests.length}</span>
               <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Pending</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-white dark:bg-dark-mode-card-bg p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-auto md:inline-flex">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'connections'
                ? 'bg-brand-teal text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All Connections
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-brand-blue text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Requests
            {incomingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{incomingRequests.length}</span>
            )}
          </button>
        </div>

        {/* --- CONNECTIONS TAB CONTENT --- */}
        {activeTab === 'connections' && (
          <div className="animate-fade-in">
            {/* Search Bar & Sync */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow max-w-lg">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, interest, or occupation..."
                        className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-mode-input-bg text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-teal/10 focus:border-brand-teal transition-all shadow-sm"
                    />
                </div>
                
                {/* Social Sync Button */}
                <button 
                    onClick={handleSyncContacts}
                    className="px-6 py-4 bg-white dark:bg-dark-mode-card-bg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                    <i className="fas fa-sync-alt text-brand-blue"></i>
                    <span className="hidden md:inline">Sync Contacts</span>
                    <span className="md:hidden">Sync</span>
                </button>
            </div>

            {friendsList.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-dark-mode-card-bg rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="bg-brand-mint/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-teal text-3xl">
                   <i className="fas fa-user-friends"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No connections yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start connecting with like-minded wellness enthusiasts to grow your circle!
                </p>
                <div className="flex gap-4 justify-center">
                    <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-brand-teal text-white rounded-xl font-bold shadow-lg hover:bg-brand-teal/90 transition-all"
                    >
                    Find Buddies
                    </button>
                    <button 
                    onClick={handleSyncContacts}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-all"
                    >
                    Import Friends
                    </button>
                </div>
              </div>
            ) : filteredFriends.length === 0 ? (
               <div className="text-center py-10">
                 <p className="text-gray-500 dark:text-gray-400 text-lg">No connections found matching "{searchQuery}".</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFriends.map((friend) => {
                  const mutualInterests = getMutualInterests(friend.interests);
                  const otherInterests = friend.interests.filter(i => !mutualInterests.includes(i));
                  // Prioritize mutual interests in the display
                  const displayInterests = [...mutualInterests, ...otherInterests].slice(0, 4);

                  return (
                    <div key={friend.id} className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col">
                      
                      {/* Decorative Top Gradient */}
                      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand-mint/30 to-brand-blue/10"></div>

                      <div className="relative flex flex-col items-center flex-grow">
                        <div className="relative mb-4">
                          <img 
                            src={friend.avatar} 
                            alt={friend.name} 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-dark-mode-card-bg shadow-lg cursor-pointer"
                            onClick={() => navigate(`/users/${friend.id}`)}
                          />
                          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white dark:border-dark-mode-card-bg rounded-full" title="Online"></div>
                        </div>
                        
                        <h3 
                          className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-blue transition-colors cursor-pointer"
                          onClick={() => navigate(`/users/${friend.id}`)}
                        >
                          {friend.name}
                        </h3>
                        <p className="text-sm font-medium text-brand-teal mb-4 uppercase tracking-wide">
                          {friend.occupation || "Wellness Member"}
                        </p>

                        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 px-2 min-h-[40px]">
                          {friend.bio || "No bio provided."}
                        </p>

                        {/* Interests Tags with Mutual Highlight */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                          {displayInterests.map((interest, idx) => {
                            const isMutual = mutualInterests.includes(interest);
                            return (
                              <span 
                                key={idx} 
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                                  isMutual 
                                    ? 'bg-brand-mint/50 text-brand-teal border border-brand-mint dark:bg-teal-900/30 dark:text-brand-teal dark:border-teal-800' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                                }`}
                              >
                                {interest}
                                {isMutual && <i className="fas fa-check ml-1.5 text-[10px]"></i>}
                              </span>
                            );
                          })}
                          {friend.interests.length > 4 && (
                            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-400">
                              +{friend.interests.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                        <button
                          onClick={() => handleMessage(friend.id)}
                          className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-brand-blue text-white font-bold text-sm shadow-md hover:bg-brand-blue/90 transition-colors"
                        >
                          <i className="fas fa-comment-alt mr-2"></i> Message
                        </button>
                        <button
                          onClick={() => navigate(`/users/${friend.id}`)}
                          className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- REQUESTS TAB CONTENT --- */}
        {activeTab === 'requests' && (
          <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
            
            {/* Incoming Requests */}
            <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-pink/10 flex items-center justify-center text-brand-pink mr-4">
                   <i className="fas fa-arrow-down"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Incoming Requests</h3>
                <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                  {incomingRequests.length}
                </span>
              </div>

              {incomingRequests.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-500 italic text-center py-4">No pending incoming requests.</p>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((req) => {
                    const sender = getUserDetails(req.senderId);
                    if (!sender) return null;
                    return (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-dark-mode-input-bg border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <img 
                            src={sender.avatar} 
                            alt={sender.name} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm cursor-pointer"
                            onClick={() => navigate(`/users/${sender.id}`)}
                          />
                          <div>
                            <h4 
                              className="font-bold text-gray-900 dark:text-white cursor-pointer hover:text-brand-blue"
                              onClick={() => navigate(`/users/${sender.id}`)}
                            >
                              {sender.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Wants to connect</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                           <button
                            onClick={() => acceptFriendRequest(req.id)}
                            className="flex-1 sm:flex-none px-5 py-2 bg-brand-teal text-white rounded-lg text-sm font-bold shadow-sm hover:bg-brand-teal/90 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => declineFriendRequest(req.id)}
                            className="flex-1 sm:flex-none px-5 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Outgoing Requests */}
             <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mr-4">
                   <i className="fas fa-arrow-up"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Outgoing Requests</h3>
                 <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                  {outgoingRequests.length}
                </span>
              </div>

              {outgoingRequests.length === 0 ? (
                <p className="text-gray-400 dark:text-gray-500 italic text-center py-4">No pending outgoing requests.</p>
              ) : (
                <div className="space-y-4">
                  {outgoingRequests.map((req) => {
                    const receiver = getUserDetails(req.receiverId);
                    if (!receiver) return null;
                    return (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-dark-mode-input-bg border border-gray-100 dark:border-gray-700 opacity-80">
                         <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <img 
                            src={receiver.avatar} 
                            alt={receiver.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 grayscale"
                          />
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{receiver.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Request Sent</p>
                          </div>
                        </div>
                        <button
                          onClick={() => declineFriendRequest(req.id)}
                          className="px-4 py-2 bg-transparent text-gray-400 hover:text-red-500 text-xs font-bold transition-colors border border-gray-200 dark:border-gray-600 rounded-lg hover:border-red-500"
                        >
                          Cancel Request
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
