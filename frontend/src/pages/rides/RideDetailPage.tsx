import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Clock3,
  Mail,
  MapPin,
  Route,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import SOSButton from "@/components/common/SOSButton";
import { useRides } from "@/contexts/RideContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Ride } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function RideDetailPage() {
  const { rideId } = useParams();
  const { getRide, requestRide, deleteRide } = useRides();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!rideId) return;
    void getRide(rideId)
      .then(setRide)
      .catch((error) =>
        toast({
          title: "Could not load ride",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        }),
      );
  }, [getRide, rideId, toast]);

  if (!ride) {
    return (
      <Layout>
        <div className="page-container py-12">
          <Skeleton className="h-5 w-32" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <Skeleton className="h-[520px] rounded-[1.5rem]" />
            <Skeleton className="h-[360px] rounded-[1.5rem]" />
          </div>
        </div>
      </Layout>
    );
  }

  const driver = typeof ride.driverId === "string" ? null : ride.driverId;
  const ownRide = driver ? driver._id === user?.id : ride.driverId === user?.id;
  const rideDate = new Date(ride.date);
  const hasValidDate = !Number.isNaN(rideDate.getTime());
  const dateText = hasValidDate
    ? rideDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date unavailable";
  const timeText = hasValidDate
    ? rideDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time unavailable";
  const driverName = driver
    ? `${driver.first_name} ${driver.last_name}`.trim()
    : "Verified driver";
  const driverInitials = driverName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteRide(ride._id);
      toast({ title: "Ride deleted" });
      navigate("/rides");
    } catch (error) {
      toast({
        title: "Could not delete ride",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleRequest = async () => {
    setBusy(true);
    try {
      await requestRide(ride._id);
      toast({
        title: "Request sent",
        description: "The driver will now be able to review your request.",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <section className="page-container py-8 md:py-12">
        <Button variant="ghost" asChild className="-ml-3">
          <Link to="/rides">
            <ArrowLeft /> Back to rides
          </Link>
        </Button>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="surface overflow-hidden">
            <div className="map-grid relative overflow-hidden bg-[#eef1ed] px-6 py-10 sm:px-10 sm:py-12">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[38px] border-lau-green/10" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-lau-green shadow-sm">
                    {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"} available
                  </span>
                  {ride.isFemaleOnly && (
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 shadow-sm">
                      Female only
                    </span>
                  )}
                </div>

                <h1 className="mt-6 max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl">
                  {ride.pickupLocation} to {ride.destination}
                </h1>

                <div className="relative mt-9 grid max-w-2xl grid-cols-[18px_1fr] gap-x-4 gap-y-7 rounded-[1.4rem] bg-white p-6 shadow-[0_16px_50px_rgba(14,25,20,0.12)] sm:p-7">
                  <div className="absolute bottom-9 left-[34px] top-9 w-px bg-zinc-200" />
                  <span className="route-dot mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Pickup</p>
                    <p className="mt-1 text-lg font-bold text-zinc-950">{ride.pickupLocation}</p>
                  </div>
                  <span className="route-dot-dark mt-1" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">Destination</p>
                    <p className="mt-1 text-lg font-bold text-zinc-950">{ride.destination}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-zinc-950">Trip details</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  [CalendarDays, "Date", dateText],
                  [Clock3, "Departure", timeText],
                  [Route, "Route", ride.route || "Not provided"],
                  [Users, "Availability", `${ride.availableSeats} seats`],
                ].map(([Icon, label, value]) => {
                  const DetailIcon = Icon as typeof CalendarDays;
                  return (
                    <div key={String(label)} className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">
                        <DetailIcon className="h-4 w-4 text-lau-green" /> {String(label)}
                      </p>
                      <p className="mt-2 text-sm font-bold leading-6 text-zinc-950">{String(value)}</p>
                    </div>
                  );
                })}
              </div>

              {ride.notes && (
                <div className="mt-6 border-t border-zinc-100 pt-6">
                  <h2 className="text-lg font-bold text-zinc-950">Driver note</h2>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">{ride.notes}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="surface p-6 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Your driver</p>
            <div className="mt-5 flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-zinc-950 text-base font-extrabold text-white">
                {driverInitials || "DR"}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-zinc-950">{driverName}</h2>
                  <ShieldCheck className="h-4 w-4 shrink-0 text-lau-green" />
                </div>
                <p className="mt-1 text-sm text-zinc-500">LAU community driver</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-y border-zinc-100 py-5 text-sm">
              <p className="flex items-start gap-3 text-zinc-600">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span className="break-all">{driver?.universityEmail || "Contact unavailable"}</span>
              </p>
              <p className="flex items-start gap-3 text-zinc-600">
                <Car className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span>{driver?.vehicleNumber || "Vehicle not provided"}</span>
              </p>
              <p className="flex items-start gap-3 text-zinc-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span>{driver?.campusLocation || "LAU campus"}</span>
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-lau-light p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-lau-green">
                <ShieldCheck className="h-4 w-4" /> Student-focused ride
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-600">
                Review the route, schedule, and driver information before confirming your request.
              </p>
            </div>

            {ownRide ? (
              <Button
                variant="destructive"
                className="mt-6 w-full"
                disabled={busy}
                onClick={() => void handleDelete()}
              >
                <Trash2 /> {busy ? "Deleting…" : "Delete ride"}
              </Button>
            ) : (
              <Button
                className="mt-6 w-full"
                disabled={busy || ride.availableSeats < 1}
                onClick={() => void handleRequest()}
              >
                <UserRound />
                {busy
                  ? "Sending request…"
                  : ride.availableSeats < 1
                    ? "No seats available"
                    : "Request this ride"}
              </Button>
            )}
          </aside>
        </div>
      </section>
      <SOSButton rideId={ride._id} />
    </Layout>
  );
}
