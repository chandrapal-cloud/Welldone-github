
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  interests: string[];
  goals: Goal[];
  bio: string;
  friends: string[];
  moodHistory: MoodEntry[];
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  hasCompletedOnboarding: boolean;
  virtualBalance: number;
  occupation?: string;
  subscriptionTier?: 'free' | 'premium';
  travelDiary?: TravelDiaryEntry[];
  gallery: GalleryItem[];
  country?: string;
  city?: string;
  area?: string;
  language?: string;
  currency?: string;
  religion?: string;
  politicalView?: string;
  philosophy?: string;
  socialMediaLinks?: SocialMediaLinks;
  preferences?: UserPreferences;
  posts?: Post[];
  instaId?: string;
  fbId?: string;
  spotifyId?: string;
  currentLocation?: string;
  education?: string;
  company?: string;
  whyImHere?: string;
  socialActivity?: SocialActivity[];
  theme?: string;
}

export interface Goal {
  id: string;
  title: string;
  name?: string; // Compatibility
  category: string;
  progress: number;
  completed: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  type: 'image' | 'video';
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  units: 'metric' | 'imperial';
  timezone: string;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  contentFilter?: 'moderate' | 'strict' | 'off';
}

export interface SocialActivity {
  id: string;
  platform: string;
  timestamp: string;
  content: string;
  image?: string;
  likes?: number;
  url: string;
}

export interface Group {
  id: string;
  name: string;
  image: string;
  description: string;
  interests: string[];
  members: string[];
}

export interface Challenge {
  id: string;
  name: string;
  image: string;
  description: string;
  reward: string;
  participants: string[];
}

export interface Event {
  id: string;
  name: string;
  image: string;
  description: string;
  date: string;
  location: string;
  attendees: string[];
}

export interface MatchmakingResult {
  users: { id: string; name: string; reason: string }[];
  groups: { id: string; name: string; reason: string }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: ChatAttachment;
}

export interface ChatAttachment {
  type: 'game' | 'travel' | 'event' | 'group' | 'gif' | 'music' | 'movie' | 'book';
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  lastMessageTimestamp: string;
}

export interface VirtualPartner {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  interests: string[];
  personalityTraits: string[];
  relationshipType: string;
  visualStyle: string;
  communicationStyle: string;
  relationshipMeter: number;
  emotionalState: { happiness: number; motivation: number; trust: number };
  currentScenario: string | null;
  relationshipGoals: { name: string; complete: boolean }[];
}

export interface VirtualPartnerChatMessage extends ChatMessage {
  isVirtualPartner: boolean;
}

export interface VirtualPartnerChatResponse {
  text: string;
  emotionalState?: { happiness: number; motivation: number; trust: number };
  relationshipMeter?: number;
  currentScenario?: string;
  relationshipGoals?: { name: string; complete: boolean }[];
}

export interface SuggestedTravelBuddy {
  id: string;
  name: string;
  matchScore: number;
  reason: string;
}

export interface TravelBuddyFilters {
  interests: string[];
  travelStyle: string | null;
  budget: string | null;
}

export interface MoodEntry {
  date: string;
  mood: string;
  water: number;
  sleep: number;
  note: string;
}

export interface SuggestedDatingMatch {
  id: string;
  name: string;
  compatibilityScore: number;
  reason: string;
  icebreaker: string;
}

export interface DatingPreferences {
  description: string;
  relationshipGoal: string;
}

export interface AstrologyPreferences {
  nameContains?: string;
  birthDate?: string;
  luckyNumber?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'friend_request' | 'activity_invite' | 'activity_update';
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface Post {
  id: string;
  authorId: string;
  text: string;
  image?: string;
  video?: string;
  location?: string;
  feeling?: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
  shares: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  theme?: string;
  subtitle: string;
  quoteAuthor?: string;
}

export interface WellnessBanner {
  id: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
  subtitle: string;
  actionUrl?: string;
}

export interface Listing {
  id: string;
  name: string;
  tagline: string;
  description: string;
  gallery: string[];
  category: string;
  subCategory: string;
  rating: number;
  reviewCount: number;
  location: string;
  contact: string;
  services: ServiceItem[];
  features: string[];
  priceRange: 'Economy' | 'Standard' | 'Premium';
  verified: boolean;
  ownerId: string;
  socials: { website?: string; instagram?: string; whatsapp?: string };
  team: any[];
  reviews: any[];
  promoted?: boolean;
  openingHours?: string;
  seoTags?: string[];
}

export interface AdCampaign {
  id: string;
  title: string;
  image: string;
  link: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  image: string;
  price: string;
}

export interface TravelPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  dates: string;
  wellnessFocus: string[];
}

export interface MeetingSpot {
    id: string;
    name: string;
    type: string;
    location: string;
    address: string;
    mapUrl: string;
    vibe: string;
    visualTheme?: 'Mystical' | 'Modern' | 'Cozy' | 'Energetic';
    image: string;
    tags: string[];
    description: string;
    rating: number;
    approved: boolean;
    addedBy: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  image: string;
}

export type RelationshipGoal = 'Long-term Partner' | 'Workout Buddy & More' | 'Activity Partner' | 'Intellectual Connection' | 'Spiritual Journey' | 'Friendship First' | 'Any';

export interface ShareContentResult {
    facebook: string;
    instagram: string;
    threads: string;
    whatsapp: string;
    linkedin: string;
}

export interface TravelDiaryEntry {
    id: string;
    location: string;
    date: string;
    story: string;
    image: string;
    invitedUserIds: string[];
}

export interface Interest {
    id: string;
    name: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
}

export interface Reel {
    id: string;
    url: string;
}

export interface ActivityUpdate {
    id: string;
    content: string;
}

export interface WellnessActivity {
    id: string;
    name: string;
    type: string;
    description: string;
    image: string;
    location: string;
    date: string;
    tags: string[];
}

export interface LocalExpert {
    id: string;
    name: string;
    avatar: string;
    expertise: string[];
    bioSnippet: string;
}
