import { FarmerProfile } from '../types';

export const initialFarmerProfile: FarmerProfile = {
  id: 'farmer-101',
  name: 'Ramesh Patel',
  phone: '+91 98765 43210',
  email: 'ramesh.patel@kisan.in',
  kisanId: 'KSN-2026-98421',
  state: 'Rajasthan',
  district: 'Jaipur',
  village: 'Chomu',
  totalLandArea: 12.5,
  preferredLanguage: 'en',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  isDarkMode: false,
  notificationSettings: {
    weatherAlerts: true,
    taskReminders: true,
    schemeUpdates: true,
    marketPrices: true,
  },
};
