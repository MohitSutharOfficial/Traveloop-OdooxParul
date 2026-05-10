import React, { useEffect, useState } from 'react';
import { Compass, Search, Star, MapPin, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { activityService, Activity, CreateActivityRequest } from '../services/activity.service';

export default function ActivitySearch() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    description: '',
    category: '',
    rating: 0,
    price_from: 0,
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const data = await activityService.getActivities();
      setActivities(data);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        name: activity.name,
        description: activity.description || '',
        rating: activity.rating,
        price_from: activity.price_from || 0,
        category: activity.category,
        image_url: activity.image_url || ''
      });
    } else {
      setEditingActivity(null);
      setFormData({
        name: '',
        description: '',
        rating: 0,
        price_from: 0,
        category: '',
        image_url: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category.trim()) return;

    setSubmitting(true);
    try {
      if (editingActivity) {
        const updated = await activityService.updateActivity(editingActivity.id, formData);
        setActivities(activities.map(a => a.id === updated.id ? updated : a));
      } else {
        const created = await activityService.createActivity(formData);
        setActivities([created, ...activities]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      await activityService.deleteActivity(id);
      setActivities(activities.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete activity');
    }
  };

  const filtered = activities.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.location && a.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold mb-2">Activity Search</h1>
          <p className="text-stone-500">Find activities, tours, restaurants, and memorable experiences.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-full bg-[#714B67] px-4 py-2 font-sora text-sm font-bold text-white hover:bg-[#8B5780] transition-colors"
        >
          <Plus size={16} />
          <span>Add Activity</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input 
          type="text" 
          placeholder="Search activities or locations..." 
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
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
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
                <label className="block text-sm font-medium mb-1">Category *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Restaurant, Museum, Tour"
                  className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 min-h-24 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price From (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price_from}
                    onChange={(e) => setFormData({ ...formData, price_from: parseInt(e.target.value) })}
                    className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>
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
                  {submitting ? 'Saving...' : editingActivity ? 'Update' : 'Create'}
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
          {filtered.map(activity => (
            <div key={activity.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-md shadow-sm flex flex-col group">
              <div className="h-40 bg-stone-100 rounded-md mb-4 flex items-center justify-center overflow-hidden relative">
                 {activity.image_url ? 
                    <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover" /> : 
                    <Compass size={40} className="text-stone-300" />
                 }
                 <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                   <Star size={12} className="text-[#714B67] fill-[#714B67]" />
                   {activity.rating || 'N/A'}
                 </div>
                 <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                   <button
                     onClick={() => handleOpenModal(activity)}
                     className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                     title="Edit activity"
                   >
                     <Edit2 size={14} />
                   </button>
                   <button
                     onClick={() => handleDelete(activity.id)}
                     className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                     title="Delete activity"
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
              </div>
              <h3 className="font-bold font-sora text-lg mb-1">{activity.name}</h3>
               <div className="flex items-center gap-1 text-stone-500 text-sm mb-3">
                 <span className="font-semibold text-[#714B67]">
                   ₹{(activity.price_from || 0).toLocaleString('en-IN')}
                 </span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
                 {activity.description || 'No description available.'}
              </p>
              <div className="mt-auto">
                 <span className="inline-block px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded text-xs text-stone-600 dark:text-stone-300">
                   {activity.category || 'General'}
                 </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-stone-500">
               No activities found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
