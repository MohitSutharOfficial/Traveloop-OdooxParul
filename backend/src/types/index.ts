// ─── Auth ────────────────────────────────────────────────
export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

// ─── Profiles ────────────────────────────────────────────
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  preferred_travel_style?: 'adventure' | 'relaxation' | 'cultural' | 'business';
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  country?: string;
  preferred_travel_style?: 'adventure' | 'relaxation' | 'cultural' | 'business';
  avatar_url?: string;
}

// ─── Destinations ────────────────────────────────────────
export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  image_url?: string;
  description?: string;
  average_daily_budget?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDestinationRequest {
  name: string;
  country: string;
  region?: string;
  image_url?: string;
  description?: string;
  average_daily_budget?: number;
}

// ─── Trips ───────────────────────────────────────────────
export type TripStatus = 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  owner_id: string;
  name: string;
  destination: string;
  cover_photo?: string;
  start_date: string;
  end_date: string;
  status: TripStatus;
  planning_score: number;
  budget_total: number;
  budget_spent: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTripRequest {
  name: string;
  destination: string;
  cover_photo?: string;
  start_date: string;
  end_date: string;
  status?: TripStatus;
  budget_total?: number;
  currency?: string;
}

export interface UpdateTripRequest {
  name?: string;
  destination?: string;
  cover_photo?: string;
  start_date?: string;
  end_date?: string;
  status?: TripStatus;
  planning_score?: number;
  budget_total?: number;
  budget_spent?: number;
  currency?: string;
}

export interface TripFilters {
  status?: TripStatus;
  destination?: string;
  from_date?: string;
  to_date?: string;
}

// ─── Itinerary Items ─────────────────────────────────────
export type ItineraryItemType = 'flight' | 'hotel' | 'activity' | 'meal' | 'transfer' | 'note';

export interface ItineraryItem {
  id: string;
  trip_id: string;
  item_type: ItineraryItemType;
  title: string;
  location?: string;
  starts_at?: string;
  ends_at?: string;
  notes?: string;
  cost: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateItineraryItemRequest {
  trip_id: string;
  item_type: ItineraryItemType;
  title: string;
  location?: string;
  starts_at?: string;
  ends_at?: string;
  notes?: string;
  cost?: number;
  sort_order?: number;
}

export interface UpdateItineraryItemRequest {
  item_type?: ItineraryItemType;
  title?: string;
  location?: string;
  starts_at?: string;
  ends_at?: string;
  notes?: string;
  cost?: number;
  sort_order?: number;
}

// ─── Activities ──────────────────────────────────────────
export interface Activity {
  id: string;
  destination_id?: string;
  name: string;
  category?: string;
  description?: string;
  price_from?: number;
  rating?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityRequest {
  destination_id?: string;
  name: string;
  category?: string;
  description?: string;
  price_from?: number;
  rating?: number;
  image_url?: string;
}

// ─── Packing Items ───────────────────────────────────────
export interface PackingItem {
  id: string;
  trip_id: string;
  label: string;
  category?: string;
  is_packed: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePackingItemRequest {
  trip_id: string;
  label: string;
  category?: string;
  sort_order?: number;
}

export interface UpdatePackingItemRequest {
  label?: string;
  category?: string;
  is_packed?: boolean;
  sort_order?: number;
}

// ─── Trip Notes ──────────────────────────────────────────
export interface TripNote {
  id: string;
  trip_id: string;
  title: string;
  body?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTripNoteRequest {
  trip_id: string;
  title: string;
  body?: string;
}

export interface UpdateTripNoteRequest {
  title?: string;
  body?: string;
}

// ─── Invoices ────────────────────────────────────────────
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'void';

export interface Invoice {
  id: string;
  trip_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  currency: string;
  total: number;
  issued_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  created_at: string;
}

export interface CreateInvoiceRequest {
  trip_id: string;
  invoice_number: string;
  status?: InvoiceStatus;
  currency?: string;
  total?: number;
  issued_at?: string;
  items?: { description: string; amount: number }[];
}

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus;
  total?: number;
  issued_at?: string;
  paid_at?: string;
}

// ─── Community Posts ─────────────────────────────────────
export interface CommunityPost {
  id: string;
  author_id?: string;
  title: string;
  body: string;
  destination?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'>;
}

export interface CreateCommunityPostRequest {
  title: string;
  body: string;
  destination?: string;
  image_url?: string;
}

// ─── API Response ────────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Pagination ──────────────────────────────────────────
export interface PaginationParams {
  page: number;
  limit: number;
}
