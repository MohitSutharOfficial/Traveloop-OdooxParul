import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export interface TripBudget {
  total: number;
  spent: number;
  currency: string;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  coverPhoto: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'completed' | 'draft';
  planningScore: number;
  budget: TripBudget;
}

interface AppContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
}

const initialTrips: Trip[] = [
  {
    id: '1',
    name: 'Paris & Rome Adventure',
    destination: 'Europe',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657?w=400',
    startDate: '2025-06-01',
    endDate: '2025-06-14',
    status: 'upcoming',
    planningScore: 75,
    budget: { total: 3000, spent: 1200, currency: 'USD' },
  },
  {
    id: '2',
    name: 'Bali Retreat',
    destination: 'Southeast Asia',
    coverPhoto: 'https://images.unsplash.com/photo-1537996194471?w=400',
    startDate: '2025-07-10',
    endDate: '2025-07-20',
    status: 'upcoming',
    planningScore: 45,
    budget: { total: 2000, spent: 400, currency: 'USD' },
  },
  {
    id: '3',
    name: 'Japan Explorer',
    destination: 'Asia',
    coverPhoto: 'https://images.unsplash.com/photo-1540959733332?w=400',
    startDate: '2025-03-01',
    endDate: '2025-03-10',
    status: 'completed',
    planningScore: 100,
    budget: { total: 2500, spent: 2300, currency: 'USD' },
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const value = useMemo<AppContextType>(
    () => ({
      trips,
      addTrip: (trip) => {
        setTrips((current) => [...current, { ...trip, id: crypto.randomUUID() }]);
      },
      updateTrip: (id, updates) => {
        setTrips((current) => current.map((trip) => (trip.id === id ? { ...trip, ...updates } : trip)));
      },
      deleteTrip: (id) => {
        setTrips((current) => current.filter((trip) => trip.id !== id));
      },
      getTripById: (id) => trips.find((trip) => trip.id === id),
    }),
    [trips]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
