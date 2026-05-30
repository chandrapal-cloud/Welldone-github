
import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { Post } from '../types';
import { StoryBoard } from './StoryBoard';

export const DetailedProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'diary' | 'goals' | 'gallery'>('overview');
  
  // Local state for adding items
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntryLoc, setNewEntryLoc] = useState('');
  const [newEntryDate, setNewEntryDate] = useState('');
  const [newEntryStory, setNewEntryStory] = useState('');

  if (!context) return null;
  const { currentUser, allUsers, createPost, likePost, commentOnPost, sharePost, updateUserProfile } = context;

  const targetUser = userId 
    ? allUsers.find(u => u.id === userId) 
    : currentUser;

  if (!targetUser) return <div className="text-center p-10">User not found.</div>;

  const isMe = currentUser?.id === targetUser.id;
  const userPosts = (targetUser.posts || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // -- Handlers --

  const handleAddGoal = () => {
    if(!newGoalTitle || !currentUser) return;
    const newGoal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        category: 'Personal',
        progress: 0,
        completed: false
    };
    const updatedUser = { ...currentUser, goals: [...currentUser.goals, newGoal] };
    updateUserProfile(updatedUser);
    setNewGoalTitle('');
    setIsAddingGoal(false);
  };

  const handleAddEntry = () => {
    if(!newEntryLoc || !currentUser) return;
    const newEntry = {
        id: Date.now().toString(),
        location: newEntryLoc,
        date: newEntryDate,
        story: newEntryStory,
        image: `https://picsum.photos/seed/${newEntryLoc}/600/400` // Mock image
    };
    const updatedUser = { ...currentUser, travelDiary: [newEntry, ...currentUser.travelDiary] };
    updateUserProfile(updatedUser);
    setNewEntryLoc(''); setNewEntryDate(''); setNewEntryStory('');
    setIsAddingEntry(false);
  };

  const getPlatformIcon = (platform: string) => {
      switch(platform) {
          case 'instagram': return 'fab fa-instagram text-pink-600';
          case 'facebook': return 'fab fa-facebook-f text-blue-600';
          case 'twitter': return 'fab fa-twitter text-blue-400';
          case 'linkedin': return 'fab fa-linkedin-in text-blue-700';
          case 'spotify': return 'fab fa-spotify text-green-500';
          default: return 'fas fa-share-alt';
      }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-teal to-accent-sky relative">
            {/* Socials - Prominent Placement */}
            <div className="absolute top-4 right-4 flex space-x-3">
                {targetUser.socialMediaLinks?.facebook && <a href={targetUser.socialMediaLinks.facebook} target="_blank" className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><i className="fab fa-facebook-f"></i></a>}
                {targetUser.socialMediaLinks?.instagram && <a href={targetUser.socialMediaLinks.instagram} target="_blank" className="bg-white text-pink-600 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><i className="fab fa-instagram"></i></a>}
                {targetUser.socialMediaLinks?.twitter && <a href={targetUser.socialMediaLinks.twitter} target="_blank" className="bg-white text-blue-400 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><i className="fab fa-twitter"></i></a>}
                {targetUser.socialMediaLinks?.linkedin && <a href={targetUser.socialMediaLinks.linkedin} target="_blank" className="bg-white text-blue-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"><i className="fab fa-linkedin-in"></i></a>}
            </div>
        </div>
        
        <div className="px-8 pb-6 relative">
            <div className="flex flex-col md:flex-row items-end -mt-12 mb-4">
                <img src={targetUser.avatar} alt={targetUser.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-dark-mode-card-bg shadow-md object-cover" />
                <div className="md:ml-6 mb-2 mt-4 md:mt-0 flex-grow">
                    <h1 className="text-3xl font-heading font-bold text-dark-text dark:text-dark-mode-text">{targetUser.name}</h1>
                    <p className="text-primary-teal font-medium">{targetUser.occupation || 'Member'}</p>
                    
                    {/* Demographics Badge - Updated */}
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {targetUser.city && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"><i className="fas fa-map-marker-alt mr-1"></i>{targetUser.city}, {targetUser.country}</span>}
                        {targetUser.language && <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"><i className="fas fa-language mr-1"></i>{targetUser.language}</span>}
                        {targetUser.religion && <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"><i className="fas fa-praying-hands mr-1"></i>{targetUser.religion}</span>}
                        {targetUser.politicalView && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"><i className="fas fa-landmark mr-1"></i>{targetUser.politicalView}</span>}
                        {targetUser.philosophy && <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded"><i className="fas fa-brain mr-1"></i>{targetUser.philosophy}</span>}
                    </div>
                </div>
                {isMe && (
                    <button onClick={() => navigate('/edit-profile')} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-dark-text dark:text-white rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mb-2">
                        Edit Profile
                    </button>
                )}
            </div>
            
            <p className="text-text-base dark:text-dark-mode-text-base max-w-2xl mb-4 italic">"{targetUser.bio}"</p>
            
            <div className="flex gap-2 flex-wrap">
                {targetUser.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary-mint/20 text-primary-teal-dark dark:text-secondary-mint rounded-full text-xs font-semibold">
                        {interest}
                    </span>
                ))}
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-gray-100 dark:border-gray-700">
            {['overview', 'diary', 'goals', 'gallery'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                        activeTab === tab 
                        ? 'border-b-4 border-primary-teal text-primary-teal bg-gray-50 dark:bg-dark-mode-input-bg' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    {tab === 'diary' ? 'Travel Diary' : tab}
                </button>
            ))}
        </div>
      </div>

      {/* --- TAB CONTENT --- */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-dark-mode-card-bg p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-dark-text dark:text-dark-mode-text">About</h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex justify-between"><span>Posts</span> <span className="font-semibold text-dark-text dark:text-white">{targetUser.posts?.length || 0}</span></li>
                        <li className="flex justify-between"><span>Friends</span> <span className="font-semibold text-dark-text dark:text-white">{targetUser.friends.length}</span></li>
                        <li className="flex justify-between"><span>Joined</span> <span className="font-semibold text-dark-text dark:text-white">2024</span></li>
                    </ul>
                </div>

                {/* Social Pulse Feed */}
                {targetUser.socialActivity && targetUser.socialActivity.length > 0 && (
                    <div className="bg-white dark:bg-dark-mode-card-bg p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-dark-text dark:text-dark-mode-text flex items-center gap-2">
                            <i className="fas fa-satellite-dish text-brand-pink"></i> Social Pulse
                        </h3>
                        <div className="space-y-4">
                            {targetUser.socialActivity.map(activity => (
                                <div key={activity.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className={`${getPlatformIcon(activity.platform)} text-sm`}></i>
                                        <span className="text-xs text-gray-400">{activity.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                        {activity.content}
                                    </p>
                                    {activity.image && (
                                        <img src={activity.image} alt="Social" className="rounded-lg w-full h-32 object-cover mb-2" />
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {activity.likes && <span><i className="far fa-heart"></i> {activity.likes}</span>}
                                        <a href={activity.url} target="_blank" className="hover:text-brand-teal">Open</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="lg:col-span-2">
                <h3 className="font-bold text-xl mb-4 text-dark-text dark:text-dark-mode-text">Activity</h3>
                <StoryBoard
                    currentUser={currentUser}
                    posts={userPosts}
                    users={allUsers}
                    onPostCreate={isMe ? createPost : undefined}
                    onLike={likePost}
                    onComment={commentOnPost}
                    onShare={sharePost}
                    showCreateBox={isMe}
                />
            </div>
        </div>
      )}

      {/* 2. TRAVEL DIARY */}
      {activeTab === 'diary' && (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-dark-text dark:text-dark-mode-text">Travel Diary</h3>
                {isMe && <button onClick={() => setIsAddingEntry(!isAddingEntry)} className="bg-primary-teal text-white px-4 py-2 rounded-lg hover:bg-secondary-mint transition-colors"><i className="fas fa-plus mr-2"></i>Add Entry</button>}
            </div>

            {isAddingEntry && (
                <div className="bg-white dark:bg-dark-mode-card-bg p-6 rounded-xl shadow-md mb-8 animate-fade-in">
                    <h4 className="font-bold mb-4">New Journey</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Location" value={newEntryLoc} onChange={e => setNewEntryLoc(e.target.value)} className="p-3 border rounded dark:bg-dark-mode-input-bg dark:border-gray-600" />
                        <input type="date" value={newEntryDate} onChange={e => setNewEntryDate(e.target.value)} className="p-3 border rounded dark:bg-dark-mode-input-bg dark:border-gray-600" />
                    </div>
                    <textarea placeholder="Share your story..." value={newEntryStory} onChange={e => setNewEntryStory(e.target.value)} className="w-full p-3 border rounded mb-4 dark:bg-dark-mode-input-bg dark:border-gray-600" rows={3}></textarea>
                    <button onClick={handleAddEntry} className="bg-primary-teal text-white px-6 py-2 rounded-lg font-bold">Post Entry</button>
                </div>
            )}

            <div className="space-y-8">
                {targetUser.travelDiary && targetUser.travelDiary.length > 0 ? (
                    targetUser.travelDiary.map((entry) => (
                        <div key={entry.id} className="flex flex-col md:flex-row bg-white dark:bg-dark-mode-card-bg rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="md:w-1/3 h-48 md:h-auto">
                                <img src={entry.image} alt={entry.location} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6 md:w-2/3 flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-xl font-bold text-dark-text dark:text-dark-mode-text">{entry.location}</h4>
                                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-dark-mode-input-bg px-2 py-1 rounded">{entry.date}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 italic">"{entry.story}"</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No travel entries yet.</p>
                )}
            </div>
        </div>
      )}

      {/* 3. GOALS */}
      {activeTab === 'goals' && (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-dark-text dark:text-dark-mode-text">Active Goals</h3>
                {isMe && <button onClick={() => setIsAddingGoal(!isAddingGoal)} className="bg-primary-teal text-white px-4 py-2 rounded-lg hover:bg-secondary-mint transition-colors"><i className="fas fa-plus mr-2"></i>New Goal</button>}
            </div>

            {isAddingGoal && (
                <div className="flex gap-2 mb-6">
                    <input type="text" placeholder="Enter goal title..." value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} className="flex-1 p-3 border rounded dark:bg-dark-mode-input-bg dark:border-gray-600" />
                    <button onClick={handleAddGoal} className="bg-primary-teal text-white px-6 rounded font-bold">Add</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {targetUser.goals.map((goal) => (
                    <div key={goal.id} className="bg-white dark:bg-dark-mode-card-bg p-6 rounded-xl shadow-sm border-l-4 border-primary-teal">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-lg text-dark-text dark:text-dark-mode-text">{goal.title}</h4>
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{goal.category}</span>
                        </div>
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                        Progress
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-teal-600 dark:text-teal-400">
                                        {goal.progress}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200 dark:bg-gray-700">
                                <div style={{ width: `${goal.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-teal transition-all duration-500"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* 4. GALLERY (Enhanced) */}
      {activeTab === 'gallery' && (
        <div>
            <h3 className="text-2xl font-bold text-dark-text dark:text-dark-mode-text mb-6">Media Gallery</h3>
            {targetUser.gallery.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {targetUser.gallery.map((asset) => (
                        <div key={asset.id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer">
                            {asset.type === 'video' ? (
                                <>
                                    <video src={asset.url} className="w-full h-full object-cover opacity-90" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <i className="fas fa-play text-white text-3xl opacity-80 group-hover:scale-110 transition-transform"></i>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Reel</div>
                                </>
                            ) : (
                                <img src={asset.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No media uploaded yet.</p>
            )}
        </div>
      )}

    </div>
  );
};
