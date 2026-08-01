import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'ynunbawulzzmeunerllm';
export const SUPABASE_PROJECT_NAME = 'Tilahan Saathi';
export const SUPABASE_URL = 'https://ynunbawulzzmeunerllm.supabase.co';
export const SUPABASE_REST_URL = 'https://ynunbawulzzmeunerllm.supabase.co/rest/v1/';
export const SUPABASE_ANON_KEY = 'sb_publishable_IwwRNGjw3XZxzQZQ86KN6w__CmjKPxW';

// Create Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const getSupabaseConfig = () => ({
  projectId: SUPABASE_PROJECT_ID,
  projectName: SUPABASE_PROJECT_NAME,
  url: SUPABASE_URL,
  restUrl: SUPABASE_REST_URL,
  apiKey: SUPABASE_ANON_KEY,
});
