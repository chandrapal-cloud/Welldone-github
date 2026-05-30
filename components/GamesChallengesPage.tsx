
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { ChallengeCard } from './ChallengeCard';
import { Challenge, ShareContentResult } from '../types';
import { ShareModal } from './ShareModal';
import { generateShareContent } from '../services/geminiService';

// --- Mini-Game Data & Types ---

type GameType = 'empathy' | 'compass' | null;

interface EmpathyScenario {
  id: number;
  text: string;
  context: string;
  options: { text: string; isCorrect: boolean; feedback: string }[];
}

const empathyScenarios: EmpathyScenario[] = [
  {
    id: 1,
    context: "Your partner comes home, slams the door, and goes straight to the bedroom without saying hello.",
    text: "What is the most empathetic interpretation of this behavior?",
    options: [
      { text: "They are angry at me and being passive-aggressive.", isCorrect: false, feedback: "This assumes malice. Try to consider external factors." },
      { text: "They are overwhelmed or had a bad day and need a moment to decompress.", isCorrect: true, feedback: "Correct! Recognizing potential overwhelm shows deep empathy." },
      { text: "They don't love me anymore.", isCorrect: false, feedback: "This is a catastrophizing thought. Try to stay grounded." }
    ]
  },
  {
    id: 2,
    context: "A close friend cancels plans with you for the third time this month.",
    text: "How do you respond with 'Secure Attachment' love behavior?",
    options: [
      { text: "Ignore them for a week so they know how it feels.", isCorrect: false, feedback: "This is 'Protest Behavior' typical of anxious attachment." },
      { text: "Send a text: 'Is everything okay? I miss you, but I understand if you're busy. Let me know when you can talk.'", isCorrect: true, feedback: "Correct! This expresses needs without blame and offers support." },
      { text: "Assume they hate you and block them.", isCorrect: false, feedback: "This is a defensive reaction. Try to communicate openly." }
    ]
  },
  {
    id: 3,
    context: "Your partner is excited about a hobby you find boring.",
    text: "How do you show love in this moment?",
    options: [
      { text: "Tell them it's not worth the time.", isCorrect: false, feedback: "Dismissiveness hurts connection." },
      { text: "Nod silently while checking your phone.", isCorrect: false, feedback: "Passive listening doesn't build intimacy." },
      { text: "Ask questions and listen to their excitement, even if the topic isn't for you.", isCorrect: true, feedback: "Correct! You are validating their joy, which is a powerful act of love." }
    ]
  }
];

interface CompassQuestion {
  id: number;
  question: string;
  choices: { text: string; score: number; outcome: string }[];
}

const compassQuestions: CompassQuestion[] = [
  {
    id: 1,
    question: "You feel neglected because your partner has been working late every night.",
    choices: [
      { text: "Accuse them of caring about work more than you.", score: 0, outcome: "Conflict Escalated. Accusations usually trigger defensiveness." },
      { text: "Say nothing and withdraw affection.", score: 0, outcome: "Distance Created. The 'Silent Treatment' damages trust." },
      { text: "Say: 'I feel lonely when we don't spend time together. Can we schedule a date night?'", score: 10, outcome: "Connection Built. You expressed a vulnerable feeling and a concrete need." }
    ]
  },
  {
    id: 2,
    question: "Your friend gives you a gift you don't really like.",
    choices: [
      { text: "Pretend to love it enthusiastically.", score: 5, outcome: "Polite, but slightly inauthentic. It keeps peace but hides your true self." },
      { text: "Say: 'Thank you for thinking of me. I really appreciate the gesture.'", score: 10, outcome: "Graceful & Honest. You acknowledged the love behind the gift." },
      { text: "Tell them it's not your style and ask for the receipt.", score: 2, outcome: "Brutal Honesty. While honest, it may hurt feelings unnecessarily." }
    ]
  }
];

