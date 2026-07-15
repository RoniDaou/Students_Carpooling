import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-base text-zinc-950 shadow-sm transition placeholder:text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-zinc-700 hover:border-zinc-400 focus-visible:border-lau-green focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lau-green/10 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
