"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Loader2 } from "lucide-react";
import { forwardGeocode } from "./map-geocoding";
import type { SelectedLocation } from "./map-types";

interface MapSearchBarProps {
  onSelectLocation: (loc: SelectedLocation) => void;
}

export function MapSearchBar({ onSelectLocation }: MapSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SelectedLocation[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    const found = await forwardGeocode(query);
    setIsSearching(false);
    if (found.length === 1) {
      onSelectLocation(found[0]);
      setQuery("");
      setResults([]);
    } else {
      setResults(found);
    }
  };

  const handleSelect = (loc: SelectedLocation) => {
    onSelectLocation(loc);
    setResults([]);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="fixed top-3 left-[72px] right-4 z-30 lg:right-4 max-sm:left-4">
      <div className="relative max-w-2xl">
        {/* Pill-shaped search input */}
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 z-10"
        />
        <input
          type="text"
          placeholder="Search any city or country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full h-12 pl-11 pr-20 rounded-full bg-stone-950/90 backdrop-blur-xl border border-stone-800/60 text-stone-50 placeholder:text-stone-500 text-sm font-medium outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:shadow-xl shadow-lg shadow-black/40 transition-shadow duration-200"
        />

        {/* Right side actions */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isSearching && (
            <Loader2
              size={16}
              className="text-amber-500 animate-spin"
            />
          )}
          {query && !isSearching && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-full hover:bg-stone-800/60 text-stone-500 hover:text-stone-200 transition-colors duration-150 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="p-2 rounded-full bg-amber-600 hover:bg-amber-500 text-white transition-colors duration-150 cursor-pointer active:scale-[0.95]"
          >
            <Search size={14} />
          </button>
        </div>

        {/* Search results dropdown */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 right-0 bg-stone-950/95 backdrop-blur-xl border border-stone-800/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
            >
              {results.map((result, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-800/50 transition-colors duration-150 text-left cursor-pointer border-b border-stone-800/30 last:border-0"
                >
                  <MapPin size={14} className="text-amber-500 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-stone-50">
                      {result.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {result.country}
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
