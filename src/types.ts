export interface TripRequest {
  startingLocation: string;
  destination: string;
  days: number;
  travelDates: string;
  travelers: number;
  budgetINR: number;
  travelStyle: string;
  interests: string[];
  transportPreference: string;
}

export interface TransportOption {
  mode: string;
  provider: string;
  duration: string;
  costPerPerson: number;
  description: string;
  recommended: boolean;
}

export interface StayRecommendation {
  name: string;
  category: string;
  pricePerNight: number;
  rating: number;
  location: string;
  description: string;
  whyRecommended: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  mealSuggestions: string;
  estimatedTravelTime?: string;
}

export interface FoodSuggestion {
  category: string;
  name: string;
  specialty: string;
  approxCost: number;
  description: string;
}

export interface LocalTransport {
  method: string;
  costRange: string;
  tips: string;
}

export interface Activity {
  name: string;
  category: string;
  duration: string;
  estimatedCost: number;
  description: string;
  isHiddenGem: boolean;
}

export interface BudgetBreakdown {
  accommodation: number;
  transportation: number;
  foodAndDining: number;
  activitiesAndTickets: number;
  shoppingAndMisc: number;
  emergencyReserve: number;
  totalPerTraveler: number;
  totalGroupCost: number;
}

export interface PackingCategory {
  category: string;
  items: string[];
}

export interface TripPlan {
  id?: string;
  createdAt?: string;
  tripTitle: string;
  startingLocation?: string;
  destination: string;
  durationDays: number;
  totalTravelers: number;
  travelStyle?: string;
  transportPreference?: string;
  interests?: string[];
  explanation: string;
  transportationOptions: TransportOption[];
  stayRecommendations: StayRecommendation[];
  itinerary: ItineraryDay[];
  foodSuggestions: FoodSuggestion[];
  localTransportation: LocalTransport[];
  activities: Activity[];
  budgetBreakdown: BudgetBreakdown;
  packingChecklist: PackingCategory[];
  safetyTips: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
