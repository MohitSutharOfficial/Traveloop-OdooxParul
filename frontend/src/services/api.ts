import axios, { AxiosError } from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from Supabase session
api.interceptors.request.use(
  async (config: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token && config.headers) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Failed to get session token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: any) => response,
  async (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      // Clear Supabase session on unauthorized
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    // Create a new error with the extracted message
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).response = error.response;
    (enhancedError as any).status = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

export default api;
