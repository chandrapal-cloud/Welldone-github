import React from 'react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onJoin: (eventId: string) => void;
  isJoined: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onJoin, isJoined }) => {
  return (
    <div className="bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="text-xl font-bold text-dark-text dark:text-dark-mode-text mb-2">{event.name}</h3>
        <p className="text-text-base dark:text-dark-mode-text-base text-sm mb-4">{event.description}</p>
        <div className="flex items-center text-sm text-gray-600 dark:text-dark-mode-text-base mb-2">
          <svg className="w-4 h-4 mr-2 text-primary-teal dark:text-primary-teal-dark" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 002-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-dark-mode-text-base mb-4">
          <svg className="w-4 h-4 mr-2 text-primary-teal dark:text-primary-teal-dark" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>{event.location}</span>
        </div>
        <button
          onClick={() => onJoin(event.id)}
          className={`w-full px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
            isJoined ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-primary-teal dark:bg-primary-teal-dark hover:bg-secondary-mint dark:hover:bg-secondary-mint-dark'
          }`}
          disabled={isJoined}
        >
          {isJoined ? 'Joined' : 'Join Event'}
        </button>
      </div>
    </div>
  );
};