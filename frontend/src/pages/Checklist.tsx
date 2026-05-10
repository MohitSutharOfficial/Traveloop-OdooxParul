import React, { useEffect, useMemo, useState } from 'react';
import {
  Backpack,
  Check,
  Filter,
  ListFilter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { packingService, PackingItem } from '../services/packing.service';
import { useTripStore } from '../store/tripStore';

const DEFAULT_CATEGORIES = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Other'];

type GroupByMode = 'category' | 'status';
type FilterMode = 'all' | 'packed' | 'pending';
type SortMode = 'manual' | 'name-asc' | 'name-desc';

export default function Checklist() {
  const { trips, fetchTrips } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<GroupByMode>('category');
  const [filterBy, setFilterBy] = useState<FilterMode>('all');
  const [sortBy, setSortBy] = useState<SortMode>('manual');

  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState('Documents');
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [editingCategory, setEditingCategory] = useState('Other');

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
      setItems([]);
      return;
    }

    const run = async () => {
      setLoading(true);
      try {
        const data = await packingService.getItems(selectedTrip);
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [selectedTrip]);

  const filteredAndSorted = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    let next = items.filter((item) => {
      if (filterBy === 'packed' && !item.is_packed) return false;
      if (filterBy === 'pending' && item.is_packed) return false;
      if (search && !item.label.toLowerCase().includes(search)) return false;
      return true;
    });

    if (sortBy === 'name-asc') {
      next = [...next].sort((a, b) => a.label.localeCompare(b.label));
    } else if (sortBy === 'name-desc') {
      next = [...next].sort((a, b) => b.label.localeCompare(a.label));
    } else {
      next = [...next].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    return next;
  }, [items, searchTerm, filterBy, sortBy]);

  const grouped = useMemo(() => {
    return filteredAndSorted.reduce<Record<string, PackingItem[]>>((acc, item) => {
      const key =
        groupBy === 'status'
          ? item.is_packed
            ? 'Packed'
            : 'Pending'
          : item.category?.trim() || 'Other';

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredAndSorted, groupBy]);

  const packedCount = items.filter((item) => item.is_packed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggle = async (itemId: string) => {
    if (!selectedTrip) return;
    try {
      const updated = await packingService.toggleItem(selectedTrip, itemId);
      setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    } catch (error) {
      console.error(error);
      alert('Failed to update packing item status');
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTrip || !newLabel.trim()) return;

    setSubmitting(true);
    try {
      const created = await packingService.createItem(selectedTrip, {
        label: newLabel.trim(),
        category: newCategory || undefined,
        sort_order: items.length + 1,
      });
      setItems((prev) => [...prev, created]);
      setNewLabel('');
      setNewCategory('Documents');
    } catch (error: any) {
      alert(error.message || 'Failed to add packing item');
    } finally {
      setSubmitting(false);
    }
  };

  const beginEdit = (item: PackingItem) => {
    setEditingId(item.id);
    setEditingLabel(item.label);
    setEditingCategory(item.category || 'Other');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingLabel('');
    setEditingCategory('Other');
  };

  const saveEdit = async () => {
    if (!selectedTrip || !editingId || !editingLabel.trim()) return;
    try {
      const updated = await packingService.updateItem(selectedTrip, editingId, {
        label: editingLabel.trim(),
        category: editingCategory,
      });
      setItems((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      cancelEdit();
    } catch (error: any) {
      alert(error.message || 'Failed to update packing item');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!selectedTrip) return;
    if (!confirm('Delete this packing item?')) return;
    try {
      await packingService.deleteItem(selectedTrip, itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error: any) {
      alert(error.message || 'Failed to delete packing item');
    }
  };

  const handleResetAll = async () => {
    if (!selectedTrip) return;
    const packedItems = items.filter((item) => item.is_packed);
    if (packedItems.length === 0) return;

    try {
      await Promise.all(
        packedItems.map((item) =>
          packingService.updateItem(selectedTrip, item.id, { is_packed: false })
        )
      );
      setItems((prev) => prev.map((item) => ({ ...item, is_packed: false })));
    } catch (error: any) {
      alert(error.message || 'Failed to reset checklist');
    }
  };

  const handleShare = async () => {
    const lines: string[] = [];
    Object.entries(grouped).forEach(([groupName, groupItems]) => {
      lines.push(`${groupName} (${groupItems.filter((item) => item.is_packed).length}/${groupItems.length})`);
      groupItems.forEach((item) => {
        lines.push(`${item.is_packed ? '[x]' : '[ ]'} ${item.label}`);
      });
      lines.push('');
    });

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      alert('Checklist copied to clipboard');
    } catch {
      alert('Unable to copy checklist');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-sora text-2xl font-bold mb-2">Packing Checklist</h1>
          <p className="text-stone-500">Organize essentials, mark progress, and keep every trip ready.</p>
        </div>
        <select
          className="traveloop-input md:w-80"
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
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-5">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            className="traveloop-input w-full pl-10"
            placeholder="Search checklist items..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <label className="flex items-center gap-2">
          <ListFilter size={16} className="text-stone-500" />
          <select
            className="traveloop-input w-full"
            value={groupBy}
            onChange={(event) => setGroupBy(event.target.value as GroupByMode)}
          >
            <option value="category">Group: Category</option>
            <option value="status">Group: Packed Status</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2">
            <Filter size={16} className="text-stone-500" />
            <select
              className="traveloop-input w-full"
              value={filterBy}
              onChange={(event) => setFilterBy(event.target.value as FilterMode)}
            >
              <option value="all">All</option>
              <option value="packed">Packed</option>
              <option value="pending">Pending</option>
            </select>
          </label>
          <select
            className="traveloop-input w-full"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortMode)}
          >
            <option value="manual">Sort: Manual</option>
            <option value="name-asc">Sort: A-Z</option>
            <option value="name-desc">Sort: Z-A</option>
          </select>
        </div>
      </div>

      <div className="mb-5 rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <p className="font-medium text-stone-700 dark:text-stone-200">
            Progress: {packedCount}/{totalCount} items packed
          </p>
          <p className="text-stone-500">{progress}%</p>
        </div>
        <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <div className="h-full bg-[#714B67] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form onSubmit={handleCreate} className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input
          type="text"
          className="traveloop-input md:col-span-2"
          placeholder="Add item to checklist..."
          value={newLabel}
          onChange={(event) => setNewLabel(event.target.value)}
          required
        />
        <select
          className="traveloop-input"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
        >
          {DEFAULT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={submitting || !selectedTrip}
          className="traveloop-button-primary h-full"
        >
          <Plus size={16} />
          {submitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]" />
        </div>
      ) : selectedTrip && filteredAndSorted.length > 0 ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 space-y-4">
          {Object.entries(grouped).map(([groupName, groupItems]) => (
            <div key={groupName}>
              <div className="flex items-center justify-between rounded-md border border-stone-200 dark:border-stone-700 px-3 py-1.5 mb-2">
                <h3 className="font-sora font-semibold text-sm text-stone-700 dark:text-stone-200">{groupName}</h3>
                <span className="text-xs text-stone-500">
                  {groupItems.filter((item) => item.is_packed).length}/{groupItems.length}
                </span>
              </div>
              <div className="space-y-2">
                {groupItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-md border border-transparent hover:border-stone-200 dark:hover:border-stone-700 p-2"
                  >
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        item.is_packed
                          ? 'bg-[#714B67] border-[#714B67]'
                          : 'border-stone-300 dark:border-stone-600'
                      }`}
                      type="button"
                    >
                      {item.is_packed && <Check size={14} className="text-white" />}
                    </button>

                    {editingId === item.id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          className="traveloop-input md:col-span-2"
                          value={editingLabel}
                          onChange={(event) => setEditingLabel(event.target.value)}
                        />
                        <select
                          className="traveloop-input"
                          value={editingCategory}
                          onChange={(event) => setEditingCategory(event.target.value)}
                        >
                          {DEFAULT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span
                        className={`flex-1 text-sm ${
                          item.is_packed
                            ? 'text-stone-400 line-through'
                            : 'text-stone-700 dark:text-stone-200'
                        }`}
                      >
                        {item.label}
                      </span>
                    )}

                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button type="button" className="traveloop-button-primary !px-3 !py-1.5 text-xs" onClick={saveEdit}>
                          Save
                        </button>
                        <button type="button" className="traveloop-button-secondary !px-3 !py-1.5 text-xs" onClick={cancelEdit}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button type="button" className="traveloop-button-secondary !px-2.5 !py-1.5" onClick={() => beginEdit(item)}>
                          <Pencil size={14} />
                        </button>
                        <button type="button" className="traveloop-button-secondary !px-2.5 !py-1.5" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md">
          <Backpack size={48} className="mx-auto text-stone-300 mb-4" />
          <h3 className="font-sora font-semibold text-stone-700 dark:text-stone-200 mb-1">No items found</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            {selectedTrip
              ? 'No packing items match your filters. Add an item to begin.'
              : 'Select a trip to manage packing checklist.'}
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-2">
        <button
          onClick={handleResetAll}
          type="button"
          className="traveloop-button-secondary"
          disabled={items.length === 0}
        >
          <RotateCcw size={16} />
          Reset All
        </button>
        <button
          onClick={handleShare}
          type="button"
          className="traveloop-button-secondary"
          disabled={items.length === 0}
        >
          <Share2 size={16} />
          Share Checklist
        </button>
        <div className="traveloop-button-secondary justify-start">
          {packedCount === totalCount && totalCount > 0 ? (
            <>
              <Check size={16} />
              Ready to travel
            </>
          ) : (
            <>
              <Backpack size={16} />
              {Math.max(totalCount - packedCount, 0)} pending items
            </>
          )}
        </div>
      </div>
    </div>
  );
}
