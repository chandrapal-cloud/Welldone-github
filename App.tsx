
import React, { useState, useEffect, useCallback, createContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  User, Group, Challenge, Event, MatchmakingResult, ChatMessage, FriendRequest, 
  Conversation, VirtualPartner, VirtualPartnerChatMessage, VirtualPartnerChatResponse, 
  SuggestedTravelBuddy, TravelBuddyFilters, ChatAttachment, MoodEntry, 
  SuggestedDatingMatch, DatingPreferences, AstrologyPreferences, Notification, 
  Post, Comment, HeroSlide, WellnessBanner, TravelPlan, Listing, MeetingSpot, AdCampaign, Booking
} from './types';
import { 
  mockUsers, mockGroups, mockChallenges, mockEvents, mockFriendRequests, 
  mockConversations, mockNotifications, mockInterests, DEFAULT_HERO_SLIDES,
  mockTravelPlans, mockBookings, mockAdCampaigns // Imported Mocks
} from './constants';
import { 
  getMatchmakingSuggestions, generateVirtualPartnerProfile, chatWithVirtualPartner, 
  getTravelBuddySuggestions, getDatingMatches, getAstrologyMatches 
} from './services/geminiService';

// Component Imports
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { HomePage } from './components/HomePage';
import { EditProfilePage } from './components/EditProfilePage';
import { TravelsPage } from './components/TravelsPage';
import { DatingPage } from './components/DatingPage';
import { GamesChallengesPage } from './components/GamesChallengesPage';
import { WellnessPage } from './components/WellnessPage';
import { MarketplacePage } from './components/MarketplacePage';
import { VirtualPartnerCreationPage } from './components/VirtualPartnerCreationPage';
import { VirtualPartnerChatPage } from './components/VirtualPartnerChatPage';
import { ConnectionsPage } from './components/ConnectionsPage';
import { DirectMessageList } from './components/DirectMessageList';
import { DirectMessageWindow } from './components/DirectMessageWindow';
import { SettingsPage } from './components/SettingsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { DetailedProfile } from './components/DetailedProfile';
import { GamesPage } from './components/GamesPage';
import { ChatWindow } from './components/CommunityChatWindow'; 
import { OnboardingModal } from './components/OnboardingModal'; 

export const THEME_COLORS: Record<string, { primary: string; secondary: string; accent: string; primaryDark: string; secondaryDark: string; accentDark: string }> = {
  teal: { primary: '#0D9488', secondary: '#99F6E4', accent: '#0EA5E9', primaryDark: '#134E4A', secondaryDark: '#CCFBF1', accentDark: '#0284C7' },
  blue: { primary: '#2563EB', secondary: '#BFDBFE', accent: '#F59E0B', primaryDark: '#1E3A8A', secondaryDark: '#DBEAFE', accentDark: '#D97706' },
  purple: { primary: '#7C3AED', secondary: '#DDD6FE', accent: '#EC4899', primaryDark: '#4C1D95', secondaryDark: '#EDE9FE', accentDark: '#DB2777' },
  rose: { primary: '#E11D48', secondary: '#FECDD3', accent: '#8B5CF6', primaryDark: '#881337', secondaryDark: '#FFE4E6', accentDark: '#7C3AED' },
  orange: { primary: '#EA580C', secondary: '#FED7AA', accent: '#10B981', primaryDark: '#7C2D12', secondaryDark: '#FFEDD5', accentDark: '#059669' },
};

const DEFAULT_WELLNESS_BANNERS: WellnessBanner[] = [
    {
        id: 'wb1',
        mediaType: 'image',
        mediaUrl: 'https://picsum.photos/seed/wellnesshero/1600/600',
        title: 'Welldone Wellness.',
        subtitle: 'Nurture your body, mind, and spirit.'
    },
    {
        id: 'wb2',
        mediaType: 'video',
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        title: 'Find Inner Peace',
        subtitle: 'Start your journey to mindfulness today.'
    },
    {
        id: 'wb3',
        mediaType: 'image',
        mediaUrl: 'https://picsum.photos/seed/yoga_sunset/1600/600',
        title: 'Move Your Body',
        subtitle: 'Join live yoga sessions with top instructors.'
    }
];

