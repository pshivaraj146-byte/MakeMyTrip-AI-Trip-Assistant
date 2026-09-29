import React, { useState } from 'react';
import { TripPlan } from '../types';
import { 
  X, Bookmark, MapPin, Calendar, Wallet, ArrowRight, Trash2, 
  Plane, Train, Bus, Hotel, Home, Clock, Car, Compass, Gift, ShieldCheck 
} from 'lucide-react';

interface SavedTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTrips: any[];
  onSelectTrip: (trip: TripPlan) => void;
  onDeleteTrip: (index: number) => void;
  onOpenService: (serviceName: string) => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  onClose,
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
  onOpenService
}) => {
  const [activeTab, setActiveTab] = useState<'itineraries' | 'bookings'>('itineraries');

  if (!isOpen) return null;

  // Separate itineraries vs service bookings
  const itineraries = savedTrips.filter(t => !t.serviceType);
  const bookings = savedTrips.filter(t => t.serviceType);

  const getServiceIcon = (serviceType: string) => {
    const s = (serviceType || '').toLowerCase();
    if (s.includes('flight')) return <Plane className="w-4 h-4 text-sky-600" />;
    if (s.includes('train')) return <Train className="w-4 h-4 text-blue-600" />;
    if (s.includes('bus')) return <Bus className="w-4 h-4 text-amber-600" />;
    if (s.includes('hotel')) return <Hotel className="w-4 h-4 text-indigo-600" />;
    if (s.includes('homestay')) return <Home className="w-4 h-4 text-emerald-600" />;
    if (s.includes('hourly stay')) return <Clock className="w-4 h-4 text-purple-600" />;
    if (s.includes('cab')) return <Car className="w-4 h-4 text-yellow-600" />;
    if (s.includes('car rental')) return <Car className="w-4 h-4 text-blue-700" />;
    if (s.includes('hourly rental')) return <Clock className="w-4 h-4 text-indigo-700" />;
    if (s.includes('activit')) return <Compass className="w-4 h-4 text-rose-600" />;
    if (s.includes('holiday')) return <Gift className="w-4 h-4 text-teal-600" />;
    if (s.includes('insurance')) return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
    return <Bookmark className="w-4 h-4 text-blue-600" />;
  };

  const serviceCategories = [
    { key: 'Flights', label: 'Flights', icon: Plane, serviceName: 'Flights' },
    { key: 'Trains', label: 'Trains & Buses', icon: Train, serviceName: 'Trains & Buses' },
    { key: 'Hotels', label: 'Hotels', icon: Hotel, serviceName: 'Hotels' },
    { key: 'Homestays', label: 'Homestays', icon: Home, serviceName: 'Homestays' },
    { key: 'Hourly Stays', label: 'Hourly Stays', icon: Clock, serviceName: 'Hourly Stays' },
    { key: 'Cabs', label: 'Cabs', icon: Car, serviceName: 'Cabs' },
    { key: 'Car Rentals', label: 'Car Rentals', icon: Car, serviceName: 'Car Rentals' },
    { key: 'Hourly Rentals', label: 'Hourly Rentals', icon: Clock, serviceName: 'Hourly Rentals' },
    { key: 'Activities', label: 'Activities', icon: Compass, serviceName: 'Activities' },
    { key: 'Holidays', label: 'Holiday Packages', icon: Gift, serviceName: 'Holidays & Tour Packages' },
    { key: 'Insurance', label: 'Travel Insurance', icon: ShieldCheck, serviceName: 'Travel Insurance' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-sky-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-blue-950">My Trips & Bookings</h2>
              <p className="text-xs text-slate-500">Central hub for your curated itineraries and active demo bookings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-sky-50 rounded-xl border border-sky-200 mb-4 shrink-0">
          <button
            onClick={() => setActiveTab('itineraries')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'itineraries' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-900'
            }`}
          >
            Saved Itineraries ({itineraries.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-900'
            }`}
          >
            Service Bookings ({bookings.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'itineraries' && (
            itineraries.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-700 font-semibold text-sm">No saved itineraries yet</p>
                <p className="text-slate-400 text-xs mt-1">Click "Save Trip" on any generated itinerary to store it here.</p>
              </div>
            ) : (
              itineraries.map((trip, idx) => (
                <div
                  key={idx}
                  className="bg-sky-50/50 hover:bg-sky-50 p-4 rounded-2xl border border-sky-100 transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex-1 cursor-pointer" onClick={() => { onSelectTrip(trip); onClose(); }}>
                    <h3 className="font-bold text-base text-blue-950 group-hover:text-blue-600 transition-colors">
                      {trip.tripTitle || `Trip to ${trip.destination}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {trip.destination}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-600" /> {trip.durationDays} Days</span>
                      <span className="flex items-center gap-1 font-mono font-semibold text-emerald-700"><Wallet className="w-3.5 h-3.5" /> ₹{trip.budgetBreakdown?.totalGroupCost?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { onSelectTrip(trip); onClose(); }}
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                      title="View Trip"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTrip(idx)}
                      className="p-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl transition-all cursor-pointer"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {serviceCategories.map(cat => {
                const catBookings = bookings.filter(b => (b.serviceType || '').toLowerCase().includes(cat.key.toLowerCase().replace('s', '')));
                if (catBookings.length === 0) {
                  // Show service-specific empty state as requested
                  return (
                    <div key={cat.key} className="p-4 rounded-2xl border border-dashed border-sky-200 bg-sky-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <cat.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-blue-950">{cat.label}</h4>
                          <p className="text-[11px] text-slate-500">No {cat.label.toLowerCase()} bookings yet</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { onClose(); onOpenService(cat.serviceName); }}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        Search / Book {cat.label}
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={cat.key} className="space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-950 flex items-center gap-2">
                      {getServiceIcon(cat.key)} {cat.label} ({catBookings.length})
                    </h3>
                    <div className="space-y-2">
                      {catBookings.map((bk, bIdx) => (
                        <div key={bIdx} className="bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-blue-950">{bk.tripTitle || bk.selectedItem}</h4>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {bk.status || 'Confirmed — Demo'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">
                              Route: {bk.startingLocation} → {bk.destination} · ID: <span className="font-mono font-bold text-blue-900">{bk.bookingId}</span>
                            </p>
                            <p className="text-[11px] text-slate-400">Date: {bk.date || 'Upcoming'} · Travellers: {bk.travellers}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount</span>
                            <span className="font-mono font-bold text-emerald-700 text-sm">₹{bk.price?.toLocaleString('en-IN') || '2,500'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
