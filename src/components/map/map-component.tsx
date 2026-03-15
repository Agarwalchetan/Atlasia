"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SelectedLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
  description?: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

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

export function MapComponent() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<SelectedLocation[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  const addMarker = useCallback((lat: number, lng: number, name: string) => {
    if (!mapRef.current) return;
    if (markerRef.current) markerRef.current.remove();

    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
      <div style="
        width: 40px; height: 40px;
        background: linear-gradient(135deg, #0ea5e9, #6366f1);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 20px rgba(14,165,233,0.5);
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <div style="
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          transform: rotate(45deg);
          font-size: 16px;
        ">📍</div>
      </div>
    `;

    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      className: "atlasia-popup",
    }).setHTML(`
      <div style="padding: 4px 0;">
        <div style="font-weight: 600; font-size: 14px; color: white;">${name}</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px;">Selected location</div>
      </div>
    `);

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(mapRef.current);
  }, []);

  const handleLocationSelect = useCallback(
    (loc: SelectedLocation) => {
      setSelectedLocation(loc);
      setShowPanel(true);
      setSearchResults([]);
      setSearchQuery("");

      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [loc.lng, loc.lat],
          zoom: 11,
          duration: 1800,
          essential: true,
        });
        addMarker(loc.lat, loc.lng, loc.name);
      }
    },
    [addMarker]
  );

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.8,
      projection: "globe",
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    map.addControl(new mapboxgl.ScaleControl(), "bottom-left");

    map.on("load", () => {
      map.setFog({
        color: "rgba(14,165,233,0.05)",
        "high-color": "rgba(99,102,241,0.1)",
        "horizon-blend": 0.1,
        "space-color": "#020817",
        "star-intensity": 0.8,
      });

      map.setPaintProperty("land", "background-color", "#0f172a");
      map.setPaintProperty("water", "fill-color", "#020817");

      setIsMapLoaded(true);
    });

    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      setIsSearching(true);

      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place,country,region`
        );
        const data = await res.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const name = feature.text || feature.place_name.split(",")[0];
          const countryContext = feature.context?.find(
            (c: { id: string; text: string }) => c.id.startsWith("country")
          );
          const country = countryContext?.text || feature.place_name.split(",").pop()?.trim() || "Unknown";

          handleLocationSelect({ name, country, lat, lng });
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      } finally {
        setIsSearching(false);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [handleLocationSelect]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&types=place,country,region&limit=5`
      );
      const data = await res.json();

      if (data.features) {
        const results: SelectedLocation[] = data.features.map(
          (f: { text: string; place_name: string; context?: { id: string; text: string }[]; center: [number, number] }) => ({
            name: f.text,
            country: f.context?.find((c) => c.id.startsWith("country"))?.text || f.place_name.split(",").pop()?.trim() || "",
            lat: f.center[1],
            lng: f.center[0],
          })
        );
        setSearchResults(results);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=place,region`
          );
          const data = await res.json();
          if (data.features?.length > 0) {
            const f = data.features[0];
            const countryCtx = f.context?.find((c: { id: string; text: string }) => c.id.startsWith("country"));
            handleLocationSelect({
              name: f.text,
              country: countryCtx?.text || "",
              lat,
              lng,
            });
          }
        } finally {
          setIsLocating(false);
        }
      },
      () => setIsLocating(false)
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 rounded-2xl overflow-hidden" />

      {/* Loading overlay */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-slate-950 rounded-2xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            <span className="text-white/50 text-sm">Loading map...</span>
          </div>
        </div>
      )}

      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-slate-900 rounded-2xl flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <MapPin size={48} className="mx-auto mb-4 text-sky-400 opacity-50" />
            <h3 className="text-lg font-semibold text-white mb-2">Mapbox Token Required</h3>
            <p className="text-white/50 text-sm">
              Add your <code className="bg-white/10 px-1.5 py-0.5 rounded text-sky-400">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
              <code className="bg-white/10 px-1.5 py-0.5 rounded text-sky-400">.env.local</code> to enable the interactive map.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search any city or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950/90 border border-white/15 backdrop-blur-xl text-white placeholder:text-white/40 text-sm outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 shadow-xl"
          />
          {isSearching && (
            <Loader2
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 animate-spin"
            />
          )}
          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full mt-2 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                {searchResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => handleLocationSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left cursor-pointer border-b border-white/5 last:border-0"
                  >
                    <MapPin size={14} className="text-sky-400 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-white">{result.name}</div>
                      <div className="text-xs text-white/40">{result.country}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Button
          onClick={handleSearch}
          size="icon"
          className="shrink-0 h-11 w-11 shadow-lg"
        >
          <Search size={16} />
        </Button>
        <Button
          onClick={handleLocate}
          size="icon"
          variant="glass"
          className="shrink-0 h-11 w-11"
          disabled={isLocating}
        >
          {isLocating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Locate size={16} />
          )}
        </Button>
      </div>

      {/* Quick Select */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleLocationSelect(loc)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-slate-900/90 hover:border-white/20 transition-all text-sm font-medium cursor-pointer"
            >
              <span>{loc.emoji}</span>
              {loc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Location Panel */}
      <AnimatePresence>
        {showPanel && selectedLocation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 right-4 z-10 w-80"
          >
            <Card className="shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedLocation.name}</h3>
                    <p className="text-sm text-white/50">{selectedLocation.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm text-white/50 mb-4">
                <span className="text-white/30">Coordinates: </span>
                {selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Link
                  href={`/travel-guide?location=${encodeURIComponent(selectedLocation.name + ", " + selectedLocation.country)}`}
                >
                  <Button className="w-full gap-2 justify-start">
                    <BookOpen size={16} />
                    View Travel Guide
                  </Button>
                </Link>
                <Link
                  href={`/phrases?lang=${encodeURIComponent(selectedLocation.country)}`}
                >
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
                  {selectedLocation.lat > 0 ? "N" : "S"}{Math.abs(selectedLocation.lat).toFixed(2)}°
                </Badge>
                <Badge variant="outline">
                  {selectedLocation.lng > 0 ? "E" : "W"}{Math.abs(selectedLocation.lng).toFixed(2)}°
                </Badge>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
