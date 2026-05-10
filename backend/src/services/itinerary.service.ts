import { supabaseAdmin } from '../config/supabase';
import { ItineraryItem, CreateItineraryItemRequest, UpdateItineraryItemRequest } from '../types';

export class ItineraryService {
  /** List all items for a trip, ordered by sort_order then starts_at */
  static async listByTrip(tripId: string) {
    const { data, error } = await supabaseAdmin
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('sort_order', { ascending: true })
      .order('starts_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<ItineraryItem | null> {
    const { data, error } = await supabaseAdmin
      .from('itinerary_items')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(payload: CreateItineraryItemRequest): Promise<ItineraryItem> {
    const { data, error } = await supabaseAdmin
      .from('itinerary_items')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, payload: UpdateItineraryItemRequest): Promise<ItineraryItem> {
    const { data, error } = await supabaseAdmin
      .from('itinerary_items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('itinerary_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  /** Bulk reorder items */
  static async reorder(items: { id: string; sort_order: number }[]): Promise<void> {
    // Use a transaction-like approach: update each in parallel
    const updates = items.map(({ id, sort_order }) =>
      supabaseAdmin
        .from('itinerary_items')
        .update({ sort_order })
        .eq('id', id)
    );
    const results = await Promise.all(updates);
    const firstError = results.find((r) => r.error);
    if (firstError?.error) throw firstError.error;
  }
}
