
import { 
  User, Group, Challenge, Event, FriendRequest, Conversation, Notification, 
  HeroSlide, TravelPlan, Booking, AdCampaign, MeetingSpot 
} from './types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    interests: ['Yoga', 'Hiking', 'Meditation'],
    goals: [],
    bio: 'Love to travel and find peace.',
    friends: ['user2', 'user3'],
    moodHistory: [],
    role: 'user',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 500,
    occupation: 'Graphic Designer',
    gallery: [],
    socialMediaLinks: {},
    preferences: {
        language: 'English',
        currency: 'USD',
        units: 'metric',
        timezone: 'UTC',
        fontSize: 'medium',
        reducedMotion: false
    }
  },
  {
    id: 'user2',
    name: 'Mike Ross',
    email: 'mike@example.com',
    avatar: 'https://picsum.photos/seed/mike/200/200',
    interests: ['Running', 'Cooking'],
    goals: [],
    bio: 'Always on the run.',
    friends: ['user1'],
    moodHistory: [],
    role: 'user',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 200,
    occupation: 'Chef',
    gallery: []
  },
  {
    id: 'user3',
    name: 'Emma Watson',
    email: 'emma@example.com',
    avatar: 'https://picsum.photos/seed/emma/200/200',
    interests: ['Reading', 'Yoga'],
    goals: [],
    bio: 'Books are magic.',
    friends: ['user1'],
    moodHistory: [],
    role: 'user',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 800,
    occupation: 'Writer',
    gallery: []
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@welldone.com',
    avatar: 'https://picsum.photos/seed/admin/200/200',
    interests: [],
    goals: [],
    bio: 'System Administrator',
    friends: [],
    moodHistory: [],
    role: 'admin',
    status: 'active',
    hasCompletedOnboarding: true,
    virtualBalance: 9999,
    occupation: 'Admin',
    gallery: []
  }
];

export const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Morning Yoga',
    image: 'https://picsum.photos/seed/yoga_group/400/300',
    description: 'Start your day with zen.',
    interests: ['Yoga', 'Meditation'],
    members: ['user1', 'user3']
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: 'chal1',
    name: '30 Days of Gratitude',
    image: 'https://picsum.photos/seed/gratitude/400/300',
    description: 'Write one thing you are grateful for every day.',
    reward: 'Gratitude Badge',
    participants: ['user1', 'user2']
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    name: 'Sunset Meditation',
    image: 'https://picsum.photos/seed/sunset_med/400/300',
    description: 'Join us for a guided meditation at sunset.',
    date: '2024-12-01T18:00:00Z',
    location: 'City Park',
    attendees: ['user1', 'user3']
  }
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'req1',
    senderId: 'user2',
    receiverId: 'user3',
    status: 'pending'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: ['user1', 'user2'],
    messages: [
      {
        id: 'm1',
        senderId: 'user1',
        senderName: 'Sarah',
        text: 'Hey Mike! How was your run?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'read'
      },
      {
        id: 'm2',
        senderId: 'user2',
        senderName: 'Mike',
        text: 'It was great! Did 5k.',
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: 'read'
      }
    ],
    lastMessageTimestamp: new Date().toISOString()
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'user1',
    type: 'friend_request',
    message: 'Mike sent you a friend request.',
    isRead: false,
    createdAt: new Date().toISOString()
  }
];

export const mockInterests = [
  { id: 'i1', name: 'Yoga' },
  { id: 'i2', name: 'Hiking' },
  { id: 'i3', name: 'Meditation' },
  { id: 'i4', name: 'Running' },
  { id: 'i5', name: 'Cooking' },
  { id: 'i6', name: 'Reading' },
  { id: 'i7', name: 'Travel' }
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/hero1/1600/900',
    title: 'Find Your Balance',
    subtitle: 'Connect with your inner self and the world around you.',
    theme: 'text-white'
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/hero2/1600/900',
    title: 'Explore Together',
    subtitle: 'Journeys are better when shared.',
    theme: 'text-white'
  }
];