// Initial Data for Listings
const INITIAL_LISTINGS: Listing[] = [
  { 
    id: 'l1', 
    name: 'Sai Yoga Centre', 
    tagline: 'Harmony for Body, Peace for Mind.', 
    description: 'Experience the transformative power of traditional Hatha and Vinyasa yoga.',
    gallery: ['https://picsum.photos/seed/saiyoga1/800/600'],
    category: 'Meditation & Yoga', 
    subCategory: 'Yoga Poses', 
    rating: 4.9,
    reviewCount: 124,
    location: '123 Peace Ave, Downtown',
    contact: '+1 (555) 019-2834',
    services: [],
    features: ['Certified Instructors', 'Eco-friendly Mats'],
    // Fixed: Corrected value to match Economy | Standard | Premium
    priceRange: 'Standard',
    verified: true,
    ownerId: 'user3',
    socials: {},
    team: [],
    reviews: [],
    promoted: true
  },
  { 
    id: 'l2', 
    name: 'Mindful Soul Clinic', 
    tagline: 'Compassionate care for your mental well-being.', 
    description: 'We provide a safe space for healing and growth.',
    gallery: ['https://picsum.photos/seed/mindfulclinic/800/600'],
    category: 'Services', 
    subCategory: 'Counselling', 
    rating: 4.8,
    reviewCount: 89,
    location: '45 Healing Blvd, Westside',
    contact: '+1 (555) 019-9988',
    services: [],
    features: ['Licensed Therapists'],
    // Fixed: Corrected value to match Economy | Standard | Premium
    priceRange: 'Premium',
    verified: true,
    ownerId: 'user1',
    socials: {},
    team: [],
    reviews: []
  }
];

const INITIAL_MEETING_SPOTS: MeetingSpot[] = [
  {
    id: 'spot1',
    name: 'The Alchemist',
    type: 'Cocktail Bar',
    location: 'London, UK',
    address: '63-66 St Martin\'s Ln',
    mapUrl: '#',
    vibe: 'Mystical',
    image: 'https://picsum.photos/seed/alchemist/400/300',
    tags: ['Nightlife'],
    description: 'A dark, copper-walled bar serving theatrical cocktails.',
    rating: 4.5,
    approved: true,
    addedBy: 'admin'
  }
];

