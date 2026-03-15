import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

type PlaceType =
  | "tourist_attraction"
  | "restaurant"
  | "museum"
  | "lodging"
  | "hospital"
  | "pharmacy"
  | "atm"
  | "transit_station";

const TYPE_MAP: Record<string, PlaceType> = {
  attractions: "tourist_attraction",
  restaurants: "restaurant",
  museums: "museum",
  hotels: "lodging",
  hospitals: "hospital",
  pharmacies: "pharmacy",
  atms: "atm",
  transit: "transit_station",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const type = searchParams.get("type") || "attractions";
    const radius = searchParams.get("radius") || "2000";

    if (!lat || !lng) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      // Return mock data when no API key is configured
      return NextResponse.json({ places: getMockPlaces(type), mock: true });
    }

    const placeType = TYPE_MAP[type] || "tourist_attraction";
    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", radius);
    url.searchParams.set("type", placeType);
    url.searchParams.set("key", GOOGLE_PLACES_API_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Google Places API error: ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Places error:", data.status, data.error_message);
      return NextResponse.json({ places: getMockPlaces(type), mock: true });
    }

    type GooglePlace = {
      place_id: string;
      name: string;
      vicinity?: string;
      rating?: number;
      user_ratings_total?: number;
      opening_hours?: { open_now?: boolean };
      photos?: { photo_reference: string }[];
      types?: string[];
      geometry: { location: { lat: number; lng: number } };
    };

    const places = (data.results || []).slice(0, 12).map((place: GooglePlace) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || "",
      rating: place.rating || null,
      reviewCount: place.user_ratings_total || 0,
      openNow: place.opening_hours?.open_now ?? null,
      photoReference: place.photos?.[0]?.photo_reference || null,
      types: place.types || [],
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    }));

    return NextResponse.json({ places });
  } catch (error) {
    console.error("Nearby places error:", error);
    return NextResponse.json({ error: "Failed to fetch nearby places" }, { status: 500 });
  }
}

function getMockPlaces(type: string) {
  const labels: Record<string, string[]> = {
    attractions: ["City Park", "Historic Square", "View Point", "Cultural Center"],
    restaurants: ["Local Bistro", "Street Food Market", "Rooftop Restaurant", "Traditional Eatery"],
    museums: ["National Museum", "Art Gallery", "History Museum", "Science Center"],
    hotels: ["Grand Hotel", "Boutique Inn", "City Hostel", "Resort & Spa"],
    hospitals: ["Central Hospital", "City Medical Center", "Emergency Clinic"],
    pharmacies: ["City Pharmacy", "24h Drugstore", "Health Clinic"],
    atms: ["Bank ATM", "Exchange Booth", "Cash Point"],
    transit: ["Central Station", "Bus Terminal", "Metro Stop"],
  };

  return (labels[type] || labels.attractions).map((name, i) => ({
    id: `mock-${type}-${i}`,
    name,
    address: "Near your location",
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    reviewCount: Math.floor(Math.random() * 500) + 50,
    openNow: Math.random() > 0.3,
    photoReference: null,
    types: [type],
    lat: null,
    lng: null,
  }));
}
