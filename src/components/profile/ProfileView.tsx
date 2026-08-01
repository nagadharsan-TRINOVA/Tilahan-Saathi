import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useApp } from '../../contexts/AppContext';
import { languageNames } from '../../utils/translations';
import { Language } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  Bell,
  Moon,
  HelpCircle,
  PhoneCall,
  LogOut,
  LogIn,
  ShieldCheck,
  Check,
  Save,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profile, authUser, signOutSupabase, updateProfile, language, setLanguage, addToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name || 'Ramesh Patel');
  const [phone, setPhone] = useState(profile?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(profile?.email || 'ramesh.patel@kisan.in');
  const [state, setState] = useState(profile?.state || 'Rajasthan');
  const [district, setDistrict] = useState(profile?.district || 'Jaipur');
  const [village, setVillage] = useState(profile?.village || 'Chomu');
  const [isDarkMode, setIsDarkMode] = useState(profile?.isDarkMode || false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.email) setEmail(profile.email);
      if (profile.state) setState(profile.state);
      if (profile.district) setDistrict(profile.district);
      if (profile.village) setVillage(profile.village);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        phone,
        email,
        state,
        district,
        village,
        isDarkMode,
      });
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your farmer profile & notification preferences have been saved.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not save profile preferences.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-xl border-none">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={
                profile?.avatarUrl ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
              }
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#FFB300]/40 shadow-md"
            />

            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl font-extrabold font-serif text-white">{profile?.name || name}</h1>
              <p className="text-xs text-emerald-200 flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck className="w-4 h-4 text-[#FFB300]" />
                <span>Verified Kisan ID: {profile?.kisanId}</span>
              </p>
              <p className="text-xs text-emerald-300">
                {village}, {district}, {state} • {profile?.totalLandArea} Acres Registered
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {authUser ? (
              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={signOutSupabase}
                className="bg-red-500/10 border-red-400/40 text-red-200 hover:bg-red-500/20"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="accent"
                size="sm"
                icon={LogIn}
                onClick={() => navigate('/login')}
              >
                Log In / Register
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Form & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Details */}
        <Card className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base font-serif">
              Farmer Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Village / Tehsil
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              icon={Save}
              isLoading={isSaving}
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Preferences & Helpline Sidebar */}
        <div className="space-y-6">
          {/* Language & Theme */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Regional Preferences
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interface Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#2E7D32] bg-white font-medium"
                >
                  {(Object.keys(languageNames) as Language[]).map((lang) => (
                    <option key={lang} value={lang}>
                      {languageNames[lang].nativeName} ({languageNames[lang].name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Dark Theme</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    isDarkMode ? 'bg-[#2E7D32]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      isDarkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Kisan Call Center Helpline */}
          <Card className="p-4 bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-300 space-y-3">
            <div className="flex items-center gap-2 text-amber-900">
              <PhoneCall className="w-5 h-5 text-amber-700" />
              <h4 className="font-bold text-xs font-serif">
                Government Kisan Helpline
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Toll-free agricultural support for pest, seed mini-kit, and subsidy assistance.
            </p>
            <a
              href="tel:18001801551"
              className="w-full bg-[#FFB300] hover:bg-amber-400 text-amber-950 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Call 1800-180-1551</span>
            </a>
          </Card>

          {/* Dedicated Sign Out Card */}
          <Card className="p-4 bg-red-50/80 border border-red-200 space-y-3">
            <div className="flex items-center gap-2 text-red-900">
              <LogOut className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-xs font-serif">
                Account Sign Out
              </h4>
            </div>
            <p className="text-xs text-red-700/90 leading-relaxed">
              Exit your current session. You can log back in anytime using your name, email, or password.
            </p>
            <Button
              variant="outline"
              icon={LogOut}
              onClick={signOutSupabase}
              className="w-full bg-red-600 text-white hover:bg-red-700 border-none shadow-xs text-xs font-bold py-2.5"
            >
              Sign Out of Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
