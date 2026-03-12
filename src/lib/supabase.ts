import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from '../../utils/supabase/info';

const supabaseKey = publicAnonKey;

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
