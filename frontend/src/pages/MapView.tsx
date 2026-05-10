import React, { useState, useEffect } from 'react';
import { 
  Compass, Filter, Search, MapPin, Plane, Bed, Landmark, 
  Utensils, Car, Clipboard, Clock, DollarSign, Layers, Sun, Moon, Info, Calendar 
} from 'lucide-react';
import { useTripStore, Trip } from '../store/tripStore';
import { itineraryService, ItineraryItem } from '../services/itinerary.service';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Geocoding cache to avoid repeated API calls
const geocodeCache: { [key: string]: [number, number] | null } = {};

// Function to geocode location names to coordinates using Nominatim (OpenStreetMap)
async function geocodeLocation(location: string): Promise<[number, number] | null> {
  if (!location) return null;
  
  // Check cache first
  if (geocodeCache[location] !== undefined) {
    return geocodeCache[location];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
      {
        headers: {
          'User-Agent': 'TravelApp/1.0'
        }
      }
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache[location] = coords;
      return coords;
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  
  geocodeCache[location] = null;
  return null;
}

// Component to update map center when trip or selected card changes
function MapUpdater({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom() || 12);
  }, [center, map, zoom]);
  return null;
}

interface LocationWithCoords extends ItineraryItem {
  coords: [number, number] | null;
}

