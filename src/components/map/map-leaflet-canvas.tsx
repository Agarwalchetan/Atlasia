"use client";

import { useEffect, useRef, useState } from "react";
import { reverseGeocode } from "./map-geocoding";
import type { MapCanvasProps } from "./map-canvas";

// ---------------------------------------------------------------------------
// Leaflet map — CARTO dark tiles, pure OSM, zero keys
// ---------------------------------------------------------------------------
export function LeafletCanvas({ onLocationSelect, flyTo, markerPos }: MapCanvasProps) {
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
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      map.on("click", async (e: { latlng: { lat: number; lng: number } }) => {
        if (cancelled) return;
        const loc = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        if (loc) onLocationSelect(loc);
      });

      mapRef.current = map;
      setLoaded(true);
    })();
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom, { duration: 1.8 });
  }, [flyTo]);

  useEffect(() => {
    if (!markerPos || !mapRef.current) return;
    import("leaflet").then(({ default: L }) => {
      markerRef.current?.remove();
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;position:relative;background:linear-gradient(135deg,#d97706,#0d9488);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 4px 16px rgba(217,119,6,0.5);">
          <svg style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:rotate(45deg);margin:auto;padding:6px;" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
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
      <div ref={containerRef} className="absolute inset-0" />
      {!loaded && (
        <div className="absolute inset-0 map-canvas-placeholder flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-stone-500 text-sm font-medium">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
}
