import { supabaseAdmin } from '../config/supabase';
import { PackingItem, CreatePackingItemRequest, UpdatePackingItemRequest } from '../types';

export class PackingService {
  static async listByTrip(tripId: string) {
    const { data, error } = await supabaseAdmin
      .from('packing_items')
      .select('*')
      .eq('trip_id', tripId)
      .order('sort_order', { ascending: true })
      .order('category', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async create(payload: CreatePackingItemRequest): Promise<PackingItem> {
    const { data, error } = await supabaseAdmin
      .from('packing_items')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, payload: UpdatePackingItemRequest): Promise<PackingItem> {
    const { data, error } = await supabaseAdmin
      .from('packing_items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('packing_items')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  /** Toggle packed status */
  static async togglePacked(id: string): Promise<PackingItem> {
    // Fetch current state
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from('packing_items')
      .select('is_packed')
      .eq('id', id)
      .single();
    if (fetchErr) throw fetchErr;

    const { data, error } = await supabaseAdmin
      .from('packing_items')
      .update({ is_packed: !current.is_packed })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /** Bulk create packing items */
  static async bulkCreate(items: CreatePackingItemRequest[]): Promise<PackingItem[]> {
    const { data, error } = await supabaseAdmin
      .from('packing_items')
      .insert(items)
      .select();
    if (error) throw error;
    return data || [];
  }
}
