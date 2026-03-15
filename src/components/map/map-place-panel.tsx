"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  BookOpen,
  Languages,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Bookmark,
  Share2,
  Grid3X3,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SelectedLocation } from "./map-types";

interface MapPlacePanelProps {
  location: SelectedLocation | null;
  open: boolean;
  onClose: () => void;
}

type Tab = "overview" | "navigate" | "about";

export function MapPlacePanel({ location, open, onClose }: MapPlacePanelProps) {
  const [tab, setTab] = useState<Tab>("overview");

  if (!location) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-[56px] top-0 h-full w-[380px] bg-stone-950/95 backdrop-blur-2xl border-r border-stone-800/40 shadow-2xl shadow-black/50 z-30 overflow-y-auto max-md:left-0 max-md:w-full max-md:max-w-[380px]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-stone-800/60 text-stone-500 hover:text-stone-200 transition-colors duration-150 cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            {/* Gradient hero header */}
            <div className="h-[160px] bg-gradient-to-br from-amber-600/20 via-stone-900 to-teal-600/10 flex items-end p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/40">
                  <MapPin size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-stone-50 font-[family-name:var(--font-sora)]">
                    {location.name}
                  </h2>
                  <p className="text-sm text-stone-400 font-medium">
                    {location.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center justify-around px-6 py-4 border-b border-stone-800/40">
              {[
                { icon: Navigation, label: "Directions", primary: true },
                { icon: Bookmark, label: "Save", primary: false },
                { icon: Share2, label: "Share", primary: false },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-150",
                      action.primary
                        ? "bg-amber-600 hover:bg-amber-500 text-white"
                        : "bg-stone-800/60 hover:bg-stone-700/60 text-stone-300 group-hover:text-stone-50"
                    )}
                  >
                    <action.icon size={18} />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      action.primary ? "text-amber-400" : "text-stone-500"
                    )}
                  >
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-stone-800/40">
              {(["overview", "navigate", "about"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 py-3 text-sm font-medium capitalize transition-colors duration-150 cursor-pointer",
                    tab === t
                      ? "text-amber-400 border-b-2 border-amber-500"
                      : "text-stone-500 hover:text-stone-300"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content — Overview */}
            {tab === "overview" && (
              <div className="p-6 space-y-4">
                {/* Coordinates */}
                <div className="flex items-start gap-3 py-3 border-b border-stone-800/30">
                  <MapPin size={16} className="text-stone-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-stone-300">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3 border-b border-stone-800/30">
                  <Grid3X3 size={16} className="text-stone-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-stone-300 font-mono">
                    {location.lat > 0 ? "N" : "S"}
                    {Math.abs(location.lat).toFixed(4)}°{" "}
                    {location.lng > 0 ? "E" : "W"}
                    {Math.abs(location.lng).toFixed(4)}°
                  </div>
                </div>

                {/* Quick links */}
                <div className="space-y-2 pt-2">
                  <Link
                    href={`/travel-guide?location=${encodeURIComponent(location.name + ", " + location.country)}`}
                  >
                    <Button className="w-full gap-2 justify-start">
                      <BookOpen size={16} />
                      View Travel Guide
                    </Button>
                  </Link>
                  <Link
                    href={`/phrases?lang=${encodeURIComponent(location.country)}`}
                  >
                    <Button
                      variant="glass"
                      className="w-full gap-2 justify-start"
                    >
                      <Languages size={16} />
                      Phrase Assistant
                    </Button>
                  </Link>
                  <Link href="/emergency">
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-start"
                    >
                      <AlertTriangle size={16} />
                      Emergency Mode
                    </Button>
                  </Link>
                </div>

                {/* Coordinate badges */}
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="info">
                    {location.lat > 0 ? "N" : "S"}
                    {Math.abs(location.lat).toFixed(2)}
                  </Badge>
                  <Badge variant="outline">
                    {location.lng > 0 ? "E" : "W"}
                    {Math.abs(location.lng).toFixed(2)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Tab content — Navigate */}
            {tab === "navigate" && (
              <div className="p-6">
                <p className="text-sm text-stone-500">
                  Open in your preferred maps app to get directions to{" "}
                  <span className="text-stone-300">{location.name}</span>.
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block"
                >
                  <Button className="w-full gap-2">
                    <Navigation size={16} />
                    Open in Google Maps
                  </Button>
                </a>
              </div>
            )}

            {/* Tab content — About */}
            {tab === "about" && (
              <div className="p-6">
                <p className="text-sm text-stone-500">
                  Location data provided by OpenStreetMap Nominatim.
                </p>
              </div>
            )}
          </motion.div>

          {/* Collapse/expand tab on right edge of panel */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed left-[calc(56px+380px)] top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-r-lg bg-stone-900/90 border border-l-0 border-stone-800/50 text-stone-500 hover:text-stone-200 hover:bg-stone-800/80 transition-colors duration-150 cursor-pointer shadow-lg max-md:left-[380px]"
          >
            <ChevronLeft size={16} />
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
