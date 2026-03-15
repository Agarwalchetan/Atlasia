import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onValueChange, options, placeholder, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "w-full rounded-xl border border-white/15 bg-slate-900/80 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 cursor-pointer",
        className
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
