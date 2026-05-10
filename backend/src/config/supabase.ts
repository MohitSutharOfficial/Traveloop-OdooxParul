import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  logger.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

/**
 * Public client — respects Row Level Security.
 * Used when forwarding a user's JWT so RLS policies apply.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

/**
 * Admin client — bypasses RLS using service_role key.
 * Use only for server-side operations that need full access.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Create a per-request client that impersonates the authenticated user.
 * This lets Supabase RLS see the user's JWT.
 */
export function createUserClient(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Quick connectivity check against the destinations table (public read).
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('destinations')
      .select('id', { count: 'exact', head: true });
    if (error) {
      logger.error('Supabase connection test failed:', error.message);
      return false;
    }
    logger.info('✅ Supabase connected successfully');
    return true;
  } catch (err: any) {
    logger.error('Supabase connection error:', err.message);
    return false;
  }
};