export default function MapView() {
  const { trips, fetchTrips } = useTripStore();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [locationsWithCoords, setLocationsWithCoords] = useState<LocationWithCoords[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([26.9124, 75.7873]); // Default to Jaipur
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite' | 'dark'>('streets');

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0].id);
    }
  }, [trips, selectedTrip]);

  // Fetch and sort itinerary items chronologically
  useEffect(() => {
    if (selectedTrip) {
      itineraryService.getTripItinerary(selectedTrip)
        .then(items => {
          const sorted = [...items].sort((a, b) => {
            if (a.starts_at && b.starts_at) {
              return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
            }
            return a.sort_order - b.sort_order;
          });
          setItineraryItems(sorted);
        })
        .catch(console.error);
    }
  }, [selectedTrip]);

  const activeTrip = trips.find(t => t.id === selectedTrip);

  // Geocode locations when itinerary items or active trip changes
  useEffect(() => {
    if (!activeTrip) {
      setLocationsWithCoords([]);
      return;
    }

    const geocodeAllLocations = async () => {
      setIsGeocoding(true);
      
      // First, try to geocode the trip destination for the map center
      const destinationCoords = await geocodeLocation(activeTrip.destination);
      if (destinationCoords) {
        setMapCenter(destinationCoords);
      }

      if (itineraryItems.length === 0) {
        setLocationsWithCoords([]);
        setIsGeocoding(false);
        return;
      }

      // Then geocode all itinerary items
      const itemsWithCoords: LocationWithCoords[] = [];
      
      for (const item of itineraryItems) {
        const locationName = item.location || activeTrip.destination;
        const coords = await geocodeLocation(locationName);
        
        itemsWithCoords.push({
          ...item,
          coords
        });
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setLocationsWithCoords(itemsWithCoords);
      
      // If we have at least one valid coordinate, center on it
      const firstValidCoord = itemsWithCoords.find(item => item.coords);
      if (firstValidCoord?.coords) {
        setMapCenter(firstValidCoord.coords);
      }
      
      setIsGeocoding(false);
    };

    geocodeAllLocations();
  }, [activeTrip, itineraryItems]);

  const validLocations = locationsWithCoords.filter(item => item.coords !== null);
  const routePositions: [number, number][] = validLocations.map(item => item.coords!);

  // Custom Icon generator based on item type and sequence number
  const createCustomIcon = (itemType: string, index: number, isSelected: boolean) => {
    let colorClass = 'bg-[#714B67] text-white'; // Dark Pink branding color
    
    if (itemType === 'flight') colorClass = 'bg-blue-600 text-white';
    else if (itemType === 'hotel') colorClass = 'bg-amber-600 text-white';
    else if (itemType === 'activity') colorClass = 'bg-[#714B67] text-white'; // Dark pink for custom activity
    else if (itemType === 'meal') colorClass = 'bg-rose-600 text-white';
    else if (itemType === 'transfer') colorClass = 'bg-indigo-600 text-white';

    const selectedClass = isSelected 
      ? 'ring-4 ring-[#714B67]/60 scale-115 shadow-2xl z-50 border-white' 
      : 'hover:scale-110 border-stone-100 shadow-md';

    return L.divIcon({
      html: `<div class="flex items-center justify-center w-7 h-7 rounded-full font-sora font-extrabold text-[11px] ${colorClass} ${selectedClass} border-2 transition-all duration-200">
               ${index + 1}
             </div>`,
      className: 'bg-transparent border-none',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  // Helper for item icons
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-3.5 w-3.5" />;
      case 'hotel': return <Bed className="h-3.5 w-3.5" />;
      case 'activity': return <Landmark className="h-3.5 w-3.5" />;
      case 'meal': return <Utensils className="h-3.5 w-3.5" />;
      case 'transfer': return <Car className="h-3.5 w-3.5" />;
      default: return <Clipboard className="h-3.5 w-3.5" />;
    }
  };

  // Helper for item color badges
  const getItemColorBadge = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-100 dark:border-blue-900/30';
      case 'hotel': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-100 dark:border-amber-900/30';
      case 'activity': return 'bg-pink-50 text-[#714B67] dark:bg-pink-950/40 dark:text-pink-300 border-pink-100 dark:border-pink-900/30';
      case 'meal': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-100 dark:border-rose-900/30';
      case 'transfer': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/30';
      default: return 'bg-stone-50 text-stone-700 dark:bg-stone-900 dark:text-stone-300 border-stone-200 dark:border-stone-800';
    }
  };

  // Format Date and Time nicely
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format Currency
  const formatCost = (cost?: number, currency = 'INR') => {
    if (cost === undefined || cost === null) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(cost);
  };

  // Card click handler: center map, select item
  const handleCardClick = (item: LocationWithCoords) => {
    setSelectedItemId(item.id);
    if (item.coords) {
      setMapCenter(item.coords);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] overflow-hidden bg-[#FBFBFA] dark:bg-[#141210]">
      {/* Top Title Bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E8E6E0] bg-white px-6 py-4 dark:border-stone-800 dark:bg-[#1C1917] shadow-sm">
        <div className="flex items-center gap-3">
          <Compass className="h-5 w-5 text-[#714B67]" />
          <div>
            <h2 className="font-sora text-base font-extrabold text-[#1C1917] dark:text-white tracking-tight">Interactive Map Routes</h2>
            <p className="text-[11px] text-stone-500 font-medium dark:text-stone-400">Explore, track, and navigate your trip itineraries on the map</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidepanel - All Itinerary Cards & Trip Selector */}
        <div className="w-[420px] shrink-0 border-r border-[#E8E6E0] bg-white dark:border-stone-800 dark:bg-[#1C1917] flex flex-col z-10 shadow-xl overflow-hidden">
          {/* Trip Selection & Miniature Trip Details */}
          <div className="p-4 border-b border-[#E8E6E0] dark:border-stone-800 space-y-4">
            <div>
               <label className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1.5 block">Select Trip</label>
               <select 
                 className="w-full rounded-lg border border-[#E8E6E0] bg-stone-50 px-3 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all duration-200 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-600 focus:ring-2 focus:ring-[#714B67]/30"
                 value={selectedTrip || ''}
                 onChange={(e) => {
                   setSelectedTrip(e.target.value);
                   setSelectedItemId(null);
                 }}
               >
                  <option value="" disabled>Select a trip...</option>
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
               </select>
            </div>

            {activeTrip && (
              <div className="p-3.5 bg-stone-50 dark:bg-[#26211E]/40 rounded-xl border border-[#E8E6E0] dark:border-stone-800/80 transition-all duration-300 hover:shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-sora text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">Active Trip</h3>
                    <div className="text-sm font-extrabold text-stone-900 dark:text-white leading-tight">{activeTrip.name}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-1.5 font-medium">
                      <MapPin className="h-3 w-3 text-[#714B67]" /> {activeTrip.destination}
                    </div>
                  </div>
                  {activeTrip.status && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-pink-50 text-[#714B67] dark:bg-pink-950/40 dark:text-pink-300 border border-pink-100 dark:border-pink-900/30">
                      {activeTrip.status}
                    </span>
                  )}
                </div>

                {activeTrip.startDate && (
                  <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-2 flex items-center gap-1 font-medium">
                    <Calendar className="h-3 w-3" />
                    {new Date(activeTrip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    {activeTrip.endDate && ` - ${new Date(activeTrip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  </div>
                )}
                
                {/* Budget Tracker */}
                {activeTrip.budget && activeTrip.budget.total > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800">
                    <div className="flex justify-between text-[10px] text-stone-500 dark:text-stone-400 font-bold mb-1 uppercase tracking-wider">
                      <span>Spent Indicator</span>
                      <span className="text-stone-700 dark:text-stone-300">
                        {formatCost(activeTrip.budget.spent, activeTrip.budget.currency)} / {formatCost(activeTrip.budget.total, activeTrip.budget.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          activeTrip.budget.spent > activeTrip.budget.total ? 'bg-rose-500' : 'bg-[#714B67]'
                        }`}
                        style={{ width: `${Math.min((activeTrip.budget.spent / activeTrip.budget.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scrollable Itinerary List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-[#FDFDFD] dark:bg-[#1C1917]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                Itinerary Timeline ({locationsWithCoords.length} items)
              </span>
            </div>

            {isGeocoding && (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]"></div>
                <span className="text-xs text-stone-500 font-medium dark:text-stone-400">Resolving location coordinates...</span>
              </div>
            )}

            {activeTrip && !isGeocoding ? (
               <div className="space-y-3">
                 {locationsWithCoords.map((item, i) => {
                   const isSelected = selectedItemId === item.id;
                   return (
                     <div 
                       key={item.id} 
                       id={`itinerary-card-${item.id}`}
                       onClick={() => handleCardClick(item)}
                       className={`group relative rounded-xl border p-4 cursor-pointer transition-all duration-350 flex gap-3.5 ${
                         isSelected 
                           ? 'bg-pink-50/20 border-[#714B67] shadow-md dark:bg-pink-950/10 dark:border-[#714B67]/80' 
                           : 'bg-white border-[#E8E6E0] hover:border-stone-300 hover:shadow-md hover:bg-stone-50/30 dark:bg-[#24211F]/60 dark:border-stone-800/80 dark:hover:border-stone-700/80 dark:hover:bg-[#282421]/60'
                       }`}
                     >
                       {/* Sequence Indicator Ring */}
                       <div className="flex flex-col items-center justify-start pt-1.5">
                         <div className={`flex items-center justify-center w-6 h-6 rounded-full font-sora font-extrabold text-[10px] shadow-sm transition-all duration-300 ${
                           isSelected 
                             ? 'bg-[#714B67] text-white ring-4 ring-[#714B67]/20' 
                             : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:group-hover:bg-stone-700'
                         }`}>
                           {i + 1}
                         </div>
                         {i < locationsWithCoords.length - 1 && (
                           <div className="w-0.5 grow mt-2 bg-dashed border-l-2 border-dashed border-stone-200 dark:border-stone-800 min-h-[40px]" />
                         )}
                       </div>

                       {/* Card Details */}
                       <div className="flex-1 min-w-0">
                         <div className="flex items-start justify-between gap-1.5">
                           <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getItemColorBadge(item.item_type)}`}>
                             {getItemIcon(item.item_type)}
                             {item.item_type}
                           </span>
                           {item.cost !== undefined && item.cost > 0 && (
                             <span className="text-xs font-extrabold text-stone-800 dark:text-stone-200 flex items-center bg-stone-100 dark:bg-stone-800/80 px-2 py-0.5 rounded-md">
                               {formatCost(item.cost, activeTrip.budget?.currency)}
                             </span>
                           )}
                         </div>

                         <h4 className="font-sora text-sm font-extrabold text-stone-900 dark:text-white mt-2 group-hover:text-[#714B67] transition-colors duration-200 leading-snug">
                           {item.title}
                         </h4>

                         {item.description && (
                           <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                             {item.description}
                           </p>
                         )}

                         <div className="mt-2.5 space-y-1.5">
                           {item.location && (
                             <div className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-1 font-semibold">
                               <MapPin className="h-3 w-3 text-stone-400 flex-shrink-0" />
                               <span className="truncate">{item.location}</span>
                             </div>
                           )}

                           {item.starts_at && (
                             <div className="text-[10px] text-stone-400 dark:text-stone-500 flex items-center gap-1 font-medium">
                               <Clock className="h-3 w-3 flex-shrink-0" />
                               <span>{formatDateTime(item.starts_at)}</span>
                             </div>
                           )}
                         </div>

                         {!item.coords && (
                           <div className="text-[10px] text-rose-500 font-semibold mt-2.5 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded border border-rose-100 dark:border-rose-900/10">
                             <Info className="h-3 w-3 flex-shrink-0" />
                             <span>Coords not found — falling back to destination center</span>
                           </div>
                         )}
                       </div>
                     </div>
                   );
                 })}

                 {itineraryItems.length === 0 && (
                   <div className="flex h-56 flex-col items-center justify-center text-center p-6 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
                     <Compass size={32} className="mb-3 text-stone-300 dark:text-stone-700 animate-pulse" />
                     <h4 className="font-sora text-xs font-bold text-stone-700 dark:text-stone-300">No itinerary items found</h4>
                     <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 max-w-[220px]">Add flights, hotels, or activities in the Itinerary tab to visualize them on the map!</p>
                   </div>
                 )}
               </div>
            ) : !activeTrip && !isGeocoding ? (
                <div className="flex h-56 flex-col items-center justify-center text-center p-6">
                  <Compass size={32} className="mb-3 text-stone-300 dark:text-stone-700" />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Select a trip to see its itinerary locations</p>
                </div>
            ) : null}
          </div>
        </div>

        {/* Right Sidepanel - Leaflet Map Container */}
        <div className="flex-1 bg-[#F5F4F0] dark:bg-[#141210] relative overflow-hidden flex items-center justify-center z-0">
           {activeTrip && !isGeocoding ? (
             <div className="h-full w-full relative">
               {/* Map Style Controls */}
               <div className="absolute top-4 right-4 z-[1000] flex bg-white dark:bg-[#1C1917] rounded-xl shadow-xl border border-[#E8E6E0] dark:border-stone-800 p-1.5 gap-1">
                 <button
                   onClick={() => setMapType('streets')}
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sora transition-all duration-200 ${
                     mapType === 'streets'
                       ? 'bg-[#714B67] text-white shadow-md'
                       : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                   }`}
                 >
                   <Sun className="h-3.5 w-3.5" />
                   Streets
                 </button>
                 <button
                   onClick={() => setMapType('satellite')}
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sora transition-all duration-200 ${
                     mapType === 'satellite'
                       ? 'bg-[#714B67] text-white shadow-md'
                       : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                   }`}
                 >
                   <Layers className="h-3.5 w-3.5" />
                   Satellite
                 </button>
                 <button
                   onClick={() => setMapType('dark')}
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sora transition-all duration-200 ${
                     mapType === 'dark'
                       ? 'bg-[#714B67] text-white shadow-md'
                       : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                   }`}
                 >
                   <Moon className="h-3.5 w-3.5" />
                   Dark
                 </button>
               </div>

               <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                 {mapType === 'streets' && (
                   <TileLayer
                     attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
                     url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                   />
                 )}
                 {mapType === 'satellite' && (
                   <TileLayer
                     attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                     url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                   />
                 )}
                 {mapType === 'dark' && (
                   <TileLayer
                     attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> contributors'
                     url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                   />
                 )}

                 <MapUpdater center={mapCenter} />

                 {validLocations.map((item, index) => {
                   const isSelected = selectedItemId === item.id;
                   return (
                     <Marker 
                       key={item.id} 
                       position={item.coords!}
                       icon={createCustomIcon(item.item_type, index, isSelected)}
                       eventHandlers={{
                         click: () => {
                           setSelectedItemId(item.id);
                           setMapCenter(item.coords!);
                           const element = document.getElementById(`itinerary-card-${item.id}`);
                           if (element) {
                             element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                           }
                         }
                       }}
                     >
                       <Popup>
                         <div className="p-1 min-w-[180px] font-sora">
                           <div className="flex items-center gap-1.5 mb-1.5">
                             <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getItemColorBadge(item.item_type)}`}>
                               {item.item_type}
                             </span>
                             {item.cost && (
                               <span className="text-[10px] font-bold text-stone-800 ml-auto bg-stone-100 px-1 py-0.5 rounded">
                                 {formatCost(item.cost, activeTrip.budget?.currency)}
                               </span>
                             )}
                           </div>
                           <h4 className="font-extrabold text-xs text-stone-900 leading-tight mb-1">{item.title}</h4>
                           <p className="text-[10px] text-stone-600 flex items-center gap-1">
                             <MapPin className="h-2.5 w-2.5 text-stone-400" />
                             {item.location || activeTrip.destination}
                           </p>
                           {item.starts_at && (
                             <p className="text-[9px] text-stone-500 mt-1.5 flex items-center gap-1">
                               <Clock className="h-2.5 w-2.5" />
                               {formatDateTime(item.starts_at)}
                             </p>
                           )}
                         </div>
                       </Popup>
                     </Marker>
                   );
                 })}

                 {routePositions.length > 1 && (
                   <Polyline 
                     positions={routePositions} 
                     pathOptions={{ 
                       color: '#714B67', 
                       weight: 3.5, 
                       opacity: 0.9,
                       dashArray: '5, 8'
                     }} 
                   />
                 )}
               </MapContainer>
             </div>
           ) : (
             <div className="text-center text-stone-400 z-10 flex flex-col items-center bg-white/95 dark:bg-stone-900/95 p-8 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800/60 max-w-sm">
                {isGeocoding ? (
                  <>
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#714B67] mb-4"></div>
                    <h3 className="font-sora font-extrabold text-stone-800 dark:text-white mb-1 tracking-tight">Geocoding Locations</h3>
                    <p className="text-xs text-stone-500 font-medium">We are transforming location names into coordinates to place them on your map...</p>
                  </>
                ) : (
                  <>
                    <Compass size={40} className="mb-4 text-[#714B67] animate-bounce" />
                    <h3 className="font-sora font-extrabold text-stone-800 dark:text-white mb-1.5 tracking-tight">Interactive Map Portal</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
                      Select a trip from the left sidebar to render your entire itinerary itinerary in chronological order.
                    </p>
                  </>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