export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  
  // Content Data
  allGroups: Group[];
  setAllGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  allChallenges: Challenge[];
  setAllChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  allEvents: Event[];
  setAllEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  meetingSpots: MeetingSpot[];
  setMeetingSpots: React.Dispatch<React.SetStateAction<MeetingSpot[]>>;
  adCampaigns: AdCampaign[];
  setAdCampaigns: React.Dispatch<React.SetStateAction<AdCampaign[]>>;
  allBookings: Booking[];
  setAllBookings: React.Dispatch<React.SetStateAction<Booking[]>>;

  // CRUD Actions
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  addMeetingSpot: (spot: MeetingSpot) => void;
  addEvent: (event: Event) => void;
  addGroup: (group: Group) => void;
  addBooking: (booking: Booking) => void;

  friendRequests: FriendRequest[];
  allConversations: Conversation[];
  notifications: Notification[];
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateUserProfile: (updatedUser: User, options?: { silent?: boolean; skipRedirect?: boolean }) => void;
  
  // Social
  sendFriendRequest: (receiverId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  unfriend: (friendId: string) => void;
  startDirectMessage: (userId: string) => void;
  sendDirectMessage: (conversationId: string, text: string, attachment?: ChatAttachment) => void;
  updateMessageStatus: (conversationId: string, messageId: string, status: 'sent' | 'delivered' | 'read') => void;
  
  // Story Board Actions
  createPost: (content: string, image?: string, video?: string, location?: string, feeling?: string) => void;
  likePost: (postOwnerId: string, postId: string) => void;
  commentOnPost: (postOwnerId: string, postId: string, text: string) => void;
  sharePost: (postOwnerId: string, postId: string) => void;

  // AI & Features
  matchmakingSuggestions: MatchmakingResult;
  loadingMatchmaking: boolean;
  refreshMatchmaking: () => void;
  
  virtualPartner: VirtualPartner | null;
  createVirtualPartner: (description: string) => Promise<void>;
  updateVirtualPartner: (partner: VirtualPartner) => void;
  resetVirtualPartner: () => void;
  virtualPartnerChatHistory: VirtualPartnerChatMessage[];
  sendVirtualPartnerMessage: (text: string) => Promise<void>;
  loadingVirtualPartner: boolean;
  errorVirtualPartner: string | null;

  travelBuddySuggestions: SuggestedTravelBuddy[];
  loadingTravelBuddies: boolean;
  errorTravelBuddies: string | null;
  searchTravelBuddies: (query: string, filters: TravelBuddyFilters) => Promise<void>;
  
  datingMatches: SuggestedDatingMatch[];
  loadingDating: boolean;
  errorDating: string | null;
  searchDatingPartners: (prefs: DatingPreferences) => Promise<void>;
  searchAstrologyPartners: (prefs: AstrologyPreferences) => Promise<void>;

  awardVirtualCurrency: (amount: number) => void;
  handleJoin: (type: 'group' | 'challenge' | 'event', id: string) => void;
  markNotificationAsRead: (id: string) => void;
  
  // New Wellness Action
  logWellnessEntry: (entry: MoodEntry) => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;

  // Search Filters State
  selectedInterestsFilter: string[];
  setSelectedInterestsFilter: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTravelStyleFilter: string | null;
  setSelectedTravelStyleFilter: React.Dispatch<React.SetStateAction<string | null>>;
  selectedBudgetFilter: string | null;
  setSelectedBudgetFilter: React.Dispatch<React.SetStateAction<string | null>>;
  selectedLookingForFilter: string | null;
  setSelectedLookingForFilter: React.Dispatch<React.SetStateAction<string | null>>;
  mockInterests: {id: string, name: string}[];

  // Hero Slides
  heroSlides: HeroSlide[];
  setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;

  // Wellness Banners
  wellnessBanners: WellnessBanner[];
  setWellnessBanners: React.Dispatch<React.SetStateAction<WellnessBanner[]>>;

  // Travel Plans Management
  travelPlans: TravelPlan[];
  setTravelPlans: React.Dispatch<React.SetStateAction<TravelPlan[]>>;
  addTravelPlan: (plan: TravelPlan) => void;
  deleteTravelPlan: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  
  // Global Content State
  const [allGroups, setAllGroups] = useState<Group[]>(mockGroups);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>(mockChallenges);
  const [allEvents, setAllEvents] = useState<Event[]>(mockEvents);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [meetingSpots, setMeetingSpots] = useState<MeetingSpot[]>(INITIAL_MEETING_SPOTS);
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(mockAdCampaigns);
  const [allBookings, setAllBookings] = useState<Booking[]>(mockBookings);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(mockFriendRequests);
  const [allConversations, setAllConversations] = useState<Conversation[]>(mockConversations);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Matchmaking State
  const [matchmakingSuggestions, setMatchmakingSuggestions] = useState<MatchmakingResult>({ users: [], groups: [] });
  const [loadingMatchmaking, setLoadingMatchmaking] = useState(false);

  // Virtual Partner State
  const [virtualPartner, setVirtualPartner] = useState<VirtualPartner | null>(null);
  const [virtualPartnerChatHistory, setVirtualPartnerChatHistory] = useState<VirtualPartnerChatMessage[]>([]);
  const [loadingVirtualPartner, setLoadingVirtualPartner] = useState(false);
  const [errorVirtualPartner, setErrorVirtualPartner] = useState<string | null>(null);

  // Travel Buddy Search State
  const [travelBuddySuggestions, setTravelBuddySuggestions] = useState<SuggestedTravelBuddy[]>([]);
  const [loadingTravelBuddies, setLoadingTravelBuddies] = useState(false);
  const [errorTravelBuddies, setErrorTravelBuddies] = useState<string | null>(null);

  // Dating State
  const [datingMatches, setDatingMatches] = useState<SuggestedDatingMatch[]>([]);
  const [loadingDating, setLoadingDating] = useState(false);
  const [errorDating, setErrorDating] = useState<string | null>(null);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState('teal');

  // Filters State
  const [selectedInterestsFilter, setSelectedInterestsFilter] = useState<string[]>([]);
  const [selectedTravelStyleFilter, setSelectedTravelStyleFilter] = useState<string | null>(null);
  const [selectedBudgetFilter, setSelectedBudgetFilter] = useState<string | null>(null);
  const [selectedLookingForFilter, setSelectedLookingForFilter] = useState<string | null>(null);

  // Hero Slider State
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
  
  // Wellness Banners
  const [wellnessBanners, setWellnessBanners] = useState<WellnessBanner[]>(DEFAULT_WELLNESS_BANNERS);

  // Travel Plans State
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>(mockTravelPlans);

  useEffect(() => {
    if (currentUser) {
      refreshMatchmaking();
    }
  }, [currentUser]);

  // CRUD Helpers
  const addListing = (listing: Listing) => setListings(prev => [listing, ...prev]);
  const updateListing = (id: string, updates: Partial<Listing>) => setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  const deleteListing = (id: string) => setListings(prev => prev.filter(l => l.id !== id));
  
  const addMeetingSpot = (spot: MeetingSpot) => setMeetingSpots(prev => [spot, ...prev]);
  const addEvent = (event: Event) => setAllEvents(prev => [event, ...prev]);
  const addGroup = (group: Group) => setAllGroups(prev => [group, ...prev]);
  const addBooking = (booking: Booking) => setAllBookings(prev => [booking, ...prev]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (updatedUser: User, options: { silent?: boolean; skipRedirect?: boolean } = { silent: false, skipRedirect: false }) => {
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (!options.silent) {
      // Could show toast here
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const refreshMatchmaking = async () => {
    if (!currentUser) return;
    setLoadingMatchmaking(true);
    try {
      const suggestions = await getMatchmakingSuggestions(currentUser, allUsers, allGroups);
      setMatchmakingSuggestions(suggestions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMatchmaking(false);
    }
  };

  // ... (Keep existing Virtual Partner logic)
  const createVirtualPartner = async (description: string) => {
    setLoadingVirtualPartner(true);
    setErrorVirtualPartner(null);
    try {
      const partner = await generateVirtualPartnerProfile(description);
      setVirtualPartner(partner);
      setVirtualPartnerChatHistory([]);
    } catch (e) {
      setErrorVirtualPartner("Failed to create partner.");
    } finally {
      setLoadingVirtualPartner(false);
    }
  };

  const updateVirtualPartner = (partner: VirtualPartner) => {
    setVirtualPartner(partner);
  };

  const resetVirtualPartner = () => {
    setVirtualPartner(null);
    setVirtualPartnerChatHistory([]);
  };

  const sendVirtualPartnerMessage = async (text: string) => {
    if (!virtualPartner) return;
    
    const userMsg: VirtualPartnerChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      text,
      timestamp: new Date().toISOString(),
      isVirtualPartner: false
    };
    
    setVirtualPartnerChatHistory(prev => [...prev, userMsg]);
    
    const typingMsgId = 'typing-' + Date.now();
    setVirtualPartnerChatHistory(prev => [...prev, {
      id: typingMsgId,
      senderId: virtualPartner.id,
      senderName: virtualPartner.name,
      text: '...',
      timestamp: new Date().toISOString(),
      isVirtualPartner: true
    }]);

    try {
      const response = await chatWithVirtualPartner(virtualPartner, virtualPartnerChatHistory, text);
      
      if (response.emotionalState || response.relationshipMeter) {
        setVirtualPartner(prev => prev ? ({
          ...prev,
          emotionalState: { ...prev.emotionalState, ...response.emotionalState },
          relationshipMeter: response.relationshipMeter ?? prev.relationshipMeter,
          currentScenario: response.currentScenario ?? prev.currentScenario,
          relationshipGoals: response.relationshipGoals ?? prev.relationshipGoals
        }) : null);
      }

      setVirtualPartnerChatHistory(prev => prev.filter(m => m.id !== typingMsgId).concat([{
        id: Date.now().toString(),
        senderId: virtualPartner.id,
        senderName: virtualPartner.name,
        text: response.text,
        timestamp: new Date().toISOString(),
        isVirtualPartner: true
      }]));

    } catch (e) {
      setErrorVirtualPartner("Failed to get response.");
      setVirtualPartnerChatHistory(prev => prev.filter(m => m.id !== typingMsgId));
    }
  };

  // ... (Keep existing search/matchmaking functions)
  const searchTravelBuddies = async (query: string, filters: TravelBuddyFilters) => {
    if (!currentUser) return;
    setLoadingTravelBuddies(true);
    setErrorTravelBuddies(null);
    try {
      const results = await getTravelBuddySuggestions(currentUser, allUsers, query, filters);
      setTravelBuddySuggestions(results);
    } catch (e) {
      setErrorTravelBuddies("Failed to find buddies.");
    } finally {
      setLoadingTravelBuddies(false);
    }
  };

  const searchDatingPartners = async (prefs: DatingPreferences) => {
    if (!currentUser) return;
    setLoadingDating(true);
    setErrorDating(null);
    try {
      const matches = await getDatingMatches(currentUser, allUsers, prefs);
      setDatingMatches(matches);
    } catch (e) {
      setErrorDating("Matchmaking failed.");
    } finally {
      setLoadingDating(false);
    }
  };

  const searchAstrologyPartners = async (prefs: AstrologyPreferences) => {
    if (!currentUser) return;
    setLoadingDating(true);
    setErrorDating(null);
    try {
      const matches = await getAstrologyMatches(currentUser, allUsers, prefs);
      setDatingMatches(matches);
    } catch (e) {
      setErrorDating("Cosmic scan failed.");
    } finally {
      setLoadingDating(false);
    }
  };

  const sendFriendRequest = (receiverId: string) => {
    if (!currentUser) return;
    const newReq: FriendRequest = {
      id: `fr-${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      status: 'pending'
    };
    setFriendRequests(prev => [...prev, newReq]);
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: receiverId,
      type: 'friend_request',
      message: `${currentUser.name} sent you a friend request.`,
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedId: currentUser.id
    };
    setNotifications(prev => [...prev, newNotif]);
  };

  const acceptFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'accepted' } : req));
    const req = friendRequests.find(r => r.id === requestId);
    if (req) {
      setAllUsers(prev => prev.map(u => {
        if (u.id === req.senderId) return { ...u, friends: [...u.friends, req.receiverId] };
        if (u.id === req.receiverId) return { ...u, friends: [...u.friends, req.senderId] };
        return u;
      }));
      if (currentUser && (currentUser.id === req.senderId || currentUser.id === req.receiverId)) {
         setCurrentUser(prev => prev ? { 
             ...prev, 
             friends: [...prev.friends, prev.id === req.senderId ? req.receiverId : req.senderId] 
         } : null);
      }
    }
  };

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const unfriend = (friendId: string) => {
    if (!currentUser) return;
    setAllUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) return { ...u, friends: u.friends.filter(id => id !== friendId) };
        if (u.id === friendId) return { ...u, friends: u.friends.filter(id => id !== currentUser.id) };
        return u;
      }));
    setCurrentUser(prev => prev ? { ...prev, friends: prev.friends.filter(id => id !== friendId) } : null);
  };

  const startDirectMessage = (userId: string) => {
    if (!currentUser) return;
    const existing = allConversations.find(c => c.participants.includes(currentUser.id) && c.participants.includes(userId));
    if (!existing) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participants: [currentUser.id, userId],
        messages: [],
        lastMessageTimestamp: new Date().toISOString()
      };
      setAllConversations(prev => [...prev, newConv]);
    }
  };

  const sendDirectMessage = (conversationId: string, text: string, attachment?: ChatAttachment) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachment
    };
    setAllConversations(prev => prev.map(c => c.id === conversationId ? {
      ...c,
      messages: [...c.messages, newMessage],
      lastMessageTimestamp: newMessage.timestamp
    } : c));
  };

  const updateMessageStatus = (conversationId: string, messageId: string, status: 'sent' | 'delivered' | 'read') => {
      setAllConversations(prev => prev.map(c => {
          if (c.id !== conversationId) return c;
          return {
              ...c,
              messages: c.messages.map(m => m.id === messageId ? { ...m, status } : m)
          };
      }));
  };

  // ... (Keep post logic)
  const createPost = useCallback((content: string, image?: string, video?: string, location?: string, feeling?: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      text: content,
      image,
      video,
      location,
      feeling,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      shares: 0
    };
    
    const updatedUser = { 
        ...currentUser, 
        posts: [newPost, ...(currentUser.posts || [])] 
    };
    
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  }, [currentUser]);

  const likePost = useCallback((postOwnerId: string, postId: string) => {
    if (!currentUser) return;
    setAllUsers(prev => prev.map(user => {
      if (user.id === postOwnerId) {
        return {
          ...user,
          posts: user.posts?.map(post => {
            if (post.id === postId) {
              const hasLiked = post.likes.includes(currentUser.id);
              return {
                ...post,
                likes: hasLiked ? post.likes.filter(id => id !== currentUser.id) : [...post.likes, currentUser.id]
              };
            }
            return post;
          })
        };
      }
      return user;
    }));
    
    if (postOwnerId === currentUser.id) {
        setCurrentUser(prev => {
            if(!prev) return null;
            return {
                ...prev,
                posts: prev.posts?.map(post => {
                    if(post.id === postId) {
                        const hasLiked = post.likes.includes(currentUser.id);
                        return { ...post, likes: hasLiked ? post.likes.filter(id => id !== currentUser.id) : [...post.likes, currentUser.id] };
                    }
                    return post;
                })
            }
        });
    }
  }, [currentUser]);

  const commentOnPost = useCallback((postOwnerId: string, postId: string, text: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toISOString()
    };

    setAllUsers(prev => prev.map(user => {
        if (user.id === postOwnerId) {
            return {
                ...user,
                posts: user.posts?.map(post => 
                    post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
                )
            };
        }
        return user;
    }));

    if (postOwnerId === currentUser.id) {
        setCurrentUser(prev => {
            if(!prev) return null;
            return {
                ...prev,
                posts: prev.posts?.map(post => 
                    post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
                )
            }
        });
    }
  }, [currentUser]);

  const sharePost = useCallback((postOwnerId: string, postId: string) => {
      if(!currentUser) return;
      setAllUsers(prev => prev.map(user => {
          if (user.id === postOwnerId) {
              return {
                  ...user,
                  posts: user.posts?.map(post => 
                      post.id === postId ? { ...post, shares: (post.shares || 0) + 1 } : post
                  )
              };
          }
          return user;
      }));
  }, [currentUser]);

  const awardVirtualCurrency = (amount: number) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, virtualBalance: (currentUser.virtualBalance || 0) + amount };
      updateUserProfile(updatedUser, { silent: true });
    }
  };

  const handleJoin = (type: 'group' | 'challenge' | 'event', id: string) => {
    if (!currentUser) return;
    if (type === 'group') {
      // In a real app, update Groups
    } else if (type === 'challenge') {
      setAllChallenges(prev => prev.map(c => c.id === id ? { ...c, participants: [...c.participants, currentUser.id] } : c));
    } else if (type === 'event') {
      setAllEvents(prev => prev.map(e => e.id === id ? { ...e, attendees: [...e.attendees, currentUser.id] } : e));
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const logWellnessEntry = (entry: MoodEntry) => {
    if (!currentUser) return;
    const existingIndex = currentUser.moodHistory.findIndex(e => e.date === entry.date);
    let newHistory = [...currentUser.moodHistory];
    if (existingIndex >= 0) {
        newHistory[existingIndex] = entry;
    } else {
        newHistory = [entry, ...newHistory];
    }
    newHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const updatedUser = { ...currentUser, moodHistory: newHistory };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleOnboardingComplete = (updatedData: Partial<User>) => {
    if (currentUser) {
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  // Travel Plan Management
  const addTravelPlan = (plan: TravelPlan) => {
      setTravelPlans(prev => [plan, ...prev]);
  };

  const deleteTravelPlan = (id: string) => {
      setTravelPlans(prev => prev.filter(p => p.id !== id));
  };

  const value: AppContextType = {
    currentUser, setCurrentUser,
    allUsers, setAllUsers,
    allGroups, setAllGroups,
    allChallenges, setAllChallenges,
    allEvents, setAllEvents,
    listings, setListings,
    meetingSpots, setMeetingSpots,
    adCampaigns, setAdCampaigns,
    allBookings, setAllBookings,
    
    // CRUD methods
    addListing, updateListing, deleteListing,
    addMeetingSpot, addEvent, addGroup, addBooking,

    friendRequests,
    allConversations,
    notifications,
    login, logout, updateUserProfile,
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, unfriend,
    startDirectMessage, sendDirectMessage, updateMessageStatus,
    createPost, likePost, commentOnPost, sharePost,
    matchmakingSuggestions, loadingMatchmaking, refreshMatchmaking,
    virtualPartner, createVirtualPartner, updateVirtualPartner, resetVirtualPartner, virtualPartnerChatHistory, sendVirtualPartnerMessage, loadingVirtualPartner, errorVirtualPartner,
    travelBuddySuggestions, loadingTravelBuddies, errorTravelBuddies, searchTravelBuddies,
    datingMatches, loadingDating, errorDating, searchDatingPartners, searchAstrologyPartners,
    awardVirtualCurrency, handleJoin, markNotificationAsRead,
    logWellnessEntry,
    isDarkMode, toggleTheme, themeColor, setThemeColor,
    selectedInterestsFilter, setSelectedInterestsFilter,
    selectedTravelStyleFilter, setSelectedTravelStyleFilter,
    selectedBudgetFilter, setSelectedBudgetFilter,
    selectedLookingForFilter, setSelectedLookingForFilter,
    mockInterests,
    heroSlides, setHeroSlides,
    wellnessBanners, setWellnessBanners,
    travelPlans, setTravelPlans, addTravelPlan, deleteTravelPlan
  };

  return (
    <AppContext.Provider value={value}>
      <div 
        className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#F8FAFC] dark:bg-[#0F172A] text-gray-900 dark:text-white transition-colors duration-300`}
        style={{
          '--color-primary': THEME_COLORS[themeColor].primary,
          '--color-secondary': THEME_COLORS[themeColor].secondary,
          '--color-accent': THEME_COLORS[themeColor].accent,
          '--color-primary-dark': THEME_COLORS[themeColor].primaryDark,
          '--color-secondary-dark': THEME_COLORS[themeColor].secondaryDark,
          '--color-accent-dark': THEME_COLORS[themeColor].accentDark,
        } as React.CSSProperties}
      >
        <Router>
          {currentUser && !currentUser.hasCompletedOnboarding && (
            <OnboardingModal user={currentUser} onComplete={handleOnboardingComplete} />
          )}
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<DetailedProfile />} />
                <Route path="/users/:userId" element={<DetailedProfile />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/travels" element={<TravelsPage />} />
                <Route path="/dating" element={<DatingPage />} />
                <Route path="/games-challenges" element={<GamesChallengesPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/wellness" element={<WellnessPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/virtual-partner/create" element={<VirtualPartnerCreationPage />} />
                <Route path="/virtual-partner/chat" element={<VirtualPartnerChatPage />} />
                <Route path="/groups" element={<div className="p-8 text-center text-gray-500">Groups feature coming soon.</div>} />
                <Route path="/events" element={<div className="p-8 text-center text-gray-500">Events feature coming soon.</div>} />
                <Route path="/chat" element={<ChatWindow currentUser={currentUser || mockUsers[0]} messages={[]} onSendMessage={()=>{}} allUsers={allUsers} />} />
                <Route path="/connections" element={<ConnectionsPage />} />
                <Route path="/friends" element={<ConnectionsPage />} />
                <Route path="/dm" element={<DirectMessageList />} />
                <Route path="/dm/:conversationId" element={<DirectMessageWindow />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </div>
    </AppContext.Provider>
  );
}
