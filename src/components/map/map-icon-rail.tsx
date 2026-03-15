"use client";

import Link from "next/link";
import { Globe, Bookmark, Clock, Smartphone, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface RailItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}

const RAIL_ITEMS: RailItem[] = [
  { icon: Bookmark, label: "Saved" },
  { icon: Clock, label: "Recents" },
  { icon: Smartphone, label: "Get app" },
];

export function MapIconRail() {
  return (
    <div className="fixed left-0 top-0 h-full w-[56px] bg-stone-950/95 backdrop-blur-xl border-r border-stone-800/40 z-40 flex flex-col items-center pt-3 gap-1 max-md:hidden">
      {/* Logo / Home */}
      <Link
        href="/"
        className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl hover:bg-stone-800/50 transition-colors duration-150 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-900/30 group-hover:shadow-amber-800/50 transition-shadow duration-200">
          <Globe size={16} className="text-white" />
        </div>
      </Link>

      {/* Menu */}
      <button className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl hover:bg-stone-800/50 transition-colors duration-150 cursor-pointer w-full">
        <Menu size={18} className="text-stone-400" />
        <span className="text-[10px] text-stone-500 font-medium">Menu</span>
      </button>

      <div className="w-7 h-px bg-stone-800/60 my-1" />

      {/* Rail items */}
      {RAIL_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={item.onClick}
            className={cn(
              "flex flex-col items-center gap-1 py-3 px-1 rounded-xl hover:bg-stone-800/50 transition-colors duration-150 cursor-pointer w-full"
            )}
          >
            <Icon size={18} className="text-stone-400" />
            <span className="text-[10px] text-stone-500 font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
