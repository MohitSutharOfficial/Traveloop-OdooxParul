import api from './api';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  cover_photo?: string;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'archived';
  budget_total?: number;
  budget_spent?: number;
  currency?: string;
  planning_score?: number;
  description?: string;
}

export const tripService = {
  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data.data || [];
  },
  
  getTrip: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get('/trips/stats');
    return response.data.data;
  },

  createTrip: async (tripData: Partial<Trip>) => {
    const response = await api.post('/trips', tripData);
    return response.data.data;
  },

  updateTrip: async (id: string, tripData: Partial<Trip>) => {
    const response = await api.patch(`/trips/${id}`, tripData);
    return response.data.data;
  },

  deleteTrip: async (id: string) => {
    await api.delete(`/trips/${id}`);
  }
};
