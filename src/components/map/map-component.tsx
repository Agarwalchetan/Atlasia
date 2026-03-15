"use client";

import { useState, useCallback, useRef } from "react";
import { Map as MapIcon, Layers } from "lucide-react";
import { MapSearchBar } from "./map-search-bar";
import { MapIconRail } from "./map-icon-rail";
import { MapCategoryPills } from "./map-category-pills";
import { MapPlacePanel } from "./map-place-panel";
import { MapControls } from "./map-controls";
import { MapLibreCanvas } from "./map-canvas";
import { LeafletCanvas } from "./map-leaflet-canvas";
import { POPULAR_LOCATIONS } from "./map-types";
import type { SelectedLocation } from "./map-types";

export function MapComponent() {
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number; name: string } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);

  const handleLocationSelect = useCallback((loc: SelectedLocation) => {
    setSelectedLocation(loc);
    setShowPanel(true);
    setFlyTo({ lat: loc.lat, lng: loc.lng, zoom: 11 });
    setMarkerPos({ lat: loc.lat, lng: loc.lng, name: loc.name });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapReady = useCallback((map: any) => {
    mapInstanceRef.current = map;
  }, []);

  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut();
  }, []);

  const handleStreetView = useCallback(() => {
    if (!mapInstanceRef.current) return;
    // Both MapLibre and Leaflet expose getCenter() returning { lat, lng }
    const center = mapInstanceRef.current.getCenter();
    const lat = center.lat;
    // MapLibre uses center.lng, Leaflet uses center.lng too
    const lng = center.lng ?? center.lon;
    window.open(
      `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Map canvas — fills entire viewport, z-0 */}
      {MAPTILER_KEY ? (
        <MapLibreCanvas
          onLocationSelect={handleLocationSelect}
          flyTo={flyTo}
          markerPos={markerPos}
          onMapReady={handleMapReady}
        />
      ) : (
        <LeafletCanvas
          onLocationSelect={handleLocationSelect}
          flyTo={flyTo}
          markerPos={markerPos}
          onMapReady={handleMapReady}
        />
      )}

      {/* Left icon rail */}
      <MapIconRail />

      {/* Floating search bar */}
      <MapSearchBar onSelectLocation={handleLocationSelect} />

      {/* Category filter pills */}
      <MapCategoryPills />

      {/* Left sliding place detail panel */}
      <MapPlacePanel
        location={selectedLocation}
        open={showPanel}
        onClose={() => setShowPanel(false)}
      />

      {/* Bottom-right map controls */}
      <MapControls
        onLocate={handleLocationSelect}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onStreetView={handleStreetView}
      />

      {/* Bottom-left: Layers button */}
      <div className="fixed bottom-4 left-[72px] z-20 max-md:left-4">
        <button className="flex items-center gap-1.5 px-3 py-2 bg-stone-950/90 backdrop-blur-xl border border-stone-800/50 rounded-xl shadow-lg shadow-black/30 text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800/70 transition-colors duration-150 cursor-pointer">
          <Layers size={14} />
          Layers
        </button>
      </div>

      {/* Provider badge — bottom center */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-950/70 backdrop-blur-md border border-stone-800/50 text-stone-600 text-[10px]">
          <MapIcon size={10} />
          {MAPTILER_KEY ? "MapLibre GL · MapTiler" : "Leaflet · OpenStreetMap · CARTO"}
        </div>
      </div>

      {/* Bottom quick-select chips (popular locations) */}
      <div className="fixed bottom-14 left-[72px] right-16 z-20 max-md:left-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {POPULAR_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleLocationSelect(loc)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-xl border border-stone-800/50 text-stone-500 hover:text-stone-100 hover:bg-stone-800/70 hover:border-stone-700/60 transition-colors duration-150 text-xs font-medium cursor-pointer active:scale-[0.97]"
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
