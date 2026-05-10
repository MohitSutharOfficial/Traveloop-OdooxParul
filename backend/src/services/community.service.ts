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

  static async like(postId: string, userId: string): Promise<void> {
    // Insert like record
    const { error: likeError } = await supabaseAdmin
      .from('community_likes')
      .insert({ post_id: postId, user_id: userId });
    if (likeError && likeError.code !== '23505') throw likeError; // Ignore duplicate key error
    
    // Increment likes_count
    const { data: post } = await supabaseAdmin.from('community_posts').select('likes_count').eq('id', postId).single();
    if (post) {
      const { error: updateError } = await supabaseAdmin
        .from('community_posts')
        .update({ likes_count: (post.likes_count || 0) + 1 })
        .eq('id', postId);
      if (updateError) throw updateError;
    }
  }

  static async unlike(postId: string, userId: string): Promise<void> {
    // Delete like record
    const { error: unlikeError } = await supabaseAdmin
      .from('community_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (unlikeError) throw unlikeError;
    
    // Decrement likes_count
    const { data: post } = await supabaseAdmin.from('community_posts').select('likes_count').eq('id', postId).single();
    if (post) {
      const { error: updateError } = await supabaseAdmin
        .from('community_posts')
        .update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) })
        .eq('id', postId);
      if (updateError) throw updateError;
    }
  }
}
