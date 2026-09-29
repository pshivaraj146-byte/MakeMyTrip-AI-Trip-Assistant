import React, { useState } from 'react';
import { TripPlan, TripRequest } from '../types';
import { X, Sparkles, Loader2, MapPin, Calendar, Users, Wallet } from 'lucide-react';

interface EditTripModalProps {
  trip: TripPlan;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (request: TripRequest) => void;
  isLoading: boolean;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
  trip,
  isOpen,
  onClose,
  onRegenerate,
  isLoading
}) => {
  const [startingLocation, setStartingLocation] = useState(trip.startingLocation || 'Mumbai');
  const [destination, setDestination] = useState(trip.destination || 'Jaipur');
  const [days, setDays] = useState(trip.durationDays || 4);
  const [travelers, setTravelers] = useState(trip.totalTravelers || 2);
  const [budgetINR, setBudgetINR] = useState(trip.budgetBreakdown?.totalGroupCost || 35000);
  const [travelStyle, setTravelStyle] = useState(trip.travelStyle || 'Mid-range Comfort');
  const [transportPreference, setTransportPreference] = useState(trip.transportPreference || 'Flight');
  const [interests] = useState<string[]>(trip.interests || ['Sightseeing & Monuments', 'Food & Culinary']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerate({
      startingLocation,
      destination,
      days,
      travelDates: 'Upcoming',
      travelers,
      budgetINR,
      travelStyle,
      interests,
      transportPreference
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-blue-950">Edit Trip Parameters</h2>
              <p className="text-xs text-slate-500">Atlas will regenerate your personalized itinerary</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Starting From</label>
              <input
                type="text"
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                required
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Travelers</label>
              <input
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                required
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Budget (INR): ₹{budgetINR.toLocaleString('en-IN')}
            </label>
            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={budgetINR}
              onChange={(e) => setBudgetINR(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Style</label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Mid-range Comfort">Mid-range Comfort</option>
                <option value="Luxury & Premium">Luxury & Premium</option>
                <option value="Budget / Backpacker">Budget / Backpacker</option>
                <option value="Family Friendly">Family Friendly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Transport</label>
              <select
                value={transportPreference}
                onChange={(e) => setTransportPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm font-semibold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Cab / Self-drive">Cab / Self-drive</option>
                <option value="Bus / Volvo">Bus / Volvo</option>
                <option value="Mixed / Flexible">Mixed / Flexible</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Trip...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Update My Trip</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
