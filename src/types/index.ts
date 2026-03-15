export interface Location {
  name: string;
  country: string;
  city?: string;
  lat: number;
  lng: number;
  description?: string;
  imageUrl?: string;
}

export interface TravelGuide {
  location: Location;
  overview: string;
  mustVisitPlaces: Place[];
  famousFood: FoodItem[];
  culturalEtiquette: CulturalTip[];
  transportationTips: string[];
  bestTimeToVisit: string;
  hiddenGems: string[];
  emergencyNumbers: EmergencyContact[];
}

export interface Place {
  name: string;
  description: string;
  category: string;
  rating?: number;
  imageUrl?: string;
  address?: string;
}

export interface FoodItem {
  name: string;
  description: string;
  where?: string;
  mustTry: boolean;
}

export interface CulturalTip {
  category: string;
  tip: string;
  severity: "important" | "good-to-know" | "avoid";
}

export interface EmergencyContact {
  service: string;
  number: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: NearbyCategory;
  rating: number;
  distance: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  phone?: string;
  openNow?: boolean;
}

export type NearbyCategory =
  | "restaurant"
  | "cafe"
  | "hospital"
  | "police"
  | "attraction"
  | "metro"
  | "pharmacy"
  | "hotel";

export interface Phrase {
  id: string;
  category: PhraseCategory;
  english: string;
  translated: string;
  pronunciation: string;
  audioUrl?: string;
}

export type PhraseCategory =
  | "greetings"
  | "directions"
  | "food"
  | "emergency"
  | "transportation"
  | "shopping"
  | "accommodation";

export interface ItineraryDay {
  day: number;
  theme: string;
  morning: ItineraryActivity[];
  afternoon: ItineraryActivity[];
  evening: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  location: string;
  description: string;
  tips?: string;
  duration?: string;
}

export interface ItineraryRequest {
  location: string;
  days: number;
  interests: string[];
  budget: "budget" | "moderate" | "luxury";
  travelStyle: string;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "local";
  originalText: string;
  translatedText: string;
  originalLang: string;
  targetLang: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface CulturalIntelligence {
  location: string;
  greetingCustoms: string[];
  diningEtiquette: string[];
  socialNorms: string[];
  thingsToAvoid: string[];
  dresscode: string;
  tipping: string;
  religiousConsiderations?: string[];
}
