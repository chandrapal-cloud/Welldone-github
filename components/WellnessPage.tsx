
import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { MoodEntry, Article, Reel, ActivityUpdate } from '../types';
import { generateDailyWellnessBlog } from '../services/geminiService';
import { MOCK_COMMUNITY_PULSE } from '../constants';

export const WellnessPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reflections' | 'library' | 'reels' | 'practice'>('reflections');

  // --- Hero Carousel State ---
  const [currentHero, setCurrentHero] = useState(0);

  // --- Reflections State ---
  const [waterCount, setWaterCount] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');

  // --- Practice State ---
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  if (!context) return null;
  const { currentUser, wellnessBanners, logWellnessEntry } = context;

  // Auto-scroll Hero
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentHero(prev => (prev + 1) % wellnessBanners.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [wellnessBanners.length]);

  // Breathing Loop
  useEffect(() => {
      let timeout: any;
      if (isBreathingActive) {
          if (breathingPhase === 'inhale') timeout = setTimeout(() => setBreathingPhase('hold'), 4000);
          else if (breathingPhase === 'hold') timeout = setTimeout(() => setBreathingPhase('exhale'), 4000);
          else if (breathingPhase === 'exhale') timeout = setTimeout(() => setBreathingPhase('inhale'), 4000);
      }
      return () => clearTimeout(timeout);
  }, [isBreathingActive, breathingPhase]);

  const HeroCarousel = () => (
      <div className="relative h-[400px] w-full rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl group">
          {wellnessBanners.map((banner, idx) => (
              <div key={banner.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentHero ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  {banner.mediaType === 'video' ? (
                      <video src={banner.mediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                      <img src={banner.mediaUrl} alt={banner.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex flex-col justify-center px-12 md:px-20">
                      <h2 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg tracking-tight animate-fade-in-up">{banner.title}</h2>
                      <p className="text-xl text-white/90 max-w-lg mb-8 drop-shadow-md animate-fade-in-up delay-100">{banner.subtitle}</p>
                      <button className="bg-brand-teal text-white px-8 py-3 rounded-full font-bold w-max shadow-lg hover:scale-105 transition-transform animate-fade-in-up delay-200">Start Journey</button>
                  </div>
              </div>
          ))}
          <div className="absolute bottom-6 right-12 z-20 flex gap-2">
              {wellnessBanners.map((_, i) => (
                  <button key={i} onClick={() => setCurrentHero(i)} className={`w-3 h-3 rounded-full transition-all ${currentHero === i ? 'bg-brand-teal w-8' : 'bg-white/50'}`} />
              ))}
          </div>
      </div>
  );

  const ReflectionsView = () => (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-dark-mode-card-bg rounded-[2.5rem] p-10 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">Daily Reflections</h3>
                  <div className="text-sm font-bold text-brand-teal uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                      <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 block">Mood Check-in</label>
                          <div className="grid grid-cols-5 gap-3">
                              {['😊', '😌', '😴', '😫', '🤩'].map(emoji => (
                                  <button key={emoji} onClick={() => setSelectedMood(emoji)} className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all ${selectedMood === emoji ? 'bg-brand-teal shadow-lg scale-110' : 'bg-gray-50 dark:bg-dark-mode-input-bg hover:bg-gray-100'}`}>{emoji}</button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 block">Hydration ({waterCount} glasses)</label>
                          <div className="flex gap-2">
                              {[1,2,3,4,5,6,7,8].map(i => (
                                  <button key={i} onClick={() => setWaterCount(i)} className={`flex-1 h-8 rounded-lg transition-all ${i <= waterCount ? 'bg-blue-500 shadow-md' : 'bg-gray-100 dark:bg-dark-mode-input-bg'}`} />
                              ))}
                          </div>
                      </div>
                  </div>
                  <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 block">Personal Note</label>
                      <textarea value={note} onChange={e => setNote(e.target.value)} rows={5} placeholder="Write something from the heart..." className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-dark-mode-input-bg border-none focus:ring-2 focus:ring-brand-teal/20 outline-none italic"></textarea>
                  </div>
              </div>
              <button onClick={() => { logWellnessEntry({ date: new Date().toISOString().split('T')[0], mood: selectedMood, water: waterCount, sleep: sleepHours, note }); alert("Saved."); }} className="w-full mt-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-transform">Complete Reflection</button>
          </div>
      </div>
  );

  const PracticeView = () => (
      <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in flex flex-col items-center">
          <div className="relative mb-16">
              <div className={`w-72 h-72 rounded-[3rem] border-8 border-brand-teal/20 flex flex-center transition-all duration-[4000ms] ease-in-out flex items-center justify-center ${
                  isBreathingActive ? (breathingPhase === 'inhale' ? 'scale-125 bg-brand-teal/10' : breathingPhase === 'hold' ? 'scale-125 bg-brand-teal/20' : 'scale-100 bg-transparent') : ''
              }`}>
                  <span className="text-3xl font-black text-brand-teal uppercase tracking-[0.3em]">{isBreathingActive ? breathingPhase : 'Box Breathing'}</span>
              </div>
              {isBreathingActive && (
                  <div className="absolute -inset-4 border border-brand-teal/30 rounded-[3.5rem] animate-ping" />
              )}
          </div>
          <p className="text-gray-500 mb-8 max-w-sm">Use this 4-4-4 rhythm to lower cortisol and instantly calm your nervous system.</p>
          <button onClick={() => setIsBreathingActive(!isBreathingActive)} className={`px-12 py-4 rounded-2xl font-black text-lg shadow-xl transition-all ${isBreathingActive ? 'bg-red-500 text-white' : 'bg-brand-teal text-white hover:scale-105'}`}>
              {isBreathingActive ? 'Stop Session' : 'Start Practice'}
          </button>
      </div>
  );

  const LibraryView = () => (
      <div className="space-y-12 animate-fade-in">
          {/* Featured magazine spotlight */}
          <div className="relative h-[450px] w-full rounded-[3rem] overflow-hidden shadow-2xl group cursor-pointer">
              <img src="https://picsum.photos/seed/mag/1200/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 max-w-xl text-white">
                  <span className="bg-brand-pink text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block shadow-lg">Featured Article</span>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">Finding Zen in the Digital Chaos</h3>
                  <p className="text-gray-300 mb-6 font-light leading-relaxed">Discover why the world is turning back to analog practices for mental clarity in 2024.</p>
                  <button className="flex items-center gap-2 font-bold hover:gap-4 transition-all">Read Full Story <i className="fas fa-arrow-right"></i></button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {['Mindfulness', 'Nutrition', 'Sleep'].map(cat => (
                  <div key={cat} className="space-y-6">
                      <h4 className="text-xl font-black border-l-4 border-brand-teal pl-4">{cat}</h4>
                      <div className="space-y-4">
                          {[1,2].map(i => (
                              <div key={i} className="group cursor-pointer">
                                  <div className="h-40 rounded-2xl overflow-hidden mb-3"><img src={`https://picsum.photos/seed/cat${cat}${i}/400/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /></div>
                                  <h5 className="font-bold text-gray-900 dark:text-white leading-snug group-hover:text-brand-teal transition-colors">The Secrets of {cat} and Well-being</h5>
                                  <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">4 min read</p>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg font-sans pb-20">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in relative">
        
        {/* New Hero Section with Wellness ID */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16 items-center">
            <div className="flex-grow">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tighter">Your Sanctuary <span className="text-brand-teal">Awaits.</span></h1>
                <p className="text-xl text-gray-500 max-w-lg">Discover professional wellness services and nurturing practices for a balanced life.</p>
            </div>
            {currentUser && (
                <div className="flex-shrink-0 w-80 bg-white dark:bg-dark-mode-card-bg rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10 flex items-center gap-4 mb-6">
                        <img src={currentUser.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="" />
                        <div>
                            <h4 className="font-black text-lg">{currentUser.name}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-teal">Wellness ID #0012</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-400"><span>Community Rank</span><span className="text-gray-900 dark:text-white">Pro</span></div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="bg-brand-teal h-full w-[70%]" />
                        </div>
                    </div>
                </div>
            )}
        </div>

        <HeroCarousel />

        {/* Community Pulse Section */}
        <div className="bg-white dark:bg-dark-mode-card-bg rounded-[2rem] p-8 mb-16 shadow-lg border border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Community Pulse
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {MOCK_COMMUNITY_PULSE.map(pulse => (
                    <div key={pulse.id} className="flex items-center gap-4 group">
                        <img src={pulse.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                        <div className="flex-grow">
                            <p className="text-sm font-bold"><span className="text-brand-teal">{pulse.user}</span> <span className="font-normal text-gray-500">{pulse.action}</span></p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{pulse.timeAgo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
            <div className="bg-white dark:bg-dark-mode-card-bg p-2 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 inline-flex flex-wrap gap-2">
                {[
                    { id: 'reflections', label: 'Reflection', icon: 'fas fa-pen-nib' },
                    { id: 'practice', label: 'Practice', icon: 'fas fa-heart' },
                    { id: 'library', label: 'Library', icon: 'fas fa-book-open' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-brand-teal text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                        <i className={tab.icon}></i> {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
            {activeTab === 'reflections' && <ReflectionsView />}
            {activeTab === 'practice' && <PracticeView />}
            {activeTab === 'library' && <LibraryView />}
        </div>

      </div>
    </div>
  );
};
