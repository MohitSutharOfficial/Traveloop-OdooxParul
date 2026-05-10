import { supabaseAdmin } from '../config/supabase';
import { Trip, CreateTripRequest, UpdateTripRequest, TripFilters } from '../types';

export class TripService {
  /** List trips for a specific user with optional filters */
  static async listByOwner(ownerId: string, page = 1, limit = 20, filters?: TripFilters) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('trips')
      .select('*', { count: 'exact' })
      .eq('owner_id', ownerId)
      .order('start_date', { ascending: false })
      .range(from, to);

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.destination) query = query.ilike('destination', `%${filters.destination}%`);
    if (filters?.from_date) query = query.gte('start_date', filters.from_date);
    if (filters?.to_date) query = query.lte('end_date', filters.to_date);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }

  /** Get a single trip (verifies ownership) */
  static async getById(id: string, ownerId: string): Promise<Trip | null> {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /** Get a trip by ID (admin — no ownership check) */
  static async getByIdAdmin(id: string): Promise<Trip | null> {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /** Create a new trip */
  static async create(ownerId: string, payload: CreateTripRequest): Promise<Trip> {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .insert({ ...payload, owner_id: ownerId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /** Update a trip (verifies ownership) */
  static async update(id: string, ownerId: string, payload: UpdateTripRequest): Promise<Trip> {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .update(payload)
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /** Delete a trip (verifies ownership) */
  static async delete(id: string, ownerId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('trips')
      .delete()
      .eq('id', id)
      .eq('owner_id', ownerId);
    if (error) throw error;
  }

  /** Get trip stats for a user */
  static async getStats(ownerId: string) {
    const { data, error } = await supabaseAdmin
      .from('trips')
      .select('status, budget_total, budget_spent')
      .eq('owner_id', ownerId);
    if (error) throw error;

    const trips = data || [];
    return {
      total: trips.length,
      draft: trips.filter((t) => t.status === 'draft').length,
      upcoming: trips.filter((t) => t.status === 'upcoming').length,
      active: trips.filter((t) => t.status === 'active').length,
      completed: trips.filter((t) => t.status === 'completed').length,
      cancelled: trips.filter((t) => t.status === 'cancelled').length,
      totalBudget: trips.reduce((sum, t) => sum + Number(t.budget_total || 0), 0),
      totalSpent: trips.reduce((sum, t) => sum + Number(t.budget_spent || 0), 0),
    };
  }
}
