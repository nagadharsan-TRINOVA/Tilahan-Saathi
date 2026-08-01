import { FarmerProfile } from '../types';
import { initialFarmerProfile } from '../data/mockFarmer';
import { findAccountByEmail } from './userRegistry';

export function getCurrentUserEmail(): string {
  return localStorage.getItem('tilahan_current_user_email') || 'farmer@tilahansaathi.in';
}

export function setCurrentUserEmail(email: string): void {
  localStorage.setItem('tilahan_current_user_email', email.trim().toLowerCase());
}

export const farmerService = {
  getProfile: async (userEmail?: string): Promise<FarmerProfile> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const key = `tilahan_saathi_farmer_profile_${email}`;
    const data = localStorage.getItem(key);

    if (data) {
      try {
        return JSON.parse(data);
      } catch (_e) {
        // Fallback if parsing fails
      }
    }

    // Check registered account
    const account = findAccountByEmail(email);

    // If default demo accounts and no custom data saved yet, use initial mock profile
    if (email === 'farmer@tilahansaathi.in' || email === 'ramesh@gmail.com') {
      localStorage.setItem(key, JSON.stringify(initialFarmerProfile));
      return initialFarmerProfile;
    }

    // For a new registered user: build profile from exact user-given values (or zero/nil)
    const newProfile: FarmerProfile = {
      id: `user-${Date.now()}`,
      name: account?.name || email.split('@')[0] || 'Farmer User',
      email: email,
      phone: account?.phone || '',
      kisanId: account?.kisanId || '',
      state: account?.state || '',
      district: account?.district || '',
      village: account?.village || '',
      totalLandArea: account?.totalLandArea !== undefined ? Number(account.totalLandArea) : 0,
      preferredLanguage: 'en',
      avatarUrl: '',
      isDarkMode: false,
      notificationSettings: {
        weatherAlerts: true,
        taskReminders: true,
        schemeUpdates: true,
        marketPrices: true,
      },
    };

    localStorage.setItem(key, JSON.stringify(newProfile));
    return newProfile;
  },

  updateProfile: async (updates: Partial<FarmerProfile>, userEmail?: string): Promise<FarmerProfile> => {
    const email = (userEmail || getCurrentUserEmail()).trim().toLowerCase();
    const profile = await farmerService.getProfile(email);
    const updated = { ...profile, ...updates };
    const key = `tilahan_saathi_farmer_profile_${email}`;
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },
};
