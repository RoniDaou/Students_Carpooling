import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  Leaf,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import type { Ride } from "@/types";

function formatRideDate(dateValue?: string) {
  if (!dateValue) return "Schedule unavailable";
  const rideDate = new Date(dateValue);
  if (Number.isNaN(rideDate.getTime())) return "Schedule unavailable";

  return rideDate.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDriverName(driverId: Ride["driverId"] | null | undefined) {
  if (!driverId || typeof driverId === "string") return "Verified LAU driver";
  const fullName = `${driverId.first_name || ""} ${driverId.last_name || ""}`.trim();
  return fullName || "Verified LAU driver";
}

export default function HomePage() {
  const { isAuthenticated, userRole } = useAuth();
  const { rides, loadRides } = useRides();

  useEffect(() => {
    if (isAuthenticated) {
      void loadRides().catch(() => undefined);
    }
  }, [isAuthenticated, loadRides]);

  const featuredRides = Array.isArray(rides)
    ? rides.filter((ride): ride is Ride => Boolean(ride?._id)).slice(0, 3)
    : [];

  const previewRide = featuredRides[0];
  const primaryPath = isAuthenticated ? "/rides" : "/register";
  const primaryLabel = isAuthenticated ? "Find a ride" : "Create your account";

  return (
    <Layout>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="subtle-grid absolute inset-0 opacity-70" />
        <div className="absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-lau-green/30 blur-[120px]" />
        <div className="absolute -bottom-36 left-1/3 h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-[100px]" />

        <div className="page-container relative grid min-h-[680px] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/75 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              Built for the LAU community
            </div>

            <h1 className="mt-7 max-w-3xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Campus commuting,
              <span className="block text-emerald-300">made effortless.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-300 sm:text-xl">
              Find trusted student rides, offer your empty seats, and coordinate
              every trip from one professional, university-focused platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100">
                <Link to={primaryPath}>
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              {isAuthenticated && userRole === "driver" ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/[0.04] text-white hover:border-white/35 hover:bg-white/10 hover:text-white"
                >
                  <Link to="/rides/create">Offer a ride</Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/[0.04] text-white hover:border-white/35 hover:bg-white/10 hover:text-white"
                >
                  <Link to="/about">See how it works</Link>
                </Button>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400">
              {["University community", "Verified identity", "Simple ride requests"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
            <div className="map-grid relative overflow-hidden rounded-[2rem] bg-[#eef1ed] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-7">
              <div className="absolute -right-10 top-20 h-44 w-44 rounded-full border-[28px] border-lau-green/10" />
              <div className="absolute -left-8 bottom-14 h-32 w-32 rounded-full border-[22px] border-zinc-900/[0.05]" />

              <div className="relative rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_16px_45px_rgba(14,25,20,0.14)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Next available ride
                    </p>
                    <p className="mt-2 text-xl font-extrabold text-zinc-950">
                      {previewRide ? "Ride ready to request" : "Your commute, organized"}
                    </p>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lau-green text-white shadow-lg shadow-lau-green/20">
                    <Car className="h-5 w-5" />
                  </div>
                </div>

                <div className="relative mt-7 grid grid-cols-[18px_1fr] gap-x-4 gap-y-6">
                  <div className="absolute bottom-3 left-[6px] top-3 w-px bg-zinc-200" />
                  <span className="route-dot mt-1" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Pickup
                    </p>
                    <p className="mt-1 font-bold text-zinc-950">
                      {previewRide?.pickupLocation || "Your neighborhood"}
                    </p>
                  </div>
                  <span className="route-dot-dark mt-1" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Destination
                    </p>
                    <p className="mt-1 font-bold text-zinc-950">
                      {previewRide?.destination || "LAU campus"}
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-5">
                  <div className="rounded-xl bg-zinc-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                      <Clock3 className="h-3.5 w-3.5" /> Schedule
                    </div>
                    <p className="mt-1.5 text-sm font-bold text-zinc-950">
                      {previewRide ? formatRideDate(previewRide.date) : "Choose a time"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-zinc-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                      <Users className="h-3.5 w-3.5" /> Seats
                    </div>
                    <p className="mt-1.5 text-sm font-bold text-zinc-950">
                      {previewRide ? `${previewRide.availableSeats} available` : "Live availability"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-zinc-900 text-xs font-extrabold text-white">
                      {getDriverName(previewRide?.driverId).charAt(0)}
                    </span>
                    <div>
                      <p className="text-xs text-zinc-400">Driver</p>
                      <p className="text-sm font-bold text-zinc-950">
                        {getDriverName(previewRide?.driverId)}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-lau-light px-3 py-1 text-xs font-bold text-lau-green">
                    LAU verified
                  </span>
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between rounded-2xl bg-zinc-950 px-5 py-4 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <div>
                    <p className="text-sm font-bold">Community-first safety</p>
                    <p className="text-xs text-zinc-400">Identity and ride verification tools</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/[0.06] bg-white">
        <div className="page-container grid divide-y divide-zinc-100 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["01", "Find a route", "Browse rides that match your campus commute."],
            ["02", "Request your seat", "Send a clear request directly to the driver."],
            ["03", "Travel together", "Coordinate securely within the LAU community."],
          ].map(([number, title, copy]) => (
            <div key={number} className="flex gap-4 px-2 py-6 sm:px-6">
              <span className="text-sm font-extrabold text-lau-green">{number}</span>
              <div>
                <h2 className="text-base font-bold text-zinc-950">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section bg-background">
        <div className="page-container">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Designed around students</span>
              <h2 className="section-title mt-4">A better way to move between home and campus.</h2>
              <p className="section-copy">
                Every screen is focused on the decisions students actually need
                to make: where, when, who, and whether a seat is available.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/about">
                Why LAU Ride <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Trusted network",
                copy: "A university-focused environment supported by student identity verification.",
              },
              {
                icon: WalletCards,
                title: "Lower commute costs",
                copy: "Share fuel and parking expenses instead of covering every trip alone.",
              },
              {
                icon: Route,
                title: "Clear trip details",
                copy: "See pickup, destination, route, schedule, seats, and driver information at a glance.",
              },
              {
                icon: Leaf,
                title: "Smarter mobility",
                copy: "Fewer single-passenger cars can mean less traffic and a lighter environmental footprint.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article key={title} className="surface card-lift p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-zinc-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className="bg-white py-16 md:py-20">
          <div className="page-container">
            <div className="flex items-center justify-between gap-5">
              <div>
                <span className="eyebrow">Available now</span>
                <h2 className="mt-4 text-3xl font-bold text-zinc-950">Recent rides</h2>
              </div>
              <Button asChild variant="ghost">
                <Link to="/rides">
                  View all <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {featuredRides.length > 0 ? (
                featuredRides.map((ride) => (
                  <Link
                    key={ride._id}
                    to={`/rides/${ride._id}`}
                    className="surface card-lift group block p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-lau-light px-3 py-1 text-xs font-bold text-lau-green">
                        {ride.availableSeats} seats
                      </span>
                      <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-zinc-950" />
                    </div>
                    <div className="relative mt-6 grid grid-cols-[14px_1fr] gap-x-3 gap-y-4">
                      <div className="absolute bottom-2 left-[6px] top-2 w-px bg-zinc-200" />
                      <span className="route-dot mt-1" />
                      <p className="font-bold text-zinc-950">{ride.pickupLocation}</p>
                      <span className="route-dot-dark mt-1" />
                      <p className="font-bold text-zinc-950">{ride.destination}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 border-t border-zinc-100 pt-4 text-sm text-zinc-500">
                      <CalendarDays className="h-4 w-4" />
                      {formatRideDate(ride.date)}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="surface col-span-full flex min-h-52 items-center justify-center p-8 text-center">
                  <div>
                    <MapPin className="mx-auto h-7 w-7 text-lau-green" />
                    <p className="mt-3 font-bold text-zinc-950">No rides are listed yet.</p>
                    <p className="mt-1 text-sm text-zinc-500">Check again soon or offer the first ride.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-lau-green text-white">
        <div className="page-container grid gap-10 py-16 md:grid-cols-[1fr_auto] md:items-center md:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">
              Ready when you are
            </p>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Make your next campus trip simpler.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Join a mobility experience designed specifically for students,
              with the route details and trust signals that matter.
            </p>
          </div>
          <Button asChild size="lg" className="bg-white text-lau-green hover:bg-zinc-100">
            <Link to={primaryPath}>
              {primaryLabel} <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
