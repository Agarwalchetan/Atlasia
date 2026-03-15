"use client";

import { useState } from "react";
import {
  UtensilsCrossed,
  Hotel,
  Compass,
  Landmark,
  ShoppingBag,
  Coffee,
  Wine,
  TreePine,
  Train,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_FILTERS } from "./map-types";

const ICON_MAP: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Hotel,
  Compass,
  Landmark,
  ShoppingBag,
  Coffee,
  Wine,
  TreePine,
  Train,
  Pill,
};

interface MapCategoryPillsProps {
  onCategorySelect?: (id: string | null) => void;
}

export function MapCategoryPills({ onCategorySelect }: MapCategoryPillsProps) {
  const [active, setActive] = useState<string | null>(null);

  const handleClick = (id: string) => {
    const next = active === id ? null : id;
    setActive(next);
    onCategorySelect?.(next);
  };

  return (
    <div className="fixed top-[60px] left-[72px] right-4 z-20 max-sm:left-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORY_FILTERS.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon];
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 active:scale-[0.97]",
                "animate-pill-fade-in",
                isActive
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-900/30"
                  : "bg-stone-900/80 backdrop-blur-xl border border-stone-800/50 text-stone-400 hover:bg-stone-800/70 hover:text-stone-200 shadow-md shadow-black/20"
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {Icon && <Icon size={14} />}
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
