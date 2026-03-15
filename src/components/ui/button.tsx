import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline" | "destructive" | "secondary" | "link" | "glass";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses = {
  default: "bg-sky-500 text-white hover:bg-sky-600 shadow-sm shadow-sky-500/25",
  ghost: "hover:bg-white/10 text-white/80 hover:text-white",
  outline: "border border-white/20 text-white/80 hover:bg-white/10 hover:text-white",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  secondary: "bg-white/10 text-white hover:bg-white/20",
  link: "text-sky-400 underline-offset-4 hover:underline",
  glass:
    "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg",
};

const sizeClasses = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
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
