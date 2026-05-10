import api from './api';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  preferred_travel_style: string | null;
  avatar_url: string | null;
  created_at: string;
}

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await api.get('/profiles/me');
    return response.data.data;
  },
  updateProfile: async (updates: Partial<Profile>): Promise<Profile> => {
    const response = await api.patch('/profiles/me', updates);
    return response.data.data;
  }
};