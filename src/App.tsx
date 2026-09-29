import React, { useState, useEffect } from 'react';
import { TripPlan, TripRequest } from './types';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { HomeView } from './components/HomeView';
import { TripWizard } from './components/TripWizard';
import { ItineraryView } from './components/ItineraryView';
import { EditTripModal } from './components/EditTripModal';
import { ChatDrawer } from './components/ChatDrawer';
import { SavedTripsModal } from './components/SavedTripsModal';
import { SignInModal } from './components/SignInModal';
import { ServicesModal } from './components/ServicesModal';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'planner' | 'itinerary'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; uid?: string } | null>(null);
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [plannerDestination, setPlannerDestination] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userInfo = {
          name: user.displayName || user.email?.split('@')[0] || 'Traveler',
          email: user.email || '',
          uid: user.uid
        };
        setCurrentUser(userInfo);
        
        // Fetch trips from Firestore
        try {
          const tripsCol = collection(db, 'users', user.uid, 'trips');
          const snapshot = await getDocs(tripsCol);
          const trips: TripPlan[] = [];
          snapshot.forEach((docSnap) => {
            trips.push({ id: docSnap.id, ...docSnap.data() } as TripPlan);
          });
          setSavedTrips(trips);
        } catch (err) {
          console.error("Failed to load trips from Firestore", err);
          const local = localStorage.getItem(`mmt_saved_trips_${user.email}`);
          if (local) {
            try { setSavedTrips(JSON.parse(local)); } catch (e) {}
          }
        }
      } else {
        setCurrentUser(null);
        setSavedTrips([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (name: string, email: string, uid?: string) => {
    const user = { name, email, uid: uid || auth.currentUser?.uid || 'guest' };
    setCurrentUser(user);
    if (user.uid && user.uid !== 'guest') {
      try {
        const tripsCol = collection(db, 'users', user.uid, 'trips');
        const snapshot = await getDocs(tripsCol);
        const trips: TripPlan[] = [];
        snapshot.forEach((docSnap) => {
          trips.push({ id: docSnap.id, ...docSnap.data() } as TripPlan);
        });
        setSavedTrips(trips);
      } catch (err) {
        console.error("Error loading user trips", err);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSavedTrips([]);
  };

  const handleGenerateTrip = async (request: TripRequest) => {
    console.log("AI GENERATION STARTED", request);
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      const data = await res.json();
      if (data.success) {
        console.log("AI GENERATION SUCCESS", data.trip);
        const newTrip: TripPlan = {
          ...data.trip,
          id: data.trip.id || `trip_${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        setCurrentTrip(newTrip);
        setActiveView('itinerary');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (currentUser?.uid) {
          try {
            const tripRef = doc(db, 'users', currentUser.uid, 'trips', newTrip.id!);
            await setDoc(tripRef, newTrip);
            setSavedTrips(prev => {
              const exists = prev.some(t => t.id === newTrip.id);
              if (exists) return prev;
              return [newTrip, ...prev];
            });
          } catch (err) {
            console.error("Firestore persistence error", err);
            handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/trips/${newTrip.id}`);
            alert("Your trip was generated, but could not be saved to Firestore. Please try again.");
          }
        }
      } else {
        console.error("AI GENERATION ERROR", data.error);
        alert(`AI Generation Error: ${data.error || "Failed to generate trip plan."}`);
      }
    } catch (err: any) {
      console.error("AI GENERATION ERROR", err);
      alert(`AI Generation Error: ${err.message || "Network error while generating trip plan."}`);
    } finally {
      setIsLoading(false);
      setIsEditOpen(false);
    }
  };

  const handleMakeCheaper = () => {
    if (!currentTrip) return;
    const currentCost = currentTrip.budgetBreakdown?.totalGroupCost || 40000;
    const cheaperBudget = Math.max(10000, Math.round(currentCost * 0.75));
    
    const request: TripRequest = {
      startingLocation: currentTrip.startingLocation || 'Bengaluru',
      destination: currentTrip.destination,
      days: currentTrip.durationDays,
      travelDates: 'Upcoming',
      travelers: currentTrip.totalTravelers,
      budgetINR: cheaperBudget,
      travelStyle: 'Budget / Backpacker',
      interests: currentTrip.interests || ['Sightseeing', 'Food'],
      transportPreference: currentTrip.transportPreference || 'Train'
    };
    handleGenerateTrip(request);
  };

  const handleSaveCurrentTrip = async () => {
    if (!currentTrip) return;
    const tripId = currentTrip.id || `trip_${Date.now()}`;
    const tripToSave: TripPlan = { ...currentTrip, id: tripId, createdAt: currentTrip.createdAt || new Date().toISOString() };
    
    setSavedTrips(prev => {
      const exists = prev.some(t => t.tripTitle === tripToSave.tripTitle && t.destination === tripToSave.destination);
      if (exists) return prev;
      return [tripToSave, ...prev];
    });

    if (currentUser?.uid) {
      try {
        const tripRef = doc(db, 'users', currentUser.uid, 'trips', tripId);
        await setDoc(tripRef, tripToSave);
      } catch (err) {
        console.error("Error saving trip to Firestore", err);
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/trips/${tripId}`);
        alert("Your trip was generated, but could not be saved. Please try again.");
      }
    }
  };

  const handleDeleteSavedTrip = async (index: number) => {
    const tripToDelete = savedTrips[index];
    const updated = savedTrips.filter((_, idx) => idx !== index);
    setSavedTrips(updated);

    if (currentUser?.uid && tripToDelete?.id) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'trips', tripToDelete.id));
      } catch (err) {
        console.error("Error deleting trip from Firestore", err);
      }
    }
  };

  const isCurrentTripSaved = currentTrip ? savedTrips.some(t => t.tripTitle === currentTrip.tripTitle && t.destination === currentTrip.destination) : false;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <DisclaimerBanner />
      
      <Header
        onGoHome={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoPlanner={() => {
          setPlannerDestination(undefined);
          setActiveView('planner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSavedTrips={() => setIsSavedModalOpen(true)}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onOpenChat={() => {
          setIsChatOpen(true);
        }}
        onOpenServiceModal={(svc) => setSelectedService(svc)}
        savedCount={savedTrips.length}
        hasActiveTrip={!!currentTrip}
        currentUser={currentUser}
        activeView={activeView}
      />

      <main className="flex-1">
        {activeView === 'home' ? (
          <HomeView
            onStartPlanning={(dest) => {
              setPlannerDestination(dest);
              setActiveView('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGenerateFromPrompt={handleGenerateTrip}
            onOpenServiceModal={(svc) => setSelectedService(svc)}
            onOpenChat={() => setIsChatOpen(true)}
          />
        ) : activeView === 'planner' ? (
          <TripWizard onGenerate={handleGenerateTrip} isLoading={isLoading} initialDestination={plannerDestination} />
        ) : currentTrip ? (
          <ItineraryView
            trip={currentTrip}
            onEdit={() => setIsEditOpen(true)}
            onMakeCheaper={handleMakeCheaper}
            onOpenChat={() => setIsChatOpen(true)}
            onSaveTrip={handleSaveCurrentTrip}
            isSaved={isCurrentTripSaved}
          />
        ) : (
          <TripWizard onGenerate={handleGenerateTrip} isLoading={isLoading} initialDestination={plannerDestination} />
        )}
      </main>

      {/* Modals & Drawers */}
      {currentTrip && (
        <EditTripModal
          trip={currentTrip}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onRegenerate={handleGenerateTrip}
          isLoading={isLoading}
        />
      )}

      <ChatDrawer
        trip={currentTrip}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onUpdateTrip={(newTrip) => {
          setCurrentTrip(newTrip);
          setIsChatOpen(false);
          setActiveView('itinerary');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <SavedTripsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setCurrentTrip(trip);
          setActiveView('itinerary');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteTrip={handleDeleteSavedTrip}
        onOpenService={(serviceName) => {
          setIsSavedModalOpen(false);
          setSelectedService(serviceName);
        }}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <ServicesModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        selectedService={selectedService}
        onOpenSavedTrips={() => {
          setSelectedService(null);
          setIsSavedModalOpen(true);
        }}
        onBookService={async (bookingRecord) => {
          const bookingId = bookingRecord.bookingId || `booking_${Date.now()}`;
          const updatedRecord = { ...bookingRecord, bookingId };
          const updated = [updatedRecord, ...savedTrips];
          setSavedTrips(updated);

          if (currentUser?.uid) {
            try {
              const bookRef = doc(db, 'users', currentUser.uid, 'bookings', bookingId);
              await setDoc(bookRef, updatedRecord);
            } catch (err) {
              console.error("Error saving booking to Firestore", err);
              handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/bookings/${bookingId}`);
            }
          }
        }}
        onPlanDestination={(dest) => {
          setSelectedService(null);
          setPlannerDestination(dest);
          setActiveView('planner');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-sky-100 py-8 text-center text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-blue-950">MakeMyTrip AI Trip Assistant — Academic Prototype</p>
          <p>Built with Google AI Studio & Gemini API. Designed for travel planning, estimation, and exploration.</p>
          <p className="text-[11px] text-slate-400">© 2026 MakeMyTrip Academic Evaluation Project. All illustrative data is AI-generated.</p>
        </div>
      </footer>
    </div>
  );
}
