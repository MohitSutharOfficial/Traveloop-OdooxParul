import api from './api';

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string | null;
  image_url: string | null;
  best_time_to_visit: string | null;
}

export interface CreateDestinationRequest {
  name: string;
  country: string;
  description?: string;
  image_url?: string;
  best_time_to_visit?: string;
}

export const destinationService = {
  getDestinations: async (): Promise<Destination[]> => {
    const response = await api.get('/destinations');
    return response.data.data || [];
  },

  getDestination: async (id: string): Promise<Destination> => {
    const response = await api.get(`/destinations/${id}`);
    return response.data.data;
  },

  createDestination: async (destinationData: CreateDestinationRequest): Promise<Destination> => {
    const response = await api.post('/destinations', destinationData);
    return response.data.data;
  },

  updateDestination: async (id: string, destinationData: Partial<CreateDestinationRequest>): Promise<Destination> => {
    const response = await api.patch(`/destinations/${id}`, destinationData);
    return response.data.data;
  },

  deleteDestination: async (id: string): Promise<void> => {
    await api.delete(`/destinations/${id}`);
  }
};