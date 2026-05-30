
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const { currentUser, notifications, markNotificationAsRead, allUsers } = context;

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4">Please log in to view your notifications.</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary-teal text-white px-6 py-2 rounded-lg hover:bg-secondary-mint transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  const userNotifications = notifications.filter(n => n.userId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    if (notification.type === 'friend_request') {
      navigate('/connections');
    } else if (notification.type === 'activity_invite') {
      // Navigate to activities or groups based on context (mock behavior)
      navigate('/dashboard');
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <i className="fas fa-user-plus text-brand-blue text-xl"></i>;
      case 'activity_invite':
        return <i className="fas fa-calendar-plus text-brand-pink text-xl"></i>;
      case 'activity_update':
        return <i className="fas fa-bell text-brand-teal text-xl"></i>;
      default:
        return <i className="fas fa-info-circle text-gray-500 text-xl"></i>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-mode-bg font-sans pb-20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Notifications
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Stay updated with your wellness circle.
            </p>
          </div>
          <div className="bg-white dark:bg-dark-mode-card-bg px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
               {unreadCount} Unread
             </span>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {userNotifications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-dark-mode-card-bg rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                 <i className="far fa-bell-slash text-2xl"></i>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No notifications yet.</p>
              <p className="text-gray-400 text-sm">We'll let you know when something happens!</p>
            </div>
          ) : (
            userNotifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 cursor-pointer group hover:shadow-md ${
                  notification.isRead 
                    ? 'bg-white dark:bg-dark-mode-card-bg border-gray-100 dark:border-gray-700 opacity-90' 
                    : 'bg-white dark:bg-dark-mode-card-bg border-brand-teal/30 shadow-sm'
                }`}
              >
                {!notification.isRead && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-brand-teal rounded-full m-3"></div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    !notification.isRead ? 'bg-brand-mint/30 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {getIconForType(notification.type)}
                  </div>
                  
                  <div className="flex-grow pt-1">
                    <p className={`text-base ${notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-bold'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>

                  <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-chevron-right text-gray-300"></i>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
