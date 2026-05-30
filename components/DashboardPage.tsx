
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { OnboardingModal } from './OnboardingModal';
import { useNavigate } from 'react-router-dom';
import { User, Booking, SuggestedTravelBuddy, TravelDiaryEntry } from '../types';
import { StoryBoard } from './StoryBoard';
import { mockBookings } from '../constants';

export const DashboardPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isPlanTripModalOpen, setIsPlanTripModalOpen] = useState(false);
  const [newTripLocation, setNewTripLocation] = useState('');
  const [newTripDate, setNewTripDate] = useState('');
  const [newTripStory, setNewTripStory] = useState('');

  if (!context) return null;

  const { 
    currentUser, allUsers, allGroups, allEvents,
    virtualPartner, virtualPartnerChatHistory,
    travelBuddySuggestions, searchTravelBuddies,
    createPost, likePost, commentOnPost, sharePost, updateUserProfile
  } = context;

  // Simulate loading dynamic suggestions if empty
  useEffect(() => {
      if (currentUser && travelBuddySuggestions.length === 0) {
          searchTravelBuddies('Recommended', { interests: currentUser.interests, travelStyle: null, budget: null });
      }
  }, [currentUser, travelBuddySuggestions.length]);

  useEffect(() => {
    if (currentUser && !currentUser.hasCompletedOnboarding) {
        setShowOnboarding(true);
    }
  }, [currentUser]);

  const handleOnboardingComplete = (updatedFields: Partial<User>) => {
      if (currentUser) {
          updateUserProfile({ ...currentUser, ...updatedFields, hasCompletedOnboarding: true });
          setShowOnboarding(false);
      }
  };

  const handleCreateTrip = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser || !newTripLocation) return;
      
      const newEntry: TravelDiaryEntry = {
          id: `trip-${Date.now()}`,
          location: newTripLocation,
          date: newTripDate || 'Upcoming',
          story: newTripStory || 'Planning this trip!',
          image: `https://picsum.photos/seed/${newTripLocation.replace(/\s/g, '')}/600/400`,
          invitedUserIds: []
      };

      const updatedUser = { ...currentUser, travelDiary: [newEntry, ...(currentUser.travelDiary || [])] };
      updateUserProfile(updatedUser);
      setIsPlanTripModalOpen(false);
      setNewTripLocation(''); setNewTripDate(''); setNewTripStory('');
      alert('Trip created successfully! Added to your Travel Diary.');
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Please log in to view your dashboard.</h2>
        <button onClick={() => navigate('/login')} className="bg-brand-teal text-white px-6 py-2 rounded-lg font-bold">Login</button>
      </div>
    );
  }

  // --- Derived Data ---
  const feedPosts = allUsers
    .filter(u => currentUser.friends.includes(u.id) || u.id === currentUser.id)
    .flatMap(u => u.posts || [])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const friendList = allUsers.filter(u => currentUser.friends.includes(u.id));
  const myTravelBuddyMatch = travelBuddySuggestions[0];
  const myBookings = mockBookings; // In real app, filter by userId
  const lastVPMsg = virtualPartnerChatHistory.length > 0 ? virtualPartnerChatHistory[virtualPartnerChatHistory.length-1].text : "Start a conversation to get advice.";

  // Daily Match Logic (Mock)
  const dailyMatchUser = allUsers.find(u => u.id !== currentUser.id && u.interests.some(i => currentUser.interests.includes(i))); 
  const matchSignals = dailyMatchUser ? ['Shared Interest: Yoga', 'Active Morning Person', 'Near San Francisco'] : [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in relative pb-20">
      
      {showOnboarding && currentUser && (
          <OnboardingModal user={currentUser} onComplete={handleOnboardingComplete} />
      )}

      {/* Plan Trip Modal */}
      {isPlanTripModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
                  <div className="p-6 bg-brand-teal text-white flex justify-between items-center">
                      <h3 className="text-xl font-bold"><i className="fas fa-plane-departure mr-2"></i> Plan a New Trip</h3>
                      <button onClick={() => setIsPlanTripModalOpen(false)} className="hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"><i className="fas fa-times"></i></button>
                  </div>
                  <form onSubmit={handleCreateTrip} className="p-6 space-y-4">
                      <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Destination</label><input required type="text" value={newTripLocation} onChange={e => setNewTripLocation(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-dark-mode-input-bg dark:border-gray-600" placeholder="e.g. Paris" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">When?</label><input type="text" value={newTripDate} onChange={e => setNewTripDate(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-dark-mode-input-bg dark:border-gray-600" placeholder="e.g. Summer 2025" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Notes</label><textarea value={newTripStory} onChange={e => setNewTripStory(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-dark-mode-input-bg dark:border-gray-600" rows={3} placeholder="Ideas, bucket list items..."></textarea></div>
                      <button type="submit" className="w-full bg-brand-teal text-white font-bold py-3 rounded-xl hover:bg-teal-600 transition-colors">Create Plan</button>
                  </form>
              </div>
          </div>
      )}

      {/* --- HEADER: Welcome & Quick Stats --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-dark-mode-card-bg dark:to-black text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 flex items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-full border-4 border-brand-teal shadow-lg object-cover" />
                  <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-sm">
                      <i className="fas fa-pencil-alt text-gray-500 text-xs"></i>
                  </div>
              </div>
              <div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Hello, {currentUser.name.split(' ')[0]}!</h1>
                  <p className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{currentUser.occupation || 'Member'}</span>
                      <span className="text-sm opacity-80">Let's make today count.</span>
                  </p>
              </div>
          </div>

          <div className="flex gap-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-center">
                  <span className="text-2xl font-bold text-brand-teal">{currentUser.virtualBalance}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Coins</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-center cursor-pointer hover:bg-white/20 transition-colors" onClick={() => navigate('/connections')}>
                  <span className="text-2xl font-bold text-brand-pink">{friendList.length}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Friends</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-center cursor-pointer hover:bg-white/20 transition-colors" onClick={() => navigate('/settings')}>
                  <i className="fas fa-cog text-2xl mb-1"></i>
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Settings</span>
              </div>
          </div>
      </div>

      {/* --- STORY HIGHLIGHTS ROW --- */}
      {friendList.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              <div className="flex flex-col items-center space-y-2 cursor-pointer min-w-[70px]">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-white dark:bg-gray-800 text-brand-teal text-xl hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all shadow-sm">
                      <i className="fas fa-plus"></i>
                  </div>
                  <span className="text-xs font-bold text-gray-500">Add Story</span>
              </div>
              {friendList.map(friend => (
                  <div key={friend.id} className="flex flex-col items-center space-y-2 cursor-pointer min-w-[70px] group" onClick={() => navigate(`/users/${friend.id}`)}>
                      <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 group-hover:scale-105 transition-transform">
                          <img src={friend.avatar} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-dark-mode-bg" alt={friend.name} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate w-16 text-center">{friend.name.split(' ')[0]}</span>
                  </div>
              ))}
          </div>
      )}

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: PRIMARY ACTIONS & AI (1 Col) */}
          <div className="space-y-6">
              
              {/* Virtual Partner Widget */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => navigate('/virtual-partner/chat')}>
                  <div className="absolute top-0 right-0 p-4 opacity-50"><i className="fas fa-robot text-6xl"></i></div>
                  <h3 className="font-bold text-lg mb-1 relative z-10">Virtual Partner</h3>
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4 relative z-10">{virtualPartner ? virtualPartner.name : 'Create Now'}</p>
                  
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 relative z-10 mb-4 h-20 overflow-hidden">
                      <p className="text-sm italic opacity-90 line-clamp-3">"{lastVPMsg}"</p>
                  </div>
                  <button className="w-full py-2 bg-white text-indigo-700 font-bold rounded-lg text-sm hover:bg-gray-100 transition-colors">
                      {virtualPartner ? 'Continue Chat' : 'Initialize'}
                  </button>
              </div>

              {/* Daily Match Widget */}
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i className="fas fa-fire text-orange-500"></i> Daily Match</h3>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">98%</span>
                  </div>
                  {dailyMatchUser ? (
                      <div className="text-center">
                          <img src={dailyMatchUser.avatar} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover shadow-md cursor-pointer" onClick={() => navigate(`/users/${dailyMatchUser.id}`)} alt="Match" />
                          <h4 className="font-bold text-lg dark:text-white cursor-pointer hover:text-brand-teal" onClick={() => navigate(`/users/${dailyMatchUser.id}`)}>{dailyMatchUser.name}</h4>
                          <p className="text-xs text-gray-500 mb-4">{dailyMatchUser.occupation}</p>
                          
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                              {matchSignals.map((signal, i) => (
                                  <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600">{signal}</span>
                              ))}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                              <button className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 py-2 rounded-lg hover:text-red-500 transition-colors"><i className="fas fa-times"></i></button>
                              <button className="bg-brand-pink text-white py-2 rounded-lg shadow-md hover:bg-pink-600 transition-colors col-span-2 font-bold text-sm">Connect</button>
                          </div>
                      </div>
                  ) : (
                      <p className="text-center text-gray-500 text-sm py-4">Refining your matches...</p>
                  )}
              </div>

              {/* Quick Create Actions */}
              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setIsPlanTripModalOpen(true)} className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 p-4 rounded-2xl font-bold text-sm hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-left flex flex-col gap-2 col-span-2">
                      <i className="fas fa-plane-departure text-xl"></i> Plan a Trip
                  </button>
                  <button className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 p-4 rounded-2xl font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-left flex flex-col gap-2">
                      <i className="fas fa-calendar-plus text-xl"></i> Create Event
                  </button>
                  <button className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 p-4 rounded-2xl font-bold text-sm hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-left flex flex-col gap-2">
                      <i className="fas fa-users text-xl"></i> Start Group
                  </button>
              </div>
          </div>

          {/* MIDDLE COLUMN: FEED (2 Cols) */}
          <div className="xl:col-span-2 space-y-6">
              {/* Create Post Widget Included in StoryBoard */}
              <StoryBoard 
                  currentUser={currentUser}
                  posts={feedPosts}
                  users={allUsers}
                  onPostCreate={createPost}
                  onLike={likePost}
                  onComment={commentOnPost}
                  onShare={sharePost}
                  showCreateBox={true}
              />
          </div>

          {/* RIGHT COLUMN: UTILITY & TRAVEL (1 Col) */}
          <div className="space-y-6">
              
              {/* Travel Soulmate Spotlight */}
              {myTravelBuddyMatch && (
                  <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-teal to-brand-blue"></div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <i className="fas fa-plane text-brand-blue"></i> Travel Soulmate
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                          <img src={`https://picsum.photos/seed/${myTravelBuddyMatch.id}/100`} className="w-14 h-14 rounded-full object-cover border-2 border-brand-teal" alt="" />
                          <div>
                              <h4 className="font-bold text-gray-900 dark:text-white cursor-pointer hover:underline" onClick={() => navigate('/travels')}>{myTravelBuddyMatch.name}</h4>
                              <p className="text-xs text-brand-teal font-bold">{myTravelBuddyMatch.matchScore}% Compatibility</p>
                          </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4 bg-gray-50 dark:bg-dark-mode-input-bg p-3 rounded-lg">"{myTravelBuddyMatch.reason}"</p>
                      <button onClick={() => navigate('/travels')} className="w-full py-2 border-2 border-brand-teal text-brand-teal font-bold rounded-xl text-sm hover:bg-brand-teal hover:text-white transition-colors">
                          Plan Trip Together
                      </button>
                  </div>
              )}

              {/* Active Bookings */}
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i className="fas fa-ticket-alt text-purple-500"></i> Bookings</h3>
                      <button className="text-xs font-bold text-gray-400 hover:text-gray-600">See All</button>
                  </div>
                  <div className="space-y-3">
                      {myBookings.map(booking => (
                          <div key={booking.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-dark-mode-input-bg rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => navigate('/wellness')}>
                              <img src={booking.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                              <div className="flex-grow min-w-0">
                                  <h4 className="font-bold text-sm text-gray-800 dark:text-white truncate">{booking.serviceName}</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{booking.date} • {booking.time}</p>
                              </div>
                              <div className={`self-center w-2 h-2 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Business / Ad Shortcuts */}
              <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-1">Grow Your Reach</h3>
                      <p className="text-gray-400 text-xs mb-4">Manage your wellness listings and ads.</p>
                      <button onClick={() => navigate('/wellness')} className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                          <i className="fas fa-store"></i> Manage Business
                      </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-teal rounded-full blur-3xl opacity-30"></div>
              </div>

              {/* Groups & Events Mini-List */}
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><i className="fas fa-layer-group text-blue-500"></i> My Groups</h3>
                  <div className="space-y-3">
                      {allGroups.slice(0,2).map(g => (
                          <div key={g.id} className="flex items-center gap-3">
                              <img src={g.image} className="w-8 h-8 rounded-lg object-cover" alt="" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{g.name}</span>
                          </div>
                      ))}
                      <button onClick={() => navigate('/groups')} className="w-full text-center text-xs font-bold text-brand-blue mt-2 hover:underline">Explore More</button>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};
