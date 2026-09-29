import React, { useState } from 'react';
import { TripRequest } from '../types';
import { Sparkles, MapPin, Calendar, Users, Wallet, Compass, Plane, Check } from 'lucide-react';

interface TripWizardProps {
  onGenerate: (request: TripRequest) => void;
  isLoading: boolean;
  initialDestination?: string;
}

const INTEREST_OPTIONS = [
  'Beaches',
  'Food',
  'Nature',
  'Culture',
  'Adventure',
  'Shopping',
  'Nightlife',
  'Wellness'
];

const TRAVEL_STYLES = [
  'Budget / Backpacker',
  'Mid-range Comfort',
  'Premium / Luxury'
];

const TRANSPORT_OPTIONS = [
  'Flight',
  'Train',
  'Cab / Self-drive',
  'Bus',
  'Mixed / Flexible'
];

const POPULAR_DESTINATIONS = [
  { name: 'Goa', tag: 'Beaches & Nightlife', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Manali', tag: 'Mountains & Adventure', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80' },
  { name: 'Jaipur', tag: 'Royal Rajasthan & History', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Kerala', tag: 'Backwaters & Nature', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80' },
];

export const TripWizard: React.FC<TripWizardProps> = ({ onGenerate, isLoading, initialDestination }) => {
  const [startingLocation, setStartingLocation] = useState('Bengaluru');
  const [destination, setDestination] = useState(initialDestination || 'Mysuru');
  const [days, setDays] = useState(3);
  const [travelDates, setTravelDates] = useState('Upcoming');
  const [travelers, setTravelers] = useState(1);
  const [budgetINR, setBudgetINR] = useState(15000);
  const [travelStyle, setTravelStyle] = useState('Mid-range Comfort');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Sightseeing & Monuments', 'Food & Culinary', 'Beaches']);
  const [transportPreference, setTransportPreference] = useState('Flight');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingLocation.trim() || !destination.trim() || !days || !travelers || !budgetINR) {
      alert("Please fill in all required trip details.");
      return;
    }

    const request: TripRequest = {
      startingLocation,
      destination,
      days,
      travelDates,
      travelers,
      budgetINR,
      travelStyle,
      interests: selectedInterests,
      transportPreference
    };

    onGenerate(request);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 font-sans">
      
      {/* Hero Section */}
      <div className="relative text-white pt-12 pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
            alt="Plan a Trip Hero"
            className="w-full h-full object-cover filter brightness-85 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/80 to-sky-950/80"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-3.5 py-1 rounded-full text-xs font-semibold text-sky-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin" />
            <span>MakeMyTrip AI Trip Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Let&apos;s plan your perfect trip
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Give us a few details and our AI will create a complete personalized itinerary just for you.
          </p>
        </div>
      </div>

      {/* Overlapping Planning Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-20">
        
        {/* Quick Inspiration Pick */}
        <div className="mb-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-sky-100 shadow-lg">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">Quick Inspiration Pick</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {POPULAR_DESTINATIONS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => setDestination(d.name)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                  destination === d.name ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]' : 'bg-white text-slate-800 border-sky-200 hover:border-blue-400 hover:shadow-xs'
                }`}
              >
                <div>
                  <p className="font-bold text-xs">{d.name}</p>
                  <p className={`text-[10px] truncate ${destination === d.name ? 'text-sky-100' : 'text-slate-500'}`}>{d.tag}</p>
                </div>
                {destination === d.name && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-sky-100 p-6 sm:p-8 space-y-7">
          
          {/* SECTION 1 — WHERE DO YOU WANT TO GO? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-sky-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shadow-2xs">1</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-950">Where do you want to go?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">From (Origin)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">To (Destination)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Goa, Manali, Jaipur"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 — WHEN DO YOU WANT TO TRAVEL? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-sky-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shadow-2xs">2</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-950">When do you want to travel?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Duration (Days: 1 - 30)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Travel Dates / Season</label>
                <select
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  <option value="Upcoming">Upcoming Season</option>
                  <option value="This Month">This Month</option>
                  <option value="Next Month">Next Month</option>
                  <option value="Long Weekend">Long Weekend</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3 — WHO IS TRAVELLING? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-sky-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shadow-2xs">3</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-950">Who is travelling?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Number of Travellers</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Preferred Transport (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Plane className="w-4 h-4" />
                  </span>
                  <select
                    value={transportPreference}
                    onChange={(e) => setTransportPreference(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  >
                    {TRANSPORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 — WHAT'S YOUR BUDGET? (INR) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-sky-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shadow-2xs">4</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-950">What&apos;s your budget? (INR)</h2>
            </div>
            <div className="bg-sky-50/40 p-4 rounded-2xl border border-sky-100 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Total Group Budget (INR)</label>
                <span className="text-sm font-bold font-mono text-emerald-600 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                  ₹{budgetINR.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={budgetINR}
                onChange={(e) => setBudgetINR(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹10k (Backpacker)</span>
                <span>₹1L (Comfort)</span>
                <span>₹5L+ (Luxury)</span>
              </div>
            </div>
          </div>

          {/* SECTION 5 — WHAT'S YOUR TRAVEL STYLE? */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-sky-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shadow-2xs">5</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-950">What&apos;s your travel style?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all cursor-pointer flex items-center justify-between ${
                    travelStyle === style
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 shadow-2xs'
                  }`}
                >
                  <span>{style}</span>
                  {travelStyle === style && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 6 — YOUR INTERESTS (OPTIONAL) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 border-b border-sky-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shadow-2xs">6</span>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-blue-950">Your interests (optional)</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 shadow-2xs'
                    }`}
                  >
                    <span className="truncate">{interest}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <div className="pt-4 border-t border-sky-100">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Generating AI Itinerary...</span>
                </>
              ) : (
                <>
                  <span>Generate My AI Trip Plan →</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
