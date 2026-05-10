import api from './api';

export interface Note {
  id: string;
  trip_id: string;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteRequest {
  title: string;
  body?: string;
}

export const noteService = {
  getNotes: async (tripId: string): Promise<Note[]> => {
    const response = await api.get(`/notes/trip/${tripId}`);
    return response.data.data || [];
  },

  getNote: async (tripId: string, noteId: string): Promise<Note> => {
    const response = await api.get(`/notes/${noteId}`);
    return response.data.data;
  },

  createNote: async (tripId: string, noteData: CreateNoteRequest): Promise<Note> => {
    const response = await api.post(`/notes`, { trip_id: tripId, ...noteData });
    return response.data.data;
  },

  updateNote: async (_tripId: string, noteId: string, noteData: Partial<CreateNoteRequest>): Promise<Note> => {
    const response = await api.patch(`/notes/${noteId}`, noteData);
    return response.data.data;
  },

  deleteNote: async (_tripId: string, noteId: string): Promise<void> => {
    await api.delete(`/notes/${noteId}`);
  }
};
