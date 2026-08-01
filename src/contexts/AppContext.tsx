import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FarmerProfile, Language, AppNotification, LandRecord } from '../types';
import { farmerService, setCurrentUserEmail, getCurrentUserEmail } from '../services/farmerService';
import { landService } from '../services/landService';
import { initialNotifications } from '../data/mockNotifications';
import { translations } from '../utils/translations';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  profile: FarmerProfile | null;
  authUser: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loginUser: (userName: string, userEmail?: string, extraData?: Partial<FarmerProfile>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  lands: LandRecord[];
  refreshLands: () => Promise<void>;
  updateProfile: (updates: Partial<FarmerProfile>) => Promise<void>;
  signOutSupabase: () => Promise<void>;
  t: (key: string) => string;
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('tilahan_authenticated') === 'true';
  });
  const [language, setLanguageState] = useState<Language>('en');
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [lands, setLands] = useState<LandRecord[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Initial profile & lands load for current user
    const currentEmail = getCurrentUserEmail();
    farmerService.getProfile(currentEmail).then((p) => {
      setProfile(p);
      setLanguageState(p.preferredLanguage || 'en');
    });
    landService.getLands(currentEmail).then(setLands);

    // Initialize Supabase Auth session & listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthenticated(true);
        localStorage.setItem('tilahan_authenticated', 'true');
        syncAuthUserToProfile(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthenticated(true);
        localStorage.setItem('tilahan_authenticated', 'true');
        syncAuthUserToProfile(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginUser = (userName: string, userEmail?: string, extraData?: Partial<FarmerProfile>) => {
    const cleanEmail = (userEmail || 'farmer@tilahansaathi.in').trim().toLowerCase();
    setCurrentUserEmail(cleanEmail);
    setIsAuthenticated(true);
    localStorage.setItem('tilahan_authenticated', 'true');

    farmerService.getProfile(cleanEmail).then(async (existingP) => {
      const updates: Partial<FarmerProfile> = {
        name: userName || existingP.name || 'Farmer User',
        email: cleanEmail,
        ...extraData,
      };
      const updatedProfile = await farmerService.updateProfile(updates, cleanEmail);
      setProfile(updatedProfile);

      const userLands = await landService.getLands(cleanEmail);
      setLands(userLands);
    });
  };

  const syncAuthUserToProfile = (user: SupabaseUser) => {
    const email = (user.email || 'farmer@tilahansaathi.in').trim().toLowerCase();
    setCurrentUserEmail(email);
    const meta = user.user_metadata || {};
    const nameVal = meta.name || meta.full_name || email.split('@')[0] || 'Farmer User';

    farmerService.getProfile(email).then(async (existing) => {
      const updatedProfile = await farmerService.updateProfile(
        {
          id: user.id,
          name: nameVal,
          email: email,
          phone: meta.phone || existing.phone || '',
          kisanId: meta.kisan_id || existing.kisanId || '',
          village: meta.village || existing.village || '',
          district: meta.district || existing.district || '',
          state: meta.state || existing.state || '',
          totalLandArea: meta.total_land_area !== undefined ? Number(meta.total_land_area) : existing.totalLandArea || 0,
        },
        email
      );
      setProfile(updatedProfile);
      const userLands = await landService.getLands(email);
      setLands(userLands);
    });
  };

  const signOutSupabase = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setSession(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tilahan_authenticated');
    localStorage.removeItem('tilahan_current_user_email');
    setProfile(null);
    setLands([]);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out successfully.',
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (profile) {
      farmerService.updateProfile({ preferredLanguage: lang });
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const refreshLands = async () => {
    const list = await landService.getLands();
    setLands(list);
  };

  const updateProfile = async (updates: Partial<FarmerProfile>) => {
    const updated = await farmerService.updateProfile(updates);
    setProfile(updated);
  };

  const t = (key: string): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        profile,
        authUser,
        session,
        isAuthenticated,
        loginUser,
        language,
        setLanguage,
        notifications,
        unreadCount,
        markNotificationRead,
        clearAllNotifications,
        isNotificationOpen,
        setIsNotificationOpen,
        lands,
        refreshLands,
        updateProfile,
        signOutSupabase,
        t,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