export const mockTravelPlans: TravelPlan[] = [
  {
    id: 'tp1',
    name: 'Bali Retreat',
    description: 'A week of yoga and wellness in Ubud.',
    image: 'https://picsum.photos/seed/bali/400/300',
    location: 'Bali, Indonesia',
    dates: 'Aug 2024',
    wellnessFocus: ['Yoga', 'Detox']
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    userId: 'user1',
    userName: 'Sarah Jenkins',
    serviceName: 'Deep Tissue Massage',
    providerName: 'Mindful Soul Clinic',
    date: '2024-11-15',
    time: '14:00',
    status: 'confirmed',
    image: 'https://picsum.photos/seed/massage/100/100',
    price: '$80'
  }
];

export const mockAdCampaigns: AdCampaign[] = [
  {
    id: 'ad1',
    title: 'Summer Sale',
    image: 'https://picsum.photos/seed/summer_sale/400/200',
    link: '#'
  }
];

export const COUNTRIES = ['USA', 'Canada', 'UK', 'Australia', 'India', 'Japan', 'Germany', 'France', 'Brazil'];
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
    'USA': ['New York', 'Los Angeles', 'Chicago', 'San Francisco'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal'],
    'UK': ['London', 'Manchester', 'Edinburgh'],
    'India': ['Mumbai', 'Delhi', 'Bangalore'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto'],
    'Germany': ['Berlin', 'Munich', 'Hamburg'],
    'France': ['Paris', 'Lyon', 'Marseille'],
    'Brazil': ['Sao Paulo', 'Rio de Janeiro']
};
export const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi', 'Portuguese'];
export const RELIGIONS = ['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Judaism', 'Sikhism', 'Atheist', 'Agnostic', 'Spiritual'];
export const POLITICAL_VIEWS = ['Liberal', 'Conservative', 'Moderate', 'Libertarian', 'Green', 'Apolitical'];
export const PHILOSOPHIES = ['Stoicism', 'Existentialism', 'Nihilism', 'Utilitarianism', 'Humanism', 'Taoism'];
export const CURRENCIES = ['USD ($) - US Dollar', 'EUR (€) - Euro', 'GBP (£) - British Pound', 'JPY (¥) - Japanese Yen', 'CAD ($) - Canadian Dollar', 'AUD ($) - Australian Dollar', 'INR (₹) - Indian Rupee'];

export const MOCK_COMMUNITY_PULSE = [
    { id: 'cp1', user: 'Sarah', action: 'completed a 5k run', timeAgo: '2m ago', avatar: 'https://picsum.photos/seed/sarah/50/50' },
    { id: 'cp2', user: 'Mike', action: 'meditated for 20 mins', timeAgo: '15m ago', avatar: 'https://picsum.photos/seed/mike/50/50' },
    { id: 'cp3', user: 'Emma', action: 'joined "Book Club"', timeAgo: '1h ago', avatar: 'https://picsum.photos/seed/emma/50/50' }
];

export const MARKETPLACE_CATEGORIES: Record<string, string[]> = {
    'All': [],
    'Meditation & Yoga': ['Classes', 'Retreats', 'Equipment'],
    'Nutrition': ['Meal Plans', 'Supplements', 'Coaching'],
    'Services': ['Massage', 'Therapy', 'Life Coaching'],
    'Travel': ['Tours', 'Accommodations', 'Experiences']
};

export const SUCCESS_STORIES = [
    { id: 's1', couple: 'Jen & Mark', location: 'Kyoto', story: 'Met on Welldone and traveled Japan together.', image: 'https://picsum.photos/seed/couple1/400/300' },
    { id: 's2', couple: 'The Hiking Crew', location: 'Patagonia', story: 'A group of strangers became best friends on the trail.', image: 'https://picsum.photos/seed/group1/400/300' }
];

export const INITIAL_MEETING_SPOTS: MeetingSpot[] = [
  {
    id: 'spot1',
    name: 'The Alchemist',
    type: 'Cocktail Bar',
    location: 'London, UK',
    address: '63-66 St Martin\'s Ln',
    mapUrl: '#',
    vibe: 'Mystical',
    visualTheme: 'Mystical',
    image: 'https://picsum.photos/seed/alchemist/400/300',
    tags: ['Nightlife'],
    description: 'A dark, copper-walled bar serving theatrical cocktails.',
    rating: 4.5,
    approved: true,
    addedBy: 'admin'
  }
];
