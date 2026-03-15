"use client";

import { Crosshair, Plus, Minus, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { reverseGeocode } from "./map-geocoding";
import type { SelectedLocation } from "./map-types";

interface MapControlsProps {
  onLocate?: (loc: SelectedLocation) => void;
}

export function MapControls({ onLocate }: MapControlsProps) {
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = await reverseGeocode(
          pos.coords.latitude,
          pos.coords.longitude
        );
        if (loc) onLocate?.(loc);
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  const btn =
    "w-10 h-10 bg-stone-950/90 backdrop-blur-xl border border-stone-800/50 rounded-xl shadow-lg shadow-black/30 flex items-center justify-center cursor-pointer text-stone-400 hover:text-stone-100 hover:bg-stone-800/70 transition-colors duration-150 active:scale-[0.95]";

  return (
    <div className="fixed bottom-8 right-4 z-20 flex flex-col gap-2">
      {/* My Location */}
      <button onClick={handleLocate} className={btn} title="My location">
        {isLocating ? (
          <Loader2 size={16} className="animate-spin text-amber-500" />
        ) : (
          <Crosshair size={16} />
        )}
      </button>

      {/* Divider */}
      <div className="w-6 h-px bg-stone-800/60 mx-auto" />

      {/* Zoom controls — these are decorative since MapLibre/Leaflet have their own */}
      <button className={btn} title="Zoom in">
        <Plus size={16} />
      </button>
      <button className={btn} title="Zoom out">
        <Minus size={16} />
      </button>

      {/* Divider */}
      <div className="w-6 h-px bg-stone-800/60 mx-auto" />

      {/* Street view toggle */}
      <button className={btn} title="Street view">
        <Eye size={16} />
      </button>
    </div>
  );
}
