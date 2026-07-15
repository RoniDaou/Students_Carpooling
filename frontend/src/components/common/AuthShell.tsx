import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  description: string;
  wide?: boolean;
}

export default function AuthShell({
  children,
  title,
  description,
  wide = false,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="relative hidden overflow-hidden bg-zinc-950 text-white lg:flex lg:flex-col">
        <div className="subtle-grid absolute inset-0 opacity-60" />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-lau-green/30 blur-[100px]" />
        <div className="relative flex h-full flex-col p-10 xl:p-14">
          <BrandLogo inverted />

          <div className="my-auto max-w-lg py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white/70">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              Student mobility, refined
            </span>
            <h2 className="mt-7 text-balance text-4xl font-extrabold leading-tight tracking-[-0.045em] xl:text-5xl">
              Your LAU commute belongs in one trusted place.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
              Discover rides, coordinate with fellow students, and manage every
              request through a platform designed around campus travel.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "University-focused member experience",
                "Clear pickup, destination, and schedule details",
                "Simple ride request and response workflow",
              ].map((item) => (
                <p key={item} className="flex items-center gap-3 text-sm font-semibold text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="relative rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-lau-green text-white">
                <Car className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">A simpler campus journey</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                  <MapPin className="h-3.5 w-3.5" /> Home, campus, and every stop between
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 bg-background">
        <div className="flex min-h-screen flex-col">
          <div className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <div className="lg:hidden">
              <BrandLogo />
            </div>
            <Link
              to="/"
              className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              <ArrowLeft className="h-4 w-4" /> Back home
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 pb-12 pt-4 sm:px-8 lg:px-10">
            <div className={wide ? "w-full max-w-3xl" : "w-full max-w-md"}>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-lau-green">LAU Ride account</p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">{title}</h1>
                <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">{description}</p>
              </div>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
