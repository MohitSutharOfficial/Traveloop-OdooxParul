import { format, parseISO, differenceInDays, addDays, isSameDay } from 'date-fns';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  GripVertical,
  MapPin,
  MessageSquare,
  PieChart as PieChartIcon,
  Plane,
  Plus,
  Redo2,
  Save,
  Share,
  Download,
  Trash2,
  Undo2,
  Utensils,
  Wallet,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cell, Pie, PieChart } from 'recharts';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTripStore, Trip } from '../store/tripStore';
import { itineraryService, ItineraryItem } from '../services/itinerary.service';
import { tripService } from '../services/trip.service';

// -- Types --
type Activity = {
  id: string;
  name: string;
  category: 'food' | 'sightseeing' | 'transport' | 'other';
  time: string;
  duration: string;
  cost: number;
  done: boolean;
};

type Section = {
  id: string;
  name: string;
  city: string;
  dates: string;
  budget: number;
  activities: Activity[];
};

// -- Mock Initial Data --
const initialSections: Section[] = [
  {
    id: 'sec-1',
    name: 'Arrival & Exploring',
    city: 'Paris',
    dates: 'June 1 - June 3',
    budget: 500,
    activities: [
      { id: 'act-1', name: 'Check into hotel', category: 'other', time: '14:00', duration: '1h', cost: 0, done: true },
      { id: 'act-2', name: 'Eiffel Tower Tour', category: 'sightseeing', time: '16:00', duration: '2h', cost: 35, done: false },
      { id: 'act-3', name: 'Dinner at Le Petit', category: 'food', time: '19:30', duration: '2h', cost: 80, done: false },
    ],
  },
  {
    id: 'sec-2',
    name: 'Museum Day',
    city: 'Paris',
    dates: 'June 4',
    budget: 300,
    activities: [
      { id: 'act-4', name: 'Louvre Museum', category: 'sightseeing', time: '09:00', duration: '4h', cost: 20, done: false },
      { id: 'act-5', name: 'Lunch at Cafe Marly', category: 'food', time: '13:30', duration: '1.5h', cost: 45, done: false },
    ],
  },
];

