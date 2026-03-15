import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-stone-800 bg-stone-900/60 px-4 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition-colors duration-200 focus:border-amber-500/50 focus:bg-stone-900/80 focus:ring-2 focus:ring-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
