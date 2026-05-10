import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Pie, PieChart } from 'recharts';
import { mockDestinations } from '../data/mockData';
import { useTripStore } from '../store/tripStore';

const steps = ['Plan', 'Budget', 'Companions'];

export default function TripCreate() {
  const navigate = useNavigate();
  const { addTrip } = useTripStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'Public' | 'Private' | 'Shared'>('Private');
  const [budgetTotal, setBudgetTotal] = useState(1800);
  const [budgetBreakdown, setBudgetBreakdown] = useState({
    Transport: 25,
    Accommodation: 40,
    Food: 25,
    Activities: 10,
  });
  const [companions, setCompanions] = useState<{ email: string; role: string }[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  // Persist state
  useEffect(() => {
    const saved = sessionStorage.getItem('tripCreateState');
    if (saved) {
      const state = JSON.parse(saved);
      setName(state.name);
      setDestination(state.destination);
      setStartDate(state.startDate);
      setEndDate(state.endDate);
      setDescription(state.description);
      setVisibility(state.visibility);
      setBudgetTotal(state.budgetTotal);
      setBudgetBreakdown(state.budgetBreakdown);
      setCompanions(state.companions);
      setCurrentStep(state.currentStep);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('tripCreateState', JSON.stringify({
      name, destination, startDate, endDate, description, visibility, budgetTotal, budgetBreakdown, companions, currentStep
    }));
  }, [name, destination, startDate, endDate, description, visibility, budgetTotal, budgetBreakdown, companions, currentStep]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((p) => p + 1);
  };
  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((p) => p - 1);
  };

  const handleCreate = async () => {
    try {
      const newTrip = await addTrip({
        name,
        destination,
        coverPhoto: mockDestinations.find(d => d.name === destination)?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400',
        startDate,
        endDate,
        status: 'upcoming',
        planningScore: 20,
        budget: { total: budgetTotal, spent: 0, currency: 'INR' }
      });
      sessionStorage.removeItem('tripCreateState');
      if (newTrip && newTrip.id) {
        navigate(`/itinerary/${newTrip.id}`);
      } else {
        navigate('/trips');
      }
    } catch (error) {
      console.error("Failed to create trip", error);
    }
  };

  const selectedDest = mockDestinations.find((d) => d.name === destination);
  const coverPhotoPreview = selectedDest?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400';

  const durationDays = (startDate && endDate) 
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const budgetColors = {
    Transport: '#10b981', // teal
    Accommodation: '#714B67', // amber
    Food: '#8b5cf6', // purple
    Activities: '#f43f5e', // rose
  };

  const pieData = Object.entries(budgetBreakdown).map(([name, val]) => ({ name, value: val }));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative flex justify-between">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-stone-200 dark:bg-stone-800" />
          <div 
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#714B67] transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }} 
          />
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            
            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                  isActive ? 'border-[#714B67] bg-[#714B67] text-white' : 
                  isCompleted ? 'border-[#714B67] bg-white text-[#714B67] dark:bg-stone-900' : 
                  'border-stone-300 bg-white text-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-600'
                }`}>
                  {isCompleted ? <Check size={14} /> : stepNum}
                </div>
                <span className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[#714B67]' : 'text-stone-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-[#E8E6E0] bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 md:flex-row">
                <div className="flex-1 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">Trip Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Paris & Rome Summer 2025" className="traveloop-input w-full" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">Destination</label>
                    <select value={destination} onChange={(e) => setDestination(e.target.value)} className="traveloop-input w-full">
                      <option value="">Select a destination...</option>
                      {mockDestinations.map((d) => <option key={d.id} value={d.name}>{d.name}, {d.country}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">Start Date</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="traveloop-input w-full" />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">End Date</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="traveloop-input w-full" />
                    </div>
                  </div>
                  {durationDays > 0 && <p className="text-xs text-[#714B67] font-medium">Duration: {durationDays} days</p>}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">Description (Optional)</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="traveloop-input w-full resize-none" placeholder="What's the vibe?" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">Visibility</label>
                    <div className="flex gap-2 p-1 rounded-md bg-stone-100 dark:bg-stone-800 w-fit">
                      {['Private', 'Shared', 'Public'].map((vis) => (
                        <button key={vis} onClick={() => setVisibility(vis as any)} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${visibility === vis ? 'bg-white shadow-sm text-stone-900 dark:bg-stone-700 dark:text-white' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'}`}>
                          {vis}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-72 lg:w-80 space-y-6">
                  <div className="rounded-md border border-[#E8E6E0] bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-800/50">
                    <h3 className="font-sora text-sm font-semibold mb-3">Live Preview</h3>
                    <div className="traveloop-card !p-0 overflow-hidden shadow-sm bg-white dark:bg-stone-900">
                      <div className="h-32 w-full bg-stone-200 relative">
                        <img src={coverPhotoPreview} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[9px] uppercase font-bold text-stone-800">Draft</div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-sora text-sm font-bold truncate">{name || 'Trip Name'}</h4>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 truncate"><MapPin size={12}/> {destination || 'Destination'}</p>
                        <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-1"><CalendarIcon size={12}/> {startDate ? format(new Date(startDate), 'MMM d, yy') : 'Start'} - {endDate ? format(new Date(endDate), 'MMM d, yy') : 'End'}</p>
                      </div>
                    </div>
                  </div>

                  {destination && (
                    <div className="rounded-md bg-blue-50 p-4 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <CloudSun size={16} />
                        <span className="font-semibold text-sm">Weather Preview</span>
                      </div>
                      <p className="text-xs opacity-80">
                        {(() => {
                          const normalized = destination.toLowerCase();
                          if (normalized.includes('goa')) return 'Typically 31°C, warm and sunny beach weather.';
                          if (normalized.includes('kochi') || normalized.includes('kerala') || normalized.includes('munnar')) return 'Typically 28°C, pleasant but tropical and humid.';
                          if (normalized.includes('delhi') || normalized.includes('jaipur')) return 'Typically 35°C, hot and sunny.';
                          if (normalized.includes('ladakh') || normalized.includes('leh')) return 'Typically 14°C, chilly high-altitude mountain climate.';
                          if (normalized.includes('rome') || normalized.includes('paris')) return 'Typically 20°C, pleasant and comfortable for exploring.';
                          return 'Typically 22°C, mild and comfortable.';
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 space-y-6 w-full">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">Total Budget</label>
                      <div className="relative w-full max-w-xs">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-medium">₹</span>
                        <input type="number" value={budgetTotal} onChange={(e) => setBudgetTotal(Number(e.target.value))} className="traveloop-input pl-7 w-full font-sora font-semibold text-lg" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 max-w-md">
                      {[
                        { label: 'Budget', amt: 800 },
                        { label: 'Mid-Range', amt: 1800 },
                        { label: 'Luxury', amt: 4200 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setBudgetTotal(preset.amt)}
                          className={`flex flex-col items-center justify-center p-3 rounded-md border ${budgetTotal === preset.amt ? 'border-[#714B67] bg-fuchsia-50 dark:bg-fuchsia-900/10' : 'border-[#E8E6E0] hover:border-stone-300 dark:border-stone-800'} transition-colors`}
                        >
                          <span className="text-[11px] font-semibold text-stone-500 uppercase">{preset.label}</span>
                          <span className="font-sora font-bold text-stone-900 dark:text-stone-100">₹{preset.amt.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                      <h4 className="text-sm font-semibold mb-4">Budget Breakdown (%)</h4>
                      {Object.keys(budgetBreakdown).map((category) => (
                        <div key={category} className="mb-4">
                          <div className="flex justify-between text-xs mb-1 font-medium">
                            <span style={{ color: budgetColors[category as keyof typeof budgetColors] }}>{category}</span>
                            <span className="text-stone-500">{budgetBreakdown[category as keyof typeof budgetBreakdown]}% (₹{Math.round(budgetTotal * (budgetBreakdown[category as keyof typeof budgetBreakdown]/100))})</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" 
                            value={budgetBreakdown[category as keyof typeof budgetBreakdown]}
                            onChange={(e) => {
                              const newBreakdown = { ...budgetBreakdown, [category]: Number(e.target.value) };
                              // Optional: logic to ensure sum is 100
                              setBudgetBreakdown(newBreakdown);
                            }}
                            className="w-full accent-[#714B67]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-64 flex flex-col items-center">
                    <div className="h-48 w-48 relative">
                      <PieChart width={192} height={192}>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={budgetColors[entry.name as keyof typeof budgetColors]} />
                          ))}
                        </Pie>
                      </PieChart>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] uppercase font-bold text-stone-400">Total</span>
                        <span className="font-sora font-bold text-lg">₹{budgetTotal}</span>
                      </div>
                    </div>
                    
                    <button className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-[#714B67] hover:underline">
                      <Sparkles size={14} /> Ask AI for budget estimate
                    </button>

                    <div className="mt-6 w-full rounded-md bg-teal-50 p-4 text-teal-900 dark:bg-teal-900/20 dark:text-teal-200">
                      <p className="text-[11px] font-semibold flex items-center justify-center gap-1"><CloudSun size={14}/> Carbon Estimate</p>
                      <p className="text-center font-sora font-bold mt-1">4.2 kg CO₂</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 max-w-xl mx-auto">
                <div>
                  <h3 className="font-sora text-lg font-semibold mb-1">Who's coming with you?</h3>
                  <p className="text-sm text-stone-500 mb-6">Invite friends to plan the itinerary together.</p>

                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      value={inviteEmail} 
                      onChange={(e) => setInviteEmail(e.target.value)} 
                      className="traveloop-input flex-1"
                    />
                    <button 
                      onClick={() => {
                        if(inviteEmail) {
                          setCompanions([...companions, { email: inviteEmail, role: 'Editor' }]);
                          setInviteEmail('');
                        }
                      }}
                      className="traveloop-button-secondary"
                    >
                      Invite
                    </button>
                  </div>
                </div>

                {companions.length > 0 && (
                  <div className="space-y-3">
                    {companions.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-md border border-stone-200 dark:border-stone-800">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-500 uppercase">{comp.email[0]}</div>
                          <span className="text-sm font-medium">{comp.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <select 
                            value={comp.role} 
                            onChange={(e) => {
                              const newComps = [...companions];
                              newComps[idx].role = e.target.value;
                              setCompanions(newComps);
                            }}
                            className="text-xs bg-transparent border-none outline-none text-stone-500 cursor-pointer"
                          >
                            <option value="Organiser">Organiser</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                          <button onClick={() => setCompanions(companions.filter((_, i) => i !== idx))} className="text-stone-400 hover:text-red-500">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 rounded-md bg-stone-50 p-6 dark:bg-stone-800/50 text-center">
                  <h4 className="font-sora font-semibold mb-2">Trip Summary</h4>
                  <p className="text-sm font-bold text-[#714B67]">{name}</p>
                  <p className="text-xs text-stone-500 mt-1">{destination} &middot; {durationDays} days &middot; ₹{budgetTotal} &middot; {companions.length + 1} travelers</p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E8E6E0] p-6 sm:px-8 bg-stone-50 dark:bg-stone-900/50 dark:border-stone-800 flex items-center justify-between rounded-b-2xl">
          <button 
            onClick={currentStep === 1 ? () => navigate(-1) : handlePrev}
            className="flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          >
            <ChevronLeft size={16} /> {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {currentStep < 3 ? (
            <button 
              onClick={handleNext} 
              disabled={currentStep === 1 && (!name || !destination || !startDate || !endDate)}
              className="traveloop-button-primary flex items-center gap-1 px-6 disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <div className="flex gap-3">
              <button className="traveloop-button-secondary" onClick={handleCreate}>Save as Draft</button>
              <button className="traveloop-button-primary flex items-center gap-2" onClick={handleCreate}><Sparkles size={16}/> Create Trip</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
