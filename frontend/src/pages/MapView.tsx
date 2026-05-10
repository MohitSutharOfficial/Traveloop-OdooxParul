import React, { useState, useEffect } from 'react';
import { Compass, Filter, Search, MapPin } from 'lucide-react';
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

// Component to update map center when trip changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0].id);
    }
  }, [trips, selectedTrip]);

  useEffect(() => {
    if (selectedTrip) {
      itineraryService.getTripItinerary(selectedTrip).then(setItineraryItems).catch(console.error);
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

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-[#E8E6E0] bg-white px-4 py-3 dark:border-stone-800 dark:bg-[#1C1917]">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-sora text-sm font-bold text-[#1C1917] dark:text-white">Map View</h2>
            <p className="text-[11px] text-stone-500">Explore routes and locations visually</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-80 shrink-0 border-r border-[#E8E6E0] bg-white p-4 dark:border-stone-800 dark:bg-[#1C1917] flex flex-col z-10">
          <div className="mb-4">
             <label className="text-[10px] font-bold uppercase tracking-wide text-stone-400 mb-2 block">Select Trip</label>
             <select 
               className="w-full rounded-md border border-[#E8E6E0] bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
               value={selectedTrip || ''}
               onChange={(e) => setSelectedTrip(e.target.value)}
             >
                <option value="" disabled>Select a trip...</option>
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
             </select>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {isGeocoding && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#714B67]"></div>
                <span className="ml-2 text-xs text-stone-500">Loading locations...</span>
              </div>
            )}
            {activeTrip && !isGeocoding ? (
               <div className="space-y-3">
                 {locationsWithCoords.map((item, i) => (
                   <div key={item.id} className="group rounded-md border border-[#E8E6E0] p-3 hover:border-[#714B67] dark:border-stone-800">
                      <div className="flex items-start gap-2">
                        <MapPin className={`h-4 w-4 mt-0.5 flex-shrink-0 ${item.coords ? 'text-emerald-500' : 'text-stone-400'}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sora text-xs font-bold text-stone-900 dark:text-white">{item.title}</h4>
                          <p className="text-[11px] text-stone-500">{item.location || activeTrip.destination}</p>
                          {!item.coords && (
                            <p className="text-[10px] text-orange-600 mt-1">Location not found</p>
                          )}
                        </div>
                      </div>
                   </div>
                 ))}
                 {itineraryItems.length === 0 && (
                   <div className="flex h-32 flex-col items-center justify-center text-center">
                     <Compass size={24} className="mb-2 text-stone-300" />
                     <p className="text-[11px] text-stone-500">No itinerary items yet</p>
                   </div>
                 )}
               </div>
            ) : !activeTrip && !isGeocoding ? (
                <div className="flex h-32 flex-col items-center justify-center text-center">
                  <Compass size={24} className="mb-2 text-stone-300" />
                  <p className="text-[11px] text-stone-500">Select a trip to see its locations</p>
                </div>
            ) : null}
          </div>
        </div>
        <div className="flex-1 bg-[#f0eee9] dark:bg-[#141210] relative overflow-hidden flex items-center justify-center z-0">
           {activeTrip && !isGeocoding ? (
             <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
               <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
               <MapUpdater center={mapCenter} />
               {validLocations.map((item) => (
                 <Marker key={item.id} position={item.coords!}>
                   <Popup>
                     <div className="p-1">
                       <h4 className="font-semibold text-sm">{item.title}</h4>
                       <p className="text-xs text-stone-600">{item.location || activeTrip.destination}</p>
                       {item.starts_at && (
                         <p className="text-xs text-stone-500 mt-1">
                           {new Date(item.starts_at).toLocaleString()}
                         </p>
                       )}
                     </div>
                   </Popup>
                 </Marker>
               ))}
               {routePositions.length > 1 && (
                 <Polyline positions={routePositions} pathOptions={{ color: '#714B67', weight: 3, opacity: 0.7 }} />
               )}
             </MapContainer>
           ) : (
             <div className="text-center text-stone-400 z-10 flex flex-col items-center bg-white/80 dark:bg-stone-900/80 p-6 rounded-md">
                {isGeocoding ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67] mb-3"></div>
                    <h3 className="font-sora font-semibold text-stone-800 dark:text-white mb-1">Loading Map</h3>
                    <p className="text-xs">Geocoding locations...</p>
                  </>
                ) : (
                  <>
                    <Compass size={32} className="mb-3" />
                    <h3 className="font-sora font-semibold text-stone-800 dark:text-white mb-1">Interactive Map</h3>
                    <p className="text-xs">
                      Choose a trip to visualize locations
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
