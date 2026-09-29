import React, { useState, useEffect } from 'react';
import { 
  X, Car, Gift, Compass, MapPin, ShieldCheck, Tag, Globe, Share2, Plane, Bookmark, 
  Train, Bus, Hotel, Home, Clock, Utensils, Check, ArrowRight, ArrowLeft, Star, Users, 
  Calendar, Wallet, CheckCircle2, AlertCircle, Search, SlidersHorizontal, RefreshCw, ArrowLeft as BackIcon
} from 'lucide-react';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService: string | null;
  onOpenSavedTrips: () => void;
  onBookService?: (bookingRecord: any) => void;
  onPlanDestination?: (dest: string) => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedService, 
  onOpenSavedTrips,
  onBookService,
  onPlanDestination
}) => {
  const groupName = selectedService || 'Flights';
  const subList = getSubServicesForGroup(groupName);

  const [currentGroup, setCurrentGroup] = useState<string>(groupName);
  const [subService, setSubService] = useState<string | null>(null);
  const [step, setStep] = useState<string>(subList.length > 0 ? 'subselector' : 'search');
  const [stepHistory, setStepHistory] = useState<string[]>(subList.length > 0 ? ['subselector'] : ['search']);

  useEffect(() => {
    const s = selectedService || 'Flights';
    setCurrentGroup(s);
    setSubService(null);
    const list = getSubServicesForGroup(s);
    const initialStep = list.length > 0 ? 'subselector' : 'search';
    setStep(initialStep);
    setStepHistory([initialStep]);
  }, [selectedService]);

  // Shared & Service-Specific Search State
  const [origin, setOrigin] = useState('Bengaluru');
  const [destination, setDestination] = useState('Goa');
  const [date, setDate] = useState('2026-10-15');
  const [returnDate, setReturnDate] = useState('2026-10-22');
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [travellers, setTravellers] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [trainClass, setTrainClass] = useState('3A');
  const [busType, setBusType] = useState('AC Sleeper');
  const [rooms, setRooms] = useState(1);
  const [checkOutDate, setCheckOutDate] = useState('2026-10-18');
  const [hourlyDuration, setHourlyDuration] = useState(4);
  const [pickupTime, setPickupTime] = useState('2:00 PM');
  const [transmission, setTransmission] = useState('Manual');
  const [cuisine, setCuisine] = useState('Local / Indian');

  // Activities Specific State
  const [activityCategory, setActivityCategory] = useState('Sightseeing');
  const [activityInterest, setActivityInterest] = useState('Beaches');

  // Holiday Packages Specific State
  const [departureCity, setDepartureCity] = useState('Bengaluru');
  const [packageTheme, setPackageTheme] = useState('Beach');
  const [holidayDurationDays, setHolidayDurationDays] = useState(5);

  // Travel Insurance Specific State
  const [insuranceCountry, setInsuranceCountry] = useState('Thailand / Worldwide');
  const [insuranceStartDate, setInsuranceStartDate] = useState('2026-10-15');
  const [insuranceEndDate, setInsuranceEndDate] = useState('2026-10-25');
  const [insuranceAgeGroup, setInsuranceAgeGroup] = useState('Adult');
  const [insuranceCoverageType, setInsuranceCoverageType] = useState('Standard');

  // Results & Selection State
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  
  // Traveller Details
  const [travellerName, setTravellerName] = useState('Rahul Sharma');
  const [travellerEmail, setTravellerEmail] = useState('rahul.sharma@example.com');
  const [travellerPhone, setTravellerPhone] = useState('+91 98765 43210');
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Status Lookups
  const [pnrInput, setPnrInput] = useState('PNR98421');
  const [pnrResult, setPnrResult] = useState<any | null>(null);
  const [flightNoInput, setFlightNoInput] = useState('6E-482');
  const [flightStatusResult, setFlightStatusResult] = useState<any | null>(null);

  // Secondary Options State
  const [pnrTab, setPnrTab] = useState<'flight' | 'pnr'>('flight');
  const [inputFlightNo, setInputFlightNo] = useState('6E-482');
  const [inputFlightDate, setInputFlightDate] = useState('2026-10-15');
  const [flightStatusChecked, setFlightStatusChecked] = useState(false);

  const [inputPnrNo, setInputPnrNo] = useState('PNR98421');
  const [inputPnrDate, setInputPnrDate] = useState('2026-10-15');
  const [pnrStatusChecked, setPnrStatusChecked] = useState(false);

  const [visaCountry, setVisaCountry] = useState('Thailand');
  const [visaNationality, setVisaNationality] = useState('Indian');
  const [visaPurpose, setVisaPurpose] = useState('Tourism');
  const [visaDate, setVisaDate] = useState('2026-10-15');
  const [visaGuidanceChecked, setVisaGuidanceChecked] = useState(false);

  const [offerCategory, setOfferCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

  if (!isOpen) return null;

  const activeServiceName = subService || currentGroup;

  const navigateTo = (newStep: string) => {
    setStepHistory(prev => [...prev, newStep]);
    setStep(newStep);
  };

  const handleBack = () => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory];
      newHistory.pop();
      const prevStep = newHistory[newHistory.length - 1];
      setStepHistory(newHistory);
      setStep(prevStep);
    } else {
      if (subService) {
        setSubService(null);
        const list = getSubServicesForGroup(currentGroup);
        const defaultStep = list.length > 0 ? 'subselector' : 'search';
        setStep(defaultStep);
        setStepHistory([defaultStep]);
      } else {
        onClose();
      }
    }
  };

  const handleRunSearch = () => {
    const s = (subService || currentGroup).toLowerCase();
    if (s.includes('flight')) {
      setSearchResults([
        { id: 'f1', name: 'IndiGo 6E-482', provider: 'IndiGo', dep: '06:00 AM', arr: '07:30 AM', duration: '1h 30m', price: 4850 * travellers, cabin: cabinClass, stops: 'Non-stop', route: `${origin} → ${destination}` },
      ]);
    } else if (s.includes('train')) {
      setSearchResults([
        { id: 't1', name: 'Goa Express (12780)', provider: 'IRCTC', dep: '06:30 AM', arr: '08:00 PM', duration: '13h 30m', price: 1450 * travellers, class: trainClass, route: `${origin} → ${destination}` },
      ]);
    } else if (s.includes('bus')) {
      setSearchResults([
        { id: 'b1', name: `VRL Travels ${busType}`, provider: 'VRL', dep: '09:00 PM', arr: '07:00 AM', duration: '10h 0m', price: 1200 * travellers, route: `${origin} → ${destination}` },
      ]);
    } else if (s.includes('cab') || s.includes('city') || s.includes('outstation') || s.includes('airport')) {
      const priceFactor = s.includes('outstation') ? 3400 : s.includes('airport') ? 1100 : 850;
      setSearchResults([
        { id: 'c1', name: `${subService || 'Cab'} (Dzire / Etios)`, provider: 'MakeMyTrip Cabs', capacity: '4 Passengers', price: priceFactor, distance: '45 km', route: `${origin} → ${destination}` },
      ]);
    } else if (s.includes('car rental')) {
      setSearchResults([
        { id: 'cr1', name: 'Hyundai Creta Self-Drive', provider: 'Zoomcar Partner', transmission, seating: '5 Seater', dailyPrice: 2400, total: 2400 * 3, route: `${origin} Hub` },
      ]);
    } else if (s.includes('hourly rental') || s.includes('hourly stay')) {
      setSearchResults([
        { id: 'hr1', name: s.includes('rental') ? 'Toyota Innova Hourly Chauffeur' : `Deluxe Hourly Stay (${hourlyDuration} hrs)`, provider: 'MMT Partner', capacity: '6 Seater', hourlyPrice: 450, total: 450 * hourlyDuration, duration: `${hourlyDuration} Hours`, location: destination || origin },
      ]);
    } else if (s.includes('hotel') || s.includes('homestay')) {
      setSearchResults([
        { id: 'h1', name: s.includes('homestay') ? 'Cozy Hills Homestay' : 'Grand Sea View Resort & Spa', location: destination || origin, rating: 4.8, price: 4500 * rooms, room: 'Deluxe Room', amenities: ['Free WiFi', 'Pool', 'Breakfast'] },
      ]);
    } else if (s.includes('restaurant')) {
      setSearchResults([
        { id: 'r1', name: 'Spice Route Bistro & Bar', cuisine, rating: 4.7, priceRange: '₹₹₹', distance: '1.2 km from center', location: destination || origin, tableOption: 'Indoor AC Table' },
        { id: 'r2', name: 'The Garden Deck Café', cuisine, rating: 4.5, priceRange: '₹₹', distance: '2.5 km from center', location: destination || origin, tableOption: 'Outdoor Garden Table' },
      ]);
    } else if (s.includes('activit')) {
      setSearchResults([
        { id: 'a1', name: `${activityCategory} Special Tour & Adventure`, category: activityCategory, duration: '4 Hours', price: 2500 * travellers, rating: 4.8, location: destination, description: 'Guided expert tour with all safety equipment and refreshments included.' },
      ]);
    } else if (s.includes('holiday') || s.includes('package')) {
      setSearchResults([
        { id: 'p1', name: `Amazing ${destination} ${packageTheme} Holiday`, theme: packageTheme, duration: `${holidayDurationDays} Days`, hotelCategory: '4-Star Resort', price: 24500 * travellers, description: `Handcrafted ${packageTheme.toLowerCase()} package from ${departureCity} to ${destination}.` },
      ]);
    } else if (s.includes('insurance')) {
      setSearchResults([
        { id: 'ins1', name: `MMT ${insuranceCoverageType} Travel Protect`, coverageType: insuranceCoverageType, medical: '$100,000 Medical Coverage', cancellation: 'Trip Cancellation Cover', baggage: 'Baggage Loss Protection', premium: insuranceCoverageType === 'Premium' ? 2400 : insuranceCoverageType === 'Standard' ? 1400 : 750, period: `${insuranceStartDate} to ${insuranceEndDate}` },
      ]);
    } else {
      setSearchResults([
        { id: 'g1', name: `${activeServiceName} Standard Plan`, provider: 'MMT Verified Partner', price: 999 * travellers, description: 'Comprehensive coverage & instant verification.' }
      ]);
    }
    navigateTo('results');
  };

  const handleSelectService = (item: any) => {
    setSelectedItem(item);
    navigateTo('details');
  };

  const handleProceedToSelection = () => {
    const s = activeServiceName.toLowerCase();
    if (s.includes('flight') || s.includes('train') || s.includes('bus')) {
      navigateTo('seatmap');
    } else {
      navigateTo('traveller');
    }
  };

  const handleConfirmBooking = () => {
    const bookingId = 'MMT-' + Math.floor(100000 + Math.random() * 900000);
    const pnr = 'PNR-' + Math.floor(10000 + Math.random() * 90000);
    const record = {
      bookingId,
      pnr,
      serviceType: activeServiceName,
      startingLocation: origin || departureCity || destination,
      destination: destination || insuranceCountry || origin,
      date: date || insuranceStartDate,
      travellers,
      selectedItem: selectedItem?.name || activeServiceName,
      selectedSeat: selectedSeat || 'Standard',
      price: selectedItem?.price || selectedItem?.total || selectedItem?.premium || 2500,
      status: 'Confirmed — Demo Booking',
      travellerName,
      travellerEmail,
      timestamp: new Date().toISOString()
    };
    setConfirmedBooking(record);
    if (onBookService) {
      onBookService({
        tripTitle: `${activeServiceName}: ${destination || origin}`,
        destination: destination || origin,
        startingLocation: origin || 'Goa',
        durationDays: 3,
        totalTravelers: travellers,
        budgetBreakdown: { totalGroupCost: record.price },
        status: 'Booked — Demo',
        bookingId
      });
    }
    navigateTo('confirmation');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-sky-100 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100 shrink-0">
          <div className="flex items-center gap-3">
            {(stepHistory.length > 1 || subService) && (
              <button
                onClick={handleBack}
                className="p-2 text-blue-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Go Back"
              >
                <BackIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-blue-950">{activeServiceName}</h2>
              <p className="text-xs text-slate-500">MakeMyTrip Verified Service · Academic Prototype</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          
          {/* GROUP SUB-SERVICE SELECTOR */}
          {subList.length > 0 && !subService && step === 'subselector' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-blue-950">Select {currentGroup} Option</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subList.map((sub: any) => {
                  const Icon = sub.icon;
                  return (
                    <button
                      key={sub.name}
                      onClick={() => {
                        setSubService(sub.name);
                        setStep('search');
                        setStepHistory(['subselector', 'search']);
                      }}
                      className="p-5 rounded-2xl border border-sky-100 bg-sky-50/40 hover:bg-blue-600 hover:text-white group transition-all text-left flex items-start gap-4 cursor-pointer shadow-2xs"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 group-hover:bg-white/20 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-blue-950 group-hover:text-white">{sub.name}</h4>
                        <p className="text-xs text-slate-500 group-hover:text-sky-100 mt-1">{sub.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP: SEARCH FOR SERVICES */}
          {(subList.length === 0 || subService) && step === 'search' && (
            <div className="space-y-5">
              
              <div className="bg-sky-50/60 p-4 sm:p-5 rounded-2xl border border-sky-100 space-y-4">
                
                {/* FLIGHT / PNR STATUS */}
                {activeServiceName === 'Flight / PNR Status' && (
                  <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-sky-100/70 rounded-xl mb-4">
                      <button
                        type="button"
                        onClick={() => { setPnrTab('flight'); setFlightStatusChecked(false); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${pnrTab === 'flight' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-900'}`}
                      >
                        Flight Status
                      </button>
                      <button
                        type="button"
                        onClick={() => { setPnrTab('pnr'); setPnrStatusChecked(false); }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${pnrTab === 'pnr' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-blue-900'}`}
                      >
                        PNR Status
                      </button>
                    </div>

                    {pnrTab === 'flight' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Airline / Flight Number</label>
                            <input
                              type="text"
                              value={inputFlightNo}
                              onChange={(e) => setInputFlightNo(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                              placeholder="e.g. 6E-482"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Travel Date</label>
                            <input
                              type="date"
                              value={inputFlightDate}
                              onChange={(e) => setInputFlightDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setFlightStatusChecked(true)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all"
                        >
                          Check Flight Status
                        </button>

                        {flightStatusChecked && (
                          <div className="mt-4 bg-white p-4 rounded-2xl border border-sky-200 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-sky-100">
                              <span className="font-extrabold text-blue-950 text-sm">{inputFlightNo} (IndiGo)</span>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">On Time</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                              <div><span className="font-semibold text-slate-500 block">Route:</span> Bengaluru (BLR) → Goa (GOI)</div>
                              <div><span className="font-semibold text-slate-500 block">Date:</span> {inputFlightDate}</div>
                              <div><span className="font-semibold text-slate-500 block">Scheduled Dep:</span> 06:00 AM</div>
                              <div><span className="font-semibold text-slate-500 block">Scheduled Arr:</span> 07:30 AM</div>
                            </div>
                            <div className="pt-2 border-t border-sky-100 text-[10px] text-slate-400 space-y-0.5">
                              <p>• Academic Prototype — Demo Status</p>
                              <p>• Live status is not connected.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">PNR Number</label>
                            <input
                              type="text"
                              value={inputPnrNo}
                              onChange={(e) => setInputPnrNo(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                              placeholder="e.g. PNR98421"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">Travel Date</label>
                            <input
                              type="date"
                              value={inputPnrDate}
                              onChange={(e) => setInputPnrDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPnrStatusChecked(true)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all"
                        >
                          Check PNR Status
                        </button>

                        {pnrStatusChecked && (
                          <div className="mt-4 bg-white p-4 rounded-2xl border border-sky-200 space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-sky-100">
                              <span className="font-extrabold text-blue-950 text-sm">PNR: {inputPnrNo}</span>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Confirmed (S3, 42)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                              <div><span className="font-semibold text-slate-500 block">Passenger Count:</span> 2 Travelers</div>
                              <div><span className="font-semibold text-slate-500 block">Route:</span> Bengaluru → Mysuru</div>
                              <div><span className="font-semibold text-slate-500 block">Train/Flight:</span> Goa Express (12780)</div>
                              <div><span className="font-semibold text-slate-500 block">Travel Date:</span> {inputPnrDate}</div>
                            </div>
                            <div className="pt-2 border-t border-sky-100 text-[10px] text-slate-400 space-y-0.5">
                              <p>• Academic Prototype — Demo Status</p>
                              <p>• Live status is not connected.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* VISA HELPDESK & GUIDANCE */}
                {activeServiceName === 'Visa Helpdesk & Guidance' && (
                  <div className="space-y-4">
                    <div className="space-y-1 mb-2">
                      <h3 className="font-extrabold text-base text-blue-950">VISA HELPDESK & GUIDANCE</h3>
                      <p className="text-xs text-slate-500">Check visa requirements, document checklists, and processing guidance.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination Country</label>
                        <input
                          type="text"
                          value={visaCountry}
                          onChange={(e) => setVisaCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          placeholder="Select Country (e.g. Thailand)"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Traveller Nationality</label>
                        <input
                          type="text"
                          value={visaNationality}
                          onChange={(e) => setVisaNationality(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          placeholder="Select Nationality"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Travel Purpose</label>
                        <select
                          value={visaPurpose}
                          onChange={(e) => setVisaPurpose(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="Tourism">Tourism</option>
                          <option value="Business">Business</option>
                          <option value="Transit">Transit</option>
                          <option value="Education">Education</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Planned Travel Date</label>
                        <input
                          type="date"
                          value={visaDate}
                          onChange={(e) => setVisaDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setVisaGuidanceChecked(true)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      Check Visa Guidance
                    </button>

                    {visaGuidanceChecked && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-white p-4 rounded-2xl border border-sky-200 space-y-2">
                          <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">Visa Requirement</h4>
                          <p className="text-xs text-slate-700">✅ E-Visa / Visa on Arrival available for {visaNationality} passport holders traveling to {visaCountry} for {visaPurpose}.</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-sky-200 space-y-2">
                          <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">Required Documents</h4>
                          <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                            <li>Valid Passport (minimum 6 months validity remaining)</li>
                            <li>Confirmed return flight tickets & hotel bookings</li>
                            <li>Recent passport-sized photographs (white background)</li>
                            <li>Bank statement for proof of sufficient funds</li>
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-sky-200 space-y-2">
                          <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">General Application Guidance</h4>
                          <p className="text-xs text-slate-700">Apply online through official portals at least 7-10 days prior to departure. Ensure all documents are clear color scans.</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-sky-200 space-y-2">
                          <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">Typical Processing Guidance</h4>
                          <p className="text-xs text-slate-700">Standard processing takes 3-5 working days. Expedited options available for select destinations.</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-sky-200 space-y-2">
                          <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">Entry / Validity Notes</h4>
                          <p className="text-xs text-slate-700">Single or multiple-entry visas typically grant 30-90 days stay upon arrival depending on bilateral agreements.</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-sky-200 space-y-2">
                          <h4 className="font-extrabold text-blue-950 text-xs uppercase tracking-wider">Important Reminders</h4>
                          <p className="text-xs text-slate-700">Carry printed copies of visa approval letter, return tickets, and accommodation proofs during immigration clearance.</p>
                        </div>
                        <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-100 text-[11px] text-slate-500">
                          Academic Prototype — General guidance only. Verify current requirements with the relevant official authority before travel.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* OFFERS & DEALS */}
                {activeServiceName === 'Offers & Deals' && (
                  <div className="space-y-4">
                    {selectedOffer ? (
                      <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-md space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">{selectedOffer.cat}</span>
                            <h3 className="font-extrabold text-base text-blue-950 mt-2">{selectedOffer.title}</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedOffer(null)}
                            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{selectedOffer.desc}</p>
                        <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-100 space-y-1.5 text-xs">
                          <div><span className="font-bold text-slate-600">Savings:</span> <span className="font-mono font-bold text-emerald-700">{selectedOffer.saving}</span></div>
                          <div><span className="font-bold text-slate-600">Validity:</span> {selectedOffer.validity}</div>
                          <div className="text-[10px] text-slate-400 pt-1 font-semibold">• Demo Offer — illustrative only</div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOffer(null)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Successfully applied offer: ${selectedOffer.title} (${selectedOffer.saving})`);
                              setSelectedOffer(null);
                            }}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                          >
                            Use Offer
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {['All', 'Flights', 'Hotels', 'Holidays', 'Cabs'].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setOfferCategory(cat)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${offerCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-sky-200'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-3">
                          {[
                            { cat: 'Flights', title: 'Flat 15% OFF on Domestic Flights', desc: 'Use code MMTFLY on all major domestic airline bookings.', saving: 'Save up to ₹2,500', validity: 'Valid till Oct 31, 2026 · Demo Offer' },
                            { cat: 'Hotels', title: 'Stay 3 Nights, Pay for 2', desc: 'Applicable across luxury resorts and boutique stays.', saving: 'Save up to ₹6,000', validity: 'Valid till Nov 15, 2026 · Demo Offer' },
                            { cat: 'Holidays', title: 'Early Bird Goa & Kerala Specials', desc: 'All-inclusive tour packages with flights and transfers.', saving: 'Save up to ₹10,000', validity: 'Valid till Dec 31, 2026 · Demo Offer' },
                            { cat: 'Cabs', title: 'Airport Transfers at ₹499 onwards', desc: 'Reliable doorstep pickup & drop across major Indian airports.', saving: 'Save ₹300 per trip', validity: 'Ongoing · Demo Offer' },
                          ].filter(o => offerCategory === 'All' || o.cat === offerCategory).map((offer, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-sky-200 shadow-2xs flex items-center justify-between gap-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">{offer.cat}</span>
                                <h4 className="font-extrabold text-sm text-blue-950 mt-1">{offer.title}</h4>
                                <p className="text-xs text-slate-600">{offer.desc}</p>
                                <p className="text-[11px] font-mono font-bold text-emerald-700">{offer.saving} · <span className="text-slate-400 font-sans font-normal">{offer.validity}</span></p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedOffer(offer)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer shrink-0 transition-all"
                              >
                                View Offer
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* DISCOVER DESTINATIONS */}
                {activeServiceName === 'Discover Destinations' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600">Explore curated destinations with AI-recommended itineraries and indicative budgets.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', desc: 'Sun-kissed beaches and vibrant nightlife.', bestFor: 'Beaches & Parties', duration: '4 Days', budget: '₹25,000' },
                        { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=600&q=80', desc: 'Majestic forts and royal palaces.', bestFor: 'History & Culture', duration: '3 Days', budget: '₹22,000' },
                        { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', desc: 'Snow-capped peaks and pine forests.', bestFor: 'Mountains & Adventure', duration: '5 Days', budget: '₹30,000' },
                        { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80', desc: 'Serene backwaters and ayurvedic spas.', bestFor: 'Nature & Relaxation', duration: '4 Days', budget: '₹28,000' },
                      ].map((dest) => (
                        <div key={dest.name} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden flex flex-col justify-between">
                          <div className="h-28 relative">
                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                              <h4 className="text-white font-extrabold text-base">{dest.name}</h4>
                            </div>
                          </div>
                          <div className="p-3.5 space-y-1.5">
                            <p className="text-xs text-slate-600 line-clamp-2">{dest.desc}</p>
                            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                              <span>Duration: {dest.duration}</span>
                              <span className="font-mono font-bold text-emerald-700">~{dest.budget}</span>
                            </div>
                          </div>
                          <div className="p-3 bg-sky-50/50 border-t border-sky-100 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (onPlanDestination) {
                                  onPlanDestination(dest.name);
                                }
                              }}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <span>Plan a Trip</span> <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* REFER & EARN */}
                {activeServiceName === 'Refer & Earn' && (
                  <div className="space-y-4 max-w-md mx-auto py-2">
                    <div className="text-center space-y-1">
                      <h3 className="font-extrabold text-base text-blue-950">REFER & EARN</h3>
                      <p className="text-xs text-slate-500">Invite friends to try the AI Trip Assistant.</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-2xs space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Your Referral Code</span>
                      <div className="flex items-center justify-between bg-sky-50 px-3 py-2.5 rounded-xl border border-sky-100">
                        <span className="font-mono font-extrabold text-blue-900 text-sm">MMT-AI-8842</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('MMT-AI-8842');
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                        >
                          {copiedCode ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                      <p className="font-bold">Referral Reward Status</p>
                      <p className="text-emerald-700 font-semibold">0 Successful Referrals</p>
                      <p className="text-emerald-600 text-[11px]">Earn ₹500 travel credit per successful referral</p>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => alert("Referral link shared successfully! (Academic Prototype)")}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all text-center"
                      >
                        Share Referral
                      </button>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-sky-100 space-y-1">
                      <p className="font-bold text-xs text-blue-950">Referral History</p>
                      <p className="text-xs text-slate-500">No successful referrals yet.</p>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center pt-2">Academic Prototype — Demo referral rewards only — not a real financial/reward system.</p>
                  </div>
                )}

                {/* 1. HOTELS SEARCH FORM */}
                {activeServiceName === 'Hotels' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination / City</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          placeholder="e.g. Goa, Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Check-in Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => {
                            const newCheckIn = e.target.value;
                            setDate(newCheckIn);
                            if (newCheckIn && checkOutDate && newCheckIn >= checkOutDate) {
                              const d = new Date(newCheckIn);
                              d.setDate(d.getDate() + 1);
                              setCheckOutDate(d.toISOString().split('T')[0]);
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Check-out Date</label>
                        <input
                          type="date"
                          min={date}
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Guests</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Rooms</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={rooms}
                          onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. HOURLY STAYS SEARCH FORM */}
                {activeServiceName === 'Hourly Stays' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Location / City</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Check-in Time</label>
                        <input
                          type="text"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          placeholder="e.g. 2:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration (Hours)</label>
                        <select
                          value={hourlyDuration}
                          onChange={(e) => setHourlyDuration(parseInt(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value={3}>3 Hours</option>
                          <option value={4}>4 Hours</option>
                          <option value={6}>6 Hours</option>
                          <option value={12}>12 Hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Guests</label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HOMESTAYS SEARCH FORM */}
                {activeServiceName === 'Homestays' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination / City</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Check-in Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Check-out Date</label>
                        <input
                          type="date"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Guests</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Rooms</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={rooms}
                          onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. RESTAURANTS SEARCH FORM */}
                {activeServiceName === 'Restaurants' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Location / City</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Time</label>
                        <input
                          type="text"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                          placeholder="e.g. 8:00 PM"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Number of Guests</label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Cuisine / Food Preference</label>
                        <select
                          value={cuisine}
                          onChange={(e) => setCuisine(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="Local / Indian">Local / Indian</option>
                          <option value="Coastal & Seafood">Coastal & Seafood</option>
                          <option value="Multi-cuisine & Continental">Multi-cuisine & Continental</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ACTIVITIES SEARCH FORM */}
                {(activeServiceName === 'Activities' || activeServiceName === 'Activities & Attractions') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                          placeholder="e.g. Goa"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Activity Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Travellers</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Activity Category</label>
                        <select
                          value={activityCategory}
                          onChange={(e) => setActivityCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="Sightseeing">Sightseeing</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Water Sports">Water Sports</option>
                          <option value="Culture & Heritage">Culture & Heritage</option>
                          <option value="Food & Dining">Food & Dining</option>
                          <option value="Nature">Nature</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Wellness">Wellness</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Optional Interest</label>
                        <select
                          value={activityInterest}
                          onChange={(e) => setActivityInterest(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="Beaches">Beaches</option>
                          <option value="Nature">Nature</option>
                          <option value="Culture">Culture</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Food">Food</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Family">Family</option>
                          <option value="Nightlife">Nightlife</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. HOLIDAYS / TOUR PACKAGES SEARCH FORM */}
                {(activeServiceName === 'Holidays & Tour Packages' || activeServiceName === 'Holiday Packages' || activeServiceName === 'Tour Packages') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Departure City</label>
                        <input
                          type="text"
                          value={departureCity}
                          onChange={(e) => setDepartureCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Travel Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration (Days)</label>
                        <input
                          type="number"
                          min={2}
                          max={30}
                          value={holidayDurationDays}
                          onChange={(e) => setHolidayDurationDays(parseInt(e.target.value) || 5)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Travellers</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Package Theme</label>
                      <select
                        value={packageTheme}
                        onChange={(e) => setPackageTheme(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                      >
                        <option value="Beach">Beach</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Family">Family</option>
                        <option value="Honeymoon">Honeymoon</option>
                        <option value="Culture">Culture</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Wildlife">Wildlife</option>
                        <option value="Spiritual">Spiritual</option>
                        <option value="Weekend Escape">Weekend Escape</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 7. TRAVEL INSURANCE SEARCH FORM */}
                {activeServiceName === 'Travel Insurance' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Destination / Country</label>
                        <input
                          type="text"
                          value={insuranceCountry}
                          onChange={(e) => setInsuranceCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Number of Travellers</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Travel Start Date</label>
                        <input
                          type="date"
                          value={insuranceStartDate}
                          onChange={(e) => setInsuranceStartDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Travel End Date</label>
                        <input
                          type="date"
                          value={insuranceEndDate}
                          onChange={(e) => setInsuranceEndDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Traveller Age Group</label>
                        <select
                          value={insuranceAgeGroup}
                          onChange={(e) => setInsuranceAgeGroup(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="Adult">Adult (18-60 yrs)</option>
                          <option value="Senior">Senior (61-80 yrs)</option>
                          <option value="Family">Family Pack</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Coverage Type</label>
                        <select
                          value={insuranceCoverageType}
                          onChange={(e) => setInsuranceCoverageType(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="Basic">Basic ($50k Medical)</option>
                          <option value="Standard">Standard ($100k Medical + Trip Cancel)</option>
                          <option value="Premium">Premium ($250k Full Cover)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. TRANSPORT & OTHER SERVICES SEARCH FORM (From → To) */}
                {activeServiceName !== 'Hotels' && 
                 activeServiceName !== 'Hourly Stays' && 
                 activeServiceName !== 'Homestays' && 
                 activeServiceName !== 'Restaurants' && 
                 activeServiceName !== 'Activities' &&
                 activeServiceName !== 'Activities & Attractions' && 
                 activeServiceName !== 'Holidays & Tour Packages' && 
                 activeServiceName !== 'Holiday Packages' && 
                 activeServiceName !== 'Tour Packages' && 
                 activeServiceName !== 'Travel Insurance' &&
                 activeServiceName !== 'Refer & Earn' &&
                 activeServiceName !== 'Visa Helpdesk & Guidance' &&
                 activeServiceName !== 'Flight / PNR Status' &&
                 activeServiceName !== 'Offers & Deals' &&
                 activeServiceName !== 'Discover Destinations' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">From / Pickup Location</label>
                        <input
                          type="text"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">To / Drop Destination</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Travellers</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={travellers}
                          onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
                          className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleRunSearch}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>
                      {activeServiceName === 'Travel Insurance' ? 'Compare Insurance Plans' : 
                       activeServiceName === 'Hotels' ? 'Search Hotels' :
                       activeServiceName === 'Hourly Stays' ? 'Search Hourly Stays' :
                       activeServiceName === 'Homestays' ? 'Search Homestays' :
                       activeServiceName === 'Restaurants' ? 'Search Restaurants' :
                       activeServiceName.includes('Holiday') || activeServiceName.includes('Package') ? 'Search Holiday Packages' : 
                       activeServiceName === 'Activities & Attractions' ? 'Search Activities' : `Search ${activeServiceName}`}
                    </span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* STEP: RESULTS */}
          {step === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-blue-950">Available {activeServiceName} Options</h3>
                  <p className="text-xs text-slate-500">{searchResults.length} verified demo results found</p>
                </div>
                <button
                  onClick={() => navigateTo('search')}
                  className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Modify Search
                </button>
              </div>

              <div className="space-y-3">
                {searchResults.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs flex items-center justify-between gap-4 hover:border-blue-300 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-blue-950">{item.name}</h4>
                        {item.provider && <span className="text-[10px] bg-sky-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">{item.provider}</span>}
                        {item.theme && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">{item.theme}</span>}
                        {item.coverageType && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">{item.coverageType}</span>}
                      </div>
                      <p className="text-xs text-slate-600">
                        {item.description || item.medical || item.duration || item.location || item.category || item.route}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">
                          {activeServiceName === 'Travel Insurance' ? 'Premium' : 'Price'}
                        </span>
                        <span className="font-mono font-bold text-base text-blue-950">₹{(item.price || item.total || item.premium || 1500)?.toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => handleSelectService(item)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        Select & Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP: DETAILS */}
          {step === 'details' && selectedItem && (
            <div className="space-y-5">
              <div className="bg-sky-50/50 p-5 rounded-2xl border border-sky-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">{activeServiceName}</span>
                    <h3 className="font-bold text-lg text-blue-950 mt-1.5">{selectedItem.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedItem.description || selectedItem.provider || 'Verified Plan'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block uppercase font-bold">
                      {activeServiceName === 'Travel Insurance' ? 'Total Premium' : 'Total Price'}
                    </span>
                    <span className="font-mono font-extrabold text-lg text-emerald-700">₹{(selectedItem.price || selectedItem.total || selectedItem.premium || 1500)?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-sky-200/60 text-xs text-slate-700">
                  {selectedItem.duration && <div><span className="font-semibold">Duration:</span> {selectedItem.duration}</div>}
                  {selectedItem.category && <div><span className="font-semibold">Category:</span> {selectedItem.category}</div>}
                  {selectedItem.location && <div><span className="font-semibold">Location:</span> {selectedItem.location}</div>}
                  {selectedItem.tableOption && <div><span className="font-semibold">Table Option:</span> {selectedItem.tableOption}</div>}
                  {selectedItem.medical && <div><span className="font-semibold">Medical Cover:</span> {selectedItem.medical}</div>}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleBack()}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  ← Back to Results
                </button>
                <button
                  onClick={handleProceedToSelection}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Proceed to Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP: SEATMAP */}
          {step === 'seatmap' && (
            <div className="space-y-4 text-center">
              <h3 className="font-bold text-sm text-blue-950">Select Your Seat / Berth</h3>
              <p className="text-xs text-slate-500">Tap an available seat in the layout below.</p>

              <div className="max-w-xs mx-auto bg-sky-50 p-5 rounded-2xl border border-sky-200 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D'].map((seat) => {
                    const isSelected = selectedSeat === seat;
                    return (
                      <button
                        key={seat}
                        onClick={() => setSelectedSeat(seat)}
                        className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-800 border border-sky-200 hover:border-blue-400'
                        }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleBack()}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={() => navigateTo('traveller')}
                  disabled={!selectedSeat}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Continue with Seat {selectedSeat || 'None'} →
                </button>
              </div>
            </div>
          )}

          {/* STEP: TRAVELLER DETAILS */}
          {step === 'traveller' && (
            <div className="space-y-4 max-w-lg mx-auto">
              <h3 className="font-bold text-sm text-blue-950">Guest / Passenger Details</h3>
              
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Guest / Traveller Name</label>
                  <input
                    type="text"
                    value={travellerName}
                    onChange={(e) => setTravellerName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={travellerEmail}
                    onChange={(e) => setTravellerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => handleBack()}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  Confirm Demo Booking →
                </button>
              </div>
            </div>
          )}

          {/* STEP: CONFIRMATION */}
          {step === 'confirmation' && confirmedBooking && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-xl text-blue-950">
                  {activeServiceName === 'Restaurants' ? 'Restaurant Reservation Confirmed — Demo' :
                   activeServiceName.includes('Hotel') || activeServiceName.includes('Stay') || activeServiceName.includes('Homestay') ? 'Hotel Booking Confirmed — Demo' :
                   activeServiceName === 'Travel Insurance' ? 'Travel Insurance Selected — Demo' :
                   activeServiceName.includes('Holiday') || activeServiceName.includes('Package') ? 'Holiday Package Confirmed — Demo' :
                   activeServiceName === 'Activities & Attractions' ? 'Activity Booking Confirmed — Demo' :
                   `${activeServiceName} Booking Confirmed — Demo`}
                </h3>
                <p className="text-xs text-slate-500">Your reservation has been successfully registered.</p>
              </div>

              <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-200 space-y-3 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-sky-200/60">
                  <div><span className="font-bold text-slate-500 block">Booking Reference ID:</span> <span className="font-mono font-bold text-blue-900">{confirmedBooking.bookingId}</span></div>
                  <div><span className="font-bold text-slate-500 block">Service:</span> <span className="font-bold text-blue-900">{confirmedBooking.serviceType}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div><span className="font-semibold">Location / Destination:</span> {confirmedBooking.destination}</div>
                  <div><span className="font-semibold">Selected Item:</span> {confirmedBooking.selectedItem}</div>
                  <div><span className="font-semibold">Date / Period:</span> {confirmedBooking.date}</div>
                  <div><span className="font-semibold">Guests / Travellers:</span> {confirmedBooking.travellers}</div>
                  <div><span className="font-semibold">Total Amount:</span> <span className="font-mono font-bold text-emerald-700">₹{confirmedBooking.price?.toLocaleString('en-IN')}</span></div>
                </div>

                <div className="pt-2 border-t border-sky-200/60 flex justify-between items-center">
                  <span className="font-bold text-slate-600">Booking Status:</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full">Confirmed — Demo</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => { onClose(); onOpenSavedTrips(); }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  View in My Trips
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// Helper function
function getSubServicesForGroup(group: string) {
  if (group === 'Trains & Buses') {
    return [
      { name: 'Trains', desc: 'Book Indian Railways tickets with berth preferences & PNR.', icon: Train },
      { name: 'Buses', desc: 'AC sleeper and Volvo bus bookings with seat layouts.', icon: Bus },
    ];
  }
  if (group === 'Hotels & Stays') {
    return [
      { name: 'Hotels', desc: 'Verified hotels and luxury resorts worldwide.', icon: Hotel },
      { name: 'Hourly Stays', desc: 'Flexible short-stay hotel rooms booked by the hour.', icon: Clock },
      { name: 'Homestays', desc: 'Unique local homes, villas, and apartment rentals.', icon: Home },
    ];
  }
  if (group === 'Cabs & Rentals') {
    return [
      { name: 'City Cabs', desc: 'Point-to-point city travel within urban areas.', icon: Car },
      { name: 'Outstation Cabs', desc: 'Intercity cab travel with professional drivers.', icon: Car },
      { name: 'Airport Cabs', desc: 'Reliable airport pickups & drop-offs.', icon: Plane },
      { name: 'Car Rentals', desc: 'Self-drive or chauffeur-driven car rentals.', icon: Car },
      { name: 'Hourly Rentals', desc: 'Vehicle rentals billed by the hour.', icon: Clock },
    ];
  }
  if (group === 'Holidays & Tour Packages') {
    return [
      { name: 'Holiday Packages', desc: 'Handcrafted domestic and international vacation packages.', icon: Gift },
      { name: 'Tour Packages', desc: 'Guided group sightseeing and cultural tours.', icon: Compass },
    ];
  }
  return [];
}
