import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  registerAccount,
  validateAccountCredentials,
} from '../services/userRegistry';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { authUser, signOutSupabase, addToast, updateProfile, loginUser } = useApp();
  const navigate = useNavigate();

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [village, setVillage] = useState('Sanganer');
  const [district, setDistrict] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [totalLandArea, setTotalLandArea] = useState<number | string>(3.5);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter both your email address and password.');
      addToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Email and password are required to log in.',
      });
      setLoading(false);
      return;
    }

    const fallbackUserName =
      name.trim() ||
      cleanEmail.split('@')[0]?.replace(/[\._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
      'Farmer User';

    // 1. First attempt Supabase cloud authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (!error && data.user) {
        const userMetaName =
          data.user.user_metadata?.name ||
          data.user.user_metadata?.full_name ||
          fallbackUserName;

        registerAccount({
          email: cleanEmail,
          password: cleanPassword,
          name: userMetaName,
        });

        updateProfile({
          name: userMetaName,
          email: data.user.email || cleanEmail,
        });

        loginUser(userMetaName, data.user.email || cleanEmail);

        setSuccessMessage(`Welcome back, ${userMetaName}! Logged in successfully.`);
        addToast({
          type: 'success',
          title: 'Login Successful',
          message: `Welcome back, ${userMetaName}!`,
        });

        setTimeout(() => {
          navigate('/');
        }, 500);
        setLoading(false);
        return;
      }
    } catch (_err) {
      // Fallback
    }

    // 2. Validate against registered accounts & passwords
    const validation = validateAccountCredentials(cleanEmail, cleanPassword);

    if (!validation.success) {
      setErrorMessage(validation.error || 'Authentication failed. Incorrect password.');
      addToast({
        type: 'error',
        title: 'Login Failed',
        message: validation.error || 'Incorrect password for this email.',
      });
      setLoading(false);
      return;
    }

    // Credentials matched!
    const account = validation.account!;
    loginUser(account.name, account.email, {
      phone: account.phone,
      village: account.village,
      district: account.district,
      state: account.state,
      totalLandArea: account.totalLandArea,
    });

    setSuccessMessage(`Welcome back, ${account.name}! Logged in successfully.`);
    addToast({
      type: 'success',
      title: 'Login Approved',
      message: `Welcome, ${account.name}!`,
    });

    setTimeout(() => {
      navigate('/');
    }, 500);
    setLoading(false);
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = name.trim() || 'Ramesh Patel';
    const userEmail = email.trim() || 'farmer@tilahansaathi.in';
    const defaultPassword = 'farmer123';

    // Auto-register default quick account
    registerAccount({
      email: userEmail,
      password: defaultPassword,
      name: userName,
      phone,
      village,
      district,
      state,
      totalLandArea: Number(totalLandArea) || 3.5,
    });

    loginUser(userName, userEmail);
    addToast({
      type: 'success',
      title: 'Login Approved',
      message: `Welcome, ${userName}!`,
    });
    navigate('/');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please enter an email address and password to register.');
      addToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Email and password are required for registration.',
      });
      setLoading(false);
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      addToast({
        type: 'warning',
        title: 'Weak Password',
        message: 'Please choose a password with at least 4 characters.',
      });
      setLoading(false);
      return;
    }

    const registeredName =
      name.trim() ||
      cleanEmail.split('@')[0]?.replace(/[\._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
      'Farmer User';

    const userLandVal = totalLandArea ? Number(totalLandArea) : 0;

    // 1. Store in user account registry
    registerAccount({
      email: cleanEmail,
      password: cleanPassword,
      name: registeredName,
      phone: phone || '',
      village: village || '',
      district: district || '',
      state: state || '',
      totalLandArea: userLandVal,
      kisanId: `KCC-RJ-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    // 2. Register in Supabase Cloud Auth as well
    try {
      await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            name: registeredName,
            phone,
            village,
            district,
            state,
            total_land_area: userLandVal,
          },
        },
      });
    } catch (_err) {
      // Continue
    }

    // 3. Log in automatically after registration
    loginUser(registeredName, cleanEmail, {
      phone: phone || '',
      village: village || '',
      district: district || '',
      state: state || '',
      totalLandArea: userLandVal,
    });

    setSuccessMessage(`Account created successfully for ${registeredName}!`);

    addToast({
      type: 'success',
      title: 'Account Registered',
      message: `Welcome, ${registeredName}!`,
    });

    setTimeout(() => {
      navigate('/');
    }, 500);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 w-full">
      {/* Logged In Active State Box */}
      {authUser ? (
        <Card className="p-6 bg-emerald-50/80 border border-emerald-200 text-slate-900 space-y-4">
          <div className="flex items-center gap-3 text-emerald-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <div>
              <h3 className="font-extrabold font-serif text-lg text-emerald-950">
                You are logged in
              </h3>
              <p className="text-xs text-emerald-700">
                Active session as <span className="font-bold">{authUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="primary" icon={User} onClick={() => navigate('/profile')}>
              Go to Profile & Dashboard
            </Button>
            <Button variant="outline" icon={LogOut} onClick={signOutSupabase}>
              Sign Out
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Main Authentication Card */}
      <Card className="p-6 sm:p-8 border border-slate-200 shadow-md">
        {/* Simple Navigation Tabs: Sign In & Register */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-[#2E7D32] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-2.5 mb-6">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Authentication Error</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start gap-2.5 mb-6">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Success</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* MODE 1: SIGN IN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto py-2">
            <div className="text-center space-y-1 mb-4">
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Sign In to Tilahan Saathi
              </h3>
              <p className="text-xs text-slate-500">
                Enter your account email address and password
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@tilahansaathi.in"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full py-3 shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              )}
            </Button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="shrink-0 mx-3 text-[11px] font-bold text-slate-400 uppercase">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickLogin}
              className="w-full py-2.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4 text-[#FFB300]" />
              <span>Demo Quick Sign In as "{name || 'Ramesh Patel'}"</span>
            </Button>
          </form>
        )}

        {/* MODE 2: REGISTER */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4 max-w-xl mx-auto py-2">
            <div className="text-center space-y-1 mb-4">
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Register New Account
              </h3>
              <p className="text-xs text-slate-500">
                Create your farmer account to manage land records and crops
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@tilahansaathi.in"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Village / Location
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Sanganer"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Land Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={totalLandArea}
                  onChange={(e) => setTotalLandArea(e.target.value)}
                  placeholder="e.g. 0 or 3.5"
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-[#2E7D32] outline-none"
                />
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-full py-3 shadow-md mt-4"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </div>
              )}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
