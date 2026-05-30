
import React, { useState } from 'react';
import { User, Interest } from '../types';
import { mockInterests, mockUsers, COUNTRIES, CITIES_BY_COUNTRY, LANGUAGES, RELIGIONS, POLITICAL_VIEWS, PHILOSOPHIES } from '../constants';

interface OnboardingModalProps {
  user: User;
  onComplete: (updatedData: Partial<User>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [locationData, setLocationData] = useState({
    country: '',
    city: '',
    language: '',
    religion: '',
    politicalView: '',
    philosophy: ''
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [friendsToAdd, setFriendsToAdd] = useState<string[]>([]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleComplete = () => {
    onComplete({
      ...locationData,
      interests: selectedInterests,
      friends: [...user.friends, ...friendsToAdd],
      hasCompletedOnboarding: true
    });
  };

  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      setSelectedInterests(selectedInterests.filter(i => i !== name));
    } else {
      setSelectedInterests([...selectedInterests, name]);
    }
  };

  const toggleFriend = (id: string) => {
    if (friendsToAdd.includes(id)) {
      setFriendsToAdd(friendsToAdd.filter(f => f !== id));
    } else {
      setFriendsToAdd([...friendsToAdd, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2">
          <div className="bg-primary-teal h-2 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>

        <div className="p-8 overflow-y-auto">
          {/* Step 1: Welcome & Location */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="mb-4">
                <i className="fas fa-hand-sparkles text-5xl text-primary-teal"></i>
              </div>
              <h2 className="text-2xl font-heading font-bold text-dark-text dark:text-dark-mode-text">Welcome to Welldone!</h2>
              <p className="text-text-base dark:text-dark-mode-text-base">Let's get to know where you are from.</p>
              
              <div className="space-y-4 text-left mt-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-dark-text dark:text-dark-mode-text">Country</label>
                  <select 
                    className="w-full p-3 rounded-lg border dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white"
                    value={locationData.country}
                    onChange={(e) => setLocationData({...locationData, country: e.target.value, city: ''})}
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-dark-text dark:text-dark-mode-text">City</label>
                  <select 
                    className="w-full p-3 rounded-lg border dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white"
                    value={locationData.city}
                    onChange={(e) => setLocationData({...locationData, city: e.target.value})}
                    disabled={!locationData.country}
                  >
                    <option value="">Select City</option>
                    {locationData.country && CITIES_BY_COUNTRY[locationData.country]?.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-dark-text dark:text-dark-mode-text">Primary Language</label>
                  <select 
                    className="w-full p-3 rounded-lg border dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white"
                    value={locationData.language}
                    onChange={(e) => setLocationData({...locationData, language: e.target.value})}
                  >
                    <option value="">Select Language</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Identity & Views */}
          {step === 2 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-heading font-bold text-dark-text dark:text-dark-mode-text">Your Identity</h2>
              <p className="text-text-base dark:text-dark-mode-text-base">Help us find your tribe.</p>
              
              <div className="space-y-4 text-left mt-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-dark-text dark:text-dark-mode-text">Religion / Spirituality</label>
                  <select 
                    className="w-full p-3 rounded-lg border dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white"
                    value={locationData.religion}
                    onChange={(e) => setLocationData({...locationData, religion: e.target.value})}
                  >
                    <option value="">Select Belief System</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-dark-text dark:text-dark-mode-text">Political View</label>
                  <select 
                    className="w-full p-3 rounded-lg border dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white"
                    value={locationData.politicalView}
                    onChange={(e) => setLocationData({...locationData, politicalView: e.target.value})}
                  >
                    <option value="">Select Political View</option>
                    {POLITICAL_VIEWS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-dark-text dark:text-dark-mode-text">Philosophical Outlook</label>
                  <select 
                    className="w-full p-3 rounded-lg border dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white"
                    value={locationData.philosophy}
                    onChange={(e) => setLocationData({...locationData, philosophy: e.target.value})}
                  >
                    <option value="">Select Philosophy</option>
                    {PHILOSOPHIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-heading font-bold text-dark-text dark:text-dark-mode-text">What moves you?</h2>
              <p className="text-text-base dark:text-dark-mode-text-base">Select topics you are interested in.</p>
              
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {mockInterests.map(interest => (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.name)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedInterests.includes(interest.name)
                        ? 'bg-primary-teal text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Add Friends */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-heading font-bold text-dark-text dark:text-dark-mode-text">Build your Circle</h2>
              <p className="text-text-base dark:text-dark-mode-text-base">Here are some people you might want to connect with.</p>
              
              <div className="space-y-3 mt-4 text-left max-h-60 overflow-y-auto pr-2">
                {mockUsers.filter(u => u.id !== user.id).map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-mode-input-bg rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-sm text-dark-text dark:text-dark-mode-text">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.occupation || 'Member'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFriend(u.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        friendsToAdd.includes(u.id) ? 'bg-primary-teal text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                      }`}
                    >
                      <i className={`fas ${friendsToAdd.includes(u.id) ? 'fa-check' : 'fa-plus'}`}></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Tour & Complete */}
          {step === 5 && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-heading font-bold text-dark-text dark:text-dark-mode-text">You're All Set!</h2>
              <p className="text-text-base dark:text-dark-mode-text-base">Here's a quick look at what you can do:</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <i className="fas fa-plane text-2xl text-blue-500 mb-2"></i>
                  <h3 className="font-bold text-sm dark:text-white">Travel Diary</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Document your journeys.</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <i className="fas fa-bullseye text-2xl text-green-500 mb-2"></i>
                  <h3 className="font-bold text-sm dark:text-white">Goals</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Track your progress.</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <i className="fas fa-robot text-2xl text-purple-500 mb-2"></i>
                  <h3 className="font-bold text-sm dark:text-white">AI Partner</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Get personalized advice.</p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <i className="fas fa-users text-2xl text-pink-500 mb-2"></i>
                  <h3 className="font-bold text-sm dark:text-white">Community</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Connect & Share.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 dark:bg-dark-mode-input-bg flex justify-between">
          {step > 1 ? (
            <button onClick={handleBack} className="px-6 py-2 text-gray-600 dark:text-gray-300 font-semibold">Back</button>
          ) : (
            <div></div>
          )}
          
          {step < 5 ? (
            <button onClick={handleNext} className="bg-primary-teal text-white px-6 py-2 rounded-lg font-semibold hover:bg-secondary-mint transition-colors">Next</button>
          ) : (
            <button onClick={handleComplete} className="bg-primary-teal text-white px-8 py-2 rounded-lg font-bold hover:bg-secondary-mint transition-colors shadow-lg">Get Started</button>
          )}
        </div>
      </div>
    </div>
  );
};
