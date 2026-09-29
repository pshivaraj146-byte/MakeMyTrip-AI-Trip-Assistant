import React, { useState, useRef, useEffect } from 'react';
import { Compass, Bookmark, Sparkles, User, LogIn, ChevronDown, Bell, Car, Gift, MapPin, ShieldCheck, Tag, Globe, Share2, Plane, Hotel, Train, Bus } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onGoPlanner: () => void;
  onOpenSavedTrips: () => void;
  onOpenSignIn: () => void;
  onOpenChat: () => void;
  onOpenServiceModal: (serviceName: string) => void;
  savedCount: number;
  hasActiveTrip: boolean;
  currentUser: { name: string; email: string } | null;
  activeView: 'home' | 'planner' | 'itinerary';
}

const MEGA_MENU_SECTIONS = [
  {
    title: 'PLAN & BOOK',
    items: [
      { name: 'Airport Cabs & Transfers', icon: Car },
      { name: 'Holidays & Tour Packages', icon: Gift },
      { name: 'Activities & Attractions', icon: Compass },
      { name: 'Hotels & Stays', icon: Hotel },
      { name: 'Flights', icon: Plane },
      { name: 'Trains & Buses', icon: Train }
    ]
  },
  {
    title: 'TRAVEL SUPPORT',
    items: [
      { name: 'Visa Helpdesk & Guidance', icon: MapPin },
      { name: 'Travel Insurance', icon: ShieldCheck },
      { name: 'Flight / PNR Status', icon: Plane },
      { name: 'My Trips & Bookings', icon: Bookmark }
    ]
  },
  {
    title: 'DISCOVER',
    items: [
      { name: 'Offers & Deals', icon: Tag },
      { name: 'Discover Destinations', icon: Globe },
      { name: 'Refer & Earn', icon: Share2 }
    ]
  }
];

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onGoPlanner,
  onOpenSavedTrips,
  onOpenSignIn,
  onOpenChat,
  onOpenServiceModal,
  savedCount,
  hasActiveTrip,
  currentUser,
  activeView
}) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Trip Plan Ready',
      message: 'Your AI itinerary for your latest trip is ready.',
      type: 'trip',
      read: false,
      action: 'planner'
    },
    {
      id: '2',
      title: 'Booking Update',
      message: 'Your demo booking details are available in My Trips.',
      type: 'booking',
      read: false,
      action: 'bookings'
    },
    {
      id: '3',
      title: 'Travel Tip',
      message: 'Your upcoming trip has activities and stay options ready to review.',
      type: 'tip',
      read: false,
      action: 'planner'
    },
    {
      id: '4',
      title: 'Offer Available',
      message: 'A new travel offer is available in Offers & Deals.',
      type: 'offer',
      read: false,
      action: 'offers'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: any) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setIsNotificationsOpen(false);

    if (notif.action === 'planner') {
      onGoPlanner();
    } else if (notif.action === 'bookings') {
      onOpenSavedTrips();
    } else if (notif.action === 'offers') {
      onOpenServiceModal('Offers & Deals');
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white border-b border-sky-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-blue-950 tracking-tight">MakeMyTrip AI Trip Assistant</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Academic Prototype · Powered by Gemini AI</p>
          </div>
        </div>

        {/* Navigation & Actions Zone */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onGoHome}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'home' ? 'text-blue-600 bg-sky-50' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            Home
          </button>

          <button
            onClick={onGoPlanner}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'planner' ? 'text-blue-600 bg-sky-50' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            Plan a Trip
          </button>

          <button
            onClick={onOpenSavedTrips}
            className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>My Trips</span>
            {savedCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenChat}
            className="px-3 py-2 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>

          {/* Services & More Mega Menu Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Services & More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isServicesOpen && (
              <div className="absolute right-0 mt-2 w-[700px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-sky-100 p-6 z-50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-150">
                {MEGA_MENU_SECTIONS.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 border-b border-sky-100 pb-1.5">
                      {section.title}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              setIsServicesOpen(false);
                              if (item.name === 'My Trips & Bookings') {
                                onOpenSavedTrips();
                              } else {
                                onOpenServiceModal(item.name);
                              }
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-blue-600 font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-2.5 group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-sky-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-5 w-[1px] bg-sky-200 mx-1 hidden sm:block"></div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-sky-100 p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-blue-950">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 || notifications.every(n => n.read) ? (
                    <div className="text-center py-8 space-y-1">
                      <Bell className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                      <p className="font-bold text-xs text-slate-700">No new notifications</p>
                      <p className="text-[11px] text-slate-400">You're all caught up.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group ${
                          notif.read ? 'bg-white border-sky-100/60 opacity-75 hover:opacity-100' : 'bg-sky-50/70 border-sky-200 hover:bg-sky-50 shadow-2xs'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'}`}>
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-blue-950 group-hover:text-blue-600 transition-colors">{notif.title}</h4>
                            {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-sky-100 text-center">
                  <p className="text-[10px] text-slate-400">Academic Prototype · Real-time demo notifications</p>
                </div>
              </div>
            )}
          </div>

          {/* User Sign In */}
          <button
            onClick={onOpenSignIn}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors border whitespace-nowrap cursor-pointer ${
              currentUser
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-sky-50 text-slate-700 border-sky-200 hover:bg-sky-100'
            }`}
          >
            {currentUser ? (
              <>
                <User className="w-4 h-4 text-emerald-600" />
                <span className="hidden xs:inline font-semibold">{currentUser.name}</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
