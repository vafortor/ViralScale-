
import { Business, Category, Lead, AnalyticsData, Booking } from './types';

export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Sparkly Cleaners',
    slug: 'sparkly-cleaners',
    description: 'Eco-friendly premium home cleaning services for busy professionals.',
    category: Category.SERVICES,
    logo: 'https://images.unsplash.com/photo-1581578731522-9b7d7b8dc691?auto=format&fit=crop&q=80&w=200',
    rating: 4.8,
    reviewCount: 124,
    location: 'San Francisco, CA',
    isFeatured: true,
    offers: [
      {
        id: 'o1',
        title: '20% Off Deep Clean',
        description: 'Get your first deep clean at 20% discount.',
        discount: '20%',
        expiryDate: '2026-12-31',
        redeemCount: 45,
        viralBonus: 'Refer a neighbor, get 1 free standard clean!',
        couponCode: 'SPARK20'
      }
    ]
  },
  {
    id: '2',
    name: 'Lumina Tech',
    slug: 'lumina-tech',
    description: 'Next-gen smart home solutions and installation.',
    category: Category.TECH,
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    reviewCount: 89,
    location: 'Austin, TX',
    offers: [
      {
        id: 'o3',
        title: 'Free Smart Audit',
        description: 'Complimentary home audit for smart device compatibility.',
        discount: 'Free',
        expiryDate: '2026-11-20',
        redeemCount: 12,
        couponCode: 'SMARTFREE'
      }
    ]
  },
  {
    id: '3',
    name: 'Green Bites',
    slug: 'green-bites',
    description: 'Delicious organic meal prep delivered to your doorstep.',
    category: Category.FOOD,
    logo: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=200',
    rating: 4.7,
    reviewCount: 256,
    location: 'New York, NY',
    isFeatured: true,
    offers: [
      {
        id: 'o2',
        title: 'Buy 5 Meals, Get 2 Free',
        description: 'Perfect for your first week of meal prep.',
        discount: 'Free Meals',
        expiryDate: '2026-11-15',
        redeemCount: 112,
        couponCode: 'BITESFREE'
      }
    ]
  }
];

export const MOCK_BLOG_POSTS = [
  {
    id: '1',
    title: 'How to make your local service business go viral',
    excerpt: 'Simple referral loops that turned a cleaning company into a 7-figure brand.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500',
    date: 'Oct 15, 2025',
    category: 'Growth Hacks'
  },
  {
    id: '2',
    title: 'Top 10 High-Converting Offer Templates',
    excerpt: 'Stop guessing. Use these proven discount structures to capture more leads.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=500',
    date: 'Oct 12, 2025',
    category: 'Sales'
  }
];

export const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'John Doe', email: 'john@example.com', source: 'Instagram Ad', date: '2026-01-25', status: 'new', message: 'I need a cleaning for my 2-bedroom apartment.' },
  { id: 'l2', name: 'Jane Smith', email: 'jane@viral.com', source: 'Referral Link', date: '2026-01-24', status: 'converted', message: 'Interested in the smart home audit.' },
  { id: 'l3', name: 'Mike Ross', email: 'mike@firm.com', source: 'Google Search', date: '2026-01-23', status: 'contacted', message: 'Price list please.' },
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'b1', customerName: 'Alice Cooper', service: 'Deep Cleaning', date: '2026-02-10', time: '10:00 AM', status: 'confirmed' },
  { id: 'b2', customerName: 'Bob Dylan', service: 'Standard Cleaning', date: '2026-02-11', time: '02:00 PM', status: 'pending' },
];

export const MOCK_ANALYTICS: AnalyticsData[] = [
  { date: 'Jan 19', views: 400, leads: 12, revenue: 1200 },
  { date: 'Jan 20', views: 600, leads: 25, revenue: 2500 },
  { date: 'Jan 21', views: 550, leads: 18, revenue: 1800 },
  { date: 'Jan 22', views: 800, leads: 40, revenue: 4000 },
  { date: 'Jan 23', views: 950, leads: 52, revenue: 5200 },
  { date: 'Jan 24', views: 1100, leads: 65, revenue: 6500 },
];
