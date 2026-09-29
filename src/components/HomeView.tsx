import React, { useState } from 'react';
import { Sparkles, Send, Mic, Compass, Plane, Hotel, Train, Bus, Car, ShieldCheck, ArrowRight, Utensils, Home, Clock, Wallet, Users, Sliders, Gift } from 'lucide-react';
import { TripRequest } from '../types';

interface HomeViewProps {
  onStartPlanning: (initialDestination?: string) => void;
  onGenerateFromPrompt: (request: TripRequest) => void;
  onOpenServiceModal: (serviceName: string) => void;
  onOpenChat: () => void;
}

const POPULAR_DESTINATIONS = [
  { name: 'Goa', tag: 'Beaches & Nightlife', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', price: '₹12,500' },
  { name: 'Manali', tag: 'Mountains & Adventure', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', price: '₹15,000' },
  { name: 'Jaipur', tag: 'Royal Rajasthan & History', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80', price: '₹10,000' },
  { name: 'Kerala', tag: 'Backwaters & Nature', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80', price: '₹16,000' },
  { name: 'Dubai', tag: 'Luxury & Skyline', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', price: '₹45,000' },
  { name: 'Singapore', tag: 'Modern City & Food', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80', price: '₹50,000' },
];

const QUICK_ACTIONS = [
  { name: 'AI Assistant', icon: Sparkles, action: 'chat' },
  { name: 'Flights', icon: Plane, action: 'Flights' },
  { name: 'Trains & Buses', icon: Train, action: 'Trains & Buses' },
  { name: 'Hotels & Stays', icon: Hotel, action: 'Hotels & Stays' },
  { name: 'Cabs & Rentals', icon: Car, action: 'Cabs & Rentals' },
  { name: 'Restaurants', icon: Utensils, action: 'Restaurants' },
  { name: 'Activities', icon: Compass, action: 'Activities' },
  { name: 'Holidays', icon: Gift, action: 'Holidays & Tour Packages' },
  { name: 'Insurance', icon: ShieldCheck, action: 'Travel Insurance' },
];

const TRAVEL_INSPIRATION = [
  { title: 'Weekend Beach Escapes', desc: 'Sun, sand & seafood', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80', tag: 'Trending' },
  { title: 'Himalayan Trekking', desc: 'Snow peaks & scenic trails', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=80', tag: 'Adventure' },
  { title: 'Royal Heritage Trails', desc: 'Palaces & ancient culture', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=500&q=80', tag: 'Culture' },
  { title: 'Serene Backwaters', desc: 'Houseboats & tranquility', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=500&q=80', tag: 'Relaxation' },
];

const WHY_AI_BENEFITS = [
  { title: 'Budget-Aware Planning', desc: 'AI optimizes expenses across stays, transport, food, and activities to fit your exact budget.', icon: Wallet },
  { title: 'Personalized Itineraries', desc: 'Tailored day-by-day schedules aligned with your travel style, pace, and interests.', icon: Sliders },
  { title: 'Instant Option Comparison', desc: 'Compare flights, trains, hotels, and local transit choices in seconds.', icon: Compass },
  { title: 'Smart Trip Modification', desc: 'Easily adjust dates, travelers, or make plans cheaper using our AI concierge.', icon: Sparkles },
];

const QUICK_PROMPTS = [
  'Weekend getaway',
  'Budget trip',
  'Family trip',
  'International',
  'Honeymoon'
];

const THEME_RECOMMENDATIONS: Record<string, Array<{ name: string; reason: string; duration: string; image: string }>> = {
  Trending: [
    { name: 'Goa', reason: 'Popular leisure destination', duration: '3–4 days', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Dubai', reason: 'International city experience', duration: '4–5 days', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Singapore', reason: 'Culture + sightseeing', duration: '4–5 days', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80' },
    { name: 'Jaipur', reason: 'Heritage & exploration', duration: '3–4 days', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kerala', reason: 'Beaches / relaxation', duration: '4–6 days', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80' },
  ],
  Adventure: [
    { name: 'Manali', reason: 'Mountain activities', duration: '4–6 days', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
    { name: 'Rishikesh', reason: 'River/adventure experiences', duration: '2–4 days', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
    { name: 'Coorg', reason: 'Nature and outdoor activities', duration: '3–4 days', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hampi', reason: 'Heritage exploration', duration: '2–3 days', image: 'https://images.unsplash.com/photo-1623820297808-cb1d2f2d7b2d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Dandeli', reason: 'Wildlife/adventure', duration: '2–4 days', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80' },
  ],
  Culture: [
    { name: 'Jaipur', reason: 'Heritage architecture', duration: '3–4 days', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80' },
    { name: 'Agra', reason: 'Historical landmarks', duration: '2–3 days', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80' },
    { name: 'Varanasi', reason: 'Local traditions', duration: '2–4 days', image: 'https://images.unsplash.com/photo-1561649987-254a438258d4?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mysuru', reason: 'Palaces and culture', duration: '2–3 days', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hampi', reason: 'Ancient sites', duration: '2–3 days', image: 'https://images.unsplash.com/photo-1623820297808-cb1d2f2d7b2d?auto=format&fit=crop&w=600&q=80' },
  ],
  Relaxation: [
    { name: 'Goa', reason: 'Beaches', duration: '3–4 days', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kerala', reason: 'Backwaters', duration: '4–6 days', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80' },
    { name: 'Alleppey', reason: 'Wellness / backwaters', duration: '2–3 days', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Varkala', reason: 'Peaceful beach stays', duration: '3–4 days', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Coorg', reason: 'Nature & peaceful stays', duration: '3–4 days', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80' },
  ]
};

const destinationImages: Record<string, string> = {
  "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
  "Rishikesh": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
  "Coorg": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80",
  "Dandeli": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  "Hampi": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  "Jaipur": "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80",
  "Agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
  "Varanasi": "https://images.unsplash.com/photo-1571536802807-30d65cef65e6?auto=format&fit=crop&w=600&q=80",
  "Mysuru": "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80",
  "Mysore": "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80",
  "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80",
  "Alleppey": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
  "Alappuzha": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
  "Varkala": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80",
  "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80"
};

const getDestinationImage = (name: string): string => {
  if (!name) return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80";
  const key = name.trim();
  if (destinationImages[key]) return destinationImages[key];
  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(destinationImages)) {
    if (k.toLowerCase() === lower) return v;
  }
  return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80";
};

export const HomeView: React.FC<HomeViewProps> = ({ onStartPlanning, onGenerateFromPrompt, onOpenServiceModal, onOpenChat }) => {
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) {
      onStartPlanning();
      return;
    }
    const text = promptText.toLowerCase();
    let days = 4;
    const dayMatch = text.match(/(\d+)\s*days?/);
    if (dayMatch) days = parseInt(dayMatch[1]);

    let travelers = 2;
    if (text.includes('solo')) travelers = 1;
    const travelerMatch = text.match(/(\d+)\s*(?:people|person|traveler)/);
    if (travelerMatch) travelers = parseInt(travelerMatch[1]);

    let budget = 35000;
    const budgetMatch = text.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
    if (budgetMatch) budget = parseInt(budgetMatch[1].replace(/,/g, ''));

    let dest = 'Goa';
    for (const d of ['goa', 'manali', 'jaipur', 'kerala', 'dubai', 'singapore', 'mumbai', 'delhi', 'bengaluru', 'mysuru', 'agra', 'leh', 'bangkok', 'coorg']) {
      if (text.includes(d)) {
        dest = d.charAt(0).toUpperCase() + d.slice(1);
        break;
      }
    }

    onGenerateFromPrompt({
      startingLocation: text.includes('from') ? text.split('from')[1].split('to')[0].trim() : 'Bengaluru',
      destination: dest,
      days,
      travelDates: 'Upcoming',
      travelers,
      budgetINR: budget,
      travelStyle: 'Mid-range Comfort',
      interests: ['Sightseeing & Monuments', 'Food & Culinary'],
      transportPreference: 'Flight'
    });
  };

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setPromptText('Plan 5 days from Bengaluru to Goa with a budget of ₹35,000');
    }, 1500);
  };

  const handleQuickActionClick = (action: string) => {
    if (action === 'planner') {
      onStartPlanning();
    } else if (action === 'chat') {
      onOpenChat();
    } else {
      onOpenServiceModal(action);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* Hero Section with Destination Background Image & Overlay */}
      <div className="relative text-white pt-16 pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
            alt="Travel Hero"
            className="w-full h-full object-cover scale-105 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-sky-950/85"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full text-xs font-semibold text-sky-100 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin" />
            <span>MakeMyTrip AI Trip Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Plan your next trip with AI
          </h1>
          <p className="text-sky-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tell us where you want to go and our AI will create a personalized itinerary, budget, stays, activities and more.
          </p>

          {/* Prominent AI Input Card */}
          <div className="mt-8 bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-sky-100 max-w-2xl mx-auto text-slate-900">
            <form onSubmit={handlePromptSubmit} className="flex items-center gap-2">
              <div className="pl-3 text-blue-600">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g. Plan 5 days from Bengaluru to Goa"
                className="flex-1 py-3 px-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
              />
              <button
                type="button"
                onClick={handleMicClick}
                className={`p-2.5 rounded-xl transition-colors cursor-pointer ${isListening ? 'bg-red-50 text-red-600 animate-bounce' : 'text-slate-400 hover:text-blue-600 hover:bg-sky-50'}`}
                title="Voice Assistant"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Generate</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Prompts */}
            <div className="flex flex-wrap items-center gap-2 pt-3 px-2 border-t border-sky-100 mt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick Prompts:</span>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setPromptText(`Plan a ${prompt.toLowerCase()} from Bengaluru to Goa`)}
                  className="bg-sky-50 hover:bg-sky-100 text-blue-900 text-xs font-medium px-3 py-1 rounded-full transition-colors cursor-pointer border border-sky-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick-Action Cards/Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-sky-100 p-4 sm:p-6">
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {QUICK_ACTIONS.map((qa) => {
              const Icon = qa.icon;
              return (
                <button
                  key={qa.name}
                  onClick={() => handleQuickActionClick(qa.action)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-sky-50 transition-all group text-center cursor-pointer border border-transparent hover:border-sky-200 shadow-2xs"
                >
                  <div className="w-11 h-11 rounded-xl bg-sky-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-2 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-blue-950 group-hover:text-blue-600 truncate w-full">{qa.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popular Destinations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-blue-950 tracking-tight">Popular Destinations</h2>
            <p className="text-xs sm:text-sm text-slate-500">Explore trending hotspots with instant AI itineraries</p>
          </div>
          <button
            onClick={() => onStartPlanning()}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Custom Planner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              onClick={() => onStartPlanning(dest.name)}
              className="group relative rounded-2xl overflow-hidden h-72 shadow-md hover:shadow-xl transition-all cursor-pointer border border-sky-100"
            >
              <div className="absolute inset-0 z-0">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/30 to-transparent"></div>
              </div>

              <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                    <span>AI Ready</span>
                  </div>
                  <span className="bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-mono">
                    From {dest.price}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold tracking-tight">{dest.name}</h3>
                  <p className="text-xs text-sky-200 mb-3">{dest.tag}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="text-xs font-semibold text-sky-100">Plan 4 Days AI Trip</span>
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Inspiration Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {selectedTheme ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedTheme(null)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2 cursor-pointer transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back to themes</span>
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-950 tracking-tight">Recommended for {selectedTheme}</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Destinations that match your travel style</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {(THEME_RECOMMENDATIONS[selectedTheme] || []).map((dest) => (
                <div key={dest.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-sky-100 flex flex-col justify-between">
                  <div>
                    <div className="h-32 relative overflow-hidden bg-gradient-to-br from-blue-900 to-sky-800">
                      <img 
                        src={getDestinationImage(dest.name)} 
                        alt={dest.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <span className="absolute top-2.5 left-2.5 bg-blue-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10">
                        {dest.duration}
                      </span>
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-sm text-blue-950">{dest.name}</h3>
                      <p className="text-xs text-slate-500">{dest.reason}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => onStartPlanning(dest.name)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Plan this trip</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-950 tracking-tight">Travel Inspiration</h2>
              <p className="text-xs sm:text-sm text-slate-500">Handpicked themes and categories for your next vacation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TRAVEL_INSPIRATION.map((item) => (
                <div
                  key={item.title}
                  onClick={() => setSelectedTheme(item.tag)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-sky-100 flex flex-col"
                >
                  <div className="h-44 relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-blue-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-blue-950 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-3 mt-3 border-t border-sky-50">
                      <span>Explore Itineraries</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Why Use AI Trip Assistant? Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-sky-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl mb-10 relative z-10">
            <span className="bg-blue-800 text-sky-200 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
              Why AI Trip Assistant?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              Smarter, Faster & Personalized Travel Planning
            </h2>
            <p className="text-sky-200 text-sm sm:text-base mt-2">
              Everything you need to go from inspiration to a fully executed itinerary in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {WHY_AI_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white">{benefit.title}</h3>
                  <p className="text-xs text-sky-100 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
