import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "soft" | "subtle";

interface InputProps extends React.ComponentProps<"input"> {
  variant?: Variant;
}

const base =
  "w-full file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-colors outline-none";

const variants: Record<Variant, string> = {
  default:
    "h-11 rounded-lg bg-white/80 dark:bg-white/5 border border-border/70 dark:border-white/10 backdrop-blur-sm px-4 py-2.5 text-[15px] placeholder:text-foreground/40 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/60 shadow-sm focus-visible:shadow-md",
  soft: "h-11 rounded-lg bg-gray-50/70 dark:bg-white/5 hover:bg-gray-100/70 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-4 py-2.5 text-[15px] placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/60 focus-visible:bg-white dark:focus-visible:bg-white/10 shadow-sm",
  subtle:
    "h-10 rounded-md bg-transparent border border-border/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(base, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
