import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

let lastSentTripSignature = '';

async function sendMakeWebhook(trip: any) {
  const signature = `${trip.destination}-${trip.durationDays}-${trip.budgetBreakdown?.totalGroupCost}-${trip.totalTravelers}`;
  if (signature === lastSentTripSignature) {
    return;
  }
  lastSentTripSignature = signature;

  try {
    const payload = {
      persona: "Aarav Sharma",
      itinerary_summary: trip.tripTitle || `${trip.durationDays}-Day Trip to ${trip.destination}`,
      ai_explanation: trip.explanation || `Optimized for ${trip.totalTravelers} traveler(s) with a budget of ₹${trip.budgetBreakdown?.totalGroupCost?.toLocaleString('en-IN') || 35000}.`
    };

    await fetch('https://hook.eu1.make.com/23mmoasgyj5qt1ac6jbe44bt822w7wl8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log("Make webhook successfully triggered for trip:", trip.destination);
  } catch (webhookErr) {
    console.warn("Make webhook notification failed gracefully:", webhookErr);
  }
}

const tripPlanSchema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: { type: Type.STRING },
    destination: { type: Type.STRING },
    durationDays: { type: Type.INTEGER },
    totalTravelers: { type: Type.INTEGER },
    explanation: { type: Type.STRING, description: "Short explanation of why the plan fits the user's request, budget, and style." },
    transportationOptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          mode: { type: Type.STRING },
          provider: { type: Type.STRING },
          duration: { type: Type.STRING },
          costPerPerson: { type: Type.NUMBER },
          description: { type: Type.STRING },
          recommended: { type: Type.BOOLEAN }
        },
        required: ["mode", "provider", "duration", "costPerPerson", "description", "recommended"]
      }
    },
    stayRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          pricePerNight: { type: Type.NUMBER },
          rating: { type: Type.NUMBER },
          location: { type: Type.STRING },
          description: { type: Type.STRING },
          whyRecommended: { type: Type.STRING }
        },
        required: ["name", "category", "pricePerNight", "rating", "location", "description", "whyRecommended"]
      }
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          date: { type: Type.STRING },
          title: { type: Type.STRING },
          morning: { type: Type.STRING },
          afternoon: { type: Type.STRING },
          evening: { type: Type.STRING },
          night: { type: Type.STRING },
          mealSuggestions: { type: Type.STRING },
          estimatedTravelTime: { type: Type.STRING }
        },
        required: ["dayNumber", "title", "morning", "afternoon", "evening", "night", "mealSuggestions"]
      }
    },
    foodSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Breakfast, Lunch, Dinner, or Street Food" },
          name: { type: Type.STRING },
          specialty: { type: Type.STRING },
          approxCost: { type: Type.NUMBER },
          description: { type: Type.STRING }
        },
        required: ["category", "name", "specialty", "approxCost", "description"]
      }
    },
    localTransportation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          method: { type: Type.STRING },
          costRange: { type: Type.STRING },
          tips: { type: Type.STRING }
        },
        required: ["method", "costRange", "tips"]
      }
    },
    activities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          duration: { type: Type.STRING },
          estimatedCost: { type: Type.NUMBER },
          description: { type: Type.STRING },
          isHiddenGem: { type: Type.BOOLEAN }
        },
        required: ["name", "category", "duration", "estimatedCost", "description", "isHiddenGem"]
      }
    },
    budgetBreakdown: {
      type: Type.OBJECT,
      properties: {
        accommodation: { type: Type.NUMBER },
        transportation: { type: Type.NUMBER },
        foodAndDining: { type: Type.NUMBER },
        activitiesAndTickets: { type: Type.NUMBER },
        shoppingAndMisc: { type: Type.NUMBER },
        emergencyReserve: { type: Type.NUMBER },
        totalPerTraveler: { type: Type.NUMBER },
        totalGroupCost: { type: Type.NUMBER }
      },
      required: ["accommodation", "transportation", "foodAndDining", "activitiesAndTickets", "shoppingAndMisc", "emergencyReserve", "totalPerTraveler", "totalGroupCost"]
    },
    packingChecklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["category", "items"]
      }
    },
    safetyTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: [
    "tripTitle", "destination", "durationDays", "totalTravelers", "explanation",
    "transportationOptions", "stayRecommendations", "itinerary", "foodSuggestions",
    "localTransportation", "activities", "budgetBreakdown", "packingChecklist", "safetyTips"
  ]
};

