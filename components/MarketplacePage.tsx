
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Listing, ServiceItem } from '../types';
import { MARKETPLACE_CATEGORIES } from '../constants';

export const MarketplacePage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  // --- Marketplace Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [budgetFilter, setBudgetFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  if (!context) return null;
  const { currentUser, listings, addBooking } = context;

  const handleBookingSubmit = (service: ServiceItem) => {
      if (!currentUser || !selectedListing) return;
      const date = prompt("Enter booking date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
      if (!date) return;
      
      addBooking({
          id: `bk-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          serviceName: service.name,
          providerName: selectedListing.name,
          date: date,
          time: "10:00",
          status: 'pending',
          image: service.image,
          price: service.price
      });
      alert(`Booking requested for ${service.name}!`);
  };

  const filteredListings = listings.filter(l => {
      const matchQuery = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         l.seoTags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = activeCategory === 'All' || l.category === activeCategory;
      const matchLoc = locationFilter === 'All' || l.location.includes(locationFilter);
      const matchBudget = budgetFilter === 'All' || l.priceRange === budgetFilter;
      const matchTag = tagFilter === 'All' || l.seoTags?.includes(tagFilter);
      return matchQuery && matchCat && matchLoc && matchBudget && matchTag;
  });

  const allLocations = Array.from(new Set(listings.map(l => l.location.split(',').pop()?.trim() || ''))).filter(Boolean);
  const allTags = Array.from(new Set(listings.flatMap(l => l.seoTags || []))).sort();

  const ListingOverlay = () => {
    if (!selectedListing) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-dark-mode-bg overflow-y-auto animate-fade-in">
            {/* Standard "Microsite" Header */}
            <div className="relative h-[450px] w-full">
                <img src={selectedListing.gallery[0]} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-mode-bg via-transparent to-transparent" />
                <button onClick={() => setSelectedListing(null)} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all border border-white/30 z-50"><i className="fas fa-times"></i></button>
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <span className="bg-brand-teal text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Verified Business</span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-2">{selectedListing.name}</h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400 italic">"{selectedListing.tagline}"</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500"><i className="fas fa-share-alt"></i></button>
                            <button className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500"><i className="far fa-heart"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 md:px-16 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <section>
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><i className="fas fa-info-circle text-brand-teal"></i> Overview</h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">{selectedListing.description}</p>
                        </section>

                        <section>
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><i className="fas fa-concierge-bell text-brand-teal"></i> Services</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedListing.services.map(s => (
                                    <div key={s.id} className="bg-gray-50 dark:bg-dark-mode-input-bg p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
                                        <div className="h-32 rounded-2xl overflow-hidden mb-4"><img src={s.image} className="w-full h-full object-cover" alt="" /></div>
                                        <h4 className="font-black text-lg mb-1">{s.name}</h4>
                                        <div className="flex gap-3 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                                            <span>{s.duration}</span>
                                            <span>•</span>
                                            <span className="text-brand-teal">{s.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6">{s.description}</p>
                                        <button onClick={() => handleBookingSubmit(s)} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02]">Reserve Now</button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Gallery Section */}
                        <section>
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><i className="fas fa-images text-brand-teal"></i> Gallery</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {selectedListing.gallery.map((img, i) => (
                                    <img key={i} src={img} className="rounded-2xl h-48 w-full object-cover shadow-md" alt="" />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-white dark:bg-dark-mode-card-bg rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
                                <h4 className="text-xl font-black mb-6">Contact Details</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center"><i className="fas fa-phone"></i></div>
                                        <span className="font-bold">{selectedListing.contact}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center"><i className="fas fa-clock"></i></div>
                                        <span className="font-bold">{selectedListing.openingHours || 'Open: 9 AM - 8 PM'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center"><i className="fas fa-globe"></i></div>
                                        <a href={selectedListing.socials.website} target="_blank" className="font-bold text-brand-teal hover:underline">Official Website</a>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    {selectedListing.socials.instagram && <button className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center"><i className="fab fa-instagram"></i></button>}
                                    {selectedListing.socials.whatsapp && <button className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><i className="fab fa-whatsapp"></i></button>}
                                    {selectedListing.socials.facebook && <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><i className="fab fa-facebook-f"></i></button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay Footer */}
            <footer className="bg-gray-50 dark:bg-dark-mode-input-bg border-t border-gray-100 dark:border-gray-800 mt-20 pt-16 pb-10">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-2xl font-black mb-4">{selectedListing.name}</h4>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">Redefining health and happiness through conscious living and professional guidance. Join our journey towards total well-being.</p>
                    </div>
                    <div>
                        <h5 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-gray-400">Quick Links</h5>
                        <ul className="space-y-3 text-sm font-bold text-gray-500 dark:text-gray-300">
                            <li className="hover:text-brand-teal transition-colors cursor-pointer">About Us</li>
                            <li className="hover:text-brand-teal transition-colors cursor-pointer">Services</li>
                            <li className="hover:text-brand-teal transition-colors cursor-pointer">Pricing</li>
                            <li className="hover:text-brand-teal transition-colors cursor-pointer">Reviews</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-gray-400">Keywords</h5>
                        <div className="flex flex-wrap gap-2">
                            {selectedListing.seoTags?.map(tag => (
                                <span key={tag} className="text-[10px] font-bold text-gray-400 bg-white dark:bg-dark-mode-card-bg px-2 py-1 rounded border border-gray-100 dark:border-gray-700">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">&copy; 2024 {selectedListing.name} x Welldone Platform. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg font-sans pb-20 p-4 md:p-8">
      <ListingOverlay />
      
      <div className="max-w-7xl mx-auto animate-fade-in">
          
          {/* Header */}
          <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Market<span className="text-brand-teal">place</span></h1>
              <p className="text-gray-500 dark:text-gray-400">Discover vetted services, classes, and products for your well-being.</p>
          </div>

          <div className="space-y-10">
              {/* Advanced Filter Bar */}
              <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Search Brand or Tag</label>
                      <div className="relative">
                          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                          <input type="text" placeholder="Sai Yoga..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-none" />
                      </div>
                  </div>
                  <div className="w-full md:w-48">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Location</label>
                      <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-none font-bold text-sm">
                          <option value="All">Global</option>
                          {allLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                  </div>
                  <div className="w-full md:w-40">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Budget</label>
                      <select value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-none font-bold text-sm">
                          <option value="All">All Tiers</option>
                          <option value="Economy">Economy</option>
                          <option value="Standard">Standard</option>
                          <option value="Premium">Premium</option>
                      </select>
                  </div>
                  <div className="w-full md:w-40">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Tag</label>
                      <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dark-mode-input-bg border-none font-bold text-sm">
                          <option value="All">All Tags</option>
                          {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                      </select>
                  </div>
              </div>

              {/* horizontal scroll subcategories fix */}
              <div className="overflow-x-auto no-scrollbar pb-2">
                  <div className="flex gap-3 whitespace-nowrap">
                      <button onClick={() => setActiveCategory('All')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === 'All' ? 'bg-brand-teal text-white' : 'bg-white dark:bg-dark-mode-card-bg text-gray-500'}`}>All Categories</button>
                      {Object.keys(MARKETPLACE_CATEGORIES).map(cat => (
                          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? 'bg-brand-teal text-white' : 'bg-white dark:bg-dark-mode-card-bg text-gray-500'}`}>{cat}</button>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredListings.map(listing => (
                      <div key={listing.id} onClick={() => setSelectedListing(listing)} className="group bg-white dark:bg-dark-mode-card-bg rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 cursor-pointer flex flex-col h-full">
                          <div className="relative h-48 overflow-hidden">
                              <img src={listing.gallery[0]} alt={listing.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-black/20" />
                              <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{listing.category}</div>
                              <div className="absolute bottom-4 left-4 text-white">
                                  <h3 className="text-xl font-black drop-shadow-md">{listing.name}</h3>
                                  <p className="text-xs opacity-90 flex items-center gap-1"><i className="fas fa-map-marker-alt"></i> {listing.location}</p>
                              </div>
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed italic">"{listing.tagline}"</p>
                              <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-800">
                                  <div className="flex items-center gap-1 text-yellow-500 font-black text-sm">
                                      <i className="fas fa-star"></i> {listing.rating}
                                  </div>
                                  <div className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${listing.priceRange === 'Premium' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{listing.priceRange}</div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};
