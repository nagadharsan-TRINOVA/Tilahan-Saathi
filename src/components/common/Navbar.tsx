import React, { useState } from 'react';
import {
  Sprout,
  Bell,
  Search,
  Globe,
  Sun,
  User,
  ChevronDown,
  Menu,
  PhoneCall,
  Check,
  ExternalLink,
  ShoppingBag,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { languageNames } from '../../utils/translations';
import { Language } from '../../types';
import { Drawer } from './Drawer';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    profile,
    authUser,
    signOutSupabase,
    language,
    setLanguage,
    unreadCount,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    isNotificationOpen,
    setIsNotificationOpen,
    t,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  const handleSearchResultClick = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#66BB6A] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-[#FFB300]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-extrabold text-slate-900 tracking-tight font-serif">
                    {t('appTitle')}
                  </h1>
                  <span className="bg-[#FFB300]/20 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[#FFB300]/40">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium hidden sm:block">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Search Trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 text-slate-500 rounded-xl px-4 py-2 text-xs flex items-center justify-between border border-slate-200 transition-colors shadow-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-700" />
                <span>{t('searchPlaceholder')}</span>
              </span>
              <kbd className="bg-white text-slate-400 text-[10px] px-1.5 py-0.5 rounded border shadow-2xs font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Weather Badge */}
            <div
              onClick={() => navigate('/weather')}
              className="hidden sm:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 px-3 py-1.5 rounded-xl cursor-pointer transition-colors text-xs font-semibold text-emerald-900"
            >
              <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>29.4°C</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-600 font-normal truncate max-w-[80px]">
                Jaipur
              </span>
            </div>

            {/* Helpline quick trigger */}
            <a
              href="tel:18001801551"
              title="Kisan Call Center Helpline"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/60 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl transition-colors border border-emerald-200/60"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span>1800-180-1551</span>
            </a>

            {/* Quick Input Store & Orders Trigger */}
            <button
              onClick={() => navigate('/store')}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-[#FFB300] hover:bg-amber-400 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
              title="Seed Mini-Kits & Orders (Supabase)"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Store & Orders</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                aria-label="Select language"
              >
                <Globe className="w-4 h-4 text-emerald-700" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Language / भाषा चुनें
                  </div>
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLangChange(lang)}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        language === lang
                          ? 'font-bold text-[#2E7D32] bg-emerald-50/80'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{languageNames[lang].nativeName}</span>
                      <span className="text-[10px] text-slate-400">
                        ({languageNames[lang].name})
                      </span>
                      {language === lang && (
                        <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Farmer Avatar & Auth Status */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 cursor-pointer group"
                title={`Logged in as ${profile?.name || 'Farmer'}`}
              >
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-600/30 group-hover:ring-emerald-600 transition-all shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden md:inline text-xs font-bold text-slate-800 group-hover:text-[#2E7D32]">
                  {profile?.name || 'Farmer User'}
                </span>
              </div>

              {/* Explicit Sign Out Button */}
              <button
                onClick={signOutSupabase}
                className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-xl transition-all shadow-2xs"
                title="Sign Out of session"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        title={t('notifications')}
        subtitle="Live weather, task, scheme & market price updates"
      >
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500">
            {unreadCount} Unread
          </span>
          <button
            onClick={clearAllNotifications}
            className="text-xs font-semibold text-[#2E7D32] hover:underline"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.actionUrl) {
                  setIsNotificationOpen(false);
                  navigate(n.actionUrl);
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                n.isRead
                  ? 'bg-slate-50/60 border-slate-200 opacity-75'
                  : 'bg-emerald-50/60 border-emerald-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-bold text-xs text-slate-900">
                  {n.title}
                </span>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {n.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {n.message}
              </p>
              {n.actionUrl && (
                <div className="mt-2 flex items-center text-[11px] font-semibold text-[#2E7D32] hover:underline">
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Drawer>

      {/* Global Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-emerald-700" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crops, recommendations, lands, weather, schemes..."
                className="w-full text-sm outline-none text-slate-800 placeholder-slate-400"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                ESC
              </button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                Quick Navigation Shortcuts
              </p>

              {[
                { title: 'Yellow Mustard AI Recommendation', path: '/crop-recommendation', category: 'Crop AI' },
                { title: 'Surya Mustard Field North', path: '/land-management', category: 'Land' },
                { title: 'National Mission on Edible Oils Subsidy', path: '/government-schemes', category: 'Scheme' },
                { title: '7-Day Rain & Temperature Advisory', path: '/weather', category: 'Weather' },
                { title: 'Sowing & Irrigation Calendar', path: '/crop-calendar', category: 'Calendar' },
              ]
                .filter((item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchResultClick(item.path)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 flex items-center justify-between text-xs text-slate-800 transition-colors"
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
