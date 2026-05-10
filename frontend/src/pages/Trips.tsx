import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  Copy,
  Download,
  Filter,
  Grid,
  Leaf,
  List as ListIcon,
  MoreVertical,
  Pencil,
  Plane,
  Plus,
  Search,
  Share,
  Trash2,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockRecentTrips } from '../data/mockData';
import { Trip, useTripStore } from '../store/tripStore';

// Dummy Templates
const tripTemplates = [
  { id: 't1', name: '7 Days in Tuscany', duration: '7 days', cost: '$1,200', activities: 14, photo: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
  { id: 't2', name: 'Tokyo Highlights', duration: '5 days', cost: '$1,500', activities: 20, photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { id: 't3', name: 'Bali Budget Backpacking', duration: '14 days', cost: '$600', activities: 10, photo: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
  { id: 't4', name: 'New York Weekend', duration: '3 days', cost: '$800', activities: 8, photo: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
  { id: 't5', name: 'Swiss Alps Hiking', duration: '10 days', cost: '$2,500', activities: 12, photo: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400' },
];

export default function Trips() {
  const { trips, deleteTrip } = useTripStore();
  const [activeTab, setActiveTab] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrips, setSelectedTrips] = useState<Set<string>>(new Set());

  // Filter trips based on tab and search
  const filteredTrips = trips.filter((t) => {
    const matchesTab = activeTab === 'All' || t.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleTripSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedTrips);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedTrips(newSet);
  };

  const handleSelectAll = () => {
    if (selectedTrips.size === filteredTrips.length) {
      setSelectedTrips(new Set());
    } else {
      setSelectedTrips(new Set(filteredTrips.map((t) => t.id)));
    }
  };

  // Virtualizer for List View
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: filteredTrips.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70, // Height of list row
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)]">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 border-b border-[#E8E6E0] bg-[#FAF9F7] px-4 py-4 dark:border-stone-800 dark:bg-[#0C0A09] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h1 className="font-sora text-2xl font-bold text-[#1C1917] dark:text-white">My Trips</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="traveloop-input h-9 w-full pl-9 text-sm"
            />
          </div>
          <button className="flex h-9 items-center gap-2 rounded-md border border-[#E8E6E0] bg-white px-3 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800">
            <Filter size={16} /> Filters
          </button>
          <div className="flex h-9 items-center rounded-md border border-[#E8E6E0] bg-white p-0.5 dark:border-stone-700 dark:bg-stone-900">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex h-full items-center justify-center rounded px-2.5 transition ${viewMode === 'grid' ? 'bg-stone-100 text-[#1C1917] dark:bg-stone-800 dark:text-white' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-full items-center justify-center rounded px-2.5 transition ${viewMode === 'list' ? 'bg-stone-100 text-[#1C1917] dark:bg-stone-800 dark:text-white' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
          <Link to="/trip/create" className="traveloop-button-primary flex h-9 items-center gap-2 px-4 text-sm">
            <Plus size={16} /> New Trip
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-[#E8E6E0] bg-[#FAF9F7] px-4 pt-2 dark:border-stone-800 dark:bg-[#0C0A09] sm:px-6">
          <div className="flex gap-6 overflow-x-auto">
            {['All', 'Ongoing', 'Upcoming', 'Completed', 'Drafts', 'Templates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab ? 'text-[#714B67]' : 'text-stone-500 hover:text-[#1C1917] dark:text-stone-400 dark:hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tripTabs" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#714B67]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Container */}
        <div ref={parentRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {filteredTrips.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-stone-100 p-6 dark:bg-stone-800">
                <Plane className="h-12 w-12 text-stone-300 dark:text-stone-600" />
              </div>
              <h3 className="font-sora text-lg font-semibold text-[#1C1917] dark:text-white">No trips found</h3>
              <p className="mt-2 text-sm text-stone-500">There are no trips matching your current filters.</p>
              <button onClick={() => { setSearchQuery(''); setActiveTab('All'); }} className="mt-4 font-medium text-[#714B67] hover:underline">
                Clear all filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence>
                {filteredTrips.map((trip) => {
                  const isSelected = selectedTrips.has(trip.id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={trip.id}
                      className={`traveloop-card group relative flex cursor-pointer flex-col overflow-hidden !p-0 transition hover:shadow-md ${isSelected ? 'ring-2 ring-[#714B67]' : ''}`}
                      onClick={() => document.location.href = `/itinerary/${trip.id}`}
                    >
                      {/* Hover Checkbox */}
                      <button
                        onClick={(e) => toggleTripSelection(trip.id, e)}
                        className={`absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded border ${
                          isSelected ? 'bg-[#714B67] border-[#714B67] text-white' : 'bg-white/90 border-stone-300 text-transparent opacity-0 backdrop-blur group-hover:opacity-100 dark:border-stone-600 dark:bg-stone-800/90'
                        } transition`}
                      >
                        <CheckSquare size={14} className={isSelected ? 'block' : 'hidden'} />
                      </button>

                      <div className="relative h-44 w-full overflow-hidden">
                        <img src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} alt={trip.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute left-3 bottom-3 rounded bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-800 backdrop-blur">
                          {trip.status}
                        </div>
                        <div className="absolute right-3 top-3 rounded-full bg-white/90 p-1 backdrop-blur">
                          <span className="flex h-8 w-8 items-center justify-center font-sora text-[10px] font-bold text-[#714B67]">{trip.planningScore}%</span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-sora text-base font-semibold text-[#1C1917] dark:text-white line-clamp-1">{trip.name}</h3>
                            <p className="mt-1 flex items-center gap-1 text-[13px] text-stone-500">
                              <span>{trip.destination}</span> 🌍
                            </p>
                          </div>
                          <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        
                        <p className="mt-3 flex items-center gap-2 text-[12px] font-medium text-stone-600 dark:text-stone-400">
                          <Calendar size={14} />
                          {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                        </p>

                        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                          <div className="flex items-center justify-between text-[11px] font-medium">
                            <span className="text-stone-500">${trip.budget.spent.toLocaleString()} / ${trip.budget.total.toLocaleString()}</span>
                            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-400/10 px-1.5 py-0.5 rounded">
                              <Leaf size={10} /> 3.2 kg CO₂
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                            <div className="h-full rounded-full bg-[#714B67]" style={{ width: `${Math.min((trip.budget.spent / trip.budget.total) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Virtualized List View */}
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const trip = filteredTrips[virtualItem.index];
                  const isSelected = selectedTrips.has(trip.id);
                  return (
                    <div
                      key={trip.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className="group flex cursor-pointer items-center border-b border-[#E8E6E0] py-2 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900/50"
                      onClick={() => document.location.href = `/itinerary/${trip.id}`}
                    >
                      <div className="flex w-12 shrink-0 justify-center">
                        <button
                          onClick={(e) => toggleTripSelection(trip.id, e)}
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isSelected ? 'bg-[#714B67] border-[#714B67] text-white' : 'border-stone-300 bg-white text-transparent opacity-0 group-hover:opacity-100 dark:border-stone-600 dark:bg-stone-800'
                          }`}
                        >
                          <CheckSquare size={12} className={isSelected ? 'block' : 'hidden'} />
                        </button>
                      </div>
                      <img src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'} alt="" className="h-10 w-16 shrink-0 rounded object-cover" />
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="truncate font-sora text-[14px] font-semibold text-[#1C1917] dark:text-white">{trip.name}</p>
                        <p className="truncate text-[12px] text-stone-500">{trip.destination}</p>
                      </div>
                      <div className="hidden w-40 shrink-0 text-[12px] text-stone-600 dark:text-stone-400 md:block">
                        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yy')}
                      </div>
                      <div className="hidden w-32 shrink-0 md:block">
                        <span className="rounded bg-stone-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                          {trip.status}
                        </span>
                      </div>
                      <div className="ml-4 shrink-0 px-4">
                        <button className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preplanned Templates Section */}
          {activeTab === 'All' && !searchQuery && (
            <div className="mt-12 border-t border-[#E8E6E0] pt-8 dark:border-stone-800">
              <h2 className="font-sora text-xl font-semibold text-[#1C1917] dark:text-white">Preplanned Templates</h2>
              <p className="mt-1 text-sm text-stone-500">Kickstart your next adventure with these curated itineraries.</p>
              
              <div className="mt-6 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {tripTemplates.map((tpl) => (
                  <div key={tpl.id} className="group w-64 shrink-0 overflow-hidden rounded-md border border-[#E8E6E0] bg-white shadow-sm transition hover:shadow-md dark:border-stone-700 dark:bg-stone-900">
                    <div className="relative h-32 w-full overflow-hidden">
                      <img src={tpl.photo} alt={tpl.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-sora text-[14px] font-semibold text-[#1C1917] dark:text-white truncate">{tpl.name}</h3>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                        <span>{tpl.duration}</span>
                        <span>{tpl.activities} activities</span>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">{tpl.cost}</span>
                      </div>
                      <Link to={`/trip/create?template=${tpl.id}`} className="mt-4 block w-full rounded-md border border-[#E8E6E0] bg-stone-50 py-1.5 text-center text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700">
                        Use Template
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedTrips.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-stone-200 bg-white px-6 py-3 shadow-xl dark:border-stone-700 dark:bg-stone-800"
          >
            <span className="rounded-full bg-[#714B67]/10 px-2 py-0.5 text-xs font-bold text-[#714B67]">
              {selectedTrips.size} selected
            </span>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-600" />
            <button className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#1C1917] dark:text-stone-300 dark:hover:text-white">
              <Download size={14} /> Export CSV
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#1C1917] dark:text-stone-300 dark:hover:text-white">
              <Copy size={14} /> Duplicate
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600" onClick={() => {
              selectedTrips.forEach(id => deleteTrip(id));
              setSelectedTrips(new Set());
            }}>
              <Trash2 size={14} /> Delete
            </button>
            <div className="h-4 w-px bg-stone-300 dark:bg-stone-600" />
            <button className="text-xs font-medium text-stone-400 hover:text-stone-600 dark:hover:text-stone-300" onClick={() => setSelectedTrips(new Set())}>
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
