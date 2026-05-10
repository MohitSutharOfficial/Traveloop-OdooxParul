import { supabaseAdmin } from '../config/supabase';
import { Profile, UpdateProfileRequest } from '../types';

export class ProfileService {
  /** Get a profile by user id */
  static async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  /** Upsert a profile (auto-created on first sign-up via Supabase trigger, but we support manual upsert) */
  static async upsert(id: string, payload: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({ id, ...payload }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /** Update own profile */
  static async update(id: string, payload: UpdateProfileRequest): Promise<Profile> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /** List all profiles (admin) */
  static async list(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }
}
