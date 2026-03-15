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
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
];

export const CATEGORY_ICONS: Record<string, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  hospital: "🏥",
  police: "🚔",
  attraction: "🎯",
  metro: "🚇",
  pharmacy: "💊",
  hotel: "🏨",
};

export const PHRASE_CATEGORIES = [
  { id: "greetings", label: "Greetings", icon: "👋" },
  { id: "directions", label: "Directions", icon: "🗺️" },
  { id: "food", label: "Food & Dining", icon: "🍜" },
  { id: "emergency", label: "Emergency", icon: "🆘" },
  { id: "transportation", label: "Transportation", icon: "🚌" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "accommodation", label: "Accommodation", icon: "🏨" },
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
