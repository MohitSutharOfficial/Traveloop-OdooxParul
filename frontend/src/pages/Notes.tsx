import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calendar,
  Edit2,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { noteService, Note } from '../services/note.service';
import { useTripStore } from '../store/tripStore';
import { dateUtils } from '../utils/dateUtils';

type FilterMode = 'all' | 'today' | 'this-week';
type SortMode = 'newest' | 'oldest' | 'title';

interface NoteFormState {
  title: string;
  body: string;
}

const EMPTY_FORM: NoteFormState = {
  title: '',
  body: '',
};

export default function Notes() {
  const { trips, fetchTrips } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<FilterMode>('all');
  const [sortBy, setSortBy] = useState<SortMode>('newest');

  const [showModal, setShowModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NoteFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0].id);
    }
  }, [trips, selectedTrip]);

  useEffect(() => {
    if (!selectedTrip) {
      setNotes([]);
      return;
    }

    const run = async () => {
      setLoading(true);
      try {
        const data = await noteService.getNotes(selectedTrip);
        setNotes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [selectedTrip]);

  const filteredNotes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    let next = notes.filter((note) => {
      const title = note.title.toLowerCase();
      const body = (note.body || '').toLowerCase();

      if (search && !title.includes(search) && !body.includes(search)) return false;

      const created = new Date(note.created_at);
      if (filterBy === 'today') {
        return created.toDateString() === now.toDateString();
      }
      if (filterBy === 'this-week') {
        return created >= weekAgo;
      }
      return true;
    });

    if (sortBy === 'newest') {
      next = [...next].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortBy === 'oldest') {
      next = [...next].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else {
      next = [...next].sort((a, b) => a.title.localeCompare(b.title));
    }

    return next;
  }, [notes, searchTerm, filterBy, sortBy]);

  const openCreateModal = () => {
    setEditingNoteId(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNoteId(note.id);
    setFormData({
      title: note.title,
      body: note.body || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNoteId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTrip || !formData.title.trim()) return;

    setSubmitting(true);
    try {
      if (editingNoteId) {
        const updated = await noteService.updateNote(selectedTrip, editingNoteId, {
          title: formData.title.trim(),
          body: formData.body.trim() || undefined,
        });
        setNotes((prev) => prev.map((note) => (note.id === updated.id ? updated : note)));
      } else {
        const created = await noteService.createNote(selectedTrip, {
          title: formData.title.trim(),
          body: formData.body.trim() || undefined,
        });
        setNotes((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (error: any) {
      alert(error.message || 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!selectedTrip) return;
    if (!confirm('Delete this note?')) return;

    try {
      await noteService.deleteNote(selectedTrip, noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (error: any) {
      alert(error.message || 'Failed to delete note');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-sora text-2xl font-bold mb-2">Trip Notes</h1>
          <p className="text-stone-500">Create, edit, and organize travel notes by trip.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="traveloop-input"
            value={selectedTrip || ''}
            onChange={(event) => setSelectedTrip(event.target.value)}
          >
            <option value="" disabled>
              Select a trip...
            </option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
          <button className="traveloop-button-primary" onClick={openCreateModal}>
            <Plus size={16} />
            Add Note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            className="traveloop-input w-full pl-10"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <label className="flex items-center gap-2">
          <Filter size={16} className="text-stone-500" />
          <select
            className="traveloop-input w-full"
            value={filterBy}
            onChange={(event) => setFilterBy(event.target.value as FilterMode)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
          </select>
        </label>

        <select
          className="traveloop-input w-full"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortMode)}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-md max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sora text-xl font-bold">
                {editingNoteId ? 'Edit Note' : 'Add Note'}
              </h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="traveloop-label">Title *</label>
                <input
                  type="text"
                  className="traveloop-input w-full"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, title: event.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="traveloop-label">Details</label>
                <textarea
                  className="traveloop-input w-full min-h-36"
                  value={formData.body}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, body: event.target.value }))
                  }
                />
              </div>
              <div className="flex gap-3">
                <button type="button" className="traveloop-button-secondary flex-1" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="traveloop-button-primary flex-1" disabled={submitting}>
                  {submitting ? 'Saving...' : editingNoteId ? 'Update Note' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]" />
        </div>
      ) : selectedTrip && filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pb-8 custom-scrollbar">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-sora text-lg font-semibold text-stone-800 dark:text-stone-100">
                  {note.title}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(note)}
                    className="traveloop-button-secondary !px-2.5 !py-1.5"
                    title="Edit note"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="traveloop-button-secondary !px-2.5 !py-1.5"
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap min-h-20">
                {note.body || 'No details added.'}
              </p>

              <div className="flex items-center gap-2 text-xs text-stone-500 mt-4 pt-3 border-t border-stone-200 dark:border-stone-700">
                <Calendar size={12} />
                <span>{dateUtils.formatDate(note.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md">
          <BookOpen size={48} className="mx-auto text-stone-300 mb-4" />
          <h3 className="font-sora font-semibold text-stone-700 dark:text-stone-200 mb-1">No notes found</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            {selectedTrip
              ? 'Create your first note for this trip.'
              : 'Select a trip to view and manage notes.'}
          </p>
        </div>
      )}
    </div>
  );
}
