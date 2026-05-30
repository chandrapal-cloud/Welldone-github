
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

export const Navbar: React.FC = () => {
  const context = useContext(AppContext);
  const currentUser = context?.currentUser;
  const logout = context?.logout;
  const isDarkMode = context?.isDarkMode; // Get theme state
  const toggleTheme = context?.toggleTheme; // Get toggle function
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate('/login');
  };

  // Consistent Navigation Items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true, icon: 'fas fa-th-large' },
    { name: 'Profile', path: '/profile', requiresAuth: true, icon: 'fas fa-user' },
    { name: 'Travels', path: '/travels', requiresAuth: true, icon: 'fas fa-plane' },
    { name: 'Dating', path: '/dating', requiresAuth: true, icon: 'fas fa-heart' },
    { name: 'Games', path: '/games-challenges', requiresAuth: true, icon: 'fas fa-gamepad' },
    { name: 'Wellness', path: '/wellness', requiresAuth: true, icon: 'fas fa-spa' },
    { name: 'Marketplace', path: '/marketplace', requiresAuth: true, icon: 'fas fa-store' },
    { name: 'AI Partner', path: '/virtual-partner/create', requiresAuth: true, icon: 'fas fa-robot' },
    { name: 'Community', path: '/groups', requiresAuth: true, icon: 'fas fa-users' },
    { name: 'Chat', path: '/chat', requiresAuth: true, icon: 'fas fa-comments' },
    { name: 'Connections', path: '/connections', requiresAuth: true, icon: 'fas fa-user-friends' },
    { name: 'Messages', path: '/dm', requiresAuth: true, icon: 'fas fa-envelope' },
    { name: 'Settings', path: '/settings', requiresAuth: true, icon: 'fas fa-cog' }
  ];

  return (
    <nav className="bg-primary-teal dark:bg-primary-teal-dark text-white shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-heading font-extrabold tracking-tight hover:scale-105 transition-transform duration-200">
          Welldone
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop menu - Only show limited top-level items to avoid crowding */}
        <div className="hidden md:flex items-center space-x-6">
          {currentUser ? (
            <>
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="hover:text-secondary-mint dark:hover:text-secondary-mint-dark transition-colors text-base font-semibold tracking-wide flex items-center gap-2"
                  aria-label={item.name}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Link - Visible to all for Demo */}
              <Link
                to="/admin"
                className="bg-red-500 hover:bg-red-600 text-white transition-all text-sm font-bold tracking-wide flex items-center gap-2 px-4 py-2 rounded-full shadow-md animate-pulse hover:animate-none"
              >
                <i className="fas fa-shield-alt text-lg"></i>
                Admin Panel
              </Link>

              <div className="relative group pl-4 border-l border-white/20">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-mode-card-bg cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => navigate('/profile')}
                />
                <span className="absolute top-12 right-0 hidden group-hover:block px-3 py-1 bg-white dark:bg-dark-mode-card-bg text-dark-text dark:text-white text-sm font-bold rounded-lg shadow-lg whitespace-nowrap z-50">
                  {currentUser.name}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-secondary-mint dark:hover:text-secondary-mint-dark transition-colors text-lg font-bold">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-teal dark:bg-primary-teal-dark pb-4 shadow-inner max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col items-center space-y-3 pt-4">
            {currentUser ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 hover:bg-white/10 transition-colors text-lg font-medium"
                    aria-label={item.name}
                  >
                    {item.icon ? <><i className={`${item.icon} mr-2 w-6 text-center`}></i> {item.name}</> : item.name}
                  </Link>
                ))}
                
                <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 bg-red-500/20 hover:bg-red-500/40 transition-colors text-lg font-bold text-white border-y border-white/10"
                >
                    <i className="fas fa-shield-alt mr-2"></i> Admin Panel
                </Link>

                <div className="flex items-center space-x-2 py-4 border-t border-white/20 w-full justify-center mt-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="text-xl font-heading font-bold">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors w-2/3 shadow-md mb-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2 hover:bg-white/10 transition-colors text-lg font-bold"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
