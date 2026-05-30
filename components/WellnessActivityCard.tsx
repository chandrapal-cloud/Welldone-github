import React from 'react';
import { WellnessActivity } from '../types';

interface WellnessActivityCardProps {
  activity: WellnessActivity;
  onViewDetails: (id: string) => void;
}

export const WellnessActivityCard: React.FC<WellnessActivityCardProps> = ({ activity, onViewDetails }) => {
  return (
    <div className="bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <img
        src={activity.image}
        alt={activity.name}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark-text dark:text-dark-mode-text mb-1">{activity.name}</h3>
        <p className="text-accent-sky dark:text-accent-sky-dark text-sm font-medium mb-2">{activity.type}</p>
        <p className="text-text-base dark:text-dark-mode-text-base text-xs mb-3 line-clamp-2">{activity.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {activity.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-light-background dark:bg-dark-mode-input-bg text-dark-text dark:text-dark-mode-text-base text-xs px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-dark-mode-text-base mb-3">
          <span className="flex items-center">
            <i className="fas fa-map-marker-alt mr-1 text-primary-teal dark:text-primary-teal-dark"></i>
            {activity.location}
          </span>
          <span className="flex items-center">
            <i className="fas fa-calendar-day mr-1 text-primary-teal dark:text-primary-teal-dark"></i>
            {activity.date}
          </span>
        </div>

        <button
          onClick={() => onViewDetails(activity.id)}
          className="w-full bg-accent-sky dark:bg-accent-sky-dark text-white px-3 py-1.5 rounded-lg shadow hover:bg-blue-600 dark:hover:bg-accent-sky transition-colors text-sm font-semibold"
        >
          Learn More
        </button>
      </div>
    </div>
  );
};