// -- Sub-Components --
function SortableActivity({ activity, sectionId, onUpdate, onDelete }: { activity: Activity; sectionId: string; onUpdate: (id: string, updates: Partial<Activity>) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id, data: { type: 'Activity', activity, sectionId } });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const getIcon = () => {
    switch(activity.category) {
      case 'food': return <Utensils size={14} className="text-fuchsia-500" />;
      case 'transport': return <Plane size={14} className="text-blue-500" />;
      case 'sightseeing': return <MapPin size={14} className="text-purple-500" />;
      default: return <Circle size={14} className="text-stone-400" />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`group flex items-center gap-3 border-b border-[#E8E6E0] bg-white px-3 py-2 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:bg-[#1C1917] dark:hover:bg-stone-800/50 ${isDragging ? 'shadow-lg z-50 rounded border' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-grab text-stone-300 hover:text-stone-500 active:cursor-grabbing">
        <GripVertical size={16} />
      </div>
      <button onClick={() => onUpdate(activity.id, { done: !activity.done })} className={`flex shrink-0 items-center justify-center ${activity.done ? 'text-teal-500' : 'text-stone-300 hover:text-teal-400'}`}>
        {activity.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
      </button>
      
      <div className="flex w-24 shrink-0 items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
          {getIcon()}
        </div>
        <input type="text" value={activity.time} onChange={(e) => onUpdate(activity.id, { time: e.target.value })} className="w-12 bg-transparent text-xs font-medium text-stone-600 outline-none focus:text-[#714B67] dark:text-stone-300" placeholder="00:00" />
      </div>

      <input 
        type="text" 
        value={activity.name} 
        onChange={(e) => onUpdate(activity.id, { name: e.target.value })} 
        className={`flex-1 bg-transparent text-sm font-medium outline-none focus:text-[#714B67] ${activity.done ? 'line-through text-stone-400 dark:text-stone-600' : 'text-[#1C1917] dark:text-white'}`} 
        placeholder="Activity Name" 
      />

      <div className="flex w-16 shrink-0 items-center">
        <input type="text" value={activity.duration} onChange={(e) => onUpdate(activity.id, { duration: e.target.value })} className="w-full bg-transparent text-xs text-stone-500 outline-none" placeholder="2h" />
      </div>

      <div className="flex w-16 shrink-0 items-center gap-1">
        <span className="text-xs text-stone-400">₹</span>
        <input type="number" value={activity.cost} onChange={(e) => onUpdate(activity.id, { cost: Number(e.target.value) })} className="w-full bg-transparent text-xs font-semibold text-stone-700 outline-none dark:text-stone-300" placeholder="0" />
      </div>

      <button onClick={() => onDelete(activity.id)} className="shrink-0 text-stone-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function SortableSection({ section, onUpdateSection, onAddActivity, onUpdateActivity, onDeleteActivity, onDeleteSection }: any) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id, data: { type: 'Section', section } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const spent = section.activities.reduce((acc: number, act: Activity) => acc + act.cost, 0);

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`mb-6 overflow-hidden rounded-md border border-[#E8E6E0] bg-white shadow-sm dark:border-stone-800 dark:bg-[#1C1917] ${isDragging ? 'ring-2 ring-[#714B67]' : ''}`} ref={setNodeRef} style={style}>
      <div className="flex items-center justify-between border-b border-[#E8E6E0] bg-[#F5F4F0] p-3 dark:border-stone-800 dark:bg-stone-900/50">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab text-stone-400 hover:text-stone-600 active:cursor-grabbing dark:hover:text-stone-200">
            <GripVertical size={18} />
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-stone-500 hover:bg-stone-200 p-1 rounded transition dark:hover:bg-stone-800">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <div>
            <input type="text" value={section.name} onChange={(e) => onUpdateSection(section.id, { name: e.target.value })} className="bg-transparent font-sora text-sm font-bold text-[#1C1917] outline-none dark:text-white" />
            <div className="flex items-center gap-2 text-[11px] font-medium text-stone-500">
              <span className="flex items-center gap-1"><MapPin size={10}/> {section.city}</span>
              <span>&middot;</span>
              <span>{section.dates}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wide text-stone-400">Section Budget</p>
            <p className={`text-xs font-semibold ${spent > section.budget ? 'text-red-500' : 'text-stone-700 dark:text-stone-300'}`}>₹{spent} / ₹{section.budget}</p>
          </div>
          <button onClick={() => onDeleteSection(section.id)} className="text-stone-400 hover:text-red-500">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <SortableContext items={section.activities.map((a: any) => a.id)} strategy={verticalListSortingStrategy}>
              <div className="min-h-[40px]">
                {section.activities.map((activity: any) => (
                  <SortableActivity key={activity.id} activity={activity} sectionId={section.id} onUpdate={onUpdateActivity} onDelete={onDeleteActivity} />
                ))}
              </div>
            </SortableContext>
            <div className="p-2">
              <button onClick={() => onAddActivity(section.id)} className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-stone-300 py-2 text-xs font-semibold text-stone-500 transition hover:border-[#714B67] hover:bg-fuchsia-50 hover:text-[#714B67] dark:border-stone-700 dark:hover:border-stone-600 dark:hover:bg-stone-800">
                <Plus size={14} /> Add Activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


const getWeatherForCity = (city: string) => {
  const normalized = (city || '').toLowerCase();
  if (normalized.includes('goa')) {
    return { temp: '31°C', desc: 'Warm & sunny beach vibes', icon: 'sun' };
  } else if (normalized.includes('kochi') || normalized.includes('kerala') || normalized.includes('munnar') || normalized.includes('alleppey')) {
    return { temp: '28°C', desc: 'Tropical breeze & showers', icon: 'rain' };
  } else if (normalized.includes('delhi') || normalized.includes('jaipur') || normalized.includes('agra')) {
    return { temp: '35°C', desc: 'Hot, wear light clothing', icon: 'sun' };
  } else if (normalized.includes('ladakh') || normalized.includes('leh')) {
    return { temp: '14°C', desc: 'Chilly, carry layers & woolens', icon: 'wind' };
  } else if (normalized.includes('rome') || normalized.includes('paris') || normalized.includes('tuscany')) {
    return { temp: '20°C', desc: 'Pleasant, carry a light jacket', icon: 'cloud-sun' };
  }
  return { temp: '22°C', desc: 'Mild and pleasant weather', icon: 'cloud-sun' };
};


export default function ItineraryBuilder() {
  const { id } = useParams();
  const { trips } = useTripStore();
  const [trip, setTrip] = useState<Trip | null>(trips.find(t => t.id === id) || null);
  const [loading, setLoading] = useState(true);

  // State
  const [sections, setSections] = useState<Section[]>([]);
  const [history, setHistory] = useState<Section[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // 1. Fetch current items in DB to compare
      const dbItems = await itineraryService.getTripItinerary(id);
      const dbItemIds = new Set(dbItems.map((item: any) => item.id));

      // 2. Extract and format all current activities from our UI sections
      const currentUiItems: any[] = [];
      let sortOrder = 1;

      sections.forEach((section) => {
        // Parse dates which could be e.g. "May 13, 2026" or format ISO
        const sectionDate = new Date(section.dates);
        section.activities.forEach((act) => {
          let startsAtIso = '';
          if (act.time && act.time.includes(':')) {
            const [hrs, mins] = act.time.split(':').map(Number);
            const d = new Date(sectionDate);
            d.setHours(hrs, mins, 0, 0);
            startsAtIso = d.toISOString();
          } else {
            const d = new Date(sectionDate);
            d.setHours(12, 0, 0, 0); // default noon
            startsAtIso = d.toISOString();
          }

          const endD = new Date(startsAtIso);
          endD.setHours(endD.getHours() + 1);
          const endsAtIso = endD.toISOString();

          const itemType = act.category === 'food' ? 'meal' :
                           act.category === 'transport' ? 'transfer' :
                           act.category === 'sightseeing' ? 'activity' : 'note';

          currentUiItems.push({
            id: act.id,
            trip_id: id,
            item_type: itemType,
            title: act.name || 'Untitled Activity',
            location: section.city || trip?.destination || '',
            starts_at: startsAtIso,
            ends_at: endsAtIso,
            cost: Number(act.cost) || 0,
            sort_order: sortOrder++
          });
        });
      });

      // 3. Separate into Create, Update, Delete
      const uiItemIds = new Set(currentUiItems.map(item => item.id));

      // Delete: Items in DB but NOT in current UI
      const itemsToDelete = dbItems.filter((item: any) => !uiItemIds.has(item.id));
      for (const item of itemsToDelete) {
        await itineraryService.deleteItem(item.id);
      }

      // Create or Update:
      for (const item of currentUiItems) {
        if (item.id.startsWith('act-')) {
          const { id: _, ...payload } = item;
          await itineraryService.createItem(payload);
        } else if (dbItemIds.has(item.id)) {
          await itineraryService.updateItem(item.id, item);
        } else {
          await itineraryService.createItem(item);
        }
      }

      // 4. Update the trip's budget_spent based on the new total cost of all activities
      const newTotalSpent = currentUiItems.reduce((sum, item) => sum + item.cost, 0);
      await tripService.updateTrip(id, { budget_spent: newTotalSpent });
      
      // Update local state
      if (trip) {
        setTrip({
          ...trip,
          budget: {
            ...trip.budget,
            spent: newTotalSpent
          }
        });
      }

      // Refresh to get DB UUIDs instead of dummy local client-side IDs
      const refreshedItems = await itineraryService.getTripItinerary(id);
      
      const startDate = trip?.startDate ? new Date(trip.startDate) : new Date();
      const endDate = trip?.endDate ? new Date(trip.endDate) : new Date();
      const daysCount = Math.max(1, differenceInDays(endDate, startDate) + 1);
      
      const updatedSecs = [];
      for (let i = 0; i < daysCount; i++) {
        const currentDate = addDays(startDate, i);
        
        const dayItems = refreshedItems.filter((item: any) => {
          if (!item.starts_at) return i === 0;
          return isSameDay(new Date(item.starts_at), currentDate);
        });
        
        const mappedActivities = dayItems.map((item: any) => ({
          id: item.id,
          name: item.title,
          category: item.item_type === 'meal' ? 'food' : item.item_type === 'flight' || item.item_type === 'transfer' ? 'transport' : item.item_type === 'activity' ? 'sightseeing' : 'other',
          time: item.starts_at ? format(new Date(item.starts_at), 'HH:mm') : '',
          duration: '1h',
          cost: Number(item.cost) || 0,
          done: false
        }));

        const existingSection = sections[i];
        updatedSecs.push({
          id: existingSection?.id || `sec-backend-${i + 1}`,
          name: existingSection?.name || `Day ${i + 1}`,
          city: existingSection?.city || trip?.destination || '',
          dates: existingSection?.dates || format(currentDate, 'MMM d, yyyy'),
          budget: existingSection?.budget || 0,
          activities: mappedActivities
        });
      }

      setSections(updatedSecs);
      setHistory([updatedSecs]);
      setHistoryIndex(0);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save itinerary:', err);
      alert('Failed to save itinerary. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);
      try {
        const foundTrip = trips.find(t => t.id === id) || await tripService.getTrip(id);
        const backendTrip: Trip = {
          id: foundTrip.id,
          name: foundTrip.name,
          destination: foundTrip.destination,
          coverPhoto: (foundTrip as any).cover_photo || foundTrip.coverPhoto,
          startDate: (foundTrip as any).start_date || foundTrip.startDate,
          endDate: (foundTrip as any).end_date || foundTrip.endDate,
          status: foundTrip.status as any,
          planningScore: (foundTrip as any).planning_score || foundTrip.planningScore,
          budget: {
             total: (foundTrip as any).budget_total || foundTrip.budget?.total || 0,
             spent: (foundTrip as any).budget_spent || foundTrip.budget?.spent || 0,
             currency: (foundTrip as any).currency || foundTrip.budget?.currency || 'USD'
          }
        };
        setTrip(backendTrip);
        const items = await itineraryService.getTripItinerary(id);
        
        // Group items by starts_at day
        const startDate = backendTrip.startDate ? new Date(backendTrip.startDate) : new Date();
        const endDate = backendTrip.endDate ? new Date(backendTrip.endDate) : new Date();
        const daysCount = Math.max(1, differenceInDays(endDate, startDate) + 1);
        
        const initialSecs = [];
        
        for (let i = 0; i < daysCount; i++) {
          const currentDate = addDays(startDate, i);
          
          const dayItems = items.filter(item => {
            if (!item.starts_at) return i === 0; // put elements without date in Day 1
            return isSameDay(new Date(item.starts_at), currentDate);
          });
          
          const mappedActivities: Activity[] = dayItems.map(item => ({
            id: item.id,
            name: item.title,
            category: item.item_type === 'meal' ? 'food' : item.item_type === 'flight' || item.item_type === 'transfer' ? 'transport' : item.item_type === 'activity' ? 'sightseeing' : 'other',
            time: item.starts_at ? format(new Date(item.starts_at), 'HH:mm') : '',
            duration: '1h',
            cost: Number(item.cost) || 0,
            done: false
          }));

          initialSecs.push({
            id: `sec-backend-${i + 1}`,
            name: `Day ${i + 1}`,
            city: backendTrip.destination,
            dates: format(currentDate, 'MMM d, yyyy'),
            budget: i === 0 ? backendTrip.budget.total : 0,
            activities: mappedActivities
          });
        }
        
        setSections(initialSecs);
        setHistory([initialSecs]);
      } catch (err) {
        console.error(err);
        setSections(initialSections);
        setHistory([initialSections]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, trips]);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiChat, setAiChat] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // History / Undo Redo
  const commit = (newSections: Section[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSections);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSections(newSections);
  };

  useKeyboard({ key: 'z', metaKey: true }, () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  });

  useKeyboard({ key: 'z', metaKey: true, shiftKey: true }, () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  });

  // Handlers
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type || (over.data.current?.sortable?.containerId ? 'SectionContainer' : null);

    if (activeType === 'Section' && overType === 'Section') {
      if (active.id !== over.id) {
        const oldIndex = sections.findIndex(s => s.id === active.id);
        const newIndex = sections.findIndex(s => s.id === over.id);
        commit(arrayMove(sections, oldIndex, newIndex));
      }
    } else if (activeType === 'Activity') {
      const activeSectionId = active.data.current.sectionId;
      // Find the section the item was dropped over
      const overId = over.id;
      let overSectionId = null;
      
      const overSection = sections.find(s => s.id === overId);
      if (overSection) {
        overSectionId = overSection.id;
      } else {
        // It might be over another activity
        overSectionId = sections.find(s => s.activities.some(a => a.id === overId))?.id;
      }

      if (activeSectionId && overSectionId) {
        if (activeSectionId === overSectionId) {
          if (active.id !== over.id) {
            const section = sections.find(s => s.id === activeSectionId);
            if (section) {
              const oldIndex = section.activities.findIndex(a => a.id === active.id);
              const newIndex = section.activities.findIndex(a => a.id === over.id);
              const newActivities = arrayMove(section.activities, oldIndex, newIndex);
              commit(sections.map(s => s.id === section.id ? { ...s, activities: newActivities } : s));
            }
          }
        } else {
          // Move to different section (Simplified for this mock: moving it to the end of the new section)
          const activeSec = sections.find(s => s.id === activeSectionId);
          const overSec = sections.find(s => s.id === overSectionId);
          if (activeSec && overSec) {
            const activity = activeSec.activities.find(a => a.id === active.id);
            if(activity) {
               const newSections = sections.map(s => {
                 if (s.id === activeSectionId) return { ...s, activities: s.activities.filter(a => a.id !== active.id) };
                 if (s.id === overSectionId) return { ...s, activities: [...s.activities, activity] };
                 return s;
               });
               commit(newSections);
            }
          }
        }
      }
    }
  };

  const handleAddSection = () => {
    commit([...sections, { id: `sec-${Date.now()}`, name: 'New Section', city: trip?.destination || 'Unknown', dates: 'TBD', budget: 0, activities: [] }]);
  };

  const handleDeleteSection = (id: string) => {
    commit(sections.filter(s => s.id !== id));
  };

  const handleUpdateSection = (id: string, updates: Partial<Section>) => {
    commit(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleAddActivity = (sectionId: string) => {
    const newAct: Activity = { id: `act-${Date.now()}`, name: '', category: 'other', time: '', duration: '', cost: 0, done: false };
    commit(sections.map(s => s.id === sectionId ? { ...s, activities: [...s.activities, newAct] } : s));
  };

  const handleUpdateActivity = (id: string, updates: Partial<Activity>) => {
    commit(sections.map(s => ({
      ...s,
      activities: s.activities.map(a => a.id === id ? { ...a, ...updates } : a)
    })));
  };

  const handleDeleteActivity = (id: string) => {
    commit(sections.map(s => ({
      ...s,
      activities: s.activities.filter(a => a.id !== id)
    })));
  };

  // AI Assist
  const sendAiMsg = (text: string) => {
    if(!text.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text }]);
    setAiInput('');
    setIsAiTyping(true);
    setTimeout(() => {
      setAiChat(prev => [...prev, { role: 'assistant', text: "Consider adding a relaxing evening activity here, like a Seine river cruise or a casual local bistro dinner. Would you like me to add a river cruise to Section 1?" }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const totalBudget = trip?.budget.total || 3000;
  const totalSpent = sections.reduce((acc, s) => acc + s.activities.reduce((a, act) => a + act.cost, 0), 0);
  const pieData = [{ name: 'Spent', value: totalSpent }, { name: 'Remaining', value: Math.max(0, totalBudget - totalSpent) }];
  const pieColors = ['#714B67', '#E8E6E0'];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E6E0] bg-white px-4 py-3 dark:border-stone-800 dark:bg-[#1C1917]">
        <div className="flex items-center gap-4">
          <button className="text-stone-400 hover:text-stone-600" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-sora text-sm font-bold text-[#1C1917] dark:text-white">{trip?.name || 'Itinerary Builder'}</h2>
            <p className="text-[11px] text-stone-500">{trip?.destination} &middot; {trip?.startDate ? new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''} - {trip?.endDate ? new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-r border-[#E8E6E0] pr-3 dark:border-stone-800">
            <button onClick={() => { if(historyIndex>0) { setHistoryIndex(historyIndex-1); setSections(history[historyIndex-1]); } }} disabled={historyIndex === 0} className="rounded p-1.5 text-stone-400 hover:bg-stone-100 disabled:opacity-30 dark:hover:bg-stone-800">
              <Undo2 size={16} />
            </button>
            <button onClick={() => { if(historyIndex < history.length-1) { setHistoryIndex(historyIndex+1); setSections(history[historyIndex+1]); } }} disabled={historyIndex === history.length-1} className="rounded p-1.5 text-stone-400 hover:bg-stone-100 disabled:opacity-30 dark:hover:bg-stone-800">
              <Redo2 size={16} />
            </button>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 disabled:opacity-50 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <Save size={14} className={isSaving ? 'animate-spin' : ''} />
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
          </button>
          <button onClick={() => setIsPreviewOpen(true)} className="traveloop-button-secondary text-xs py-1.5">View Itinerary</button>
          <button onClick={handleShare} className="traveloop-button-primary text-xs py-1.5 gap-1">
            <Share size={14} /> 
            {shareSuccess ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="flex-1 overflow-y-auto bg-[#FAF9F7] p-6 dark:bg-[#0C0A09]">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {sections.map(section => (
                <SortableSection 
                  key={section.id} 
                  section={section} 
                  onUpdateSection={handleUpdateSection}
                  onAddActivity={handleAddActivity}
                  onUpdateActivity={handleUpdateActivity}
                  onDeleteActivity={handleDeleteActivity}
                  onDeleteSection={handleDeleteSection}
                />
              ))}
            </SortableContext>
            <DragOverlay dropAnimation={null}>
              {/* Overlay logic could go here for better visuals, but standard works well enough for mock */}
            </DragOverlay>
          </DndContext>

          <button onClick={handleAddSection} className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-stone-300 bg-transparent py-4 text-sm font-semibold text-stone-500 transition hover:border-[#714B67] hover:bg-fuchsia-50 hover:text-[#714B67] dark:border-stone-700 dark:hover:border-[#714B67] dark:hover:bg-stone-900">
            <Plus size={16} /> Add Section
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden w-80 shrink-0 flex-col border-l border-[#E8E6E0] bg-white dark:border-stone-800 dark:bg-[#1C1917] lg:flex">
          {/* Presence */}
          <div className="flex items-center justify-between border-b border-[#E8E6E0] px-4 py-3 dark:border-stone-800">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/150?u=a" className="h-7 w-7 rounded-full border-2 border-white dark:border-[#1C1917]" alt=""/>
              <img src="https://i.pravatar.cc/150?u=b" className="h-7 w-7 rounded-full border-2 border-white dark:border-[#1C1917]" alt=""/>
            </div>
            <p className="text-[10px] font-medium text-stone-500">Priya is viewing Section 2</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Budget Meter */}
            <div className="rounded-md border border-[#E8E6E0] p-4 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
              <h3 className="font-sora text-[13px] font-semibold flex items-center gap-2 mb-4"><PieChartIcon size={14}/> Budget Tracker</h3>
              
              <div className="flex justify-center relative mb-4">
                <PieChart width={120} height={120}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={55} dataKey="value" stroke="none">
                    {pieData.map((e,i) => <Cell key={i} fill={pieColors[i]} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[12px] font-sora font-bold">₹{totalSpent}</span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Spent</span>
                </div>
              </div>

              <div className="space-y-2">
                {sections.map(s => {
                  const sectionSpent = s.activities.reduce((acc, act) => acc + act.cost, 0);
                  const over = sectionSpent > s.budget;
                  return (
                    <div key={s.id}>
                      <div className="flex justify-between text-[10px] mb-1 font-medium">
                        <span className="truncate w-24 text-stone-600 dark:text-stone-400">{s.name}</span>
                        <span className={over ? 'text-red-500' : 'text-stone-500'}>₹{sectionSpent} / ₹{s.budget}</span>
                      </div>
                      <div className="h-1 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                         <div className={`h-full ${over ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${Math.min((sectionSpent/Math.max(s.budget,1))*100, 100)}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Weather Widget */}
            <div className="space-y-2">
              <h3 className="font-sora text-[11px] uppercase tracking-wide font-semibold text-stone-400 px-1">Weather Forecast</h3>
              {sections.map(s => {
                const weather = getWeatherForCity(s.city);
                const renderIcon = () => {
                  switch (weather.icon) {
                    case 'sun': return <Sun size={16} className="text-amber-500" />;
                    case 'rain': return <CloudRain size={16} className="text-blue-500" />;
                    case 'wind': return <Wind size={16} className="text-teal-500" />;
                    default: return <CloudSun size={16} className="text-blue-500" />;
                  }
                };
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-md bg-blue-50 p-3 text-blue-900 dark:bg-blue-900/10 dark:text-blue-300">
                    <div className="flex items-center gap-2">
                      {renderIcon()}
                      <div>
                        <p className="text-xs font-bold">{s.city}</p>
                        <p className="text-[10px] opacity-70">{weather.desc}</p>
                      </div>
                    </div>
                    <span className="font-sora text-sm font-semibold">{weather.temp}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Assist Panel (Bottom right) */}
          <div className="flex flex-col border-t border-[#E8E6E0] dark:border-stone-800">
            <button onClick={() => setIsAiPanelOpen(!isAiPanelOpen)} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-900">
              <span className="font-sora text-sm font-semibold text-[#714B67] flex items-center gap-2"><Bot size={16}/> AI Assistant</span>
              {isAiPanelOpen ? <ChevronDown size={16} className="text-stone-400"/> : <ChevronUp size={16} className="text-stone-400"/>}
            </button>
            <AnimatePresence>
              {isAiPanelOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 300 }} exit={{ height: 0 }} className="flex flex-col overflow-hidden bg-stone-50 dark:bg-stone-900">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 text-[12px]">
                    {aiChat.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role==='user'?'justify-end':'justify-start'}`}>
                        <div className={`rounded-md px-3 py-2 max-w-[85%] ${msg.role==='user'?'bg-[#714B67] text-white rounded-br-none':'bg-white dark:bg-stone-800 border border-[#E8E6E0] dark:border-stone-700 rounded-bl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="rounded-md px-3 py-2 bg-white dark:bg-stone-800 border border-[#E8E6E0] dark:border-stone-700 rounded-bl-none flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"/>
                          <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-75"/>
                          <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-150"/>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white dark:bg-[#1C1917] border-t border-[#E8E6E0] dark:border-stone-800">
                     <div className="flex gap-2 mb-2 overflow-x-auto hide-scrollbar">
                       <button onClick={() => sendAiMsg('Suggest activities')} className="shrink-0 rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">Suggest activities</button>
                       <button onClick={() => sendAiMsg('Review my plan')} className="shrink-0 rounded-full bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">Review my plan</button>
                     </div>
                     <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendAiMsg(aiInput)} placeholder="Ask about Paris..." className="traveloop-input h-8 w-full text-xs" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Itinerary Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm dark:bg-black/80"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-[#FAF9F7] shadow-2xl overflow-hidden dark:bg-[#1C1917]"
            >
              {/* Cover Header */}
              <div className="relative h-48 w-full bg-cover bg-center flex items-end p-6" style={{ backgroundImage: `url(${trip?.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/45 to-transparent" />
                <div className="relative z-10 flex w-full items-center justify-between text-white">
                  <div>
                    <span className="rounded bg-teal-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Verified Trip</span>
                    <h1 className="font-sora text-2xl font-bold mt-1">{trip?.name || 'My Itinerary'}</h1>
                    <p className="text-xs opacity-90 mt-0.5">{trip?.destination} &middot; {trip?.startDate ? new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''} - {trip?.endDate ? new Date(trip.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75">Estimated Cost</p>
                    <p className="font-sora text-xl font-bold text-teal-400">₹{(trip?.budget?.spent || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                {/* Close Button */}
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-[#E8E6E0] bg-white px-6 py-3 dark:border-stone-800 dark:bg-[#151312]">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">READ-ONLY PREVIEW</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-md border border-[#E8E6E0] bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                  >
                    <Download size={14} /> Print Itinerary
                  </button>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="traveloop-button-primary text-xs py-1.5 px-4"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Itinerary Timeline Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 print:p-0">
                {sections.map((section, idx) => (
                  <div key={section.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800 last:before:hidden">
                    {/* Timeline Node */}
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-teal-500 bg-white dark:bg-[#1C1917]" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-sora text-base font-bold text-stone-800 dark:text-white">{section.name}</h3>
                        <p className="text-xs text-stone-500">{section.dates} &middot; {section.city}</p>
                      </div>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-semibold text-stone-600 dark:bg-stone-900 dark:text-stone-400">
                        Spent: ₹{section.activities.reduce((sum, a) => sum + a.cost, 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {section.activities.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">No activities planned for this day.</p>
                      ) : (
                        section.activities.map((act) => (
                          <div key={act.id} className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-[#151312]">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-teal-50 p-2 text-teal-600 dark:bg-teal-900/10 dark:text-teal-400">
                                {act.category === 'food' ? <Utensils size={16} /> :
                                 act.category === 'transport' ? <Plane size={16} /> :
                                 act.category === 'sightseeing' ? <MapPin size={16} /> : <Circle size={16} />}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-stone-800 dark:text-white">{act.name || 'Untitled Activity'}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {act.time && <span className="text-[10px] text-stone-500 font-medium">{act.time}</span>}
                                  {act.duration && <span className="text-[10px] text-stone-400 font-medium">&bull; {act.duration}</span>}
                                </div>
                              </div>
                            </div>
                            <span className="font-sora text-xs font-bold text-stone-700 dark:text-stone-300">
                              {act.cost > 0 ? `₹${act.cost.toLocaleString('en-IN')}` : 'Free'}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
