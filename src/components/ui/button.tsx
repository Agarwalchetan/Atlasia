import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "destructive" | "secondary" | "link" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses = {
  default:
    "bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-900/30 active:scale-[0.97]",
  ghost:
    "hover:bg-stone-800/60 text-stone-300 hover:text-stone-50 active:scale-[0.97]",
  outline:
    "border border-stone-700 text-stone-300 hover:bg-stone-800/50 hover:text-stone-50 hover:border-stone-600 active:scale-[0.97]",
  destructive:
    "bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-900/25 active:scale-[0.97]",
  secondary:
    "bg-stone-800/80 text-stone-200 hover:bg-stone-700/80 active:scale-[0.97]",
  link:
    "text-amber-500 underline-offset-4 hover:underline hover:text-amber-400",
  glass:
    "bg-white/8 backdrop-blur-xl border border-white/12 text-stone-100 hover:bg-white/14 hover:border-white/20 shadow-lg active:scale-[0.97]",
};

const sizeClasses = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 px-3.5 text-xs",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
