import { supabase } from '../lib/supabase';

export interface RegisteredAccount {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  village?: string;
  district?: string;
  state?: string;
  totalLandArea?: number;
  kisanId?: string;
  registeredAt?: string;
}

const STORAGE_KEY = 'tilahan_registered_accounts';

// Seed default accounts if none exist
const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    email: 'farmer@tilahansaathi.in',
    password: 'farmer123',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    village: 'Sanganer',
    district: 'Jaipur',
    state: 'Rajasthan',
    totalLandArea: 4.5,
    kisanId: 'KCC-RJ-883921',
    registeredAt: new Date().toISOString(),
  },
  {
    email: 'ramesh@gmail.com',
    password: 'ramesh123',
    name: 'Ramesh Patel',
    phone: '+91 98765 43210',
    village: 'Sanganer',
    district: 'Jaipur',
    state: 'Rajasthan',
    totalLandArea: 4.5,
    kisanId: 'KCC-RJ-883922',
    registeredAt: new Date().toISOString(),
  },
];

export function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ACCOUNTS;
  } catch (err) {
    console.error('Failed to parse registered accounts:', err);
    return DEFAULT_ACCOUNTS;
  }
}

export function registerAccount(account: RegisteredAccount): void {
  const accounts = getRegisteredAccounts();
  const normalizedEmail = account.email.trim().toLowerCase();

  // Remove existing entry for same email if any
  const filtered = accounts.filter(
    (a) => a.email.trim().toLowerCase() !== normalizedEmail
  );

  const updatedAccount: RegisteredAccount = {
    ...account,
    email: normalizedEmail,
    registeredAt: account.registeredAt || new Date().toISOString(),
  };

  filtered.push(updatedAccount);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  // Also attempt to persist profile row in Supabase database asynchronously
  (async () => {
    try {
      const { error } = await supabase.from('profiles').upsert([
        {
          email: normalizedEmail,
          name: account.name,
          phone: account.phone || '',
          village: account.village || '',
          district: account.district || '',
          state: account.state || '',
          total_land_area: account.totalLandArea || 3.5,
          updated_at: new Date().toISOString(),
        },
      ]);
      if (error) {
        console.warn('Supabase DB profile save info:', error.message);
      }
    } catch (_err) {
      // Ignore background sync errors
    }
  })();
}

export function findAccountByEmail(email: string): RegisteredAccount | undefined {
  const accounts = getRegisteredAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find((a) => a.email.trim().toLowerCase() === normalized);
}

export function validateAccountCredentials(
  email: string,
  passwordInput: string
): { success: boolean; account?: RegisteredAccount; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const account = findAccountByEmail(normalizedEmail);

  if (!account) {
    return {
      success: false,
      error: `No registered account found for "${normalizedEmail}". Please register a new account first!`,
    };
  }

  // Check password match
  if (account.password && account.password !== passwordInput) {
    return {
      success: false,
      error: 'Incorrect password! Please enter the exact password used during registration.',
    };
  }

  return {
    success: true,
    account,
  };
}
