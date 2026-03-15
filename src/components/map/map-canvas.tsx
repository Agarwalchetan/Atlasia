"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import { reverseGeocode } from "./map-geocoding";
import type { SelectedLocation } from "./map-types";

// ---------------------------------------------------------------------------
// Shared props for both map renderers
// ---------------------------------------------------------------------------
export interface MapCanvasProps {
  onLocationSelect: (loc: SelectedLocation) => void;
  flyTo: { lat: number; lng: number; zoom: number } | null;
  markerPos: { lat: number; lng: number; name: string } | null;
}

// ---------------------------------------------------------------------------
// Custom marker element (amber/teal pin — shared between both renderers)
// ---------------------------------------------------------------------------
function createMarkerElement(): HTMLDivElement {
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
    "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);";

  // SVG pin icon instead of emoji
  inner.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  el.appendChild(inner);
  return el;
}

// ---------------------------------------------------------------------------
// Loading placeholder
// ---------------------------------------------------------------------------
function MapLoading({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 map-canvas-placeholder flex items-center justify-center z-10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        <span className="text-stone-500 text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MapLibre GL — MapTiler tiles, globe projection
// ---------------------------------------------------------------------------
export function MapLibreCanvas({ onLocationSelect, flyTo, markerPos }: MapCanvasProps) {
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
        const map = new maplibregl.Map({
          container: containerRef.current,
          style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_KEY}`,
          center: [0, 20],
          zoom: 1.8,
        });
        // Hide default controls — we render our own
        map.on("load", () => {
          if (cancelled) return;
          map.setProjection({ type: "globe" });
          setLoaded(true);
        });
        map.on("error", (e) => {
          console.error("MapLibre error:", e);
          if (!loaded) setError("Failed to load map tiles.");
        });
        map.on("click", async (e: { lngLat: { lat: number; lng: number } }) => {
          const loc = await reverseGeocode(e.lngLat.lat, e.lngLat.lng);
          if (loc && !cancelled) onLocationSelect(loc);
        });
        mapRef.current = map;
      } catch (err) {
        console.error("MapLibre init error:", err);
        setError("Map failed to initialize.");
      }
    })();
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({ center: [flyTo.lng, flyTo.lat], zoom: flyTo.zoom, duration: 1800, essential: true });
  }, [flyTo]);

  useEffect(() => {
    if (!markerPos || !mapRef.current) return;
    import("maplibre-gl").then(({ default: maplibregl }) => {
      markerRef.current?.remove();
      markerRef.current = new maplibregl.Marker({ element: createMarkerElement() })
        .setLngLat([markerPos.lng, markerPos.lat])
        .setPopup(new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(
          `<div style="padding:4px 0;color:white;font-weight:600;font-size:14px;">${markerPos.name}</div>`
        ))
        .addTo(mapRef.current);
    });
  }, [markerPos]);

  if (error) {
    return (
      <div className="absolute inset-0 bg-stone-900 flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <MapIcon size={40} className="mx-auto mb-4 text-rose-400 opacity-60" />
          <p className="text-stone-400 text-sm">{error}</p>
          <p className="text-stone-500 text-xs mt-2">Falling back to Leaflet mode.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />
      {!loaded && <MapLoading label="Loading globe..." />}
    </div>
  );
}
