
import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';

export const Sidebar: React.FC = () => {
  const context = useContext(AppContext);
  const currentUser = context?.currentUser;
  const logout = context?.logout;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout?.();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true, icon: 'fas fa-th-large' },
    { name: 'Profile', path: '/profile', requiresAuth: true, icon: 'fas fa-user' },
    { name: 'Travels', path: '/travels', requiresAuth: true, icon: 'fas fa-plane' },
    { name: 'Dating', path: '/dating', requiresAuth: true, icon: 'fas fa-heart' },
    { name: 'Games & Challenges', path: '/games-challenges', requiresAuth: true, icon: 'fas fa-gamepad' },
    { name: 'Wellness', path: '/wellness', requiresAuth: true, icon: 'fas fa-spa' },
    { name: 'Marketplace', path: '/marketplace', requiresAuth: true, icon: 'fas fa-store' },
    { name: 'Virtual Partner', path: '/virtual-partner/create', requiresAuth: true, icon: 'fas fa-robot' },
    { name: 'Groups', path: '/groups', requiresAuth: true, icon: 'fas fa-users' },
    { name: 'Events', path: '/events', requiresAuth: true, icon: 'fas fa-calendar-alt' },
    { name: 'Community Chat', path: '/chat', requiresAuth: true, icon: 'fas fa-comments' },
    { name: 'Connections', path: '/connections', requiresAuth: true, icon: 'fas fa-user-friends' },
    { name: 'Messages', path: '/dm', requiresAuth: true, icon: 'fas fa-envelope' },
    { name: 'Settings', path: '/settings', requiresAuth: true, icon: 'fas fa-cog' },
    // Removed strict admin check for demo visibility
    { name: 'Admin', path: '/admin', requiresAuth: true, icon: 'fas fa-shield-alt', requiresAdmin: false }
  ];

  return (
    <>
      {/* Sidebar Content - Hidden on Mobile, Visible on Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-dark-mode-card-bg shadow-xl border-r border-gray-200 dark:border-gray-700 h-full">
        {/* Brand Logo */}
        <div className="flex items-center justify-center h-20 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-mode-card-bg">
           <Link to="/" className="text-3xl font-heading font-black text-primary-teal dark:text-primary-teal-dark tracking-tight hover:scale-105 transition-transform">Welldone</Link>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {/* User Profile Section */}
            {currentUser ? (
            <div className="flex flex-col items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-dark-mode-input-bg/50">
                <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                    <img 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-600 shadow-lg object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all"></div>
                </div>
                <h3 className="mt-3 font-heading font-bold text-lg text-dark-text dark:text-dark-mode-text text-center">{currentUser.name}</h3>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 text-center line-clamp-1 px-2">{currentUser.occupation || 'Member'}</p>
                
                {/* Coin Balance Display */}
                <div className="mt-3 flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-full shadow-sm border border-yellow-200 dark:border-yellow-700">
                    <i className="fas fa-coins text-yellow-500 text-xs"></i>
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{currentUser.virtualBalance || 0} Coins</span>
                </div>
            </div>
            ) : (
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 text-center bg-gray-50/50">
                    <p className="text-gray-500 text-sm font-medium mb-3">Join our community</p>
                    <Link to="/login" className="block w-full bg-primary-teal text-white py-2 rounded-xl font-bold shadow-md hover:bg-secondary-mint transition-all transform hover:-translate-y-0.5">Login</Link>
                </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
                if (item.requiresAuth && !currentUser) return null;
                // Only show admin items if user has admin role - COMMENTED OUT FOR DEMO VISIBILITY
                // if ((item as any).requiresAdmin && currentUser?.role !== 'admin') return null;

                const isActive = location.pathname === item.path;
                const isAdminItem = item.name === 'Admin';

                return (
                    <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive 
                        ? 'bg-primary-teal dark:bg-primary-teal-dark text-white shadow-md font-bold' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-teal dark:hover:text-primary-teal-dark font-medium'}
                        ${isAdminItem ? 'mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300' : ''}
                    `}
                    >
                    <div className={`w-6 flex justify-center mr-3 text-base ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-teal dark:group-hover:text-primary-teal-dark transition-colors'} ${isAdminItem ? 'text-red-500 dark:text-red-400' : ''}`}>
                        <i className={item.icon}></i>
                    </div>
                    <span className="text-sm">{item.name}</span>
                    </Link>
                );
            })}
            </nav>
        </div>

        {/* Logout Button */}
        {currentUser && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-dark-mode-card-bg">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold group"
            >
              <div className="w-6 flex justify-center mr-3 text-base text-red-400 group-hover:text-red-600 transition-colors">
                 <i className="fas fa-sign-out-alt"></i>
              </div>
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
