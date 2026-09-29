import React, { useState } from 'react';
import { TripPlan } from '../types';
import {
  Compass,
  Calendar,
  Users,
  Wallet,
  Plane,
  Hotel,
  Utensils,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Edit3,
  Bookmark,
  MessageSquare,
  Printer,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  Check
} from 'lucide-react';

interface ItineraryViewProps {
  trip: TripPlan;
  onEdit: () => void;
  onMakeCheaper: () => void;
  onOpenChat: () => void;
  onSaveTrip: () => void;
  isSaved: boolean;
}

const destinationImages: Record<string, string> = {
  Goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
  Manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=80',
  Jaipur: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1600&q=80',
  Kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
  Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
  Singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80',
  Mysuru: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
  Kashmir: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80',
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onEdit,
  onMakeCheaper,
  onOpenChat,
  onSaveTrip,
  isSaved
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'stays' | 'transport' | 'food' | 'activities' | 'packing'>('overview');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeImage = trip.destination && destinationImages[trip.destination]
    ? destinationImages[trip.destination]
    : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans">
      
      {/* Top Banner Header with Rich Destination Photography Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={activeImage}
            alt={trip.destination}
            className="w-full h-full object-cover filter brightness-90 scale-105"
          />
          {/* Balanced Dark Overlay for Readability while keeping Photo Rich & Visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/50 to-blue-950/30"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-md border border-blue-400/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-100 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>AI Trip Plan</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onSaveTrip}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-black/30 hover:bg-black/40 text-white backdrop-blur-md border border-white/30'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'Saved to My Trips' : 'Save Trip'}</span>
              </button>

              <button
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask AI Assistant</span>
              </button>

              <button
                onClick={onMakeCheaper}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Make it Cheaper</span>
              </button>

              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-black/30 hover:bg-black/40 backdrop-blur-md text-white rounded-xl transition-all border border-white/30 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Trip</span>
              </button>

              <button
                onClick={handlePrint}
                className="p-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/40 backdrop-blur-md rounded-xl transition-all border border-white/30 cursor-pointer hidden sm:block"
                title="Print / Export"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
            {trip.tripTitle || `${trip.durationDays}-Day Journey from ${trip.startingLocation || 'Origin'} to ${trip.destination}`}
          </h1>
          <p className="text-sky-100 text-sm sm:text-base max-w-3xl mb-8 leading-relaxed drop-shadow">
            {trip.explanation}
          </p>

          {/* Key Meta Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2.5 bg-blue-950/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shadow-sm">
              <MapPin className="w-4 h-4 text-sky-300 shrink-0" />
              <div>
                <p className="text-[10px] text-sky-200 uppercase tracking-wider font-bold">Route</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">{trip.startingLocation || 'Origin'} → {trip.destination}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-blue-950/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shadow-sm">
              <Calendar className="w-4 h-4 text-sky-300 shrink-0" />
              <div>
                <p className="text-[10px] text-sky-200 uppercase tracking-wider font-bold">Duration</p>
                <p className="text-xs sm:text-sm font-bold text-white">{trip.durationDays} Days</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-blue-950/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shadow-sm">
              <Users className="w-4 h-4 text-sky-300 shrink-0" />
              <div>
                <p className="text-[10px] text-sky-200 uppercase tracking-wider font-bold">Travelers</p>
                <p className="text-xs sm:text-sm font-bold text-white">{trip.totalTravelers} Traveller(s)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-blue-950/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shadow-sm">
              <Compass className="w-4 h-4 text-sky-300 shrink-0" />
              <div>
                <p className="text-[10px] text-sky-200 uppercase tracking-wider font-bold">Travel Style</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">{trip.travelStyle || 'Mid-range Comfort'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-blue-950/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 shadow-sm col-span-2 sm:col-span-1">
              <Wallet className="w-4 h-4 text-emerald-300 shrink-0" />
              <div>
                <p className="text-[10px] text-sky-200 uppercase tracking-wider font-bold">Estimated Cost</p>
                <p className="text-xs sm:text-sm font-bold text-emerald-300 font-mono">₹{trip.budgetBreakdown?.totalGroupCost?.toLocaleString('en-IN') || '35,000'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-sky-50/80 p-1.5 rounded-2xl mb-8 border border-sky-200/60 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Budget', icon: Wallet },
          { id: 'itinerary', label: `Day-by-Day (${trip.itinerary?.length || 0})`, icon: Calendar },
          { id: 'stays', label: `Stays (${trip.stayRecommendations?.length || 0})`, icon: Hotel },
          { id: 'transport', label: 'Transport', icon: Plane },
          { id: 'food', label: 'Food & Dining', icon: Utensils },
          { id: 'activities', label: `Activities (${trip.activities?.length || 0})`, icon: Compass },
          { id: 'packing', label: 'Packing & Safety', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Budget */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Explanation & Highlights */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm">
              <h2 className="text-lg font-bold text-blue-950 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" /> Why This Plan Fits You
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed mb-6">
                {trip.explanation}
              </p>

              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Top Trip Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trip.activities?.slice(0, 4).map((act, idx) => (
                  <div key={idx} className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-blue-950">{act.name}</h4>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Transportation */}
            <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 mb-4">Local Transportation Tips</h3>
              <div className="space-y-3">
                {trip.localTransportation?.map((lt, idx) => (
                  <div key={idx} className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{lt.method}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{lt.tips}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0">
                      {lt.costRange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Budget Breakdown Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-blue-950 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" /> Estimated Budget
                </h3>
                <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                  INR (₹)
                </span>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-600">Accommodation ({trip.durationDays - 1} nights)</span>
                  <span className="font-semibold font-mono text-slate-900">₹{trip.budgetBreakdown?.accommodation?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-600">Transportation</span>
                  <span className="font-semibold font-mono text-slate-900">₹{trip.budgetBreakdown?.transportation?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-600">Food & Dining</span>
                  <span className="font-semibold font-mono text-slate-900">₹{trip.budgetBreakdown?.foodAndDining?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-600">Activities & Tickets</span>
                  <span className="font-semibold font-mono text-slate-900">₹{trip.budgetBreakdown?.activitiesAndTickets?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-600">Shopping & Misc</span>
                  <span className="font-semibold font-mono text-slate-900">₹{trip.budgetBreakdown?.shoppingAndMisc?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-sky-50">
                  <span className="text-slate-600">Emergency Reserve</span>
                  <span className="font-semibold font-mono text-slate-900">₹{trip.budgetBreakdown?.emergencyReserve?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 space-y-2">
                <div className="flex justify-between text-xs text-blue-900 font-medium">
                  <span>Per Traveler ({trip.totalTravelers} total):</span>
                  <span className="font-mono font-bold">₹{trip.budgetBreakdown?.totalPerTraveler?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-blue-950 font-bold pt-2 border-t border-blue-200">
                  <span>Total Group Cost:</span>
                  <span className="font-mono text-blue-600 text-base">₹{trip.budgetBreakdown?.totalGroupCost?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Day-by-Day Itinerary */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {trip.itinerary?.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            return (
              <div key={day.dayNumber} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden transition-all">
                <button
                  onClick={() => toggleDay(day.dayNumber)}
                  className="w-full p-5 text-left flex items-center justify-between bg-sky-50/40 hover:bg-sky-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-blue-950">Day {day.dayNumber}: {day.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Tap to view morning, afternoon & evening schedule</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </button>

                {isExpanded && (
                  <div className="p-6 space-y-6 border-t border-sky-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">☀️ Morning</span>
                        <p className="text-sm text-slate-800 mt-1">{day.morning}</p>
                      </div>

                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">🌤️ Afternoon</span>
                        <p className="text-sm text-slate-800 mt-1">{day.afternoon}</p>
                      </div>

                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">🌅 Evening</span>
                        <p className="text-sm text-slate-800 mt-1">{day.evening}</p>
                      </div>

                      <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">🌙 Night</span>
                        <p className="text-sm text-slate-800 mt-1">{day.night}</p>
                      </div>
                    </div>

                    <div className="bg-sky-50 p-4 rounded-xl border border-sky-200/60 flex items-center gap-3">
                      <Utensils className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-blue-900">Recommended Meal Stop:</span>
                        <p className="text-xs text-slate-700 mt-0.5">{day.mealSuggestions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Stays */}
      {activeTab === 'stays' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trip.stayRecommendations?.map((stay, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">
                      {stay.category}
                    </span>
                    <h3 className="font-bold text-lg text-blue-950 mt-2">{stay.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-lg text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{stay.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {stay.location}
                </p>

                <p className="text-xs text-slate-700 leading-relaxed">{stay.description}</p>

                <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-100">
                  <p className="text-[11px] font-semibold text-blue-900 mb-0.5">Why recommended:</p>
                  <p className="text-xs text-slate-600">{stay.whyRecommended}</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-sky-50/40 border-t border-sky-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Price per night</span>
                  <span className="font-bold text-blue-950 font-mono text-base">₹{stay.pricePerNight?.toLocaleString('en-IN')}</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  View Property <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Transport */}
      {activeTab === 'transport' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm mb-6">
            <h2 className="text-base font-bold text-blue-950 mb-2">Long-Distance Travel Options</h2>
            <p className="text-xs text-slate-600">Comparing travel modes from {trip.startingLocation || 'your starting location'} to {trip.destination}.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {trip.transportationOptions?.map((trans, idx) => (
              <div key={idx} className={`bg-white rounded-2xl p-6 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                trans.recommended ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-md' : 'border-sky-100 shadow-sm'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    trans.recommended ? 'bg-blue-600 text-white' : 'bg-sky-100 text-blue-800'
                  }`}>
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-blue-950">{trans.mode}</h3>
                      {trans.recommended && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Atlas Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">Provider: {trans.provider} · Duration: {trans.duration}</p>
                    <p className="text-xs text-slate-500 mt-2">{trans.description}</p>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-sky-100 sm:pl-6 shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-4 sm:pt-0 border-t border-sky-100">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Approx. Cost / Person</span>
                    <span className="font-bold text-lg font-mono text-blue-950">₹{trans.costPerPerson?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Food */}
      {activeTab === 'food' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trip.foodSuggestions?.map((food, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">
                  {food.category}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">Approx. ₹{food.approxCost} / person</span>
              </div>
              <h3 className="font-bold text-lg text-blue-950">{food.name}</h3>
              <p className="text-xs font-semibold text-blue-600">Specialty: {food.specialty}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{food.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Activities */}
      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trip.activities?.map((act, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-blue-800 px-2.5 py-1 rounded-md">
                    {act.category}
                  </span>
                  {act.isHiddenGem && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Hidden Gem
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base text-blue-950 mb-1">{act.name}</h3>
                <p className="text-xs text-slate-500 mb-3">Duration: {act.duration}</p>
                <p className="text-xs text-slate-700 leading-relaxed">{act.description}</p>
              </div>

              <div className="pt-3 border-t border-sky-50 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Entry / Ticket Cost</span>
                <span className="font-bold font-mono text-blue-950">₹{act.estimatedCost?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 7: Packing & Safety */}
      {activeTab === 'packing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Packing Checklist */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" /> Packing Checklist for {trip.destination}
            </h2>

            <div className="space-y-4">
              {trip.packingChecklist?.map((pack, idx) => (
                <div key={idx} className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                  <h3 className="font-bold text-xs text-blue-900 uppercase tracking-wider mb-2">{pack.category}</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pack.items?.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Etiquette */}
          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Safety & Local Etiquette
            </h2>

            <div className="space-y-3">
              {trip.safetyTips?.map((tip, idx) => (
                <div key={idx} className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