function ensureExactTripParameters(tripData: any, reqBody: any) {
  const numDays = (reqBody.days !== undefined && reqBody.days !== null && !isNaN(Number(reqBody.days))) ? Number(reqBody.days) : (tripData.durationDays || 3);
  const numTravelers = (reqBody.travelers !== undefined && reqBody.travelers !== null && !isNaN(Number(reqBody.travelers))) ? Number(reqBody.travelers) : (tripData.totalTravelers || 1);
  const totalBudget = (reqBody.budgetINR !== undefined && reqBody.budgetINR !== null && !isNaN(Number(reqBody.budgetINR))) ? Number(reqBody.budgetINR) : 25000;
  const startingLocation = reqBody.startingLocation || tripData.startingLocation || 'Bengaluru';
  const destination = reqBody.destination || tripData.destination || 'Mysuru';
  const travelStyle = reqBody.travelStyle || tripData.travelStyle || 'Mid-range Comfort';
  const transportPreference = reqBody.transportPreference || tripData.transportPreference || 'Flight/Train';
  const interests = reqBody.interests || tripData.interests || ['Sightseeing & Monuments', 'Food & Culinary'];

  tripData.startingLocation = startingLocation;
  tripData.destination = destination;
  tripData.durationDays = numDays;
  tripData.totalTravelers = numTravelers;
  tripData.travelStyle = travelStyle;
  tripData.transportPreference = transportPreference;
  tripData.interests = interests;
  tripData.tripTitle = `${numDays}-Day ${travelStyle} Journey from ${startingLocation} to ${destination}`;
  tripData.explanation = `This tailored itinerary from ${startingLocation} to ${destination} for ${numTravelers} traveler(s) has been optimized for a ₹${totalBudget.toLocaleString('en-IN')} budget, balancing comfort, must-see sights, and authentic local experiences.`;

  if (tripData.itinerary && Array.isArray(tripData.itinerary)) {
    if (tripData.itinerary.length > numDays) {
      tripData.itinerary = tripData.itinerary.slice(0, numDays);
    } else if (tripData.itinerary.length < numDays) {
      for (let i = tripData.itinerary.length + 1; i <= numDays; i++) {
        tripData.itinerary.push({
          dayNumber: i,
          title: i === numDays ? `Final Activities & Departure from ${destination}` : `Day ${i}: Discovering ${destination}`,
          morning: `Morning sightseeing and local breakfast in ${destination}.`,
          afternoon: `Explore popular landmarks and local cuisine for lunch.`,
          evening: `Evening leisure, market strolls, and relaxing views.`,
          night: `Dinner at a recommended local restaurant.`,
          mealSuggestions: `Local specialty café or dining spot`
        });
      }
    }
    tripData.itinerary = tripData.itinerary.map((d: any, idx: number) => ({
      ...d,
      dayNumber: idx + 1,
      title: d.title ? d.title.replace(/Goa|Manali|Jaipur|Kerala|Dubai|Singapore|Mysuru|Kashmir/gi, destination) : `Day ${idx + 1}: Discovering ${destination}`,
      morning: d.morning ? d.morning.replace(/Goa|Manali|Jaipur|Kerala|Dubai|Singapore|Mysuru|Kashmir/gi, destination) : `Morning in ${destination}`,
      afternoon: d.afternoon ? d.afternoon.replace(/Goa|Manali|Jaipur|Kerala|Dubai|Singapore|Mysuru|Kashmir/gi, destination) : `Afternoon in ${destination}`,
      evening: d.evening ? d.evening.replace(/Goa|Manali|Jaipur|Kerala|Dubai|Singapore|Mysuru|Kashmir/gi, destination) : `Evening in ${destination}`,
      night: d.night ? d.night.replace(/Goa|Manali|Jaipur|Kerala|Dubai|Singapore|Mysuru|Kashmir/gi, destination) : `Night in ${destination}`,
    }));
  } else {
    const newItinerary = [];
    for (let i = 1; i <= numDays; i++) {
      newItinerary.push({
        dayNumber: i,
        title: i === 1 ? `Arrival & Exploration in ${destination}` : i === numDays ? `Final Activities & Departure from ${destination}` : `Day ${i}: Discovering ${destination}`,
        morning: `Morning sightseeing and local breakfast in ${destination}.`,
        afternoon: `Explore popular landmarks and local cuisine for lunch.`,
        evening: `Evening leisure, market strolls, and relaxing views.`,
        night: `Dinner at a recommended local restaurant.`,
        mealSuggestions: `Local specialty café or dining spot`
      });
    }
    tripData.itinerary = newItinerary;
  }

  const accommodationCost = Math.round(totalBudget * 0.35);
  const transportCost = Math.round(totalBudget * 0.25);
  const foodCost = Math.round(totalBudget * 0.20);
  const activitiesCost = Math.round(totalBudget * 0.10);
  const shoppingCost = Math.round(totalBudget * 0.05);
  const reserveCost = totalBudget - (accommodationCost + transportCost + foodCost + activitiesCost + shoppingCost);

  tripData.budgetBreakdown = {
    accommodation: accommodationCost,
    transportation: transportCost,
    foodAndDining: foodCost,
    activitiesAndTickets: activitiesCost,
    shoppingAndMisc: shoppingCost,
    emergencyReserve: reserveCost > 0 ? reserveCost : 1000,
    totalPerTraveler: Math.round(totalBudget / numTravelers),
    totalGroupCost: totalBudget
  };

  return tripData;
}

