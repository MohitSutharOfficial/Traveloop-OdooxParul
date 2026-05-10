import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1000);
        } else {
          throw new Error('No session found');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage(err.message || 'Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4F0] p-4 dark:bg-stone-950">
      <div className="w-full max-w-md">
        <div className="traveloop-card text-center">
          {status === 'loading' && (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-400/10">
                <Loader2 className="h-8 w-8 animate-spin text-[#EF9F27]" />
              </div>
              <h2 className="mb-2 font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">
                Authenticating...
              </h2>
              <p className="text-stone-600 dark:text-stone-300">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-400/10">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="mb-2 font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">
                Success!
              </h2>
              <p className="mb-4 text-stone-600 dark:text-stone-300">{message}</p>
              <div className="flex items-center justify-center gap-2 text-[#EF9F27]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Redirecting...</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-400/10">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>
              <h2 className="mb-2 font-sora text-2xl font-bold text-[#1C1917] dark:text-stone-100">
                Authentication Failed
              </h2>
              <p className="mb-4 text-stone-600 dark:text-stone-300">{message}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Redirecting to login page...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
