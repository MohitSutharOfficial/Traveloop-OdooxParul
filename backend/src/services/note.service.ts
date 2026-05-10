import { supabaseAdmin } from '../config/supabase';
import { TripNote, CreateTripNoteRequest, UpdateTripNoteRequest } from '../types';

export class NoteService {
  static async listByTrip(tripId: string) {
    const { data, error } = await supabaseAdmin
      .from('trip_notes')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async getById(id: string): Promise<TripNote | null> {
    const { data, error } = await supabaseAdmin
      .from('trip_notes')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create(payload: CreateTripNoteRequest): Promise<TripNote> {
    const { data, error } = await supabaseAdmin
      .from('trip_notes')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id: string, payload: UpdateTripNoteRequest): Promise<TripNote> {
    const { data, error } = await supabaseAdmin
      .from('trip_notes')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('trip_notes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