export const GamesChallengesPage: React.FC = () => {
  const context = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'games' | 'challenges'>('games');
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareContent, setShareContent] = useState<ShareContentResult | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareItemTitle, setShareItemTitle] = useState('');

  // Celebration State
  const [celebrationData, setCelebrationData] = useState<{ name: string; reward: string } | null>(null);

  // Empathy Game State
  const [currentEmpathyIndex, setCurrentEmpathyIndex] = useState(0);
  const [empathyFeedback, setEmpathyFeedback] = useState<string | null>(null);
  const [empathyScore, setEmpathyScore] = useState(0);

  // Compass Game State
  const [currentCompassIndex, setCurrentCompassIndex] = useState(0);
  const [compassOutcome, setCompassOutcome] = useState<string | null>(null);
  const [compassTotalScore, setCompassTotalScore] = useState(0);

  if (!context) return null;
  const { allChallenges, handleJoin, currentUser, awardVirtualCurrency } = context;

  // Derive selected challenge from ID
  const selectedChallenge = allChallenges.find(c => c.id === selectedChallengeId);

  // Helper to get progress based on goal name matching challenge name
  const getChallengeProgress = (challenge: Challenge) => {
    if (!currentUser) return 0;
    // Simple logic: check if a goal exists with the same name as the challenge
    const goal = currentUser.goals.find(g => g.name === challenge.name);
    return goal ? goal.progress : 0;
  };

  const handleShareChallenge = async (challenge: Challenge) => {
    setShareItemTitle(`Share "${challenge.name}"`);
    setIsShareModalOpen(true);
    setShareLoading(true);
    setShareError(null);
    setShareContent(null);
    try {
        const content = await generateShareContent('challenge', challenge);
        setShareContent(content);
    } catch (err) {
        setShareError("Failed to generate share content. Please try again.");
    } finally {
        setShareLoading(false);
    }
  };

  const handleJoinWithCelebration = (challenge: Challenge) => {
    handleJoin('challenge', challenge.id);
    awardVirtualCurrency(1000);
    setSelectedChallengeId(null); // Close details modal if open
    setCelebrationData({ name: challenge.name, reward: challenge.reward });
  };

  // --- Game Logic ---
  const handleEmpathyChoice = (isCorrect: boolean, feedback: string) => {
    setEmpathyFeedback(feedback);
    if (isCorrect) setEmpathyScore(prev => prev + 1);
  };

  const nextEmpathyScenario = () => {
    setEmpathyFeedback(null);
    if (currentEmpathyIndex < empathyScenarios.length - 1) {
      setCurrentEmpathyIndex(prev => prev + 1);
    } else {
      alert(`Game Over! You scored ${empathyScore} out of ${empathyScenarios.length}`);
      setCurrentEmpathyIndex(0);
      setEmpathyScore(0);
      setActiveGame(null);
    }
  };

  const handleCompassChoice = (score: number, outcome: string) => {
    setCompassOutcome(outcome);
    setCompassTotalScore(prev => prev + score);
  };

  const nextCompassQuestion = () => {
    setCompassOutcome(null);
    if (currentCompassIndex < compassQuestions.length - 1) {
      setCurrentCompassIndex(prev => prev + 1);
    } else {
      alert(`Journey Complete! Your Relationship Health Score: ${compassTotalScore + 10} points.`);
      setCurrentCompassIndex(0);
      setCompassTotalScore(0);
      setActiveGame(null);
    }
  };

  const resetGames = () => {
    setActiveGame(null);
    setCurrentEmpathyIndex(0);
    setEmpathyFeedback(null);
    setEmpathyScore(0);
    setCurrentCompassIndex(0);
    setCompassOutcome(null);
    setCompassTotalScore(0);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto relative min-h-screen">
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        loading={shareLoading}
        content={shareContent}
        error={shareError}
        title={shareItemTitle}
      />

      {/* Header Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-dark-mode-card-bg rounded-full p-1 shadow-md inline-flex">
          <button
            onClick={() => setActiveTab('games')}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeTab === 'games'
                ? 'bg-primary-teal text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Mind & Heart Games
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeTab === 'challenges'
                ? 'bg-primary-teal text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Active Challenges
          </button>
        </div>
      </div>

      {/* --- CONTENT: GAMES TAB --- */}
      {activeTab === 'games' && (
        <div className="animate-fade-in-up">
          {!activeGame ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-pink-500 to-rose-400 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center group"
                   onClick={() => setActiveGame('empathy')}>
                <div className="bg-white/20 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-heart text-5xl"></i>
                </div>
                <h3 className="text-3xl font-black mb-3">Empathy Echo</h3>
                <p className="mb-8 opacity-90 text-lg">Test your emotional intelligence. Can you decode the hidden feelings behind behavior?</p>
                <button className="bg-white text-rose-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                  Play Now
                </button>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center group"
                   onClick={() => setActiveGame('compass')}>
                <div className="bg-white/20 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <i className="fas fa-compass text-5xl"></i>
                </div>
                <h3 className="text-3xl font-black mb-3">The Love Compass</h3>
                <p className="mb-8 opacity-90 text-lg">Navigate tricky relationship scenarios. Your choices determine the health of your bond.</p>
                <button className="bg-white text-indigo-500 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                  Play Now
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <button 
                onClick={resetGames} 
                className="mb-6 text-gray-500 dark:text-gray-300 hover:text-primary-teal dark:hover:text-primary-teal-dark flex items-center font-bold"
              >
                <i className="fas fa-arrow-left mr-2"></i> Back to Games
              </button>

              {activeGame === 'empathy' && (
                <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-xl p-8 border-t-8 border-rose-400 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                     <span className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-sm font-bold">Level {currentEmpathyIndex + 1}/{empathyScenarios.length}</span>
                     <span className="text-dark-text dark:text-dark-mode-text font-bold">Score: {empathyScore}</span>
                  </div>
                  
                  <h3 className="text-xl text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide text-sm font-bold">The Scenario</h3>
                  <p className="text-2xl font-bold text-dark-text dark:text-dark-mode-text mb-8 leading-snug">
                    "{empathyScenarios[currentEmpathyIndex].context}"
                  </p>
                  
                  <p className="text-lg text-primary-teal dark:text-primary-teal-dark mb-6 font-semibold">
                    {empathyScenarios[currentEmpathyIndex].text}
                  </p>

                  <div className="space-y-4">
                    {empathyScenarios[currentEmpathyIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => !empathyFeedback && handleEmpathyChoice(option.isCorrect, option.feedback)}
                        disabled={!!empathyFeedback}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 text-lg ${
                          empathyFeedback 
                            ? option.isCorrect 
                                ? 'bg-green-50 border-green-500 text-green-800'
                                : 'bg-gray-50 border-gray-200 text-gray-400' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-gray-800 text-dark-text dark:text-dark-mode-text'
                        }`}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>

                  {empathyFeedback && (
                    <div className="mt-8 animate-fade-in">
                      <div className={`p-6 rounded-2xl mb-6 ${empathyFeedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <p className="font-black text-xl mb-2">{empathyFeedback.includes('Correct') ? 'Great Job!' : 'Not quite...'}</p>
                        <p>{empathyFeedback}</p>
                      </div>
                      <button 
                        onClick={nextEmpathyScenario}
                        className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-colors shadow-lg"
                      >
                        Next Scenario
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeGame === 'compass' && (
                <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-xl p-8 border-t-8 border-indigo-500 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                     <span className="bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold">Scenario {currentCompassIndex + 1}/{compassQuestions.length}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-dark-text dark:text-dark-mode-text mb-8 leading-snug">
                    {compassQuestions[currentCompassIndex].question}
                  </h3>

                  <div className="grid gap-4">
                    {compassQuestions[currentCompassIndex].choices.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={() => !compassOutcome && handleCompassChoice(choice.score, choice.outcome)}
                        disabled={!!compassOutcome}
                        className="text-left p-5 rounded-2xl bg-gray-50 dark:bg-dark-mode-input-bg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 border border-transparent hover:border-indigo-300 text-dark-text dark:text-dark-mode-text text-lg"
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>

                  {compassOutcome && (
                    <div className="mt-8 animate-fade-in bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                      <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">Outcome:</h4>
                      <p className="text-lg text-dark-text dark:text-dark-mode-text mb-6">{compassOutcome}</p>
                      <button 
                        onClick={nextCompassQuestion}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
                      >
                        Continue Journey
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- CONTENT: CHALLENGES TAB --- */}
      {activeTab === 'challenges' && (
        <div className="animate-fade-in-up">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-dark-text dark:text-dark-mode-text mb-4">Community Challenges</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of others in these collective goals. Click on a challenge to see details, track progress, or invite friends!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={() => handleJoinWithCelebration(challenge)}
                isJoined={currentUser ? challenge.participants.includes(currentUser.id) : false}
                onClick={() => setSelectedChallengeId(challenge.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Celebration Modal (Immediate Reward) */}
      {celebrationData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl animate-bounce-in border-4 border-yellow-400/30">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                     <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-yellow-300 rounded-full blur-xl opacity-50"></div>
                     <div className="absolute bottom-[-20px] right-[-20px] w-20 h-20 bg-purple-300 rounded-full blur-xl opacity-50"></div>
                </div>

                <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
                        <i className="fas fa-trophy text-5xl text-white"></i>
                    </div>
                    
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Challenge Accepted!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You've committed to <span className="font-bold text-primary-teal">{celebrationData.name}</span>
                    </p>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-4 border border-yellow-200 dark:border-yellow-700">
                        <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide mb-1">Immediate Reward</p>
                        <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400 font-black text-2xl">
                            <i className="fas fa-coins"></i> <span>+1000 Coins</span>
                        </div>
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">Use these for premium plans & shop!</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-mode-input-bg rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Completion Reward</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{celebrationData.reward}</p>
                    </div>

                    <button 
                        onClick={() => setCelebrationData(null)}
                        className="w-full bg-gradient-to-r from-primary-teal to-brand-blue text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                    >
                        Let's Do This!
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Challenge Details Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedChallengeId(null)}>
          <div 
            className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all border border-gray-100 dark:border-gray-700"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img src={selectedChallenge.image} alt={selectedChallenge.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <button 
                onClick={() => setSelectedChallengeId(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-3xl font-black text-white shadow-sm leading-tight mb-1">{selectedChallenge.name}</h3>
                <p className="text-white/80 font-medium">Join the movement</p>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-gray-600 dark:text-dark-mode-text-base mb-8 text-lg leading-relaxed">{selectedChallenge.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-yellow-100 dark:border-yellow-900/30">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center mb-2 text-yellow-600">
                        <i className="fas fa-trophy text-xl"></i>
                    </div>
                    <span className="text-xs uppercase font-bold text-yellow-700 dark:text-yellow-400 tracking-wide mb-1">Reward</span>
                    <span className="font-bold text-dark-text dark:text-dark-mode-text">{selectedChallenge.reward}</span>
                 </div>
                 <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center border border-teal-100 dark:border-teal-900/30">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-2 text-teal-600">
                        <i className="fas fa-users text-xl"></i>
                    </div>
                    <span className="text-xs uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wide mb-1">Participants</span>
                    <span className="font-bold text-dark-text dark:text-dark-mode-text">{selectedChallenge.participants.length}</span>
                 </div>
              </div>

              {currentUser && selectedChallenge.participants.includes(currentUser.id) && (
                <div className="mb-8 bg-gray-50 dark:bg-dark-mode-input-bg p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Your Progress</span>
                    <span className="text-2xl font-black text-brand-teal">{getChallengeProgress(selectedChallenge)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-brand-teal to-secondary-mint h-4 rounded-full transition-all duration-1000 ease-out relative" 
                      style={{ width: `${getChallengeProgress(selectedChallenge)}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-500 mt-3 font-medium">
                    {getChallengeProgress(selectedChallenge) === 100 ? "🎉 Challenge Completed! Reward Unlocked." : "Keep pushing! You're doing great."}
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                {!selectedChallenge.participants.includes(currentUser?.id || '') ? (
                  <button 
                    onClick={() => handleJoinWithCelebration(selectedChallenge)}
                    className="flex-1 bg-gradient-to-r from-primary-teal to-brand-blue hover:from-teal-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
                  >
                    Accept Challenge
                  </button>
                ) : (
                  <button disabled className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-bold py-4 px-6 rounded-xl cursor-not-allowed border border-gray-200 dark:border-gray-600">
                    <i className="fas fa-check mr-2"></i> Challenge Active
                  </button>
                )}
                
                <button 
                  onClick={() => handleShareChallenge(selectedChallenge)}
                  className="px-6 py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-teal dark:hover:text-white transition-colors"
                  title="Share"
                >
                  <i className="fas fa-share-alt text-xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
