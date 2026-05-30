
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

export const FriendRequestsPage: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const { currentUser, allUsers, friendRequests, acceptFriendRequest, declineFriendRequest, startDirectMessage } = context;

  if (!currentUser) {
    return <p className="text-center text-xl text-dark-text dark:text-dark-mode-text">Please log in to manage your friends.</p>;
  }

  const incomingRequests = friendRequests.filter(
    (req) => req.receiverId === currentUser.id && req.status === 'pending'
  );
  const outgoingRequests = friendRequests.filter(
    (req) => req.senderId === currentUser.id && req.status === 'pending'
  );
  const acceptedFriends = allUsers.filter(user => currentUser.friends.includes(user.id));

  const getUserDetails = (userId: string) => allUsers.find((u) => u.id === userId);

  const handleStartDM = (friendId: string) => {
    if (startDirectMessage) {
      startDirectMessage(friendId);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <h2 className="text-3xl font-bold text-dark-text dark:text-dark-mode-text mb-8">Your Friends & Requests</h2>

      {/* Incoming Requests */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-dark-text dark:text-dark-mode-text mb-4">Incoming Friend Requests ({incomingRequests.length})</h3>
        {incomingRequests.length === 0 ? (
          <p className="text-text-base dark:text-dark-mode-text-base">No new friend requests.</p>
        ) : (
          <ul className="space-y-4">
            {incomingRequests.map((request) => {
              const sender = getUserDetails(request.senderId);
              if (!sender) return null;
              return (
                <li key={request.id} className="flex items-center justify-between bg-light-background dark:bg-dark-mode-input-bg p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img src={sender.avatar} alt={sender.name} className="w-12 h-12 rounded-full object-cover border-2 border-accent-sky dark:border-accent-sky-dark" />
                    <div>
                      <Link to={`/users/${sender.id}`} className="font-semibold text-lg text-dark-text dark:text-dark-mode-text hover:text-accent-sky dark:hover:text-accent-sky-dark transition-colors">
                        {sender.name}
                      </Link>
                      <p className="text-sm text-text-base dark:text-dark-mode-text-base">wants to be your friend.</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => acceptFriendRequest(request.id)}
                      className="bg-primary-teal dark:bg-primary-teal-dark text-white px-4 py-2 rounded-lg hover:bg-secondary-mint dark:hover:bg-secondary-mint-dark transition-colors text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineFriendRequest(request.id)}
                      className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Outgoing Requests */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-dark-text dark:text-dark-mode-text mb-4">Outgoing Friend Requests ({outgoingRequests.length})</h3>
        {outgoingRequests.length === 0 ? (
          <p className="text-text-base dark:text-dark-mode-text-base">You haven't sent any pending friend requests.</p>
        ) : (
          <ul className="space-y-4">
            {outgoingRequests.map((request) => {
              const receiver = getUserDetails(request.receiverId);
              if (!receiver) return null;
              return (
                <li key={request.id} className="flex items-center justify-between bg-light-background dark:bg-dark-mode-input-bg p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img src={receiver.avatar} alt={receiver.name} className="w-12 h-12 rounded-full object-cover border-2 border-accent-sky dark:border-accent-sky-dark" />
                    <div>
                      <Link to={`/users/${receiver.id}`} className="font-semibold text-lg text-dark-text dark:text-dark-mode-text hover:text-accent-sky dark:hover:text-accent-sky-dark transition-colors">
                        {receiver.name}
                      </Link>
                      <p className="text-sm text-text-base dark:text-dark-mode-text-base">Pending...</p>
                    </div>
                  </div>
                  <button
                    onClick={() => declineFriendRequest(request.id)} // Allow cancelling outgoing requests
                    className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel Request
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* My Friends */}
      <section>
        <h3 className="text-2xl font-semibold text-dark-text dark:text-dark-mode-text mb-4">My Friends ({acceptedFriends.length})</h3>
        {acceptedFriends.length === 0 ? (
          <p className="text-text-base dark:text-dark-mode-text-base">You don't have any friends yet. Send some requests!</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {acceptedFriends.map((friend) => (
              <li key={friend.id} className="flex flex-col items-center bg-light-background dark:bg-dark-mode-input-bg p-4 rounded-lg shadow-sm">
                <Link to={`/users/${friend.id}`} className="flex flex-col items-center text-center mb-2">
                  <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-primary-teal dark:border-primary-teal-dark" />
                  <p className="font-semibold text-dark-text dark:text-dark-mode-text hover:text-primary-teal dark:hover:text-primary-teal-dark transition-colors">{friend.name}</p>
                </Link>
                <button
                  onClick={() => handleStartDM(friend.id)}
                  className="bg-accent-sky dark:bg-accent-sky-dark text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-accent-sky transition-colors text-sm"
                >
                  Message
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
