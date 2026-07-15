import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[110px] w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 shadow-sm transition placeholder:text-zinc-400 hover:border-zinc-400 focus-visible:border-lau-green focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lau-green/10 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
