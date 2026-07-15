import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
  onClick?: () => void;
}

export default function BrandLogo({
  className,
  compact = false,
  inverted = false,
  onClick,
}: BrandLogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn("inline-flex items-center gap-3", className)}
      aria-label="LAU Ride home"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-lau-green shadow-sm ring-1 ring-black/5">
        <img
          src="/lovable-uploads/de2beea1-0f3a-4cca-9619-8f619db2c38c.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={cn(
              "block text-[17px] font-extrabold tracking-[-0.04em]",
              inverted ? "text-white" : "text-zinc-950",
            )}
          >
            LAU Ride
          </span>
          <span
            className={cn(
              "mt-1 block text-[10px] font-bold uppercase tracking-[0.18em]",
              inverted ? "text-white/55" : "text-zinc-500",
            )}
          >
            Student mobility
          </span>
        </span>
      )}
    </Link>
  );
}
