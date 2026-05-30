
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { User, Listing, AdCampaign, Booking, Event, Group, MeetingSpot, WellnessBanner, ServiceItem } from '../types';
import { MARKETPLACE_CATEGORIES } from '../constants';

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-mode-card-bg rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-dark-mode-input-bg">
                    <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose}><i className="fas fa-times text-gray-400"></i></button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export const AdminDashboardPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'banners' | 'bookings' | 'ads'>('overview');

  // Modal States
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  if (!context) return null;
  const { 
      currentUser, allUsers, 
      listings, addListing, updateListing, deleteListing,
      allBookings, adCampaigns,
      wellnessBanners, setWellnessBanners, login
  } = context;

  // Access check with demo mode
  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full mb-6 animate-bounce">
            <i className="fas fa-lock text-5xl text-red-500"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Admin Portal</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
            This section is restricted to Welldone Administrators. Use the demo button below to login as admin.
        </p>
        <button onClick={() => { 
            const admin = allUsers.find(u => u.role === 'admin') || allUsers[0]; 
            login({...admin, role: 'admin'}); 
        }} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition-transform uppercase tracking-widest text-sm">
            Demo Login as Admin
        </button>
      </div>
    );
  }

  // --- Listing Editor Upgrade ---
  const handleSaveListing = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      const newListing: Listing = {
          id: editingListing ? editingListing.id : `l-${Date.now()}`,
          name: formData.get('name') as string,
          tagline: formData.get('tagline') as string,
          description: formData.get('description') as string,
          category: formData.get('category') as string,
          subCategory: formData.get('subCategory') as string,
          rating: editingListing?.rating || 4.5,
          reviewCount: editingListing?.reviewCount || 0,
          location: formData.get('location') as string,
          contact: formData.get('contact') as string,
          services: editingListing?.services || [], // Simplified: maintain existing for demo
          features: (formData.get('features') as string).split(',').map(f => f.trim()),
          gallery: [formData.get('mainImage') as string || 'https://picsum.photos/800/600'],
          priceRange: formData.get('priceRange') as any,
          verified: formData.get('verified') === 'on',
          ownerId: editingListing?.ownerId || currentUser.id,
          socials: {
            website: formData.get('website') as string,
            instagram: formData.get('instagram') as string,
            whatsapp: formData.get('whatsapp') as string
          },
          team: editingListing?.team || [],
          reviews: editingListing?.reviews || [],
          openingHours: formData.get('openingHours') as string,
          seoTags: (formData.get('seoTags') as string).split(',').map(t => t.trim()),
          promoted: formData.get('promoted') === 'on'
      };

      if (editingListing) updateListing(editingListing.id, newListing);
      else addListing(newListing);
      setIsListingModalOpen(false);
      setEditingListing(null);
  };

  const handleSaveBanner = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newBanner: WellnessBanner = {
          id: `wb-${Date.now()}`,
          mediaType: formData.get('mediaType') as any,
          mediaUrl: formData.get('mediaUrl') as string,
          title: formData.get('title') as string,
          subtitle: formData.get('subtitle') as string,
          actionUrl: formData.get('actionUrl') as string
      };
      setWellnessBanners(prev => [newBanner, ...prev]);
      setIsBannerModalOpen(false);
  };

  const ListingsTab = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
              <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Wellness Marketplace Inventory</h3>
                  <p className="text-gray-500 text-sm">Manage business listings, services, and verification status.</p>
              </div>
              <button onClick={() => { setEditingListing(null); setIsListingModalOpen(true); }} className="bg-brand-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-600 transition-colors shadow-lg flex items-center gap-2">
                  <i className="fas fa-plus"></i> New Listing
              </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listings.map(l => (
                  <div key={l.id} className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex gap-6 group hover:shadow-md transition-all">
                      <img src={l.gallery[0]} className="w-24 h-24 rounded-2xl object-cover" alt="" />
                      <div className="flex-grow min-w-0">
                          <h4 className="font-black text-lg truncate">{l.name}</h4>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{l.category}</p>
                          <div className="flex gap-4">
                              <button onClick={() => { setEditingListing(l); setIsListingModalOpen(true); }} className="text-blue-500 font-bold text-xs hover:underline">Edit Rich Data</button>
                              <button onClick={() => deleteListing(l.id)} className="text-red-500 font-bold text-xs hover:underline">Remove</button>
                              <span className={`ml-auto text-[10px] font-black uppercase px-2 py-1 rounded ${l.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{l.verified ? 'Verified' : 'Unverified'}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          <Modal isOpen={isListingModalOpen} onClose={() => setIsListingModalOpen(false)} title={editingListing ? "Edit Rich Listing" : "Create New Wellness Listing"}>
              <form onSubmit={handleSaveListing} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Business Name</label><input name="name" defaultValue={editingListing?.name} required className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Category</label><select name="category" defaultValue={editingListing?.category} className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl">{Object.keys(MARKETPLACE_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                  <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Tagline</label><input name="tagline" defaultValue={editingListing?.tagline} required className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Full Description</label><textarea name="description" defaultValue={editingListing?.description} rows={4} className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Location</label><input name="location" defaultValue={editingListing?.location} required className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Contact Phone</label><input name="contact" defaultValue={editingListing?.contact} required className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Budget Tier</label><select name="priceRange" defaultValue={editingListing?.priceRange} className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl"><option>Economy</option><option>Standard</option><option>Premium</option></select></div>
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Website</label><input name="website" defaultValue={editingListing?.socials.website} className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                      <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Main Image URL</label><input name="mainImage" defaultValue={editingListing?.gallery[0]} className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  </div>
                  <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">SEO Tags (comma separated)</label><input name="seoTags" defaultValue={editingListing?.seoTags?.join(', ')} className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  <div className="flex gap-8 items-center bg-gray-50 dark:bg-dark-mode-input-bg p-4 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-sm"><input type="checkbox" name="verified" defaultChecked={editingListing?.verified} /> Verified Partner</label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-sm"><input type="checkbox" name="promoted" defaultChecked={editingListing?.promoted} /> Promote as Featured</label>
                  </div>
                  <button type="submit" className="w-full py-4 bg-brand-teal text-white font-black text-lg rounded-2xl shadow-xl">Save & Publish Listing</button>
              </form>
          </Modal>
      </div>
  );

  const BannersTab = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
              <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Hero Banner Management</h3>
                  <p className="text-gray-500 text-sm">Control the cinematic carousel at the top of the Wellness Sanctuary.</p>
              </div>
              <button onClick={() => setIsBannerModalOpen(true)} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg">
                  Add New Banner
              </button>
          </div>
          <div className="space-y-4">
              {wellnessBanners.map(b => (
                  <div key={b.id} className="bg-white dark:bg-dark-mode-card-bg rounded-3xl p-4 flex items-center gap-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="w-40 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0">
                          {b.mediaType === 'video' ? <video src={b.mediaUrl} className="w-full h-full object-cover" /> : <img src={b.mediaUrl} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-grow">
                          <h4 className="font-bold">{b.title}</h4>
                          <p className="text-xs text-gray-400">{b.mediaType === 'video' ? 'Video Autoplay' : 'Static Image'}</p>
                      </div>
                      <button onClick={() => setWellnessBanners(prev => prev.filter(x => x.id !== b.id))} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors"><i className="fas fa-trash-alt"></i></button>
                  </div>
              ))}
          </div>

          <Modal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} title="Upload Wellness Banner">
              <form onSubmit={handleSaveBanner} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-[10px] font-black text-gray-400 mb-1 uppercase">Media Type</label><select name="mediaType" className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl"><option value="image">Image</option><option value="video">Video</option></select></div>
                      <div><label className="block text-[10px] font-black text-gray-400 mb-1 uppercase">Media URL</label><input name="mediaUrl" required className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  </div>
                  <div><label className="block text-[10px] font-black text-gray-400 mb-1 uppercase">Headline</label><input name="title" required className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  <div><label className="block text-[10px] font-black text-gray-400 mb-1 uppercase">Subtext</label><input name="subtitle" required className="w-full p-3 bg-gray-50 dark:bg-dark-mode-input-bg border-none rounded-xl" /></div>
                  <button type="submit" className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl">Launch Carousel Slide</button>
              </form>
          </Modal>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg font-sans pb-20 pt-4 md:pt-8 px-4">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
            <div className="p-8 bg-gradient-to-br from-gray-900 to-black text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal flex items-center justify-center text-white font-bold text-xl shadow-lg">W</div>
                    <div>
                        <h2 className="font-black text-xl tracking-tight leading-none">Admin</h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Portal</p>
                    </div>
                </div>
            </div>
            <nav className="flex flex-col py-2">
              <SidebarItem id="overview" label="Dashboard" icon="fas fa-chart-pie" />
              <SidebarItem id="listings" label="Listings & Services" icon="fas fa-store" />
              <SidebarItem id="banners" label="Banner Carousel" icon="fas fa-play-circle" />
              <SidebarItem id="bookings" label="Global Bookings" icon="fas fa-calendar-check" />
              <SidebarItem id="ads" label="Campaigns" icon="fas fa-bullhorn" />
            </nav>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => navigate('/')} className="w-full py-3 text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                    <i className="fas fa-sign-out-alt"></i> Exit to App
                </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
            {activeTab === 'overview' && (
                <div className="bg-white dark:bg-dark-mode-card-bg p-12 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-teal text-3xl"><i className="fas fa-user-shield"></i></div>
                    <h2 className="text-3xl font-black mb-4">Welcome to Welldone Control.</h2>
                    <p className="text-gray-500 max-w-md mx-auto">Use this dashboard to curate the sanctuary experience, manage verified partners, and monitor community growth.</p>
                </div>
            )}
            {activeTab === 'listings' && <ListingsTab />}
            {activeTab === 'banners' && <BannersTab />}
            {activeTab === 'bookings' && (
                 <div className="bg-white dark:bg-dark-mode-card-bg rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-dark-mode-input-bg text-gray-400 font-black text-[10px] uppercase tracking-widest">
                            <tr><th className="p-6">Booking ID</th><th>User</th><th>Service</th><th>Provider</th><th>Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {allBookings.map(b => (
                                <tr key={b.id} className="text-sm">
                                    <td className="p-6 font-mono text-xs">{b.id}</td>
                                    <td className="font-bold">{b.userName}</td>
                                    <td>{b.serviceName}</td>
                                    <td>{b.providerName}</td>
                                    <td><span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-black text-[10px] uppercase tracking-widest">{b.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            )}
        </div>

      </div>
    </div>
  );
  
  function SidebarItem({ id, label, icon }: { id: any, label: string, icon: string }) {
      return (
          <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 ${
                activeTab === id 
                ? 'bg-brand-teal/10 border-brand-teal text-brand-teal dark:text-brand-teal font-bold' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
              <i className={`${icon} text-xl w-6 text-center`}></i>
              <span className="text-sm font-bold tracking-tight">{label}</span>
          </button>
      );
  }
};
