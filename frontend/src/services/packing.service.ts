import api from './api';

export interface PackingItem {
  id: string;
  trip_id: string;
  label: string;
  category: string | null;
  is_packed: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePackingItemRequest {
  label: string;
  category?: string;
  sort_order?: number;
}

export const packingService = {
  getItems: async (tripId: string): Promise<PackingItem[]> => {
    const response = await api.get(`/packing/trip/${tripId}`);
    return response.data.data || [];
  },

  createItem: async (tripId: string, itemData: CreatePackingItemRequest): Promise<PackingItem> => {
    const response = await api.post(`/packing`, { trip_id: tripId, ...itemData });
    return response.data.data;
  },

  bulkCreateItems: async (tripId: string, items: CreatePackingItemRequest[]): Promise<PackingItem[]> => {
    const itemsWithTripId = items.map(item => ({ ...item, trip_id: tripId }));
    const response = await api.post(`/packing/bulk`, { items: itemsWithTripId });
    return response.data.data;
  },

  updateItem: async (_tripId: string, itemId: string, itemData: Partial<CreatePackingItemRequest>): Promise<PackingItem> => {
    const response = await api.patch(`/packing/${itemId}`, itemData);
    return response.data.data;
  },

  toggleItem: async (_tripId: string, itemId: string): Promise<PackingItem> => {
    const response = await api.patch(`/packing/${itemId}/toggle`);
    return response.data.data;
  },

  deleteItem: async (_tripId: string, itemId: string): Promise<void> => {
    await api.delete(`/packing/${itemId}`);
  }
};
