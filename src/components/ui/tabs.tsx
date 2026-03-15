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
        "flex gap-1 rounded-2xl bg-white/5 border border-white/10 p-1",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
            activeTab === tab.id
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
