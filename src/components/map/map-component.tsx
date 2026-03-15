"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Locate,
  X,
  MapPin,
  Loader2,
  BookOpen,
  Languages,
  AlertTriangle,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SelectedLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const POPULAR_LOCATIONS = [
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, emoji: "🗼" },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522, emoji: "🗺️" },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.006, emoji: "🗽" },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, emoji: "🏙️" },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lng: 100.5018, emoji: "⛩️" },
  { name: "Rome", country: "Italy", lat: 41.9028, lng: 12.4964, emoji: "🏛️" },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, emoji: "🦘" },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, emoji: "🇮🇳" },
];

// ---------------------------------------------------------------------------
// Nominatim geocoding (free, no key required)
// ---------------------------------------------------------------------------
async function reverseGeocode(lat: number, lng: number): Promise<SelectedLocation | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { "Accept-Language": "en", "User-Agent": "Atlasia/1.0" } }
    );
    const data = await res.json();
    if (!data || data.error) return null;
    const addr = data.address || {};
    const name =
      addr.city || addr.town || addr.village || addr.county || addr.state || data.display_name.split(",")[0];
    return { name, country: addr.country || "", lat, lng };
  } catch {
    return null;
  }
}

async function forwardGeocode(query: string): Promise<SelectedLocation[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
      { headers: { "Accept-Language": "en", "User-Agent": "Atlasia/1.0" } }
    );
    const data = await res.json();
    return (data || []).map((f: {
      display_name: string;
      address?: { city?: string; town?: string; village?: string; county?: string; state?: string; country?: string };
      lat: string;
      lon: string;
    }) => {
      const addr = f.address || {};
      const name = addr.city || addr.town || addr.village || addr.county || addr.state || f.display_name.split(",")[0];
      return {
        name,
        country: addr.country || f.display_name.split(",").pop()?.trim() || "",
        lat: parseFloat(f.lat),
        lng: parseFloat(f.lon),
      };
    });
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Shared UI overlay: search, location panel, quick-select
// ---------------------------------------------------------------------------
function MapUI({
  selectedLocation,
  showPanel,
  setShowPanel,
  onSelectLocation,
}: {
  selectedLocation: SelectedLocation | null;
  showPanel: boolean;
  setShowPanel: (v: boolean) => void;
  onSelectLocation: (loc: SelectedLocation) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<SelectedLocation[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await forwardGeocode(searchQuery);
    setIsSearching(false);
    if (results.length === 1) {
      onSelectLocation(results[0]);
      setSearchQuery("");
    } else {
      setSearchResults(results);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (loc) onSelectLocation(loc);
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  return (
    <>
      {/* Search bar — floating pill with prominent shadow (Google Maps design language) */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search any city or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-stone-950/90 border border-stone-800/60 backdrop-blur-xl text-stone-50 placeholder:text-stone-500 text-sm outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 shadow-xl shadow-black/30 transition-colors"
          />
          {isSearching && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin" />
          )}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full mt-2 left-0 right-0 bg-stone-950/95 backdrop-blur-xl border border-stone-800/60 rounded-xl overflow-hidden shadow-2xl shadow-black/40"
              >
                {searchResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectLocation(result);
                      setSearchResults([]);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-800/60 transition-colors text-left cursor-pointer border-b border-stone-800/40 last:border-0"
                  >
                    <MapPin size={14} className="text-amber-500 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-stone-50">{result.name}</div>
                      <div className="text-xs text-stone-500">{result.country}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button onClick={handleSearch} size="icon" className="shrink-0 h-11 w-11 shadow-lg shadow-black/30">
          <Search size={16} />
        </Button>
        <Button
          onClick={handleLocate}
          size="icon"
          variant="glass"
          className="shrink-0 h-11 w-11"
          disabled={isLocating}
        >
          {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Locate size={16} />}
        </Button>
      </div>

      {/* Quick select — elevated drawer sheet */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => onSelectLocation(loc)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-950/80 backdrop-blur-xl border border-stone-800/60 text-stone-400 hover:text-stone-50 hover:bg-stone-900/90 hover:border-stone-700/80 transition-colors text-sm font-medium cursor-pointer active:scale-[0.97]"
            >
              <span>{loc.emoji}</span>
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Location panel — floating card with shadow-2xl (Google Maps design language) */}
      <AnimatePresence>
        {showPanel && selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 right-4 z-[1000] w-80"
          >
            <Card className="shadow-2xl shadow-black/40">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold font-[family-name:var(--font-sora)] text-stone-50 text-lg">{selectedLocation.name}</h3>
                    <p className="text-sm text-stone-400">{selectedLocation.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-stone-500 hover:text-stone-50 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="text-sm text-stone-400 mb-4">
                <span className="text-stone-500">Coordinates: </span>
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Link href={`/travel-guide?location=${encodeURIComponent(selectedLocation.name + ", " + selectedLocation.country)}`}>
                  <Button className="w-full gap-2 justify-start">
                    <BookOpen size={16} />
                    View Travel Guide
                  </Button>
                </Link>
                <Link href={`/phrases?lang=${encodeURIComponent(selectedLocation.country)}`}>
                  <Button variant="glass" className="w-full gap-2 justify-start">
                    <Languages size={16} />
                    Phrase Assistant
                  </Button>
                </Link>
                <Link href="/emergency">
                  <Button variant="outline" className="w-full gap-2 justify-start">
                    <AlertTriangle size={16} />
                    Emergency Mode
                  </Button>
                </Link>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="info">
                  {selectedLocation.lat > 0 ? "N" : "S"}{Math.abs(selectedLocation.lat).toFixed(2)}
                </Badge>
                <Badge variant="outline">
                  {selectedLocation.lng > 0 ? "E" : "W"}{Math.abs(selectedLocation.lng).toFixed(2)}
                </Badge>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// MapLibre GL map — MapTiler tiles, globe projection
// Fixed for MapLibre GL v5:
//   CSS imported from local node_modules (no race condition)
//   Globe set via map.setProjection({ type: "globe" }) after load
//   setFog removed (does not exist in v5)
//   MapTiler style URL corrected
// ---------------------------------------------------------------------------
function MapLibreMap({
  onLocationSelect,
  flyTo,
  markerPos,
}: {
  onLocationSelect: (loc: SelectedLocation) => void;
  flyTo: { lat: number; lng: number; zoom: number } | null;
  markerPos: { lat: number; lng: number; name: string } | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY!;

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    (async () => {
      try {
        const { default: maplibregl } = await import("maplibre-gl");

        if (cancelled || !containerRef.current) return;

        // MapTiler v2 style endpoint — works with all MapTiler free-tier keys
        const styleUrl = `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`;

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: styleUrl,
          center: [0, 20],
          zoom: 1.8,
        });

        map.addControl(new maplibregl.NavigationControl(), "bottom-right");
        map.addControl(new maplibregl.ScaleControl(), "bottom-left");

        map.on("load", () => {
          if (cancelled) return;

          // v5 API: setProjection must be called after load, via method (not constructor option)
          map.setProjection({ type: "globe" });

          setLoaded(true);
        });

        map.on("error", (e) => {
          console.error("MapLibre error:", e);
          if (!loaded) setError("Failed to load map tiles. Check your MapTiler key.");
        });

        map.on("click", async (e: { lngLat: { lat: number; lng: number } }) => {
          const { lat, lng } = e.lngLat;
          const loc = await reverseGeocode(lat, lng);
          if (loc && !cancelled) onLocationSelect(loc);
        });

        mapRef.current = map;
      } catch (err) {
        console.error("MapLibre init error:", err);
        setError("Map failed to initialize.");
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fly to
  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom,
      duration: 1800,
      essential: true,
    });
  }, [flyTo]);

  // Marker — amber/teal accent instead of default blue/red
  useEffect(() => {
    if (!markerPos || !mapRef.current) return;
    import("maplibre-gl").then(({ default: maplibregl }) => {
      markerRef.current?.remove();

      const el = document.createElement("div");
      el.style.cssText = `
        width:36px;height:36px;position:relative;
        background:linear-gradient(135deg,#d97706,#0d9488);
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid white;
        box-shadow:0 4px 20px rgba(217,119,6,0.5);
        cursor:pointer;
      `;
      const inner = document.createElement("div");
      inner.style.cssText =
        "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);font-size:14px;";
      inner.textContent = "📍";
      el.appendChild(inner);

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([markerPos.lng, markerPos.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
            `<div style="padding:4px 0;color:white;font-weight:600;font-size:14px;">${markerPos.name}</div>`
          )
        )
        .addTo(mapRef.current);
    });
  }, [markerPos]);

  if (error) {
    return (
      <div className="absolute inset-0 bg-stone-900 rounded-2xl flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <MapIcon size={40} className="mx-auto mb-4 text-rose-400 opacity-60" />
          <p className="text-stone-400 text-sm">{error}</p>
          <p className="text-stone-500 text-xs mt-2">Falling back to Leaflet mode — remove the key to use it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0 rounded-2xl overflow-hidden" />
      {!loaded && (
        <div className="absolute inset-0 bg-stone-950 rounded-2xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-stone-400 text-sm">Loading globe...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Leaflet map — CARTO dark tiles, pure OSM, zero keys
// ---------------------------------------------------------------------------
function LeafletMap({
  onLocationSelect,
  flyTo,
  markerPos,
}: {
  onLocationSelect: (loc: SelectedLocation) => void;
  flyTo: { lat: number; lng: number; zoom: number } | null;
  markerPos: { lat: number; lng: number; name: string } | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !containerRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, { center: [20, 0], zoom: 2, zoomControl: false });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.scale({ position: "bottomleft" }).addTo(map);

      map.on("click", async (e: { latlng: { lat: number; lng: number } }) => {
        if (cancelled) return;
        const loc = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        if (loc) onLocationSelect(loc);
      });

      mapRef.current = map;
      setLoaded(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom, { duration: 1.8 });
  }, [flyTo]);

  // Marker — amber/teal accent instead of default blue/red
  useEffect(() => {
    if (!markerPos || !mapRef.current) return;
    import("leaflet").then(({ default: L }) => {
      markerRef.current?.remove();
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;position:relative;background:linear-gradient(135deg,#d97706,#0d9488);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 4px 16px rgba(217,119,6,0.5);">
          <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);font-size:12px;">📍</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [0, 32],
        popupAnchor: [16, -32],
      });
      markerRef.current = L.marker([markerPos.lat, markerPos.lng], { icon })
        .bindPopup(`<b style="color:#d97706">${markerPos.name}</b>`)
        .addTo(mapRef.current)
        .openPopup();
    });
  }, [markerPos]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0 rounded-2xl overflow-hidden" />
      {!loaded && (
        <div className="absolute inset-0 bg-stone-950 rounded-2xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-stone-400 text-sm">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function MapComponent() {
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number; name: string } | null>(null);

  const handleLocationSelect = useCallback((loc: SelectedLocation) => {
    setSelectedLocation(loc);
    setShowPanel(true);
    setFlyTo({ lat: loc.lat, lng: loc.lng, zoom: 11 });
    setMarkerPos({ lat: loc.lat, lng: loc.lng, name: loc.name });
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Provider badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1100] pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/70 backdrop-blur-md border border-stone-800/60 text-stone-500 text-xs">
          <MapIcon size={10} />
          {MAPTILER_KEY ? "MapLibre GL · MapTiler · Globe" : "Leaflet · OpenStreetMap · CARTO"}
        </div>
      </div>

      {MAPTILER_KEY ? (
        <MapLibreMap
          onLocationSelect={handleLocationSelect}
          flyTo={flyTo}
          markerPos={markerPos}
        />
      ) : (
        <LeafletMap
          onLocationSelect={handleLocationSelect}
          flyTo={flyTo}
          markerPos={markerPos}
        />
      )}

      <MapUI
        selectedLocation={selectedLocation}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        onSelectLocation={handleLocationSelect}
      />
    </div>
  );
}
