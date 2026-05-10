import React, { useEffect, useState } from 'react';
import { Building2, Search, Map, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { destinationService, Destination, CreateDestinationRequest } from '../services/destination.service';

export default function CitySearch() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: '',
    country: '',
    description: '',
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const data = await destinationService.getDestinations();
      setDestinations(data);
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (destination?: Destination) => {
    if (destination) {
      setEditingDestination(destination);
      setFormData({
        name: destination.name,
        country: destination.country,
        description: destination.description || '',
        image_url: destination.image_url || ''
      });
    } else {
      setEditingDestination(null);
      setFormData({
        name: '',
        country: '',
        description: '',
        image_url: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.country.trim()) return;

    setSubmitting(true);
    try {
      if (editingDestination) {
        const updated = await destinationService.updateDestination(editingDestination.id, formData);
        setDestinations(destinations.map(d => d.id === updated.id ? updated : d));
      } else {
        const created = await destinationService.createDestination(formData);
        setDestinations([created, ...destinations]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save destination');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;

    try {
      await destinationService.deleteDestination(id);
      setDestinations(destinations.filter(d => d.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete destination');
    }
  };

  const filtered = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold mb-2">City Search</h1>
          <p className="text-stone-500">Discover cities, neighborhoods, and regional highlights around the world.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-full bg-[#714B67] px-4 py-2 font-sora text-sm font-bold text-white hover:bg-[#8B5780] transition-colors"
        >
          <Plus size={16} />
          <span>Add Destination</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input 
          type="text" 
          placeholder="Search destinations or countries..." 
          className="w-full lg:w-1/3 pl-10 pr-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#714B67]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-md max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sora text-xl font-bold">
                {editingDestination ? 'Edit Destination' : 'Add New Destination'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#714B67] text-white rounded-md hover:bg-[#8B5780] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingDestination ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8 custom-scrollbar">
          {filtered.map(dest => (
            <div key={dest.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-md shadow-sm flex flex-col group cursor-pointer hover:border-[#714B67] transition-colors">
              <div className="h-48 bg-stone-100 rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
                 {dest.image_url ? 
                    <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : 
                    <Building2 size={40} className="text-stone-300" />
                 }
                 <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                   <button
                     onClick={(e) => { e.stopPropagation(); handleOpenModal(dest); }}
                     className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                     title="Edit destination"
                   >
                     <Edit2 size={14} />
                   </button>
                   <button
                     onClick={(e) => { e.stopPropagation(); handleDelete(dest.id); }}
                     className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                     title="Delete destination"
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
              </div>
              <h3 className="font-bold font-sora text-xl mb-1">{dest.name}</h3>
              <div className="flex items-center gap-1 text-[#714B67] font-medium text-sm mb-3">
                 <Map size={14} />
                 {dest.country}
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3">
                 {dest.description || 'No description available for this destination.'}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-stone-500">
               No destinations found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
