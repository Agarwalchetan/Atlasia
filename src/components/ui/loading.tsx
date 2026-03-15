"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeMap = { sm: 16, md: 24, lg: 40 };
  return (
    <Loader2
      size={sizeMap[size]}
      className={cn("animate-spin text-sky-400", className)}
    />
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center gap-4 py-16"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-sky-500/20 border-t-sky-500 animate-spin" />
          <div className="absolute inset-2 w-12 h-12 rounded-full border-2 border-indigo-500/20 border-b-indigo-500 animate-spin animation-delay-150" />
        </div>
        <p className="text-white/60 text-sm font-medium">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
}

interface PulseDotsProps {
  className?: string;
}

export function PulseDots({ className }: PulseDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-sky-400"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
