
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { COUNTRIES, CITIES_BY_COUNTRY, LANGUAGES, RELIGIONS, POLITICAL_VIEWS, PHILOSOPHIES, CURRENCIES } from '../constants';

export const EditProfilePage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('AppContext must be used within an AppContext.Provider');
  }

  const { currentUser, updateUserProfile } = context;

  // Redirect if no user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Images
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [coverImage, setCoverImage] = useState(currentUser?.coverImage || 'https://picsum.photos/seed/nature_wide/1200/400');

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  
  // Demographics
  const [country, setCountry] = useState(currentUser?.country || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [area, setArea] = useState(currentUser?.area || '');
  const [language, setLanguage] = useState(currentUser?.language || '');
  const [currency, setCurrency] = useState(currentUser?.currency || '');
  const [religion, setReligion] = useState(currentUser?.religion || '');
  const [politicalView, setPoliticalView] = useState(currentUser?.politicalView || '');
  const [philosophy, setPhilosophy] = useState(currentUser?.philosophy || '');

  // Socials
  const [facebook, setFacebook] = useState(currentUser?.socialMediaLinks?.facebook || '');
  const [instagram, setInstagram] = useState(currentUser?.socialMediaLinks?.instagram || '');
  const [twitter, setTwitter] = useState(currentUser?.socialMediaLinks?.twitter || '');
  const [linkedin, setLinkedin] = useState(currentUser?.socialMediaLinks?.linkedin || '');
  const [tiktok, setTiktok] = useState(currentUser?.socialMediaLinks?.tiktok || '');

  const availableCities = country ? CITIES_BY_COUNTRY[country] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        name,
        avatar,
        coverImage,
        bio,
        occupation,
        country,
        city,
        area,
        language,
        currency,
        religion,
        politicalView,
        philosophy,
        socialMediaLinks: {
            facebook,
            instagram,
            twitter,
            linkedin,
            tiktok
        }
      };
      updateUserProfile(updatedUser);
      navigate('/profile');
    }
  };

  const handleImageChange = (type: 'avatar' | 'cover') => {
      const url = prompt(`Enter new ${type} image URL:`, type === 'avatar' ? avatar : coverImage);
      if (url) {
          if (type === 'avatar') setAvatar(url);
          else setCoverImage(url);
      }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-20">
      
      {/* Visual Editor Header */}
      <div className="relative mb-24">
          <div className="h-48 md:h-64 w-full rounded-b-[2rem] overflow-hidden relative group">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleImageChange('cover')} className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white/40 transition-colors">
                      <i className="fas fa-camera"></i> Change Cover
                  </button>
              </div>
          </div>
          
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-12 md:translate-x-0 group">
              <div className="relative">
                  <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-mode-card-bg shadow-xl object-cover" />
                  <button onClick={() => handleImageChange('avatar')} className="absolute bottom-0 right-0 bg-brand-teal text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition-transform">
                      <i className="fas fa-pencil-alt text-xs"></i>
                  </button>
              </div>
          </div>
      </div>

      <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <h2 className="text-3xl font-heading font-bold text-dark-text dark:text-dark-mode-text mb-6">Edit Profile Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Basic Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Occupation</label>
                        <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                </div>
            </section>

            {/* Location & Culture */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Location & Culture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Country</label>
                        <select value={country} onChange={(e) => { setCountry(e.target.value); setCity(''); }} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none">
                            <option value="">Select Country</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">City</label>
                        {availableCities ? (
                            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" disabled={!country}>
                                <option value="">Select City</option>
                                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <input 
                                type="text" 
                                value={city} 
                                onChange={(e) => setCity(e.target.value)} 
                                placeholder={country ? "Enter City Name" : "Select Country First"}
                                disabled={!country}
                                className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white disabled:opacity-50 focus:ring-2 focus:ring-brand-teal/50 outline-none" 
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Area/District</label>
                        <input type="text" value={area} onChange={(e) => setArea(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Language (Primary)</label>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none">
                            <option value="">Select Language</option>
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Preferred Currency</label>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none">
                            <option value="">Select Currency</option>
                            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {/* Identity & Views */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Identity & Views</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Religion / Spirituality</label>
                        <select value={religion} onChange={(e) => setReligion(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none">
                            <option value="">Select Belief System</option>
                            {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Political View</label>
                        <select value={politicalView} onChange={(e) => setPoliticalView(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none">
                            <option value="">Select Political View</option>
                            {POLITICAL_VIEWS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark-text dark:text-dark-mode-text mb-1">Philosophical Outlook</label>
                        <select value={philosophy} onChange={(e) => setPhilosophy(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none">
                            <option value="">Select Philosophy</option>
                            {PHILOSOPHIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {/* Social Links */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Social Connections</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <i className="fab fa-facebook text-blue-600 w-8 text-center text-xl"></i>
                        <input type="text" placeholder="Facebook URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="flex-1 p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="fab fa-instagram text-pink-500 w-8 text-center text-xl"></i>
                        <input type="text" placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="flex-1 p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="fab fa-twitter text-blue-400 w-8 text-center text-xl"></i>
                        <input type="text" placeholder="Twitter URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="flex-1 p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="fab fa-linkedin text-blue-700 w-8 text-center text-xl"></i>
                        <input type="text" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="flex-1 p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="fab fa-tiktok text-black dark:text-white w-8 text-center text-xl"></i>
                        <input type="text" placeholder="TikTok URL" value={tiktok} onChange={(e) => setTiktok(e.target.value)} className="flex-1 p-3 border rounded-xl dark:bg-dark-mode-input-bg dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-teal/50 outline-none" />
                    </div>
                </div>
            </section>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-8 py-3 bg-primary-teal text-white rounded-xl font-bold hover:bg-secondary-mint transition-colors shadow-lg"
                >
                    Save Profile
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
