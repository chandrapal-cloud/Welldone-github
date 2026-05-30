
import React from 'react';
import { TravelPlan } from '../types';

interface TravelPlanCardProps {
  travelPlan: TravelPlan;
  onViewDetails: (id: string) => void;
  onShare?: (plan: TravelPlan) => void;
}

export const TravelPlanCard: React.FC<TravelPlanCardProps> = ({ travelPlan, onViewDetails, onShare }) => {
  return (
    <div className="bg-white dark:bg-dark-mode-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      {/* Cache-busting comment: 2024-07-29T11:35:00Z */}
      <div className="relative h-48 overflow-hidden">
        <img
            src={travelPlan.image}
            alt={travelPlan.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-heading font-extrabold text-dark-text dark:text-dark-mode-text mb-2 leading-tight">{travelPlan.name}</h3>
        <p className="text-text-base dark:text-dark-mode-text-base text-sm mb-4 line-clamp-3 leading-relaxed">{travelPlan.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {travelPlan.wellnessFocus.map((focus, index) => (
            <span
              key={index}
              className="bg-secondary-mint dark:bg-secondary-mint-dark text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
            >
              {focus}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-dark-mode-text-base mb-4 mt-auto font-medium">
          <span className="flex items-center">
            <i className="fas fa-map-marker-alt mr-1 text-primary-teal dark:text-primary-teal-dark"></i>
            {travelPlan.location}
          </span>
          <span className="flex items-center">
            <i className="fas fa-calendar-alt mr-1 text-primary-teal dark:text-primary-teal-dark"></i>
            {travelPlan.dates}
          </span>
        </div>

        <div className="flex gap-2">
            <button
            onClick={() => onViewDetails(travelPlan.id)}
            className="flex-grow bg-primary-teal dark:bg-primary-teal-dark text-white px-4 py-2.5 rounded-xl shadow hover:bg-secondary-mint dark:hover:bg-secondary-mint-dark transition-colors font-bold text-sm"
            >
            View Details
            </button>
            {onShare && (
                <button
                onClick={() => onShare(travelPlan)}
                className="bg-accent-sky dark:bg-accent-sky-dark text-white px-4 py-2.5 rounded-xl shadow hover:bg-blue-600 dark:hover:bg-accent-sky transition-colors font-bold"
                aria-label="Share Travel Plan"
                >
                <i className="fas fa-share-alt"></i>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
