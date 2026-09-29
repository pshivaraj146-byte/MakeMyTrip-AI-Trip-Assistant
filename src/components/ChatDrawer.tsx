import React, { useState } from 'react';
import { TripPlan, ChatMessage } from '../types';
import { X, Send, Sparkles, MessageSquare, Loader2, Compass, Plus, Clock, ArrowRight, ArrowLeft, ChevronRight, Mic, CheckCircle2 } from 'lucide-react';

interface ChatDrawerProps {
  trip?: TripPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTrip?: (trip: TripPlan) => void;
}

const QUICK_ACTIONS = [
  'Make it cheaper',
  'More comfortable',
  'Add one day',
  'Change destination',
  'Show alternatives'
];

const SUPPORTED_DESTINATIONS = [
  'Goa',
  'Jaipur',
  'Manali',
  'Kerala',
  'Dubai',
  'Singapore',
  'Mysuru',
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Kashmir'
];

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ trip, isOpen, onClose, onUpdateTrip }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDestinationSelectorOpen, setIsDestinationSelectorOpen] = useState(false);
  const [targetDestination, setTargetDestination] = useState(trip?.destination === 'Goa' ? 'Jaipur' : 'Goa');
  const [destError, setDestError] = useState('');

  if (!isOpen) return null;

  const handleQuickAction = (action: string) => {
    if (action === 'Change destination') {
      setIsDestinationSelectorOpen(true);
      setDestError('');
    } else {
      sendMessageToAPI(action);
    }
  };

  const confirmChangeDestination = () => {
    const trimmed = targetDestination.trim();
    if (!trimmed) {
      setDestError('Please choose a destination.');
      return;
    }
    setIsDestinationSelectorOpen(false);
    sendMessageToAPI(`Change destination to ${trimmed}`);
  };

  const sendMessageToAPI = async (msgText: string) => {
    if (!msgText.trim() || isLoading) return;

    const userMsg = msgText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          tripContext: trip || null,
          chatHistory: messages
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        if (data.trip && onUpdateTrip) {
          onUpdateTrip(data.trip);
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that request right now. Please try again." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Please check connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToAPI(input);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInput('Can you make it cheaper and add one day?');
    }, 1500);
  };

  const destinationImages: Record<string, string> = {
    Goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
    Manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80',
    Jaipur: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=400&q=80',
    Kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80',
    Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
    Singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80',
  };

  const activeImage = trip?.destination && destinationImages[trip.destination] 
    ? destinationImages[trip.destination] 
    : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80';

  const currentCost = trip?.budgetBreakdown?.totalGroupCost || 15000;
  const updatedCost = Math.round(currentCost * 0.82);
  const savings = currentCost - updatedCost;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-blue-950/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-5xl h-full shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-72 bg-slate-900 text-white p-5 flex flex-col justify-between border-r border-slate-800 shrink-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">AI Assistant</h3>
                  <p className="text-[10px] text-sky-300">MakeMyTrip AI</p>
                </div>
              </div>
              <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleNewChat}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Chat</span>
            </button>

            {/* Current Trip Section */}
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">CURRENT TRIP</p>
              {trip ? (
                <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/80 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{trip.destination}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">Active</span>
                  </div>
                  <p className="text-[11px] text-sky-300">{trip.startingLocation || 'Origin'} → {trip.destination}</p>
                  <p className="text-[11px] font-mono text-slate-300">{trip.durationDays} Days · ₹{currentCost.toLocaleString('en-IN')}</p>
                </div>
              ) : (
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 text-xs text-slate-400 italic">
                  No active trip selected
                </div>
              )}
            </div>

            {/* Past Chats Section */}
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">PAST CHATS</p>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center gap-2 truncate cursor-pointer hover:bg-slate-800 transition-colors">
                  <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{trip?.destination ? `Planning ${trip.destination} Trip` : 'Goa Weekend Getaway'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 flex items-center gap-2 truncate cursor-pointer hover:bg-slate-800 transition-colors">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Manali Snow Adventure</span>
                </div>
              </div>
              <button onClick={() => alert("Showing all recent chats")} className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold pt-1 block cursor-pointer">
                View All Chats →
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Powered by Gemini AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* Right Main Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
          
          {/* Top Header with Breadcrumb */}
          <div className="px-5 py-3 bg-white border-b border-sky-100 flex items-center justify-between shadow-2xs shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-sky-50 transition-colors border border-sky-100 cursor-pointer"
                title="Back to previous screen"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Home</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-blue-900 font-semibold">AI Assistant</span>
              </div>
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. TOP CURRENT TRIP CARD */}
          <div className="px-4 sm:px-6 pt-3 shrink-0">
            {trip ? (
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-sky-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <img src={activeImage} alt={trip.destination} className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0" />
                  <div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Current Trip</span>
                    <h3 className="text-sm font-extrabold text-blue-950 mt-0.5">{trip.startingLocation || 'Origin'} → {trip.destination}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {trip.durationDays} Days · {trip.totalTravelers} Traveller(s) · <span className="font-mono font-bold text-emerald-600">₹{currentCost.toLocaleString('en-IN')}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>View itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-3.5 border border-sky-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-blue-600 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-blue-950">No active trip selected</h3>
                    <p className="text-[11px] text-slate-500">Plan a trip or generate an itinerary to see active trip details here.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. CONVERSATION AREA (Starts near top without massive empty space) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4 pt-2">
                <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Travel Concierge</span>
                  </div>
                  <h3 className="text-base font-extrabold text-blue-950">AI Travel Concierge</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Tell me what you'd like to change, compare or plan for your trip.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      className="bg-white hover:bg-blue-50 text-blue-950 border border-sky-200 text-xs font-semibold p-3.5 rounded-xl transition-all text-left flex items-center justify-between cursor-pointer shadow-2xs group"
                    >
                      <span>{action}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm font-medium'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-sky-100 shadow-xs'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-sky-100 text-blue-600 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Travel Concierge</span>
                      </div>
                    )}
                    {msg.content}

                    {/* 3. STRUCTURED TRAVEL RESPONSE CARD FOR BUDGET CHANGES */}
                    {msg.role === 'assistant' && (msg.content.toLowerCase().includes('cheaper') || msg.content.toLowerCase().includes('budget') || msg.content.toLowerCase().includes('save')) && (
                      <div className="mt-4 bg-sky-50/90 rounded-2xl p-4 border border-sky-200 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900">You can save ₹{savings.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">Within Budget</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-sky-100 text-center">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Current Plan</p>
                            <p className="text-sm sm:text-base font-mono font-extrabold text-slate-800 mt-0.5">₹{currentCost.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Updated Plan</p>
                            <p className="text-sm sm:text-base font-mono font-extrabold text-emerald-600 mt-0.5">₹{updatedCost.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                          <p className="font-bold text-blue-950">Key Changes:</p>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span>Budget-friendly stay option</span></div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span>Alternative transport option</span></div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /><span>Lower-cost activities</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-xs border border-sky-100 flex items-center gap-2 text-slate-500 text-xs shadow-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>AI Concierge is analyzing your request...</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. QUICK ACTIONS CHIPS (Without visible horizontal scrollbar) */}
          <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-sky-100 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">Quick Actions:</span>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="bg-sky-50 hover:bg-blue-600 hover:text-white text-blue-900 border border-sky-200 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer shadow-2xs shrink-0"
              >
                {action}
              </button>
            ))}
          </div>

          {/* 5. MESSAGE COMPOSER */}
          <form onSubmit={handleSend} className="p-4 sm:p-5 border-t border-sky-100 bg-white flex items-center gap-3 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your trip..."
              className="flex-1 px-4 py-3.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            <button
              type="button"
              onClick={handleMicClick}
              className={`p-3 rounded-xl transition-colors cursor-pointer ${isListening ? 'bg-red-50 text-red-600 animate-bounce' : 'text-slate-400 hover:text-blue-600 hover:bg-sky-50'}`}
              title="Voice Assistant"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Destination Selector Modal */}
      {isDestinationSelectorOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-blue-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-sky-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-extrabold text-blue-950 mb-1">Where would you like to go instead?</h3>
            <p className="text-xs text-slate-500 mb-4">Select a supported destination to update your trip itinerary.</p>
            
            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-slate-700">Destination</label>
              <select
                value={targetDestination}
                onChange={(e) => {
                  setTargetDestination(e.target.value);
                  setDestError('');
                }}
                className="w-full px-3.5 py-2.5 bg-sky-50 border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {SUPPORTED_DESTINATIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {destError && <p className="text-xs text-red-600 font-semibold">{destError}</p>}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDestinationSelectorOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmChangeDestination}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Change Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