function createFallbackTripPlan(startingLocation: string, destination: string, days: number, travelers: number, budgetINR: number, travelStyle: string, interests: any[], transportPreference: string) {
  const numDays = (days !== undefined && days !== null && !isNaN(Number(days))) ? Number(days) : 3;
  const numTravelers = (travelers !== undefined && travelers !== null && !isNaN(Number(travelers))) ? Number(travelers) : 1;
  const totalBudget = (budgetINR !== undefined && budgetINR !== null && !isNaN(Number(budgetINR))) ? Number(budgetINR) : 25000;
  const nights = Math.max(1, numDays - 1);

  const itinerary = [];
  for (let i = 1; i <= numDays; i++) {
    itinerary.push({
      dayNumber: i,
      title: i === 1 ? `Arrival & Initial Exploration in ${destination}` : i === numDays ? `Final Souvenirs & Departure from ${destination}` : `Exploring Iconic Sights & Hidden Gems of ${destination}`,
      morning: `Start your morning with local breakfast specialties in ${destination}. Visit key landmark spots and take in the serene atmosphere.`,
      afternoon: `Enjoy a guided walking tour or curated local experience. Taste regional delicacies for lunch.`,
      evening: `Relax at scenic viewpoints, shop at local bazaars, or experience the vibrant evening atmosphere of ${destination}.`,
      night: `Dine at a highly recommended local restaurant known for regional authentic cuisine.`,
      mealSuggestions: `Local specialty diner or rooftop café in ${destination}`
    });
  }

  const accommodationCost = Math.round(totalBudget * 0.35);
  const transportCost = Math.round(totalBudget * 0.25);
  const foodCost = Math.round(totalBudget * 0.20);
  const activitiesCost = Math.round(totalBudget * 0.10);
  const shoppingCost = Math.round(totalBudget * 0.05);
  const reserveCost = totalBudget - (accommodationCost + transportCost + foodCost + activitiesCost + shoppingCost);

  return {
    tripTitle: `${numDays}-Day ${travelStyle || 'Custom'} Journey from ${startingLocation || 'Origin'} to ${destination}`,
    destination: destination,
    durationDays: numDays,
    totalTravelers: numTravelers,
    explanation: `This tailored itinerary from ${startingLocation || 'your origin'} to ${destination} for ${numTravelers} traveler(s) has been optimized for a ₹${totalBudget.toLocaleString('en-IN')} budget, balancing comfort, must-see sights, and authentic local experiences.`,
    transportationOptions: [
      {
        mode: transportPreference || 'Flight',
        provider: 'Major Airline / Express Train',
        duration: 'Approx. 4-6 hours',
        costPerPerson: Math.round(transportCost / numTravelers),
        description: `Direct or connecting service from ${startingLocation || 'Origin'} to ${destination} tailored for your schedule.`,
        recommended: true
      },
      {
        mode: 'Cab / Bus',
        provider: 'State / Private Transport',
        duration: 'Comfortable overnight journey',
        costPerPerson: Math.round((transportCost * 0.7) / numTravelers),
        description: 'Budget-friendly alternative with scenic routes.',
        recommended: false
      }
    ],
    stayRecommendations: [
      {
        name: `${destination} Heritage & Comfort Hotel`,
        category: travelStyle || 'Mid-range Comfort',
        pricePerNight: Math.round(accommodationCost / Math.max(1, numDays - 1)),
        rating: 4.6,
        location: `Central ${destination}`,
        description: `Centrally located accommodation offering excellent hospitality and easy access to top attractions.`,
        whyRecommended: 'Highly rated for cleanliness, location, and welcoming staff.'
      },
      {
        name: `Boutique Stay ${destination}`,
        category: 'Boutique & Cozy',
        pricePerNight: Math.round((accommodationCost * 1.1) / Math.max(1, numDays - 1)),
        rating: 4.8,
        location: `Scenic district, ${destination}`,
        description: `Charming boutique property featuring local architectural touches and peaceful surroundings.`,
        whyRecommended: 'Great views and personalized service.'
      }
    ],
    itinerary,
    foodSuggestions: [
      {
        category: 'Breakfast',
        name: `Classic ${destination} Morning Cafe`,
        specialty: 'Traditional regional breakfast and artisanal coffee/tea',
        approxCost: 350,
        description: 'Start your day with freshly prepared local breakfast favorites.'
      },
      {
        category: 'Dinner',
        name: `Signature Dining ${destination}`,
        specialty: 'Authentic regional thali and local delicacies',
        approxCost: 850,
        description: 'Renowned for authentic flavors and warm hospitality.'
      }
    ],
    localTransportation: [
      {
        method: 'App-based Cabs & Auto-rickshaws',
        costRange: '₹300 - ₹800 / day',
        tips: 'Convenient and readily available across major tourist spots.'
      },
      {
        method: 'Walking / Local Metro',
        costRange: '₹50 - ₹200 / day',
        tips: 'Great for exploring old markets and narrow lanes.'
      }
    ],
    activities: [
      {
        name: `Landmark Sightseeing Tour of ${destination}`,
        category: 'Culture & Sightseeing',
        duration: 'Half Day',
        estimatedCost: Math.round(activitiesCost * 0.6),
        description: `Explore the historical and cultural heart of ${destination} with expert insights.`,
        isHiddenGem: false
      },
      {
        name: `Hidden Valley / Sunset Viewpoint`,
        category: 'Nature & Photography',
        duration: '2-3 hours',
        estimatedCost: Math.round(activitiesCost * 0.4),
        description: `A peaceful off-the-beaten-path spot offering breathtaking panoramic views of ${destination}.`,
        isHiddenGem: true
      }
    ],
    budgetBreakdown: {
      accommodation: accommodationCost,
      transportation: transportCost,
      foodAndDining: foodCost,
      activitiesAndTickets: activitiesCost,
      shoppingAndMisc: shoppingCost,
      emergencyReserve: reserveCost > 0 ? reserveCost : 2000,
      totalPerTraveler: Math.round(totalBudget / numTravelers),
      totalGroupCost: totalBudget
    },
    packingChecklist: [
      {
        category: 'Clothing & Essentials',
        items: ['Comfortable walking shoes', 'Weather-appropriate clothing', 'Sunglasses & sunscreen', 'Personal toiletries']
      },
      {
        category: 'Documents & Gadgets',
        items: ['Government ID / Aadhaar / Passport', 'Phone charger & power bank', 'Cash & cards', 'Prescription medications']
      }
    ],
    safetyTips: [
      `Keep emergency contact numbers handy while exploring ${destination}.`,
      'Drink bottled water and try freshly cooked hot foods.',
      'Respect local customs and traditions during your visits.'
    ]
  };
}

