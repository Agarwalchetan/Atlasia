// Shared types and constants for the map module

export interface SelectedLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export const POPULAR_LOCATIONS = [
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018 },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
];

export const CATEGORY_FILTERS = [
  { id: "restaurants", label: "Restaurants", icon: "UtensilsCrossed" as const },
  { id: "hotels", label: "Hotels", icon: "Hotel" as const },
  { id: "attractions", label: "Things to do", icon: "Compass" as const },
  { id: "museums", label: "Museums", icon: "Landmark" as const },
  { id: "shopping", label: "Shopping", icon: "ShoppingBag" as const },
  { id: "cafes", label: "Cafés", icon: "Coffee" as const },
  { id: "nightlife", label: "Nightlife", icon: "Wine" as const },
  { id: "parks", label: "Parks", icon: "TreePine" as const },
  { id: "transit", label: "Transit", icon: "Train" as const },
  { id: "pharmacies", label: "Pharmacies", icon: "Pill" as const },
];
