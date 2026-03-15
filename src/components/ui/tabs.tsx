"use client";

import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

import React from "react";

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1 rounded-2xl bg-stone-900/60 border border-stone-800/60 p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
            activeTab === tab.id
              ? "bg-amber-600 text-white shadow-lg shadow-amber-900/25"
              : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
