
import React, { useState } from 'react';
import { ShareContentResult } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  content: ShareContentResult | null;
  error: string | null;
  title: string;
}

type Platform = 'facebook' | 'instagram' | 'threads' | 'whatsapp' | 'linkedin';

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, loading, content, error, title }) => {
  const [activeTab, setActiveTab] = useState<Platform>('whatsapp');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareExternal = () => {
    if (!content) return;
    
    const text = encodeURIComponent(content[activeTab]);
    const url = encodeURIComponent(window.location.href); // Sharing current app link
    let shareUrl = '';

    switch (activeTab) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; // LinkedIn relies mostly on OG tags of the URL
            break;
        case 'threads':
            shareUrl = `https://threads.net/intent/post?text=${text}%20${url}`;
            break;
        case 'instagram':
            // Instagram doesn't have a direct web intent for text. Copying is best.
            handleCopy();
            alert("Content copied! Opening Instagram...");
            shareUrl = 'https://instagram.com';
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'fab fa-facebook-f';
      case 'instagram': return 'fab fa-instagram';
      case 'threads': return 'fab fa-threads';
      case 'whatsapp': return 'fab fa-whatsapp';
      case 'linkedin': return 'fab fa-linkedin-in';
      default: return 'fas fa-share-alt';
    }
  };

  const getPlatformColor = (platform: string) => {
      switch(platform) {
          case 'facebook': return 'bg-[#1877F2] text-white';
          case 'whatsapp': return 'bg-[#25D366] text-white';
          case 'linkedin': return 'bg-[#0A66C2] text-white';
          case 'instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white';
          case 'threads': return 'bg-black text-white dark:bg-white dark:text-black';
          default: return 'bg-gray-100 text-gray-600';
      }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-white dark:bg-dark-mode-card-bg rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-gray-100 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-dark-mode-input-bg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fas fa-share-alt text-brand-teal"></i> {title}
          </h3>
          <button onClick={onClose} className="hover:text-red-500 transition-colors bg-white dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner />
              <p className="mt-6 text-gray-600 dark:text-gray-300 animate-pulse font-medium">
                AI is crafting the perfect caption...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-800 text-center">
              <i className="fas fa-exclamation-triangle mb-2 text-2xl"></i>
              <p>{error}</p>
            </div>
          ) : content ? (
            <>
              <div className="flex justify-center flex-wrap gap-3 mb-6">
                {(['whatsapp', 'facebook', 'instagram', 'linkedin', 'threads'] as const).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => { setActiveTab(platform); setCopied(false); }}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-md ${
                      activeTab === platform
                        ? `${getPlatformColor(platform)} ring-4 ring-gray-100 dark:ring-gray-700 transform scale-110`
                        : 'bg-gray-100 dark:bg-dark-mode-input-bg text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={platform}
                  >
                    <i className={`${getPlatformIcon(platform)} text-xl`}></i>
                  </button>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-dark-mode-input-bg p-5 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6 relative min-h-[100px]">
                <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {content[activeTab]}
                </p>
                <div className="absolute top-2 right-2">
                    <button onClick={handleCopy} className="text-gray-400 hover:text-brand-teal transition-colors p-2">
                        <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCopy}
                    className={`py-3 rounded-xl font-bold shadow-sm transition-all duration-300 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700`}
                  >
                    <i className="fas fa-copy"></i> Copy Text
                  </button>
                  
                  <button
                    onClick={handleShareExternal}
                    className={`py-3 rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-white ${activeTab === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-brand-teal hover:bg-secondary-mint'}`}
                  >
                    <i className="fas fa-external-link-alt"></i> Open {activeTab === 'whatsapp' ? 'WhatsApp' : 'App'}
                  </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
