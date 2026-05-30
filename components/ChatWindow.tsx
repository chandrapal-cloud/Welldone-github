import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, User } from '../types';

interface ChatWindowProps {
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  allUsers: User[]; // To display sender avatars/names
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, messages, onSendMessage, allUsers }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const getUserAvatar = (senderId: string) => {
    const user = allUsers.find(u => u.id === senderId);
    return user ? user.avatar : 'https://picsum.photos/50/50?random=0'; // Default avatar
  };

  const getUserName = (senderId: string) => {
    const user = allUsers.find(u => u.id === senderId);
    return user ? user.name : 'Unknown User';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-lg overflow-hidden">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <div className="p-4 bg-primary-teal dark:bg-primary-teal-dark text-white text-xl font-semibold">
        Community Chat
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-dark-mode-text-base py-10">Start a conversation!</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              {message.senderId !== currentUser.id && (
                <img
                  src={getUserAvatar(message.senderId)}
                  alt={getUserName(message.senderId)}
                  className="w-8 h-8 rounded-full mr-3 object-cover self-end"
                />
              )}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-sm ${
                  message.senderId === currentUser.id
                    ? 'bg-accent-sky dark:bg-accent-sky-dark text-white rounded-br-none'
                    : 'bg-light-background dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text rounded-bl-none'
                }`}
              >
                <p className="font-semibold text-sm mb-1">{getUserName(message.senderId)}</p>
                <p>{message.text}</p>
                <span className="block text-xs text-right opacity-75 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {message.senderId === currentUser.id && (
                <img
                  src={getUserAvatar(message.senderId)}
                  alt={getUserName(message.senderId)}
                  className="w-8 h-8 rounded-full ml-3 object-cover self-end"
                />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-dark-mode-input-bg border-t border-gray-200 dark:border-gray-700 flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal dark:focus:ring-primary-teal-dark bg-white dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text"
        />
        <button
          type="submit"
          className="ml-4 bg-primary-teal dark:bg-primary-teal-dark text-white px-6 py-3 rounded-lg shadow hover:bg-secondary-mint dark:hover:bg-secondary-mint-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputText.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};