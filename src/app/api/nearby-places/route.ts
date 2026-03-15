import { NextRequest, NextResponse } from "next/server";

// Overpass API — OpenStreetMap, completely free, no key required
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Maps our type names to Overpass QL filter expressions
const OVERPASS_FILTERS: Record<string, string> = {
  attractions: `node["tourism"~"attraction|viewpoint|artwork|theme_park|zoo|aquarium|gallery"](around:{r},{lat},{lng});
               node["historic"~"monument|memorial|castle|ruins|building|archaeological_site"](around:{r},{lat},{lng});`,
  restaurants: `node["amenity"~"restaurant|cafe|fast_food|food_court|bar|pub|bistro"](around:{r},{lat},{lng});`,
  museums:     `node["tourism"~"museum|gallery"](around:{r},{lat},{lng});
               way["tourism"~"museum|gallery"](around:{r},{lat},{lng});`,
  hotels:      `node["tourism"~"hotel|hostel|guest_house|motel|apartment|camp_site"](around:{r},{lat},{lng});`,
  hospitals:   `node["amenity"~"hospital|clinic|doctors|dentist"](around:{r},{lat},{lng});
               way["amenity"~"hospital|clinic"](around:{r},{lat},{lng});`,
  pharmacies:  `node["amenity"="pharmacy"](around:{r},{lat},{lng});`,
  atms:        `node["amenity"~"atm|bank"](around:{r},{lat},{lng});`,
  transit:     `node["railway"~"station|halt|tram_stop"](around:{r},{lat},{lng});
               node["public_transport"~"station|stop_position"](around:{r},{lat},{lng});
               node["highway"="bus_stop"](around:{r},{lat},{lng});`,
};

type OSMElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function buildQuery(type: string, lat: string, lng: string, radius: string): string {
  const filter = (OVERPASS_FILTERS[type] || OVERPASS_FILTERS.attractions)
    .replaceAll("{lat}", lat)
    .replaceAll("{lng}", lng)
    .replaceAll("{r}", radius);

  return `[out:json][timeout:15];
(
  ${filter}
);
out body center 15;`;
}

function inferCategory(tags: Record<string, string>): string {
  if (tags.amenity) return tags.amenity;
  if (tags.tourism) return tags.tourism;
  if (tags.historic) return tags.historic;
  if (tags.railway) return tags.railway;
  if (tags.public_transport) return tags.public_transport;
  if (tags.highway) return tags.highway;
  return "place";
}

function buildAddress(tags: Record<string, string>): string {
  const parts: string[] = [];
  if (tags["addr:housenumber"] && tags["addr:street"]) {
    parts.push(`${tags["addr:street"]} ${tags["addr:housenumber"]}`);
  } else if (tags["addr:street"]) {
    parts.push(tags["addr:street"]);
  }
  if (tags["addr:city"]) parts.push(tags["addr:city"]);
  return parts.join(", ");
}

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

    const query = buildQuery(type, lat, lng, radius);

    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      throw new Error(`Overpass API error: ${res.status}`);
    }

    const data = await res.json();
    const elements: OSMElement[] = data.elements || [];

    // Deduplicate by name, filter unnamed, cap at 15
    const seen = new Set<string>();
    const places = elements
      .filter((el) => {
        const name = el.tags?.name;
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .slice(0, 15)
      .map((el) => {
        const tags = el.tags || {};
        const elLat = el.lat ?? el.center?.lat ?? null;
        const elLng = el.lon ?? el.center?.lon ?? null;
        return {
          id: `osm-${el.type}-${el.id}`,
          name: tags.name,
          address: buildAddress(tags),
          rating: null,           // OSM doesn't have ratings
          reviewCount: 0,
          openNow: tags.opening_hours ? null : null,
          openingHours: tags.opening_hours || null,
          website: tags.website || tags["contact:website"] || null,
          phone: tags.phone || tags["contact:phone"] || null,
          types: [inferCategory(tags)],
          lat: elLat,
          lng: elLng,
          osmId: el.id,
          osmType: el.type,
        };
      });

    return NextResponse.json({ places, source: "openstreetmap" });
  } catch (error) {
    console.error("Nearby places (Overpass) error:", error);
    // Graceful fallback to mock data on timeout or network error
    const type = new URL(req.url).searchParams.get("type") || "attractions";
    return NextResponse.json({ places: getMockPlaces(type), mock: true, source: "mock" });
  }
}

function getMockPlaces(type: string) {
  const labels: Record<string, string[]> = {
    attractions: ["City Park", "Historic Square", "Viewpoint", "Cultural Center"],
    restaurants: ["Local Bistro", "Street Food Market", "Rooftop Restaurant", "Traditional Eatery"],
    museums:     ["National Museum", "Art Gallery", "History Museum", "Science Center"],
    hotels:      ["Grand Hotel", "Boutique Inn", "City Hostel", "Resort & Spa"],
    hospitals:   ["Central Hospital", "City Medical Center", "Emergency Clinic"],
    pharmacies:  ["City Pharmacy", "24h Drugstore", "Health Clinic"],
    atms:        ["Bank ATM", "Exchange Booth", "Cash Point"],
    transit:     ["Central Station", "Bus Terminal", "Metro Stop"],
  };

  return (labels[type] || labels.attractions).map((name, i) => ({
    id: `mock-${type}-${i}`,
    name,
    address: "Near your location",
    rating: null,
    reviewCount: 0,
    openNow: null,
    openingHours: null,
    website: null,
    phone: null,
    types: [type],
    lat: null,
    lng: null,
    osmId: null,
    osmType: null,
  }));
}
