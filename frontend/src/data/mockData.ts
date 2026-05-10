export const mockDestinations = [
  { id: '1', name: 'Paris', country: 'France', costIndex: '$$$', region: 'Europe', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
  { id: '2', name: 'Rome', country: 'Italy', costIndex: '$$', region: 'Europe', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
  { id: '3', name: 'Tokyo', country: 'Japan', costIndex: '$$$', region: 'Asia', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { id: '4', name: 'Bali', country: 'Indonesia', costIndex: '$', region: 'Southeast Asia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
  { id: '5', name: 'New York', country: 'United States', costIndex: '$$$$', region: 'Americas', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
  { id: '6', name: 'London', country: 'United Kingdom', costIndex: '$$$', region: 'Europe', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' },
  { id: '7', name: 'Cape Town', country: 'South Africa', costIndex: '$$', region: 'Africa', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400' },
  { id: '8', name: 'Sydney', country: 'Australia', costIndex: '$$$', region: 'Oceania', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400' },
];

export const mockRecentTrips = [
  { id: '1', name: 'Paris & Rome Adventure', destination: 'Europe', coverPhoto: 'https://images.unsplash.com/photo-1502602898657?w=400', startDate: '2025-06-01', endDate: '2025-06-14', status: 'upcoming', planningScore: 75, budget: { total: 3000, spent: 1200, currency: 'USD' } },
  { id: '2', name: 'Bali Retreat', destination: 'Southeast Asia', coverPhoto: 'https://images.unsplash.com/photo-1537996194471?w=400', startDate: '2025-07-10', endDate: '2025-07-20', status: 'upcoming', planningScore: 45, budget: { total: 2000, spent: 400, currency: 'USD' } },
  { id: '3', name: 'Japan Explorer', destination: 'Asia', coverPhoto: 'https://images.unsplash.com/photo-1540959733332?w=400', startDate: '2025-03-01', endDate: '2025-03-10', status: 'completed', planningScore: 100, budget: { total: 2500, spent: 2300, currency: 'USD' } },
  { id: '4', name: 'New York City Break', destination: 'North America', coverPhoto: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400', startDate: '2024-11-20', endDate: '2024-11-25', status: 'completed', planningScore: 100, budget: { total: 1500, spent: 1450, currency: 'USD' } },
];

export const mockCommunityPosts = [
  { id: '1', authorName: 'Priya Patel', authorAvatar: 'https://i.pravatar.cc/150?u=priya', tripTitle: 'Japan Explorer', excerpt: 'Just got back from 10 days in Tokyo and Kyoto. The cherry blossoms were incredible...', likes: 24, comments: 8, timeAgo: '5 days ago' },
  { id: '2', authorName: 'Marcus Johnson', authorAvatar: 'https://i.pravatar.cc/150?u=marcus', tripTitle: 'Bali Retreat', excerpt: 'Found the most amazing hidden waterfall near Ubud. Highly recommend renting a scooter to get there.', likes: 45, comments: 12, timeAgo: '1 week ago' },
  { id: '3', authorName: 'Sarah Chen', authorAvatar: 'https://i.pravatar.cc/150?u=sarah', tripTitle: 'Paris on a Budget', excerpt: 'Yes, it is possible! Here is my itinerary for 5 days in Paris for under $500 (excluding flights).', likes: 112, comments: 34, timeAgo: '2 weeks ago' },
];
