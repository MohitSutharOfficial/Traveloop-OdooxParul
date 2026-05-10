import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const demoSessionKey = 'traveloop_demo_session';
const authListeners = new Set<(event: string, session: any) => void>();

function createDemoSession(email = 'traveler@traveloop.app') {
  const now = new Date().toISOString();

  return {
    access_token: 'traveloop-demo-token',
    refresh_token: 'traveloop-demo-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: 'demo-traveler',
      email,
      created_at: now,
      updated_at: now,
      app_metadata: {},
      user_metadata: {
        first_name: 'Demo',
        last_name: 'Traveler',
        full_name: 'Demo Traveler',
        city: 'Mumbai',
        country: 'India',
        travel_style: 'Adventure',
      },
      aud: 'authenticated',
      role: 'authenticated',
    },
  };
}

function getStoredDemoSession() {
  const stored = window.localStorage.getItem(demoSessionKey);
  return stored ? JSON.parse(stored) : null;
}

function setStoredDemoSession(session: any) {
  window.localStorage.setItem(demoSessionKey, JSON.stringify(session));
  authListeners.forEach((listener) => listener('SIGNED_IN', session));
}

function clearStoredDemoSession() {
  window.localStorage.removeItem(demoSessionKey);
  authListeners.forEach((listener) => listener('SIGNED_OUT', null));
}

function createDemoSupabaseClient() {
  return {
    auth: {
      getSession: async () => ({
        data: { session: getStoredDemoSession() },
        error: null,
      }),
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        authListeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => authListeners.delete(callback),
            },
          },
        };
      },
      signInWithPassword: async ({ email }: { email: string; password: string }) => {
        const session = createDemoSession(email);
        setStoredDemoSession(session);
        return { data: { user: session.user, session }, error: null };
      },
      signUp: async ({ email, options }: { email: string; password: string; options?: any }) => {
        const session = createDemoSession(email);
        session.user.user_metadata = {
          ...session.user.user_metadata,
          ...options?.data,
        };
        setStoredDemoSession(session);
        return { data: { user: session.user, session }, error: null };
      },
      signInWithOAuth: async ({ options }: { provider: string; options?: { redirectTo?: string } }) => {
        const session = createDemoSession();
        setStoredDemoSession(session);

        if (options?.redirectTo) {
          window.location.href = options.redirectTo;
        }

        return { data: { provider: 'demo', url: options?.redirectTo || null }, error: null };
      },
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async ({ password: _password }: { password: string }) => ({
        data: { user: getStoredDemoSession()?.user || createDemoSession().user },
        error: null,
      }),
      signOut: async () => {
        clearStoredDemoSession();
        return { error: null };
      },
    },
  };
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    })
  : (createDemoSupabaseClient() as any);
