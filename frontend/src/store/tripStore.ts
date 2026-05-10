import { create } from 'zustand';
import { tripService } from '../services/trip.service';

export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'draft' | 'archived';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  coverPhoto?: string;
  startDate?: string;
  endDate?: string;
  status: TripStatus;
  planningScore?: number;
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
}

interface TripState {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  fetchTrips: () => Promise<void>;
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<any>;
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  isLoading: false,
  error: null,
  
  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await tripService.getTrips();
      // map backend data to frontend trip format
      const mappedTrips = data.map(t => ({
        id: t.id,
        name: t.name,
        destination: t.destination,
        coverPhoto: t.cover_image,
        startDate: t.start_date,
        endDate: t.end_date,
        status: (t.status as TripStatus) || 'upcoming',
        planningScore: t.planning_score || 0,
        budget: {
          total: t.budget_total || 0,
          spent: t.budget_spent || 0,
          currency: t.currency || 'INR'
        }
      }));
      set({ trips: mappedTrips, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch trips', isLoading: false });
    }
  },

  addTrip: async (tripData) => {
    try {
      const newTrip = await tripService.createTrip({
        name: tripData.name,
        destination: tripData.destination,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        status: tripData.status,
        budget_total: tripData.budget.total,
        currency: tripData.budget.currency
      });
      // Refresh list
      await get().fetchTrips();
      return newTrip;
    } catch(e: any) {
      console.error(e);
      throw e;
    }
  },

  updateTrip: async (id, updatedTrip) => {
    try {
      const payload: any = {};
      if (updatedTrip.name) payload.name = updatedTrip.name;
      if (updatedTrip.destination) payload.destination = updatedTrip.destination;
      if (updatedTrip.startDate) payload.start_date = updatedTrip.startDate;
      if (updatedTrip.endDate) payload.end_date = updatedTrip.endDate;
      if (updatedTrip.status) payload.status = updatedTrip.status;
      
      await tripService.updateTrip(id, payload);
      // Optimistic update
      set((state) => ({
        trips: state.trips.map((trip) => (trip.id === id ? { ...trip, ...updatedTrip } : trip)),
      }));
    } catch (error) {
      console.error(error);
      await get().fetchTrips();
    }
  },

  deleteTrip: async (id) => {
    try {
      await tripService.deleteTrip(id);
      set((state) => ({ trips: state.trips.filter((trip) => trip.id !== id) }));
    } catch (error) {
      console.error(error);
    }
  },
}));
