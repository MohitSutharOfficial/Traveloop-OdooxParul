import api from './api';

export interface ItineraryItem {
  id: string;
  trip_id: string;
  item_type: 'flight' | 'hotel' | 'activity' | 'meal' | 'transfer' | 'note';
  title: string;
  description?: string;
  location?: string;
  starts_at?: string;
  ends_at?: string;
  cost?: number;
  sort_order: number;
}

export const itineraryService = {
  getTripItinerary: async (tripId: string) => {
    const response = await api.get(`/itinerary/trip/${tripId}`);
    return response.data.data || [];
  },

  createItem: async (itemData: Partial<ItineraryItem>) => {
    const response = await api.post('/itinerary', itemData);
    return response.data.data;
  },

  updateItem: async (id: string, itemData: Partial<ItineraryItem>) => {
    const response = await api.patch(`/itinerary/${id}`, itemData);
    return response.data.data;
  },

  deleteItem: async (id: string) => {
    await api.delete(`/itinerary/${id}`);
  },

  reorderItems: async (tripId: string, items: { id: string; sort_order: number }[]) => {
    // Assuming backend has a bulk update route, or we can patch them sequentially for now
    const promises = items.map(item => api.patch(`/itinerary/${item.id}`, { sort_order: item.sort_order }));
    await Promise.all(promises);
  }
};
