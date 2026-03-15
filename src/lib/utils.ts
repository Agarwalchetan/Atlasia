import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "circle-flags:gb" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "circle-flags:jp" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "circle-flags:cn" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "circle-flags:es" },
  { code: "fr", name: "French", nativeName: "Français", flag: "circle-flags:fr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "circle-flags:de" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "circle-flags:it" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "circle-flags:pt" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "circle-flags:sa" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "circle-flags:in" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "circle-flags:kr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "circle-flags:ru" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "circle-flags:tr" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "circle-flags:th" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "circle-flags:vn" },
];

export const CATEGORY_ICONS: Record<string, string> = {
  restaurant: "Utensils",
  cafe: "Coffee",
  hospital: "Hospital",
  police: "ShieldAlert",
  attraction: "Landmark",
  metro: "Train",
  pharmacy: "Pill",
  hotel: "BedDouble",
};

export const PHRASE_CATEGORIES = [
  { id: "greetings", label: "Greetings", icon: "HandMetal" },
  { id: "directions", label: "Directions", icon: "Map" },
  { id: "food", label: "Food & Dining", icon: "Utensils" },
  { id: "emergency", label: "Emergency", icon: "Siren" },
  { id: "transportation", label: "Transportation", icon: "Bus" },
  { id: "shopping", label: "Shopping", icon: "ShoppingBag" },
  { id: "accommodation", label: "Accommodation", icon: "BedDouble" },
];

export const TRAVEL_INTERESTS = [
  "History & Culture",
  "Food & Cuisine",
  "Art & Museums",
  "Nature & Outdoors",
  "Nightlife & Entertainment",
  "Shopping",
  "Architecture",
  "Local Markets",
  "Sports & Adventure",
  "Relaxation & Wellness",
];
