import { supabaseAdmin } from '../config/supabase';
import { CommunityPost, CreateCommunityPostRequest } from '../types';

export class CommunityService {
  static async list(page = 1, limit = 20, destination?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    let query = supabaseAdmin
      .from('community_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (destination) query = query.ilike('destination', `%${destination}%`);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }

  static async getById(id: string): Promise<CommunityPost | null> {
    const { data, error } = await supabaseAdmin.from('community_posts').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(authorId: string, payload: CreateCommunityPostRequest): Promise<CommunityPost> {
    const { data, error } = await supabaseAdmin.from('community_posts').insert({ ...payload, author_id: authorId }).select().single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string, authorId: string): Promise<void> {
    const { error } = await supabaseAdmin.from('community_posts').delete().eq('id', id).eq('author_id', authorId);
    if (error) throw error;
  }
}
