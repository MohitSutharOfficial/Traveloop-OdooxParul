import { supabaseAdmin } from '../config/supabase';
import { Destination, CreateDestinationRequest } from '../types';

export class DestinationService {
  static async list(page = 1, limit = 20, search?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('destinations')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(from, to);

    if (search) {
      query = query.or(`name.ilike.%${search}%,country.ilike.%${search}%,region.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }

  static async getById(id: string): Promise<Destination | null> {
    const { data, error } = await supabaseAdmin
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(payload: CreateDestinationRequest): Promise<Destination> {
    const { data, error } = await supabaseAdmin
      .from('destinations')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, payload: Partial<CreateDestinationRequest>): Promise<Destination> {
    const { data, error } = await supabaseAdmin
      .from('destinations')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('destinations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
