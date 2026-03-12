// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Netlify environment variables (or .env.local for local development).
const _supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const _publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!_supabaseUrl || !_publicAnonKey) {
  throw new Error('Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set.');
}

export const supabaseUrl: string = _supabaseUrl;
export const publicAnonKey: string = _publicAnonKey;