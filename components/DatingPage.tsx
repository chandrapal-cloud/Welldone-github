
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { DatingMatchCard } from './DatingMatchCard';
import { LoadingSpinner } from './LoadingSpinner';
import { RelationshipGoal } from '../types';

export const DatingPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // Search Mode State
  const [searchMode, setSearchMode] = useState<'standard' | 'cosmic'>('standard');

  // Standard Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<RelationshipGoal>('Any');
  const [selectedVibe, setSelectedVibe] = useState('');

  // Cosmic Search State
  const [astroName, setAstroName] = useState('');
  const [astroBirthDate, setAstroBirthDate] = useState('');
  const [astroLuckyNumber, setAstroLuckyNumber] = useState('');

  // Quiz State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(1);
  const [quizGoal, setQuizGoal] = useState<RelationshipGoal | null>(null);
  const [quizVibe, setQuizVibe] = useState('');
  const [quizGreenFlag, setQuizGreenFlag] = useState('');
  const [quizDescription, setQuizDescription] = useState('');

  // Celebration State
  const [celebrationData, setCelebrationData] = useState<{ title: string; message: string } | null>(null);

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const {
    currentUser,
    allUsers,
    sendFriendRequest,
    datingMatches,
    loadingDating,
    errorDating,
    searchDatingPartners,
    searchAstrologyPartners,
    awardVirtualCurrency
  } = context;

  const relationshipOptions: RelationshipGoal[] = [
    'Long-term Partner',
    'Workout Buddy & More',
    'Activity Partner',
    'Intellectual Connection',
    'Spiritual Journey',
    'Friendship First',
    'Any'
  ];

  const vibeOptions = [
    'Adventurous 🎒', 'Chill ☕', 'Ambitious 💼', 'Creative 🎨', 'Spiritual 🧘', 'Intellectual 📚'
  ];

  const activityTags = [
    { label: '📚 Book Club', desc: 'Looking for a book reading partner to discuss literature.', goal: 'Activity Partner' as RelationshipGoal },
    { label: '🤔 Philosopher', desc: 'Seeking someone to have deep philosophical discussions with.', goal: 'Intellectual Connection' as RelationshipGoal },
    { label: '🎬 Film Buddy', desc: 'Want a movie buff to watch and critique films with.', goal: 'Activity Partner' as RelationshipGoal },
    { label: '🏛️ Temple Visit', desc: 'Looking for a companion to visit temples and explore spirituality.', goal: 'Spiritual Journey' as RelationshipGoal },
    { label: '🧘 Meditation', desc: 'Finding peace together through shared meditation sessions.', goal: 'Spiritual Journey' as RelationshipGoal },
    { label: '🏃 Fitness Pal', desc: 'Need a gym buddy or running partner to stay motivated.', goal: 'Workout Buddy & More' as RelationshipGoal },
  ];

  // --- Handlers ---

  const handleQuickSelect = (tag: typeof activityTags[0]) => {
    setSearchQuery(tag.desc);
    setSelectedGoal(tag.goal);
  };

  const handleStandardSearch = async () => {
    if (!searchQuery.trim() && selectedGoal === 'Any' && !selectedVibe) {
      alert("Please describe your ideal connection or select a filter!");
      return;
    }
    
    // Construct a rich prompt from the inputs
    let finalDescription = searchQuery;
    if (selectedVibe) {
        finalDescription += ` (Vibe: ${selectedVibe})`;
    }

    await searchDatingPartners({
      description: finalDescription || "Looking for a compatible match.",
      relationshipGoal: selectedGoal
    });
  };

  const handleCosmicSearch = async () => {
    if (!astroBirthDate && !astroName && !astroLuckyNumber) {
        alert("Please enter at least one criteria (Name, Birthdate, or Lucky Number)!");
        return;
    }
    await searchAstrologyPartners({
        nameContains: astroName,
        birthDate: astroBirthDate,
        luckyNumber: astroLuckyNumber
    });
  };

  const handleImportSocialData = () => {
      // Mock data import
      if (currentUser?.instaId || currentUser?.fbId) {
          setAstroName(currentUser.name);
          setAstroBirthDate('1995-06-15'); // Mock birthdate extraction
          setAstroLuckyNumber('7');
          alert("Data imported from connected accounts!");
      } else {
          alert("No connected accounts found. Please connect Instagram or Facebook in Settings.");
          navigate('/settings');
      }
  };

  const handleQuizSubmit = async () => {
      setIsQuizOpen(false);
      setQuizStep(1); // Reset for next time

      const constructedPrompt = `
        I am looking for a ${quizGoal || 'partner'}.
        My ideal date vibe is ${quizVibe}.
        I value ${quizGreenFlag} in a person.
        Additional details: ${quizDescription}
      `;

      setSearchQuery(constructedPrompt); // Visual feedback
      setSelectedGoal(quizGoal || 'Any');

      await searchDatingPartners({
          description: constructedPrompt,
          relationshipGoal: quizGoal || 'Any'
      });
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleConnectWithReward = (userId: string) => {
    sendFriendRequest(userId);
    awardVirtualCurrency(1000);
    setCelebrationData({
        title: "Spark Ignited!",
        message: "You've taken a brave step towards connection."
    });
  };

  // --- Sub-Components ---

  const QuizModal = () => {
      if (!isQuizOpen) return null;
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 bg-gradient-to-r from-brand-pink to-purple-600 text-white flex justify-between items-center">
                      <div>
                          <h2 className="text-2xl font-bold"><i className="fas fa-heart mr-2"></i> Dream Date Quiz</h2>
                          <p className="opacity-90 text-sm">Step {quizStep} of 3</p>
                      </div>
                      <button onClick={() => setIsQuizOpen(false)} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"><i className="fas fa-times"></i></button>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5"><div className="bg-purple-300 h-1.5 transition-all duration-500" style={{ width: `${(quizStep / 3) * 100}%` }}></div></div>
                  
                  <div className="p-8 overflow-y-auto flex-grow">
                      {quizStep === 1 && (
                          <div className="space-y-6 animate-fade-in">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">What are you looking for right now?</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {relationshipOptions.filter(r => r !== 'Any').map(opt => (
                                      <button key={opt} onClick={() => setQuizGoal(opt)} className={`p-4 rounded-xl border-2 text-left text-sm font-bold transition-all ${quizGoal === opt ? 'border-brand-pink bg-pink-50 text-brand-pink' : 'border-gray-200 dark:border-gray-700 hover:border-brand-pink/50'}`}>{opt}</button>
                                  ))}
                              </div>
                          </div>
                      )}
                      {quizStep === 2 && (
                          <div className="space-y-6 animate-fade-in">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pick a Vibe & Green Flag</h3>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ideal Vibe</label>
                                  <div className="flex flex-wrap gap-2">
                                      {vibeOptions.map(v => (
                                          <button key={v} onClick={() => setQuizVibe(v)} className={`px-4 py-2 rounded-full text-sm border transition-all ${quizVibe === v ? 'bg-purple-100 border-purple-500 text-purple-700' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}>{v}</button>
                                      ))}
                                  </div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Must-Have Trait (Green Flag)</label>
                                  <input type="text" value={quizGreenFlag} onChange={(e) => setQuizGreenFlag(e.target.value)} className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg focus:ring-2 focus:ring-brand-pink outline-none" placeholder="e.g. Kindness, Ambition, Humor" />
                              </div>
                          </div>
                      )}
                      {quizStep === 3 && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="text-center mb-4">
                                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-pink text-2xl"><i className="fas fa-magic"></i></div>
                                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Describe Your Dream Date</h3>
                              </div>
                              <textarea value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)} rows={4} className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg focus:ring-2 focus:ring-brand-pink outline-none resize-none" placeholder="I want someone who loves hiking on weekends and discussing sci-fi movies..."></textarea>
                          </div>
                      )}
                  </div>

                  <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                      {quizStep > 1 ? <button onClick={() => setQuizStep(s => s - 1)} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Back</button> : <div></div>}
                      {quizStep < 3 ? (
                          <button onClick={() => setQuizStep(s => s + 1)} className="px-8 py-2 bg-brand-pink text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">Next</button>
                      ) : (
                          <button onClick={handleQuizSubmit} className="px-8 py-2 bg-gradient-to-r from-brand-pink to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">Find Match</button>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">Please log in to access Connection features.</h2>
        <button onClick={() => navigate('/login')} className="bg-primary-teal text-white px-6 py-2 rounded-lg">Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg pb-20 relative font-sans">
      
      <QuizModal />

      {/* Celebration Modal */}
      {celebrationData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-bounce-in border-4 border-pink-400/30">
                <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
                        <i className="fas fa-heart text-5xl text-white"></i>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{celebrationData.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{celebrationData.message}</p>
                    <button onClick={() => setCelebrationData(null)} className="w-full bg-gradient-to-r from-brand-pink to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">Continue</button>
                </div>
            </div>
        </div>
      )}

      {/* Hero & Search Section */}
      <section className="relative pt-10 pb-16 px-4 flex flex-col items-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-pink/10 to-transparent"></div>
          <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-purple-300/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-brand-pink/20 rounded-full blur-[80px]"></div>

          <div className="text-center max-w-3xl mx-auto mb-8 animate-fade-in-up">
              <div className="inline-flex bg-white dark:bg-dark-mode-card-bg p-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                  <button onClick={() => setSearchMode('standard')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${searchMode === 'standard' ? 'bg-brand-pink text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}`}>Standard Match</button>
                  <button onClick={() => setSearchMode('cosmic')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${searchMode === 'cosmic' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'}`}><i className="fas fa-moon"></i> Cosmic</button>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                  Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-purple-600">Perfect Connection</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                  {searchMode === 'standard' ? "Connect with people who match your vibe, values, and goals." : "Explore compatibility through your social circle and the stars."}
              </p>
          </div>

          {/* Search Container */}
          <div className="w-full max-w-5xl relative z-20 animate-fade-in-up delay-100">
              <div className={`bg-white dark:bg-dark-mode-card-bg rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 p-3 transition-colors duration-500 ${searchMode === 'cosmic' ? 'border-indigo-200 dark:border-indigo-900' : ''}`}>
                  
                  {searchMode === 'standard' ? (
                      // STANDARD SEARCH BAR
                      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-700">
                          {/* 1. Description Input */}
                          <div className="flex-grow relative group p-2 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors cursor-text">
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 group-focus-within:text-brand-pink transition-colors">Describe Ideal Match</label>
                              <div className="flex items-center">
                                  <i className="fas fa-magic text-gray-300 group-focus-within:text-brand-pink mr-3 text-lg transition-colors"></i>
                                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white font-bold text-lg placeholder-gray-300 focus:ring-0" placeholder="Kind, adventurous, loves books..." />
                              </div>
                          </div>

                          {/* 2. Goal Dropdown */}
                          <div className="lg:w-1/4 relative group p-2 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer">
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 group-focus-within:text-purple-500 transition-colors">Goal</label>
                              <div className="flex items-center">
                                  <i className="fas fa-bullseye text-gray-300 group-focus-within:text-purple-500 mr-3 text-lg transition-colors"></i>
                                  <select value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value as RelationshipGoal)} className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white font-bold text-lg focus:ring-0 cursor-pointer appearance-none">
                                      {relationshipOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                  </select>
                              </div>
                          </div>

                          {/* 3. Vibe Dropdown */}
                          <div className="lg:w-1/5 relative group p-2 lg:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl transition-colors cursor-pointer">
                              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 group-focus-within:text-blue-500 transition-colors">Vibe</label>
                              <div className="flex items-center">
                                  <i className="fas fa-icons text-gray-300 group-focus-within:text-blue-500 mr-3 text-lg transition-colors"></i>
                                  <select value={selectedVibe} onChange={(e) => setSelectedVibe(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white font-bold text-lg focus:ring-0 cursor-pointer appearance-none">
                                      <option value="">Any</option>
                                      {vibeOptions.map(v => <option key={v} value={v}>{v}</option>)}
                                  </select>
                              </div>
                          </div>

                          {/* Search Button */}
                          <div className="p-2 lg:p-2 flex items-center justify-center lg:justify-end">
                              <button onClick={handleStandardSearch} disabled={loadingDating} className="w-full lg:w-auto aspect-square h-16 rounded-2xl bg-gradient-to-br from-brand-pink to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center text-2xl group disabled:opacity-70 disabled:scale-100">
                                  {loadingDating ? <LoadingSpinner /> : <i className="fas fa-search group-hover:rotate-90 transition-transform duration-300"></i>}
                              </button>
                          </div>
                      </div>
                  ) : (
                      // COSMIC SEARCH BAR
                      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-700 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-[1.5rem]">
                          <div className="flex-grow p-4 relative group">
                              <label className="block text-xs font-bold text-indigo-400 uppercase mb-1">Name Filter (Optional)</label>
                              <div className="flex gap-2">
                                  <input type="text" value={astroName} onChange={(e) => setAstroName(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white font-bold text-lg focus:ring-0" placeholder="e.g. 'Sarah' (FB Friend)" />
                                  <button onClick={handleImportSocialData} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 whitespace-nowrap" title="Import from connected accounts"><i className="fas fa-sync-alt"></i> Auto-fill</button>
                              </div>
                          </div>
                          <div className="lg:w-1/4 p-4 relative group">
                              <label className="block text-xs font-bold text-indigo-400 uppercase mb-1">Birth Date</label>
                              <input type="date" value={astroBirthDate} onChange={(e) => setAstroBirthDate(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white font-bold text-lg focus:ring-0" />
                          </div>
                          <div className="lg:w-1/5 p-4 relative group">
                              <label className="block text-xs font-bold text-indigo-400 uppercase mb-1">Lucky #</label>
                              <input type="number" value={astroLuckyNumber} onChange={(e) => setAstroLuckyNumber(e.target.value)} className="w-full bg-transparent border-none p-0 text-gray-900 dark:text-white font-bold text-lg focus:ring-0" placeholder="7" />
                          </div>
                          <div className="p-2 flex items-center justify-center">
                              <button onClick={handleCosmicSearch} disabled={loadingDating} className="w-full lg:w-auto h-16 px-6 rounded-2xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all font-bold flex items-center gap-2 disabled:opacity-70">
                                  {loadingDating ? <LoadingSpinner /> : <><i className="fas fa-star"></i> Scan</>}
                              </button>
                          </div>
                      </div>
                  )}
              </div>

              {/* Quick Tags / Quiz Trigger */}
              {searchMode === 'standard' && (
                  <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in">
                      {activityTags.map((tag, idx) => (
                          <button key={idx} onClick={() => handleQuickSelect(tag)} className="px-4 py-2 rounded-full bg-white dark:bg-dark-mode-card-bg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-brand-pink hover:text-brand-pink transition-all shadow-sm">
                              {tag.label}
                          </button>
                      ))}
                      <button onClick={() => setIsQuizOpen(true)} className="px-4 py-2 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-sm font-bold text-brand-pink hover:bg-brand-pink hover:text-white transition-all shadow-sm flex items-center gap-2">
                          <i className="fas fa-magic"></i> Dream Date Quiz
                      </button>
                  </div>
              )}
          </div>
      </section>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4">
        {errorDating && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-6 py-4 rounded-xl mb-8 flex items-center shadow-sm animate-fade-in">
              <i className="fas fa-exclamation-circle mr-3 text-xl"></i>
              <div><strong className="font-bold block">Matchmaking Error</strong><span className="text-sm">{errorDating}</span></div>
            </div>
        )}

        {datingMatches && datingMatches.length > 0 ? (
            <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-8">
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your {searchMode === 'cosmic' ? 'Cosmic' : 'Top'} Matches</h2>
                   <span className={`text-white px-3 py-1 rounded-full text-xs font-bold ${searchMode === 'cosmic' ? 'bg-indigo-600' : 'bg-brand-pink'}`}>{datingMatches.length} Found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {datingMatches.map(match => (
                      <DatingMatchCard 
                         key={match.id}
                         match={match}
                         allUsers={allUsers}
                         currentUser={currentUser}
                         onViewProfile={handleViewProfile}
                         onSendRequest={handleConnectWithReward}
                      />
                   ))}
                </div>
            </div>
        ) : (
             !loadingDating && (
                 <div className="text-center py-20 bg-white dark:bg-dark-mode-card-bg rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in opacity-70">
                    <div className="bg-gray-50 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-3xl">
                       <i className={`far ${searchMode === 'cosmic' ? 'fa-star' : 'fa-heart'}`}></i>
                    </div>
                    <p className="text-gray-400 font-bold text-lg">Ready to find love?</p>
                    <p className="text-gray-400 text-sm">Use the search bar or take the quiz to start.</p>
                 </div>
             )
        )}
      </div>
    </div>
  );
};
