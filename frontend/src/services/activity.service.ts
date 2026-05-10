import api from './api';

export interface Activity {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  price_level: number;
  rating: number;
  category: string;
  image_url: string | null;
}

export interface CreateActivityRequest {
  name: string;
  description?: string;
  location?: string;
  price_level?: number;
  rating?: number;
  category: string;
  image_url?: string;
}

export const activityService = {
  getActivities: async (): Promise<Activity[]> => {
    const response = await api.get('/activities');
    return response.data.data || [];
  },

  getActivity: async (id: string): Promise<Activity> => {
    const response = await api.get(`/activities/${id}`);
    return response.data.data;
  },

  createActivity: async (activityData: CreateActivityRequest): Promise<Activity> => {
    const response = await api.post('/activities', activityData);
    return response.data.data;
  },

  updateActivity: async (id: string, activityData: Partial<CreateActivityRequest>): Promise<Activity> => {
    const response = await api.patch(`/activities/${id}`, activityData);
    return response.data.data;
  },

  deleteActivity: async (id: string): Promise<void> => {
    await api.delete(`/activities/${id}`);
  }
};