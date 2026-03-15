// Nominatim geocoding — free, no key required
import type { SelectedLocation } from "./map-types";

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<SelectedLocation | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { "Accept-Language": "en", "User-Agent": "Atlasia/1.0" } }
    );
    const data = await res.json();
    if (!data || data.error) return null;
    const addr = data.address || {};
    const name =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state ||
      data.display_name.split(",")[0];
    return { name, country: addr.country || "", lat, lng };
  } catch {
    return null;
  }
}

export async function forwardGeocode(
  query: string
): Promise<SelectedLocation[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
      { headers: { "Accept-Language": "en", "User-Agent": "Atlasia/1.0" } }
    );
    const data = await res.json();
    return (data || []).map(
      (f: {
        display_name: string;
        address?: {
          city?: string;
          town?: string;
          village?: string;
          county?: string;
          state?: string;
          country?: string;
        };
        lat: string;
        lon: string;
      }) => {
        const addr = f.address || {};
        const name =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.county ||
          addr.state ||
          f.display_name.split(",")[0];
        return {
          name,
          country:
            addr.country || f.display_name.split(",").pop()?.trim() || "",
          lat: parseFloat(f.lat),
          lng: parseFloat(f.lon),
        };
      }
    );
  } catch {
    return [];
  }
}
