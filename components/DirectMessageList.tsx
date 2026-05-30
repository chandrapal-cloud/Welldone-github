import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

export const DirectMessageList: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <p className="text-center text-xl">Loading application context...</p>;
  }

  const { currentUser, allUsers, allConversations } = context;

  if (!currentUser) {
    return <p className="text-center text-xl text-dark-text dark:text-dark-mode-text">Please log in to view your messages.</p>;
  }

  const userConversations = allConversations
    .filter(conv => conv.participants.includes(currentUser.id))
    .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());

  const getOtherParticipant = (conversationParticipants: string[]) => {
    const otherParticipantId = conversationParticipants.find(id => id !== currentUser.id);
    return allUsers.find(user => user.id === otherParticipantId);
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md max-w-2xl mx-auto">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <h2 className="text-3xl font-bold text-dark-text dark:text-dark-mode-text mb-8">Your Direct Messages</h2>

      {userConversations.length === 0 ? (
        <p className="text-text-base dark:text-dark-mode-text-base">You have no active direct messages. Start a chat with a friend!</p>
      ) : (
        <ul className="space-y-4">
          {userConversations.map(conversation => {
            const otherUser = getOtherParticipant(conversation.participants);
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            if (!otherUser) return null;

            return (
              <li key={conversation.id} className="bg-light-background dark:bg-dark-mode-input-bg p-4 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Link to={`/dm/${conversation.id}`} className="flex items-center space-x-4">
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary-teal dark:border-primary-teal-dark"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lg text-dark-text dark:text-dark-mode-text">{otherUser.name}</p>
                      {lastMessage && (
                        <span className="text-xs text-gray-500 dark:text-dark-mode-text-base">
                          {new Date(lastMessage.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-base dark:text-dark-mode-text-base truncate">
                      {lastMessage ? `${lastMessage.senderId === currentUser.id ? 'You: ' : ''}${lastMessage.text}` : 'No messages yet.'}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};