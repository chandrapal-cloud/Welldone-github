
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

export const HomePage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const { currentUser, allUsers, updateUserProfile, heroSlides, login } = context;

  // --- State for Hero Slider ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- State for Travel Diary ---
  const [newTripLocation, setNewTripLocation] = useState('');
  const [newTripDate, setNewTripDate] = useState('');
  const [newTripStory, setNewTripStory] = useState('');
  const [isPostingTrip, setIsPostingTrip] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000); // Slower interval for philosophical contemplation
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // --- Helpers ---
  const myFriends = currentUser ? allUsers.filter(u => currentUser.friends.includes(u.id)) : [];

  const handlePostTrip = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser || !newTripLocation || !newTripStory) return;

      const newTrip = {
          id: `trip-${Date.now()}`,
          location: newTripLocation,
          date: newTripDate || 'Upcoming',
          story: newTripStory,
          image: `https://picsum.photos/seed/${newTripLocation.replace(/\s/g, '')}/600/400`,
          invitedUserIds: []
      };

      const updatedUser = {
          ...currentUser,
          travelDiary: [newTrip, ...(currentUser.travelDiary || [])]
      };

      updateUserProfile(updatedUser, { skipRedirect: true, silent: true });
      
      // Reset Form
      setNewTripLocation('');
      setNewTripDate('');
      setNewTripStory('');
      setIsPostingTrip(false);
  };

  const openInviteModal = (tripId: string) => {
      setSelectedTripId(tripId);
      setInviteModalOpen(true);
  };

  const handleInviteFriend = (friendId: string) => {
      if (!currentUser || !selectedTripId) return;

      const updatedDiary = (currentUser.travelDiary || []).map(trip => {
          if (trip.id === selectedTripId) {
              const currentInvites = trip.invitedUserIds || [];
              if (currentInvites.includes(friendId)) {
                  return trip; 
              }
              return { ...trip, invitedUserIds: [...currentInvites, friendId] };
          }
          return trip;
      });

      const updatedUser = { ...currentUser, travelDiary: updatedDiary };
      updateUserProfile(updatedUser, { skipRedirect: true, silent: true });
      alert("Invitation sent!"); 
  };

  const handleGuestAccess = () => {
      const guestUser: User = {
          id: `guest-${Date.now()}`,
          name: 'Guest Explorer',
          email: 'guest@welldone.com',
          avatar: `https://picsum.photos/seed/guest_${Date.now()}/200/200`,
          interests: [],
          goals: [],
          bio: 'Just visiting to explore the world of Welldone.',
          friends: [],
          moodHistory: [],
          role: 'user',
          status: 'active',
          hasCompletedOnboarding: false, // This triggers the "Guide Me" flow
          virtualBalance: 0,
          occupation: 'Visitor',
          subscriptionTier: 'free',
          travelDiary: [],
          gallery: []
      };
      
      login(guestUser);
      navigate('/dashboard');
  };

  // --- Render Sections ---

  const renderTravelDiary = () => {
      return (
          <div className="space-y-8 animate-fade-in">
              {/* Post New Trip Form */}
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                  {!isPostingTrip ? (
                      <button 
                        onClick={() => setIsPostingTrip(true)}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 font-bold hover:border-brand-teal hover:text-brand-teal transition-all flex items-center justify-center gap-2"
                      >
                          <i className="fas fa-plus-circle"></i> Post a New Journey
                      </button>
                  ) : (
                      <form onSubmit={handlePostTrip} className="space-y-4">
                          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Share Your Plan or Memory</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input 
                                required
                                type="text" 
                                placeholder="Location (e.g. Bali, Indonesia)" 
                                value={newTripLocation}
                                onChange={(e) => setNewTripLocation(e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-transparent focus:ring-2 focus:ring-brand-teal/50 outline-none text-gray-900 dark:text-white"
                              />
                              <input 
                                type="text" 
                                placeholder="Date (e.g. Next Summer, Oct 2024)" 
                                value={newTripDate}
                                onChange={(e) => setNewTripDate(e.target.value)}
                                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-transparent focus:ring-2 focus:ring-brand-teal/50 outline-none text-gray-900 dark:text-white"
                              />
                          </div>
                          <textarea 
                            required
                            rows={3}
                            placeholder="Tell us about it... (e.g. Planning a yoga retreat!)"
                            value={newTripStory}
                            onChange={(e) => setNewTripStory(e.target.value)}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-transparent focus:ring-2 focus:ring-brand-teal/50 outline-none text-gray-900 dark:text-white resize-none"
                          ></textarea>
                          <div className="flex gap-3">
                              <button type="submit" className="flex-1 bg-brand-teal text-white py-2 rounded-xl font-bold hover:bg-teal-600 transition-colors">Post</button>
                              <button type="button" onClick={() => setIsPostingTrip(false)} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                          </div>
                      </form>
                  )}
              </div>

              {/* Trip List */}
              {currentUser && currentUser.travelDiary && currentUser.travelDiary.length > 0 ? (
                  currentUser.travelDiary.map((entry, idx) => (
                    <div key={idx} className="group bg-white dark:bg-dark-mode-card-bg rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                        <div className="relative h-48 w-full overflow-hidden">
                            <img src={entry.image} alt={entry.location} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold text-xl leading-tight">{entry.location}</h3>
                                <span className="text-white/80 text-xs font-medium bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">{entry.date}</span>
                            </div>
                        </div>
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-4">"{entry.story}"</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex -space-x-2">
                                    {entry.invitedUserIds && entry.invitedUserIds.map((uid) => {
                                        const u = allUsers.find(user => user.id === uid);
                                        if (!u) return null;
                                        return (
                                            <img key={uid} src={u.avatar} title={u.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-mode-card-bg" alt="" />
                                        );
                                    })}
                                    {(!entry.invitedUserIds || entry.invitedUserIds.length === 0) && (
                                        <span className="text-xs text-gray-400 italic">No one invited yet</span>
                                    )}
                                </div>
                                <button 
                                    onClick={() => openInviteModal(entry.id)}
                                    className="text-xs font-bold bg-brand-blue/10 text-brand-blue px-3 py-1.5 rounded-lg hover:bg-brand-blue hover:text-white transition-all flex items-center gap-1"
                                >
                                    <i className="fas fa-user-plus"></i> Invite
                                </button>
                            </div>
                        </div>
                    </div>
                ))
              ) : (
                  <div className="text-center p-8 text-gray-400">
                      <p>Your travel diary is empty. Post your first plan!</p>
                  </div>
              )}
          </div>
      );
  };

  const renderMyWorld = () => {
      return (
          <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">People in your circle</p>
                  <button 
                    onClick={() => navigate('/connections')}
                    className="text-xs font-bold text-brand-teal hover:underline"
                  >
                      Manage
                  </button>
              </div>

              {myFriends.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {myFriends.map(friend => (
                          <div key={friend.id} className="bg-gray-50 dark:bg-dark-mode-input-bg p-4 rounded-xl flex flex-col items-center text-center hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all shadow-sm cursor-pointer" onClick={() => navigate(`/users/${friend.id}`)}>
                              <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-white dark:border-gray-600 shadow-sm" />
                              <h5 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{friend.name}</h5>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{friend.occupation || 'Member'}</p>
                          </div>
                      ))}
                      <div 
                        onClick={() => navigate('/connections')}
                        className="bg-gray-50 dark:bg-dark-mode-input-bg p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-brand-teal text-gray-400 hover:text-brand-teal transition-all min-h-[140px]"
                      >
                          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-2 shadow-sm">
                              <i className="fas fa-plus"></i>
                          </div>
                          <span className="text-xs font-bold">Add Friend</span>
                      </div>
                  </div>
              ) : (
                  <div className="text-center py-10 bg-gray-50 dark:bg-dark-mode-input-bg rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-300 text-xl mx-auto mb-3">
                          <i className="fas fa-user-friends"></i>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Your circle is waiting to grow.</p>
                      <button 
                        onClick={() => navigate('/connections')}
                        className="px-4 py-2 bg-brand-teal text-white rounded-lg text-xs font-bold hover:bg-teal-600 transition-colors"
                      >
                          Find Connections
                      </button>
                  </div>
              )}
          </div>
      );
  };

  if (!currentUser) {
    // --- FULL SCREEN LANDING PAGE (PHILOSOPHICAL THEME) ---
    return (
      <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden font-sans">
        {/* Fullscreen Slider */}
        <div className="absolute inset-0 z-0">
             {heroSlides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transition-transform duration-[15000ms] ease-linear scale-110" />
                    {/* Darker gradient for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                </div>
             ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center min-h-screen px-4 md:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-7xl mx-auto">
                {/* LEFT: Login & Intro (Prominent) */}
                <div className="lg:col-span-5 xl:col-span-4 w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] shadow-2xl animate-fade-in-up">
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Welldone.</h1>
                    <p className="text-white/80 text-lg mb-8 font-light">Where humanity connects.</p>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-teal hover:text-white transition-all transform hover:scale-[1.02]"
                        >
                            Log In
                        </button>
                        <button
                            onClick={handleGuestAccess}
                            className="w-full bg-transparent border-2 border-white/30 text-white py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-compass"></i> Explore as Guest
                        </button>
                    </div>
                    
                    <p className="mt-6 text-xs text-white/50 text-center">
                        Join a community dedicated to growth, kindness, and authentic connection.
                    </p>
                </div>

                {/* RIGHT: Philosophical Quotes (Dynamic) */}
                <div className="hidden lg:block lg:col-span-7 xl:col-span-8 relative h-[400px]">
                     {heroSlides.map((slide, index) => (
                         <div key={slide.id} className={`transition-opacity duration-1000 absolute inset-0 flex items-center justify-end ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                             <div className="text-right max-w-2xl">
                                <h2 className={`text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl leading-tight ${slide.theme || 'text-white'}`}>
                                    "{slide.title}"
                                </h2>
                                <p className="text-2xl md:text-3xl text-white/90 font-serif italic mb-4">
                                    {slide.subtitle}
                                </p>
                                {slide.quoteAuthor && (
                                    <p className="text-xl text-brand-teal font-bold tracking-widest uppercase mt-4">
                                        — {slide.quoteAuthor}
                                    </p>
                                )}
                             </div>
                         </div>
                     ))}
                </div>
            </div>
        </div>
        
        {/* Mobile Quote Fallback (Bottom) */}
        <div className="lg:hidden absolute bottom-10 left-0 right-0 text-center px-6 z-10">
             <p className="text-white/90 italic text-lg shadow-black drop-shadow-md">
                 "{heroSlides[currentSlide].title}"
             </p>
        </div>
      </div>
    );
  }

  // --- LOGGED IN USER HOME (COVER PAGE STYLE) ---
  return (
    <div className="-mt-8 -mx-4 md:-mx-4 lg:-mx-8 font-sans">
      
      {/* Invite Friend Modal */}
      {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setInviteModalOpen(false)}>
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-dark-mode-input-bg">
                      <h3 className="font-bold text-gray-800 dark:text-white">Invite Friends</h3>
                      <button onClick={() => setInviteModalOpen(false)}><i className="fas fa-times text-gray-400"></i></button>
                  </div>
                  <div className="p-4 max-h-80 overflow-y-auto">
                      {myFriends.length > 0 ? (
                          <div className="space-y-2">
                              {myFriends.map(friend => (
                                  <div key={friend.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                      <div className="flex items-center gap-3">
                                          <img src={friend.avatar} className="w-8 h-8 rounded-full" alt="" />
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{friend.name}</span>
                                      </div>
                                      <button 
                                        onClick={() => handleInviteFriend(friend.id)}
                                        className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded-md hover:bg-blue-600"
                                      >
                                          Send
                                      </button>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <p className="text-center text-sm text-gray-500 py-4">No friends to invite yet. Add connections first!</p>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* 1. USER HERO SLIDER - Facebook Cover Dimensions (820x312 desktop, 640x360 mobile) */}
      <div className="relative w-full h-[360px] md:h-[312px] overflow-hidden mb-8 bg-gray-900 shadow-xl group">
         {/* Slides */}
         {heroSlides.map((slide, index) => (
             <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
             >
                 {/* Image centered to mimic cover photo cropping */}
                 <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className={`w-full h-full object-cover object-center transition-transform duration-[8000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`} 
                 />
                 
                 {/* Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                 {/* Safe Zone Container - Centered approx 820x250px area to keep text visible */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="w-full max-w-[820px] h-full max-h-[250px] flex flex-col items-center justify-center text-center p-4">
                         <h2 className={`text-3xl md:text-5xl font-black mb-2 drop-shadow-2xl tracking-tight animate-fade-in-up ${slide.theme || 'text-white'}`}>
                             {slide.title}
                         </h2>
                         {slide.quoteAuthor && <p className="text-xs md:text-sm text-white/90 font-bold uppercase tracking-widest mt-1 opacity-80">— {slide.quoteAuthor}</p>}
                     </div>
                 </div>
             </div>
         ))}

         {/* Navigation Dots */}
         <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
             {heroSlides.map((_, idx) => (
                 <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white h-6' : 'bg-white/40 hover:bg-white/80'}`}
                 />
             ))}
         </div>
      </div>

      {/* 2. CONTENT AREA: Magazine Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Sidebar: Identity & Core */}
              <div className="space-y-6">
                  {/* Core Identity */}
                  <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                      
                      {/* Centered Header */}
                      <div className="flex flex-col items-center text-center mb-6">
                          <div className="relative mb-3">
                              <img 
                                src={currentUser.avatar} 
                                alt={currentUser.name} 
                                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg" 
                              />
                              <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-dark-mode-card-bg" title="Online"></div>
                          </div>
                          
                          <h3 className="font-heading font-black text-2xl text-gray-900 dark:text-white mb-1">{currentUser.name}</h3>
                          <p className="text-sm font-bold text-brand-teal uppercase tracking-wider mb-3">{currentUser.occupation || "Explorer"}</p>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic max-w-xs mx-auto">
                              "{currentUser.bio || "Ready to explore the world."}"
                          </p>
                      </div>

                      {/* Info Grid - Visual Update */}
                      <div className="bg-gray-50 dark:bg-dark-mode-input-bg/50 rounded-2xl p-4 mb-6 space-y-3">
                          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-dark-mode-card-bg flex items-center justify-center text-red-500 shadow-sm">
                                  <i className="fas fa-map-marker-alt"></i>
                              </div>
                              <span className="font-medium">{currentUser.currentLocation || "Location not set"}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-dark-mode-card-bg flex items-center justify-center text-blue-500 shadow-sm">
                                  <i className="fas fa-graduation-cap"></i>
                              </div>
                              <span className="font-medium truncate">{currentUser.education || "Education not set"}</span>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-dark-mode-card-bg flex items-center justify-center text-purple-500 shadow-sm">
                                  <i className="fas fa-briefcase"></i>
                              </div>
                              <span className="font-medium truncate">{currentUser.company || "Work not set"}</span>
                          </div>
                      </div>

                      {/* Latest Trip Snippet */}
                      {currentUser.travelDiary && currentUser.travelDiary.length > 0 ? (
                          <div className="mb-6 relative rounded-2xl overflow-hidden group cursor-pointer" onClick={() => navigate('/travels')}>
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10"></div>
                              <img src={currentUser.travelDiary[0].image} alt="Trip" className="w-full h-32 object-cover" />
                              <div className="absolute bottom-0 left-0 right-0 p-3 z-20 text-white">
                                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-90"><i className="fas fa-plane"></i> Latest Adventure</p>
                                  <p className="font-bold text-sm leading-tight">{currentUser.travelDiary[0].location}</p>
                              </div>
                          </div>
                      ) : (
                           <div className="mb-6 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
                              <p className="text-xs text-gray-400 font-medium">No trips logged yet.</p>
                              <button onClick={() => navigate('/travels')} className="text-brand-teal text-xs font-bold mt-1 hover:underline">Add one now</button>
                          </div>
                      )}

                      {/* Social Media - Prominent */}
                      <div className="mb-6">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-3">Social Connect</p>
                          <div className="flex justify-center gap-3">
                              {currentUser.socialMediaLinks?.facebook ? (
                                  <a href={currentUser.socialMediaLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-blue-500/30">
                                      <i className="fab fa-facebook-f text-lg"></i>
                                  </a>
                              ) : (
                                  <button onClick={() => navigate('/edit-profile')} className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition-colors">
                                      <i className="fab fa-facebook-f"></i>
                                  </button>
                              )}
                              
                              {currentUser.socialMediaLinks?.instagram ? (
                                  <a href={currentUser.socialMediaLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-pink-500/30">
                                      <i className="fab fa-instagram text-lg"></i>
                                  </a>
                              ) : (
                                  <button onClick={() => navigate('/edit-profile')} className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-pink-400 hover:text-pink-400 transition-colors">
                                      <i className="fab fa-instagram"></i>
                                  </button>
                              )}

                              {currentUser.socialMediaLinks?.twitter ? (
                                  <a href={currentUser.socialMediaLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-gray-500/30">
                                      <i className="fab fa-twitter text-lg"></i>
                                  </a>
                              ) : (
                                  <button onClick={() => navigate('/edit-profile')} className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-black hover:text-black transition-colors">
                                      <i className="fab fa-twitter"></i>
                                  </button>
                              )}
                          </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6 justify-center">
                          {currentUser.interests.slice(0, 5).map((tag, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                  #{tag}
                              </span>
                          ))}
                      </div>

                      <button onClick={() => navigate('/profile')} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                          View Full Profile
                      </button>
                  </div>

                  {/* Mission Widget */}
                  <div className="bg-gradient-to-br from-brand-teal/10 to-brand-blue/10 rounded-3xl p-8 border border-brand-teal/20 relative overflow-hidden">
                      <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-teal/20 rounded-full blur-2xl"></div>
                      <h3 className="font-bold text-brand-teal mb-3 uppercase text-xs tracking-wide flex items-center gap-2">
                          <i className="fas fa-bullseye"></i> My Mission
                      </h3>
                      <p className="text-xl text-gray-800 dark:text-gray-100 font-serif italic relative z-10">
                          "{currentUser.whyImHere || "To live authentically."}"
                      </p>
                  </div>
              </div>

              {/* Main Content: Diary & Friends */}
              <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-brand-pink">
                              <i className="fas fa-plane-departure"></i>
                          </div>
                          Travel Diary
                      </h3>
                      {renderTravelDiary()}
                  </div>

                  <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl text-yellow-600">
                              <i className="fas fa-star"></i>
                          </div>
                          My World
                      </h3>
                      {renderMyWorld()}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
