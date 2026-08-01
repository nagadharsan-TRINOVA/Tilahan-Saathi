import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Sparkles,
  CalendarDays,
  CloudSun,
  Building2,
  User,
  ShoppingBag,
  HelpCircle,
  PhoneCall,
  X,
  Sprout,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { t, profile, authUser, signOutSupabase } = useApp();

  const navItems = [
    {
      name: t('dashboard'),
      path: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: t('landManagement'),
      path: '/land-management',
      icon: MapPin,
      badge: '4 Farms',
    },
    {
      name: t('cropRecommendation'),
      path: '/crop-recommendation',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-[#FFB300] text-amber-950 font-bold',
    },
    {
      name: t('cropCalendar'),
      path: '/crop-calendar',
      icon: CalendarDays,
      badge: 'Tasks',
    },
    {
      name: t('weatherAdvisory'),
      path: '/weather',
      icon: CloudSun,
      badge: 'Rain Alert',
      badgeColor: 'bg-rose-100 text-rose-800 font-semibold',
    },
    {
      name: t('governmentSchemes'),
      path: '/government-schemes',
      icon: Building2,
      badge: 'Subsidies',
    },
    {
      name: 'Seed Store & Orders',
      path: '/store',
      icon: ShoppingBag,
      badge: 'Supabase DB',
      badgeColor: 'bg-emerald-400 text-emerald-950 font-bold',
    },
    {
      name: 'Supabase Auth Login',
      path: '/login',
      icon: KeyRound,
      badge: 'Auth',
      badgeColor: 'bg-emerald-200 text-emerald-900 font-bold',
    },
    {
      name: t('profile'),
      path: '/profile',
      icon: User,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-[#1B431E] text-white border-r border-[#2E7D32]/30 shadow-md">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#2E7D32]/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FFB300] rounded-xl flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 bg-[#1B431E] rounded-full" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-[#F8FAF5] font-serif block leading-none">
              Tilahan Saathi
            </span>
            <span className="text-[10px] text-emerald-200/70 font-medium">
              NMEO Oilseeds Portal
            </span>
          </div>
        </div>

        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-emerald-200/70 hover:text-white rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Nav Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300/60 font-mono">
          Farmer Navigation
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-colors group ${
                isActive
                  ? 'bg-[#2E7D32] text-white font-bold shadow-sm'
                  : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#FFB300]' : 'text-emerald-300/80'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-[#1B431E] text-white'
                        : 'bg-[#2E7D32]/80 text-emerald-100'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-4 border-t border-[#2E7D32]/30 bg-[#163819]/80 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={
              profile?.avatarUrl ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
            }
            alt={profile?.name || 'Farmer'}
            className="w-10 h-10 bg-[#FFB300] rounded-full border-2 border-white/20 object-cover shrink-0"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-white truncate">
              {profile?.name || 'Ramesh Patel'}
            </p>
            <p className="text-[10px] text-emerald-200/70 truncate">
              {profile?.district || 'Jaipur'}, {profile?.state || 'Rajasthan'}
            </p>
          </div>
        </div>

        {/* Sign Out Action Button */}
        <button
          onClick={signOutSupabase}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 hover:bg-red-600/40 text-red-200 border border-red-500/30 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />
          <div className="relative w-64 max-w-xs bg-white h-full shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
