
import React, { useContext, useState, useEffect } from 'react';
import { AppContext, THEME_COLORS } from '../App';
import { useNavigate } from 'react-router-dom';
import { User, UserPreferences } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { LANGUAGES, CURRENCIES } from '../constants';

// --- Sub-Components ---

// Reusable Toggle Switch
const ToggleSwitch: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ label, description, checked, onChange, disabled }) => (
  <div className={`flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 last:border-0 ${disabled ? 'opacity-50' : ''}`}>
    <div className="pr-4">
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{label}</h4>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
    </div>
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-primary-teal' : 'bg-gray-200 dark:bg-gray-600'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// Reusable Input Field
const InputField: React.FC<{
  label: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}> = ({ label, value, type = 'text', onChange, disabled = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary-teal text-gray-900 dark:text-white transition-all ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

// --- Main Settings Page Component ---

export const SettingsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const { currentUser, updateUserProfile, isDarkMode, toggleTheme, themeColor, setThemeColor, allUsers, sendFriendRequest } = context;

  // Tabs
  type Tab = 'account' | 'preferences' | 'notifications' | 'privacy' | 'appearance' | 'integrations' | 'help';
  const [activeTab, setActiveTab] = useState<Tab>('appearance');

  // --- Local State for Forms ---
  
  // Account
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || 'user@example.com'); 
  const [password, setPassword] = useState('');
  
  // Preferences (Default values if not set)
  const [language, setLanguage] = useState(currentUser?.preferences?.language || 'English');
  const [currency, setCurrency] = useState(currentUser?.preferences?.currency || 'USD ($) - US Dollar');
  const [units, setUnits] = useState<'metric' | 'imperial'>(currentUser?.preferences?.units || 'metric');
  const [timezone, setTimezone] = useState(currentUser?.preferences?.timezone || 'UTC');
  
  // Appearance (Local override for preview, committed on save or toggle)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>(currentUser?.preferences?.fontSize || 'medium');
  const [reducedMotion, setReducedMotion] = useState(currentUser?.preferences?.reducedMotion || false);

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(true);
  const [notifFriendReq, setNotifFriendReq] = useState(true);

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataSharing, setDataSharing] = useState(false);

  // Integrations Status
  const [fbConnected, setFbConnected] = useState(!!currentUser?.fbId);
  const [instaConnected, setInstaConnected] = useState(!!currentUser?.instaId);
  const [spotifyConnected, setSpotifyConnected] = useState(!!currentUser?.spotifyId);
  
  // Sync State
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [foundFriends, setFoundFriends] = useState<{source: string, users: User[]} | null>(null);

  // Update local state when user changes
  useEffect(() => {
      if (currentUser) {
          setName(currentUser.name);
          setEmail(currentUser.email);
          setFbConnected(!!currentUser.fbId);
          setInstaConnected(!!currentUser.instaId);
          setSpotifyConnected(!!currentUser.spotifyId);
      }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Please log in to manage your settings.</p>
        <button onClick={() => navigate('/login')} className="bg-primary-teal text-white px-6 py-2 rounded-lg">Login</button>
      </div>
    );
  }

  const handleAccountSave = () => {
    if (currentUser) {
        const updatedUser: User = {
            ...currentUser,
            name: name,
            email: email,
            preferences: {
                ...currentUser.preferences,
                language,
                currency,
                units,
                timezone,
                fontSize,
                reducedMotion,
                contentFilter: currentUser.preferences?.contentFilter || 'moderate'
            }
        };
        updateUserProfile(updatedUser);
        alert("Settings saved successfully!");
    }
  };

  const handleConnectSocial = (platform: 'instagram' | 'facebook' | 'spotify') => {
      setIsSyncing(platform);
      
      // Simulate API delay and finding friends
      setTimeout(() => {
          let updatedUser = { ...currentUser };
          if (platform === 'instagram') {
              setInstaConnected(true);
              updatedUser.instaId = 'linked_insta_123';
          }
          else if (platform === 'facebook') {
              setFbConnected(true);
              updatedUser.fbId = 'linked_fb_123';
          }
          else if (platform === 'spotify') {
              setSpotifyConnected(true);
              updatedUser.spotifyId = 'linked_spotify_123';
          }

          // Persist the link
          updateUserProfile(updatedUser, { silent: true, skipRedirect: true });

          // Mock finding friends for social platforms
          if (platform !== 'spotify') {
              const potentialFriends = allUsers.filter(u => 
                  u.id !== currentUser.id && 
                  !currentUser.friends.includes(u.id) &&
                  (foundFriends?.source !== platform || !foundFriends?.users.some(existing => existing.id === u.id))
              ).slice(0, 3);
              setFoundFriends({ source: platform, users: potentialFriends });
          }
          
          setIsSyncing(null);
      }, 1500);
  };

  const handleDisconnect = (platform: 'instagram' | 'facebook' | 'spotify') => {
      let updatedUser = { ...currentUser };
      if (platform === 'instagram') {
          setInstaConnected(false);
          updatedUser.instaId = undefined;
          if (foundFriends?.source === 'instagram') setFoundFriends(null);
      } else if (platform === 'facebook') {
          setFbConnected(false);
          updatedUser.fbId = undefined;
          if (foundFriends?.source === 'facebook') setFoundFriends(null);
      } else if (platform === 'spotify') {
          setSpotifyConnected(false);
          updatedUser.spotifyId = undefined;
      }
      updateUserProfile(updatedUser, { silent: true, skipRedirect: true });
  };

  const handleInviteUser = (userId: string) => {
      sendFriendRequest(userId);
      if (foundFriends) {
          setFoundFriends({
              ...foundFriends,
              users: foundFriends.users.filter(u => u.id !== userId)
          });
      }
  };

  const menuItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'account', label: 'Account', icon: 'fas fa-user-cog' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-sliders-h' },
    { id: 'appearance', label: 'Appearance', icon: 'fas fa-palette' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'integrations', label: 'Integrations', icon: 'fas fa-link' },
    { id: 'privacy', label: 'Privacy', icon: 'fas fa-lock' },
    { id: 'help', label: 'Help & Support', icon: 'fas fa-question-circle' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg font-sans pb-20 pt-4 md:pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
            <span className="text-xs font-bold bg-primary-teal/10 text-primary-teal px-2 py-1 rounded-full uppercase tracking-wide border border-primary-teal/20">Control Center</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors w-full whitespace-nowrap lg:whitespace-normal ${
                      activeTab === item.id
                        ? 'bg-primary-teal/10 text-primary-teal border-b-2 lg:border-b-0 lg:border-l-4 border-primary-teal'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <i className={`${item.icon} w-6 text-lg ${activeTab === item.id ? 'text-primary-teal' : 'text-gray-400'}`}></i>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow">
            <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 animate-fade-in min-h-[500px]">
              
              {/* --- ACCOUNT TAB --- */}
              {activeTab === 'account' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
                  
                  <div className="space-y-6 max-w-xl">
                    <InputField label="Display Name" value={name} onChange={setName} />
                    <InputField label="Email Address" value={email} onChange={setEmail} />
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                         <h3 className="font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                         <InputField label="New Password" value={password} onChange={setPassword} type="password" />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <button 
                            onClick={handleAccountSave}
                            className="px-6 py-3 bg-primary-teal text-white font-bold rounded-xl shadow-lg hover:bg-secondary-mint transition-all"
                        >
                            Save Changes
                        </button>
                        <button 
                             onClick={() => navigate('/edit-profile')}
                             className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                             Edit Public Profile
                        </button>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="text-red-500 font-bold mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <button className="text-red-500 border border-red-200 bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors">
                            Delete Account
                        </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PREFERENCES TAB (NEW) --- */}
              {activeTab === 'preferences' && (
                  <div className="animate-fade-in">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Global Preferences</h2>
                      <div className="space-y-6 max-w-xl">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Language</label>
                              <select 
                                  value={language} 
                                  onChange={(e) => setLanguage(e.target.value)} 
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary-teal text-gray-900 dark:text-white"
                              >
                                  <option value="">Select Language</option>
                                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                                  <select 
                                      value={currency} 
                                      onChange={(e) => setCurrency(e.target.value)} 
                                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary-teal text-gray-900 dark:text-white"
                                  >
                                      <option value="">Select Currency</option>
                                      {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Units</label>
                                  <select 
                                      value={units} 
                                      onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')} 
                                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary-teal text-gray-900 dark:text-white"
                                  >
                                      <option value="metric">Metric (km, kg)</option>
                                      <option value="imperial">Imperial (mi, lbs)</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                              <select 
                                  value={timezone} 
                                  onChange={(e) => setTimezone(e.target.value)} 
                                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary-teal text-gray-900 dark:text-white"
                              >
                                  <option>UTC</option>
                                  <option>PST (Pacific Standard)</option>
                                  <option>EST (Eastern Standard)</option>
                                  <option>CET (Central European)</option>
                                  <option>JST (Japan Standard)</option>
                              </select>
                          </div>

                          <div className="pt-4">
                              <button 
                                  onClick={handleAccountSave}
                                  className="px-6 py-3 bg-primary-teal text-white font-bold rounded-xl shadow-lg hover:bg-secondary-mint transition-all"
                              >
                                  Save Preferences
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {/* --- NOTIFICATIONS TAB --- */}
              {activeTab === 'notifications' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-2 max-w-2xl">
                    <ToggleSwitch 
                        label="Email Notifications" 
                        description="Receive digests and important updates via email."
                        checked={notifEmail} 
                        onChange={() => setNotifEmail(!notifEmail)} 
                    />
                    <ToggleSwitch 
                        label="Push Notifications" 
                        description="Get real-time alerts on your device."
                        checked={notifPush} 
                        onChange={() => setNotifPush(!notifPush)} 
                    />
                     <ToggleSwitch 
                        label="Friend Requests" 
                        description="Notify me when someone sends a friend request."
                        checked={notifFriendReq} 
                        onChange={() => setNotifFriendReq(!notifFriendReq)} 
                    />
                    <ToggleSwitch 
                        label="Marketing & Tips" 
                        description="Receive wellness tips and promotional offers."
                        checked={notifMarketing} 
                        onChange={() => setNotifMarketing(!notifMarketing)} 
                    />
                  </div>
                </div>
              )}

              {/* --- PRIVACY TAB --- */}
              {activeTab === 'privacy' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy & Security</h2>
                  
                  <div className="mb-8">
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Profile Visibility</label>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['public', 'friends', 'private'].map((option) => (
                             <div 
                                key={option}
                                onClick={() => setProfileVisibility(option)}
                                className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center text-center transition-all ${
                                    profileVisibility === option 
                                    ? 'border-primary-teal bg-primary-teal/5 ring-1 ring-primary-teal' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-teal/50'
                                }`}
                             >
                                <div className={`w-4 h-4 rounded-full border mb-2 flex items-center justify-center ${
                                     profileVisibility === option ? 'border-primary-teal' : 'border-gray-400'
                                }`}>
                                    {profileVisibility === option && <div className="w-2 h-2 rounded-full bg-primary-teal"></div>}
                                </div>
                                <span className="capitalize font-semibold text-gray-900 dark:text-white">{option}</span>
                             </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2 max-w-2xl">
                     <ToggleSwitch 
                        label="Share Usage Data" 
                        description="Allow Welldone to use your activity for matchmaking improvements."
                        checked={dataSharing} 
                        onChange={() => setDataSharing(!dataSharing)} 
                    />
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Blocked Users</h3>
                      <p className="text-sm text-gray-500 mb-4">Manage the list of people you have blocked.</p>
                      <button className="text-sm font-bold text-primary-teal border border-primary-teal px-4 py-2 rounded-lg hover:bg-primary-teal hover:text-white transition-colors">
                          Manage Block List
                      </button>
                  </div>
                </div>
              )}

              {/* --- APPEARANCE TAB --- */}
              {activeTab === 'appearance' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                  <div className="space-y-6 max-w-2xl">
                     <ToggleSwitch 
                        label="Dark Mode" 
                        description="Switch between light and dark themes."
                        checked={isDarkMode} 
                        onChange={toggleTheme} 
                    />
                    
                    <ToggleSwitch 
                        label="Reduced Motion" 
                        description="Minimize animations for a calmer experience."
                        checked={reducedMotion} 
                        onChange={() => { setReducedMotion(!reducedMotion); handleAccountSave(); }} 
                    />

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Select App Theme</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {Object.keys(THEME_COLORS).map((colorKey) => {
                          const color = THEME_COLORS[colorKey];
                          return (
                            <button
                              key={colorKey}
                              onClick={() => setThemeColor(colorKey)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                themeColor === colorKey 
                                  ? 'border-gray-400 bg-gray-50 dark:bg-gray-800 shadow-sm scale-105 ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600' 
                                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <div 
                                className="w-12 h-12 rounded-full shadow-md border-2 border-white dark:border-gray-700"
                                style={{ backgroundColor: color.primary }}
                              ></div>
                              <span className="text-xs font-bold capitalize text-gray-600 dark:text-gray-300">{colorKey}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Font Size</label>
                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-dark-mode-input-bg p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                            <button onClick={() => setFontSize('small')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${fontSize === 'small' ? 'bg-white dark:bg-dark-mode-card-bg shadow-sm text-primary-teal' : 'text-gray-500'}`}>Aa Small</button>
                            <button onClick={() => setFontSize('medium')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${fontSize === 'medium' ? 'bg-white dark:bg-dark-mode-card-bg shadow-sm text-primary-teal' : 'text-gray-500'}`}>Aa Medium</button>
                            <button onClick={() => setFontSize('large')} className={`flex-1 py-2 rounded-lg text-lg font-bold ${fontSize === 'large' ? 'bg-white dark:bg-dark-mode-card-bg shadow-sm text-primary-teal' : 'text-gray-500'}`}>Aa Large</button>
                        </div>
                    </div>
                  </div>
                  
                  <div className="mt-10 p-6 bg-gray-50 dark:bg-dark-mode-input-bg rounded-xl border border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 uppercase font-bold tracking-widest text-center">Live Preview</p>
                      <div className="flex flex-col items-center justify-center gap-6">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary-teal flex items-center justify-center text-white shadow-lg animate-pulse">
                                  <i className="fas fa-check"></i>
                              </div>
                              <div className="bg-white dark:bg-dark-mode-card-bg p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                                  <p className={`text-primary-teal font-bold ${fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'}`}>Primary Color</p>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm">Theming applied instantly.</p>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>
              )}

              {/* --- INTEGRATIONS TAB --- */}
              {activeTab === 'integrations' && (
                 <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Connected Accounts</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Sync your social world to find more connections and enhance your Cosmic Match data.</p>

                    <div className="space-y-6 max-w-2xl">
                        
                        {/* Facebook Integration */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-mode-card-bg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl shadow-md">
                                        <i className="fab fa-facebook-f"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">Facebook</h4>
                                        <p className="text-xs text-gray-500">{fbConnected ? 'Connected' : 'Sync friends & events'}</p>
                                    </div>
                                </div>
                                {isSyncing === 'facebook' ? (
                                    <div className="transform scale-75"><LoadingSpinner /></div>
                                ) : (
                                    <button 
                                        onClick={() => fbConnected ? handleDisconnect('facebook') : handleConnectSocial('facebook')}
                                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                                            fbConnected 
                                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                        }`}
                                    >
                                        {fbConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                )}
                            </div>
                            
                            {/* Found Friends - Facebook */}
                            {fbConnected && foundFriends?.source === 'facebook' && foundFriends.users.length > 0 && (
                                <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Found {foundFriends.users.length} Friends on Welldone</p>
                                        <button onClick={() => setFoundFriends(null)} className="text-xs text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                                    </div>
                                    <div className="space-y-3">
                                        {foundFriends.users.map(user => (
                                            <div key={user.id} className="flex items-center justify-between bg-white dark:bg-dark-mode-card-bg p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{user.name}</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleInviteUser(user.id)}
                                                    className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1.5 rounded-md transition-colors font-bold"
                                                >
                                                    Add Friend
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Instagram Integration */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-mode-card-bg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-md">
                                        <i className="fab fa-instagram"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">Instagram</h4>
                                        <p className="text-xs text-gray-500">{instaConnected ? 'Connected' : 'Import photos & bio data'}</p>
                                    </div>
                                </div>
                                {isSyncing === 'instagram' ? (
                                    <div className="transform scale-75"><LoadingSpinner /></div>
                                ) : (
                                    <button 
                                        onClick={() => instaConnected ? handleDisconnect('instagram') : handleConnectSocial('instagram')}
                                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                                            instaConnected 
                                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300' 
                                            : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-md'
                                        }`}
                                    >
                                        {instaConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Spotify Integration */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-mode-card-bg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl shadow-md">
                                        <i className="fab fa-spotify"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">Spotify</h4>
                                        <p className="text-xs text-gray-500">{spotifyConnected ? 'Connected' : 'Match based on music taste'}</p>
                                    </div>
                                </div>
                                {isSyncing === 'spotify' ? (
                                    <div className="transform scale-75"><LoadingSpinner /></div>
                                ) : (
                                    <button 
                                        onClick={() => spotifyConnected ? handleDisconnect('spotify') : handleConnectSocial('spotify')}
                                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                                            spotifyConnected 
                                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300' 
                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                                        }`}
                                    >
                                        {spotifyConnected ? 'Disconnect' : 'Connect'}
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                 </div>
              )}

              {/* --- HELP TAB --- */}
              {activeTab === 'help' && (
                  <div className="animate-fade-in">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Help & Support</h2>
                      <div className="space-y-4 max-w-2xl">
                          <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <h4 className="font-bold text-gray-800 dark:text-white mb-1">FAQs</h4>
                              <p className="text-sm text-gray-500">Common questions about connecting and travel.</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <h4 className="font-bold text-gray-800 dark:text-white mb-1">Contact Support</h4>
                              <p className="text-sm text-gray-500">Need help with your account?</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              <h4 className="font-bold text-gray-800 dark:text-white mb-1">Report a Bug</h4>
                              <p className="text-sm text-gray-500">Help us improve Welldone.</p>
                          </div>
                          
                          <div className="mt-8 text-center text-xs text-gray-400">
                              <p>Welldone Version 2.5.0</p>
                              <p>&copy; 2024 Welldone Inc.</p>
                          </div>
                      </div>
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
