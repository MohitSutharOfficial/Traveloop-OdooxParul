import { supabaseAdmin } from '../config/supabase';
import { Activity, CreateActivityRequest } from '../types';

export class ActivityService {
  static async list(page = 1, limit = 20, filters?: { category?: string; destination_id?: string; search?: string }) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('activities')
      .select('*', { count: 'exact' })
      .order('rating', { ascending: false, nullsFirst: false })
      .range(from, to);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.destination_id) query = query.eq('destination_id', filters.destination_id);
    if (filters?.search) query = query.ilike('name', `%${filters.search}%`);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }

  static async getById(id: string): Promise<Activity | null> {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(payload: CreateActivityRequest): Promise<Activity> {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, payload: Partial<CreateActivityRequest>): Promise<Activity> {
    const { data, error } = await supabaseAdmin
      .from('activities')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('activities')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