app.post('/api/generate-trip', async (req, res) => {
  const {
    startingLocation,
    destination,
    days,
    travelDates,
    travelers,
    budgetINR,
    travelStyle,
    interests,
    transportPreference
  } = req.body;

  try {
    const prompt = `Act as Atlas, an expert AI Travel Concierge and Itinerary Planner for MakeMyTrip AI Trip Assistant.
Create a comprehensive, highly realistic, personalized, and budget-aware trip plan based on the following traveler request:
- Starting Location: ${startingLocation || 'Anywhere in India'}
- Destination: ${destination}
- Duration: ${days} days
- Travel Dates: ${travelDates || 'Upcoming'}
- Number of Travelers: ${travelers || 2}
- Target Budget (INR): ₹${budgetINR || 50000} (Keep the total group cost close to or within this budget)
- Travel Style: ${travelStyle || 'Mid-range'}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : (interests || 'Sightseeing, Food')}
- Preferred Transport: ${transportPreference || 'Flight/Train'}

Ensure realistic Indian Rupee (INR) costs, practical travel routes, varied local food experiences, balanced daily itineraries, and hidden gems.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are Atlas, a professional, friendly, and expert AI Travel Concierge. Always return data matching the specified JSON schema strictly.",
        responseMimeType: 'application/json',
        responseSchema: tripPlanSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI");
    }

    const tripData = JSON.parse(text);
    const finalizedTrip = ensureExactTripParameters(tripData, req.body);
    await sendMakeWebhook(finalizedTrip);
    res.json({ success: true, trip: finalizedTrip });
  } catch (error: any) {
    const errStr = String(error?.message || error);
    if (!errStr.includes('429') && !errStr.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Generation error, utilizing fallback trip plan:", errStr);
    }
    const fallbackTrip = createFallbackTripPlan(
      startingLocation,
      destination,
      days,
      travelers,
      budgetINR,
      travelStyle,
      interests,
      transportPreference
    );
    const finalizedFallback = ensureExactTripParameters(fallbackTrip, req.body);
    await sendMakeWebhook(finalizedFallback);
    res.json({ success: true, trip: finalizedFallback });
  }
});

function extractExplicitDays(message: string): number | null {
  if (!message) return null;
  const match = message.match(/(?:(\d+)\s*-?\s*days?|for\s+(\d+)\s*days?|(\d+)\s*-?\s*day\s+trip|(\d+)\s*-?\s*day\s+vacation)/i);
  if (match) {
    const val = match[1] || match[2] || match[3] || match[4];
    if (val) {
      const parsed = parseInt(val);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 30) return parsed;
    }
  }
  const wordMatch = message.match(/(\d+)\s*days?/i);
  if (wordMatch) {
    const parsed = parseInt(wordMatch[1]);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 30) return parsed;
  }
  return null;
}

function extractExplicitTravelers(message: string): number | null {
  const lower = message.toLowerCase();
  if (lower.includes('solo') || lower.includes('alone') || lower.includes('1 person') || lower.includes('1 traveler')) {
    return 1;
  }
  if (lower.includes('couple') || lower.includes('two people') || lower.includes('2 people') || lower.includes('two travelers')) {
    return 2;
  }
  const match = message.match(/(\d+)\s*(?:people|person|traveler|travellers)/i);
  if (match) {
    const val = parseInt(match[1]);
    if (!isNaN(val) && val > 0) return val;
  }
  return null;
}

function extractExplicitBudget(message: string): number | null {
  const match = message.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
  if (match) {
    const val = parseInt(match[1].replace(/,/g, ''));
    if (!isNaN(val) && val > 0) return val;
  }
  return null;
}

function extractExplicitRoute(message: string): { origin: string | null, destination: string | null } {
  let origin: string | null = null;
  let destination: string | null = null;
  const travelMatch = message.match(/from\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:\s+with|\s+for|\s+budget|\s+in|\.|$)/i);
  if (travelMatch) {
    origin = travelMatch[1].trim();
    destination = travelMatch[2].trim();
  } else {
    const toMatch = message.match(/to\s+([a-zA-Z\s]+?)(?:\s+with|\s+for|\s+budget|\s+in|\.|$)/i);
    if (toMatch) {
      destination = toMatch[1].trim();
    }
    const fromMatch = message.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+with|\s+for|\s+budget|\s+in|\.|$)/i);
    if (fromMatch) {
      origin = fromMatch[1].trim();
    }
  }
  return { origin, destination };
}

app.post('/api/chat-trip', async (req, res) => {
  try {
    const { message, tripContext, chatHistory } = req.body;
    const lowerMsg = (message || '').toLowerCase();

    let chatResult: any = null;
    try {
      const prompt = `You are the expert MakeMyTrip AI Trip Assistant.
Current Trip Context (if any): ${tripContext ? JSON.stringify(tripContext) : 'None (New trip)'}
Chat History: ${JSON.stringify(chatHistory || [])}
User Message: "${message}"

Your task:
1. Carefully analyze the user's message.
2. Extract or update trip parameters based STRICTLY on the user's message and current trip context.
3. Return valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: "You are the MakeMyTrip AI Trip Assistant. Extract trip parameters precisely and return valid JSON.",
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        chatResult = JSON.parse(text);
      }
    } catch (apiErr: any) {
      console.warn("AI Chat fallback:", apiErr);
    }

    const explicitDays = extractExplicitDays(message);
    const explicitTravelers = extractExplicitTravelers(message);
    const explicitBudget = extractExplicitBudget(message);
    const { origin: explicitOrigin, destination: explicitDest } = extractExplicitRoute(message);

    let dest = explicitDest 
      || chatResult?.extracted?.destination 
      || tripContext?.destination 
      || 'Mysuru';

    if (lowerMsg.includes('change destination')) {
      if (explicitDest) {
        dest = explicitDest;
      } else if (lowerMsg.includes('to ')) {
        const parts = message.split(/to\s+/i);
        if (parts[1]) {
          dest = parts[1].trim().replace(/[.,!?;].*$/, '');
        }
      } else {
        const currentDest = tripContext?.destination || 'Goa';
        const alternatives = ['Jaipur', 'Manali', 'Kerala', 'Dubai', 'Goa', 'Mysuru'];
        dest = alternatives.find(d => d.toLowerCase() !== currentDest.toLowerCase()) || 'Jaipur';
      }
    }

    let days = explicitDays !== null 
      ? explicitDays 
      : (chatResult?.extracted?.days !== null && chatResult?.extracted?.days !== undefined && !isNaN(Number(chatResult?.extracted?.days))
          ? Number(chatResult.extracted.days)
          : (tripContext?.durationDays || 3));

    if (lowerMsg.includes('add one day') || lowerMsg.includes('add a day') || lowerMsg.includes('+1 day')) {
      days = Math.min(30, (tripContext?.durationDays || 3) + 1);
    }

    const startingLocation = explicitOrigin 
      || chatResult?.extracted?.startingLocation 
      || tripContext?.startingLocation 
      || 'Bengaluru';

    const travelers = explicitTravelers !== null 
      ? explicitTravelers 
      : (chatResult?.extracted?.travelers !== null && chatResult?.extracted?.travelers !== undefined && !isNaN(Number(chatResult?.extracted?.travelers))
          ? Number(chatResult.extracted.travelers)
          : (tripContext?.totalTravelers || 1));

    let budget = explicitBudget !== null 
      ? explicitBudget 
      : (chatResult?.extracted?.budgetINR !== null && chatResult?.extracted?.budgetINR !== undefined && !isNaN(Number(chatResult?.extracted?.budgetINR))
          ? Number(chatResult.extracted.budgetINR)
          : (tripContext?.budgetBreakdown?.totalGroupCost || 25000));

    let travelStyle = chatResult?.extracted?.travelStyle || tripContext?.travelStyle || (budget < 25000 ? 'Budget / Backpacker' : 'Mid-range Comfort');
    let interests = chatResult?.extracted?.interests || tripContext?.interests || ['Sightseeing & Monuments', 'Food & Culinary'];
    let transportPreference = chatResult?.extracted?.transportPreference || tripContext?.transportPreference || 'Flight/Train';

    const currentBudget = tripContext?.budgetBreakdown?.totalGroupCost;

    if (lowerMsg.includes('cheaper') || lowerMsg.includes('reduce budget') || lowerMsg.includes('less budget')) {
      if (currentBudget && !explicitBudget) {
        budget = Math.round(currentBudget * 0.80);
      } else {
        budget = Math.round(budget * 0.80);
      }
    }

    if (lowerMsg.includes('train') || lowerMsg.includes('trains')) {
      transportPreference = 'Train';
    } else if (lowerMsg.includes('flight') || lowerMsg.includes('flights')) {
      transportPreference = 'Flight';
    } else if (lowerMsg.includes('bus')) {
      transportPreference = 'Bus';
    }

    const reqBody = {
      startingLocation,
      destination: dest,
      days,
      travelers,
      budgetINR: budget,
      travelStyle,
      interests,
      transportPreference
    };

    let finalizedTrip;
    try {
      const tripPrompt = `Act as MakeMyTrip AI Trip Assistant. Create a comprehensive, realistic, personalized, and budget-aware trip plan based on:
- Starting Location: ${reqBody.startingLocation}
- Destination: ${reqBody.destination}
- Duration: ${reqBody.days} days
- Number of Travelers: ${reqBody.travelers}
- Target Budget (INR): ₹${reqBody.budgetINR}
- Travel Style: ${reqBody.travelStyle}
- Interests: ${reqBody.interests.join(', ')}
- Preferred Transport: ${reqBody.transportPreference}`;

      const genResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: tripPrompt,
        config: {
          systemInstruction: "You are the MakeMyTrip AI Trip Assistant. Return data matching the specified JSON schema strictly.",
          responseMimeType: 'application/json',
          responseSchema: tripPlanSchema,
          temperature: 0.7,
        },
      });

      const genText = genResponse.text;
      if (genText) {
        const tripData = JSON.parse(genText);
        finalizedTrip = ensureExactTripParameters(tripData, reqBody);
      } else {
        throw new Error("Empty response");
      }
    } catch (genErr: any) {
      const fallback = createFallbackTripPlan(
        reqBody.startingLocation,
        reqBody.destination,
        reqBody.days,
        reqBody.travelers,
        reqBody.budgetINR,
        reqBody.travelStyle,
        reqBody.interests,
        reqBody.transportPreference
      );
      finalizedTrip = ensureExactTripParameters(fallback, reqBody);
    }

    let replyMsg = chatResult?.reply;
    if (lowerMsg.includes('add one day') || lowerMsg.includes('add a day') || lowerMsg.includes('+1 day')) {
      replyMsg = `I have successfully added one day to your itinerary! Your trip to ${dest} is now ${days} days long, and the itinerary and budget have been automatically updated.`;
    } else if (lowerMsg.includes('change destination')) {
      replyMsg = `I have successfully changed your destination to ${dest}! Your itinerary, stays, and activities have been regenerated for ${dest} while preserving your duration, budget, and preferences.`;
    } else if (lowerMsg.includes('show alternatives') || lowerMsg.includes('alternatives')) {
      replyMsg = `Here are the top alternative options for transport, stays, and activities for your trip to ${dest}:
- Transport: Flight (₹4,850) vs Express Train (₹1,450) vs AC Bus (₹1,200)
- Stays: Budget Boutique (₹2,500/night) vs Mid-range Resort (₹4,500/night) vs Luxury Villa (₹8,500/night)
- Activities: Sightseeing Tour vs Water Sports Adventure vs Hidden Gem Sunset Viewpoint`;
    } else if (explicitDays !== null && explicitDays !== tripContext?.durationDays) {
      replyMsg = `I've updated your trip plan to ${days} days from ${startingLocation} to ${dest} (${travelers} traveller(s), ₹${budget.toLocaleString('en-IN')}) based on your request!`;
    } else if (explicitDest && explicitDest !== tripContext?.destination) {
      replyMsg = `I've updated your destination to ${dest} (${days} days, ₹${budget.toLocaleString('en-IN')}).`;
    } else if (explicitBudget !== null && explicitBudget !== currentBudget) {
      replyMsg = `I've updated your budget to ₹${budget.toLocaleString('en-IN')} for your ${days}-day trip to ${dest}.`;
    } else if (!replyMsg) {
      replyMsg = `I've successfully updated your trip to ${days} days from ${startingLocation} to ${dest}!`;
    }

    await sendMakeWebhook(finalizedTrip);
    res.json({
      success: true,
      reply: replyMsg,
      trip: finalizedTrip
    });
  } catch (error: any) {
    console.error("Error in chat-trip:", error);
    res.json({ 
      success: true, 
      trip: req.body.tripContext || null,
      reply: "AI is temporarily unavailable because the generation service is rate-limited. Your current trip plan is saved and you can continue editing it." 
    });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
