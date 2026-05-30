
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { TravelBuddyCard } from './TravelBuddyCard';
import { TravelPlanCard } from './TravelPlanCard';
import { LoadingSpinner } from './LoadingSpinner';
import { SUCCESS_STORIES } from '../constants';

export const TravelsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'soulmate' | 'plans' | 'spots' | 'stories'>('soulmate');
  const [destination, setDestination] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('Any');
  const [selectedBudget, setSelectedBudget] = useState('Any');
  const [isExpandedSearch, setIsExpandedSearch] = useState(false);
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false);

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const { 
    currentUser, allUsers, friendRequests, sendFriendRequest,
    travelBuddySuggestions, loadingTravelBuddies, searchTravelBuddies,
    travelPlans, meetingSpots, addMeetingSpot 
  } = context;

  const isSearching = loadingTravelBuddies;

  const handleCosmicSearch = () => {
      searchTravelBuddies(destination, { 
          interests: currentUser?.interests || [], 
          travelStyle: selectedVibe !== 'Any' ? selectedVibe : null, 
          budget: selectedBudget !== 'Any' ? selectedBudget : null 
      });
  };

  const handleUserAddSpot = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      addMeetingSpot({
          id: `spot-${Date.now()}`,
          name: formData.get('name') as string,
          type: 'User Recommendation',
          location: formData.get('location') as string,
          address: formData.get('address') as string,
          vibe: 'Community',
          visualTheme: formData.get('visualTheme') as any,
          image: 'https://picsum.photos/seed/userspot/400/300',
          tags: ['User Added'],
          description: formData.get('description') as string,
          rating: 5,
          approved: false,
          addedBy: currentUser?.id || 'anon',
          mapUrl: '#'
      });
      setIsAddSpotModalOpen(false);
      alert("Spot submitted for review!");
  };

  const TabButton = ({ id, label, icon }: { id: any, label: string, icon: string }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 ${
            activeTab === id 
            ? 'bg-brand-teal text-white border-brand-teal shadow-lg transform scale-105' 
            : 'bg-white dark:bg-dark-mode-card-bg text-gray-500 border-gray-100 dark:border-gray-700 hover:border-brand-teal/50'
        }`}
      >
          <i className={icon}></i>
          <span className="hidden md:inline">{label}</span>
      </button>
  );

  const getThemeColor = (theme?: string) => {
      switch (theme) {
          case 'Mystical': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
          case 'Modern': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
          case 'Cozy': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
          case 'Energetic': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
          default: return 'bg-brand-mint/20 text-brand-teal';
      }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg font-sans pb-20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Wander<span className="text-brand-teal">lust</span></h1>
              <p className="text-gray-500 dark:text-gray-400">Restoring connections through shared journeys.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
              <TabButton id="soulmate" label="Soulmate Search" icon="fas fa-user-astronaut" />
              <TabButton id="plans" label="Travel Plans" icon="fas fa-map-marked-alt" />
              <TabButton id="spots" label="Meeting Spots" icon="fas fa-map-pin" />
              <TabButton id="stories" label="Success Stories" icon="fas fa-heart" />
          </div>

          {/* --- TAB: SOULMATE SEARCH --- */}
          {activeTab === 'soulmate' && (
              <div className="animate-fade-in">
                  
                  {/* Cosmic Search Bar - RESTORED TO BRAND UI */}
                  <div className="bg-white dark:bg-dark-mode-card-bg rounded-[2.5rem] p-8 shadow-xl mb-12 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 text-brand-teal opacity-5 pointer-events-none">
                          <i className="fas fa-atom text-9xl"></i>
                      </div>

                      <div className="relative z-10 max-w-5xl mx-auto">
                          <div className="flex items-center justify-center gap-3 mb-8">
                              <i className="fas fa-rocket text-brand-pink text-2xl"></i>
                              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Cosmic Soulmate Scan</h2>
                              <i className="fas fa-moon text-brand-blue text-2xl"></i>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                              {/* Destination */}
                              <div className="md:col-span-4 relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                      <i className="fas fa-globe-americas text-gray-400"></i>
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="Destination (e.g. Kyoto)" 
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-dark-mode-input-bg border-2 border-transparent focus:border-brand-teal/30 focus:ring-0 text-gray-900 dark:text-white transition-all font-bold"
                                  />
                              </div>

                              {/* Vibe */}
                              <div className="md:col-span-3 relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                      <i className="fas fa-icons text-gray-400"></i>
                                  </div>
                                  <select 
                                    value={selectedVibe}
                                    onChange={(e) => setSelectedVibe(e.target.value)}
                                    className="w-full pl-11 pr-8 py-4 rounded-2xl bg-gray-50 dark:bg-dark-mode-input-bg border-2 border-transparent focus:border-brand-teal/30 focus:ring-0 text-gray-900 dark:text-white appearance-none cursor-pointer font-bold"
                                  >
                                      <option value="Any">Any Vibe</option>
                                      <option value="Adventure">🌋 Adventure</option>
                                      <option value="Chill">🌴 Chill & Relax</option>
                                      <option value="Spiritual">🧘 Spiritual</option>
                                      <option value="Party">🎉 Nightlife</option>
                                  </select>
                              </div>

                              {/* Budget */}
                              <div className="md:col-span-3 relative">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                      <i className="fas fa-wallet text-gray-400"></i>
                                  </div>
                                  <select 
                                    value={selectedBudget}
                                    onChange={(e) => setSelectedBudget(e.target.value)}
                                    className="w-full pl-11 pr-8 py-4 rounded-2xl bg-gray-50 dark:bg-dark-mode-input-bg border-2 border-transparent focus:border-brand-teal/30 focus:ring-0 text-gray-900 dark:text-white appearance-none cursor-pointer font-bold"
                                  >
                                      <option value="Any">Any Budget</option>
                                      <option value="Low">$ Shoestring</option>
                                      <option value="Medium">$$ Balanced</option>
                                      <option value="High">$$$ Luxury</option>
                                  </select>
                              </div>

                              {/* Search Button */}
                              <div className="md:col-span-2">
                                  <button 
                                    onClick={handleCosmicSearch}
                                    className="w-full h-full bg-brand-teal text-white rounded-2xl font-bold shadow-lg hover:bg-teal-600 hover:scale-105 transition-all flex items-center justify-center gap-2 py-4"
                                  >
                                      {isSearching ? <LoadingSpinner /> : <><i className="fas fa-search"></i> Scan</>}
                                  </button>
                              </div>
                          </div>

                          {/* Expand Search Toggle */}
                          <div className="flex justify-between items-center px-2">
                              <button 
                                onClick={() => setIsExpandedSearch(!isExpandedSearch)}
                                className="text-sm font-bold text-gray-400 hover:text-brand-teal transition-colors flex items-center gap-2"
                              >
                                  <i className={`fas fa-sliders-h`}></i>
                                  {isExpandedSearch ? 'Fewer Filters' : 'Expand Search'}
                              </button>
                          </div>

                          {/* Expanded Filters */}
                          {isExpandedSearch && (
                              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                                  <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <input type="checkbox" className="w-4 h-4 rounded text-brand-teal focus:ring-brand-teal" /> Female Only
                                  </label>
                                  <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <input type="checkbox" className="w-4 h-4 rounded text-brand-teal focus:ring-brand-teal" /> Verified
                                  </label>
                                  <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <input type="checkbox" className="w-4 h-4 rounded text-brand-teal focus:ring-brand-teal" /> Near Me
                                  </label>
                                  <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                      <input type="checkbox" className="w-4 h-4 rounded text-brand-teal focus:ring-brand-teal" /> Speak English
                                  </label>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {travelBuddySuggestions.map(buddy => (
                          <TravelBuddyCard 
                              key={buddy.id}
                              buddy={buddy}
                              currentUser={currentUser}
                              allUsers={allUsers}
                              friendRequests={friendRequests}
                              onSendFriendRequest={(id) => sendFriendRequest(id)}
                              onViewProfile={(id) => navigate(`/users/${id}`)}
                          />
                      ))}
                      {travelBuddySuggestions.length === 0 && !isSearching && (
                          <div className="col-span-full text-center py-20 bg-white dark:bg-dark-mode-card-bg rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                              <h3 className="text-xl font-bold text-gray-400">No cosmic matches yet.</h3>
                              <p className="text-gray-400">Adjust your destination or vibe to find matches!</p>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* --- TAB: TRAVEL PLANS --- */}
          {activeTab === 'plans' && (
              <div className="animate-fade-in-up">
                  <div className="flex justify-between items-center mb-8">
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white">Curated Travel Plans</h2>
                      <button className="bg-white dark:bg-dark-mode-card-bg px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-gray-100">Explore All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {travelPlans.map(plan => (
                          <TravelPlanCard 
                            key={plan.id} 
                            travelPlan={plan} 
                            onViewDetails={(id) => console.log('View', id)} 
                            onShare={(p) => console.log('Share', p)}
                          />
                      ))}
                  </div>
              </div>
          )}

          {/* --- TAB: MEETING SPOTS --- */}
          {activeTab === 'spots' && (
              <div className="animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                      <div>
                          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Soulmate Meeting Places</h2>
                          <p className="text-gray-500">Discover vetted spots loved by the community.</p>
                      </div>
                      <button onClick={() => setIsAddSpotModalOpen(true)} className="bg-brand-pink text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-pink-600 transition-colors flex items-center gap-2">
                          <i className="fas fa-plus"></i> Suggest Spot
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {meetingSpots.map(spot => (
                          <div key={spot.id} className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
                              <div className="relative h-56 overflow-hidden">
                                  <img src={spot.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={spot.name} />
                                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                                      {spot.type}
                                  </div>
                                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                      <h3 className="font-bold text-xl text-white">{spot.name}</h3>
                                      <p className="text-gray-200 text-xs flex items-center gap-1"><i className="fas fa-map-marker-alt"></i> {spot.location}</p>
                                  </div>
                              </div>
                              <div className="p-6 flex flex-col flex-grow">
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                      <span className="text-xs font-bold text-brand-teal bg-brand-mint/20 px-2 py-1 rounded">Vibe: {spot.vibe}</span>
                                      {spot.visualTheme && (
                                          <span className={`text-xs font-bold px-2 py-1 rounded ${getThemeColor(spot.visualTheme)}`}>
                                              {spot.visualTheme}
                                          </span>
                                      )}
                                      {!spot.approved && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold uppercase">Pending Review</span>}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4 flex-grow">{spot.description}</p>
                                  <button className="w-full py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors mt-auto">
                                      Details
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* --- TAB: SUCCESS STORIES --- */}
          {activeTab === 'stories' && (
              <div className="animate-fade-in">
                  <div className="text-center mb-10">
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Real Connections, Real Journeys</h2>
                      <p className="text-gray-500">Read how others found their travel soulmates.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {SUCCESS_STORIES.map(story => (
                          <div key={story.id} className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                              <img src={story.image} alt={story.couple} className="w-full h-48 object-cover rounded-2xl mb-6 shadow-sm" />
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{story.couple}</h3>
                              <p className="text-xs text-brand-teal font-bold uppercase tracking-wider mb-4"><i className="fas fa-map-pin mr-1"></i> {story.location}</p>
                              <p className="text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed">
                                  <i className="fas fa-quote-left text-gray-200 mr-2"></i>
                                  {story.story}
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Add Spot Modal */}
          {isAddSpotModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-2xl w-full max-w-md p-8 relative overflow-y-auto max-h-[90vh]">
                      <button onClick={() => setIsAddSpotModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
                      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Suggest a Spot</h3>
                      <form onSubmit={handleUserAddSpot} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Place Name</label>
                              <input name="name" required className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City / Location</label>
                              <input name="location" required className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Address</label>
                              <input name="address" required className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white outline-none" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Visual Theme</label>
                              <select name="visualTheme" className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white outline-none appearance-none bg-white">
                                  <option value="">Select Theme</option>
                                  <option value="Mystical">Mystical</option>
                                  <option value="Modern">Modern</option>
                                  <option value="Cozy">Cozy</option>
                                  <option value="Energetic">Energetic</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Why is it special?</label>
                              <textarea name="description" className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white outline-none" rows={3}></textarea>
                          </div>
                          <button type="submit" className="w-full bg-brand-teal text-white py-3 rounded-xl font-bold shadow-md hover:bg-teal-600 transition-colors uppercase tracking-widest text-sm">Submit for Review</button>
                      </form>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
