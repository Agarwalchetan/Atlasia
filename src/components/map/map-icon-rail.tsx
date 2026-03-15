"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Map,
  BookOpen,
  Languages,
  Mic,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/travel-guide", label: "Guide", icon: BookOpen },
  { href: "/phrases", label: "Phrases", icon: Languages },
  { href: "/conversation", label: "Chat", icon: Mic },
  { href: "/emergency", label: "SOS", icon: AlertTriangle },
];

export function MapIconRail() {
  const pathname = usePathname();

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

      <div className="w-7 h-px bg-stone-800/60 my-1" />

      {/* Nav items — same routes as main navbar */}
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-4 px-2 w-full cursor-pointer rounded-lg mx-1 transition-colors duration-150",
              isActive
                ? "text-amber-400"
                : "text-stone-400 hover:bg-stone-800/50 hover:text-stone-100"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
