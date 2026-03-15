import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

const variantClasses = {
  default: "bg-stone-800/80 text-stone-300 border border-stone-700/50",
  success: "bg-teal-500/15 text-teal-400 border border-teal-500/25",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  danger: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  info: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  outline: "border border-stone-700 text-stone-400",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
