
export enum Category {
  TECH = 'Tech',
  RETAIL = 'Retail',
  SERVICES = 'Services',
  FOOD = 'Food & Drink',
  HEALTH = 'Health & Wellness',
  FINANCE = 'Finance'
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  logo: string;
  rating: number;
  reviewCount: number;
  location: string;
  isFeatured?: boolean;
  offers: Offer[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  redeemCount: number;
  viralBonus?: string;
  couponCode?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  date: string;
  status: 'new' | 'contacted' | 'converted';
  message?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface AnalyticsData {
  date: string;
  views: number;
  leads: number;
  revenue: number;
}
