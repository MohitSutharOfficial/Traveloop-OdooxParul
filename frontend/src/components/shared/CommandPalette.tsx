import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Compass,
  FileText,
  LayoutDashboard,
  Map,
  MapPin,
  Moon,
  Plane,
  Receipt,
  Search,
  Settings,
  Sun,
  Users,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { mockDestinations, mockRecentTrips } from '../../data/mockData';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useUiStore } from '../../store/uiStore';

type Action = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  onSelect: () => void;
};

type Group = {
  label: string;
  items: Action[];
};

export default function CommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette, toggleCommandPalette } = useUiStore();
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useKeyboard({ key: 'k', metaKey: true }, () => toggleCommandPalette());
  useKeyboard({ key: 'k', ctrlKey: true }, () => toggleCommandPalette());

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isCommandPaletteOpen]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const allGroups: Group[] = [
    {
      label: 'Recent Trips',
      items: mockRecentTrips.map((trip) => ({
        id: `trip-${trip.id}`,
        label: trip.name,
        description: trip.destination,
        icon: <Plane size={16} />,
        onSelect: () => navigate(`/itinerary/${trip.id}`),
      })),
    },
    {
      label: 'Navigation',
      items: [
        { id: 'nav-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, onSelect: () => navigate('/dashboard') },
        { id: 'nav-trips', label: 'My Trips', icon: <Plane size={16} />, onSelect: () => navigate('/trips') },
        { id: 'nav-plan', label: 'Plan a Trip', icon: <MapPin size={16} />, onSelect: () => navigate('/trip/create') },
        { id: 'nav-community', label: 'Community', icon: <Users size={16} />, onSelect: () => navigate('/community') },
        { id: 'nav-admin', label: 'Admin', icon: <BarChart3 size={16} />, onSelect: () => navigate('/admin') },
      ],
    },
    {
      label: 'Actions',
      items: [
        { id: 'action-new', label: 'New Trip', icon: <MapPin size={16} />, onSelect: () => navigate('/trip/create') },
        { id: 'action-pdf', label: 'Export PDF', icon: <FileText size={16} />, onSelect: () => alert('Exporting PDF...') },
        { id: 'action-settings', label: 'Open Settings', icon: <Settings size={16} />, onSelect: () => navigate('/profile') },
        { id: 'action-theme', label: 'Toggle Dark Mode', icon: theme === 'light' ? <Moon size={16} /> : <Sun size={16} />, onSelect: handleToggleTheme },
      ],
    },
    {
      label: 'Destinations',
      items: mockDestinations.map((dest) => ({
        id: `dest-${dest.id}`,
        label: dest.name,
        description: dest.country,
        icon: <Map size={16} />,
        onSelect: () => navigate(`/search/activities?city=${dest.name}`),
      })),
    },
  ];

  const filteredGroups = allGroups
    .map((group) => {
      if (!search) {
        if (group.label === 'Destinations') return { ...group, items: [] }; // Hide destinations initially unless searching
        return group;
      }
      
      const lowerSearch = search.toLowerCase();
      const filteredItems = group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(lowerSearch) ||
          item.description?.toLowerCase().includes(lowerSearch)
      );
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);

  const flattenedItems = filteredGroups.flatMap((group) => group.items);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, flattenedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + Math.max(1, flattenedItems.length)) % Math.max(1, flattenedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flattenedItems[activeIndex]) {
        flattenedItems[activeIndex].onSelect();
        closeCommandPalette();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeCommandPalette();
    }
  };

  if (!isCommandPaletteOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeCommandPalette}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.12 }}
          className="relative w-full max-w-xl overflow-hidden rounded-md bg-white shadow-2xl dark:bg-[#1C1917]"
        >
          <div className="flex h-12 items-center border-b border-[#E8E6E0] px-4 dark:border-stone-800">
            <Search size={18} className="text-stone-400" />
            <input
              ref={inputRef}
              className="flex-1 bg-transparent px-3 text-sm text-[#1C1917] placeholder:text-stone-400 focus:outline-none dark:text-stone-100"
              placeholder="Search trips, pages, actions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
              >
                ESC
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {flattenedItems.length === 0 ? (
              <div className="py-8 text-center text-sm text-stone-500">
                No results found. <br />
                Try 'New Trip' or 'Dashboard'
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.label} className="mb-4 last:mb-0">
                  <div className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-[#A8A29E]">
                    {group.label}
                  </div>
                  <div>
                    {group.items.map((item) => {
                      const globalIndex = flattenedItems.indexOf(item);
                      const isActive = globalIndex === activeIndex;

                      return (
                        <button
                          key={item.id}
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                            isActive
                              ? 'border-l-2 border-[#714B67] bg-[#F5F4F0] text-[#1C1917] dark:bg-stone-800 dark:text-stone-100'
                              : 'border-l-2 border-transparent text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800/50'
                          }`}
                          onClick={() => {
                            item.onSelect();
                            closeCommandPalette();
                          }}
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                        >
                          <span className={`flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm dark:bg-stone-900 ${isActive ? 'text-[#714B67]' : 'text-stone-400'}`}>
                            {item.icon}
                          </span>
                          <span className="flex-1 text-sm font-medium">
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="text-xs text-stone-500 dark:text-stone-400">
                              {item.description}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
