import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Clock3,
  MapPin,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import type { Ride } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RideCardProps {
  ride: Ride;
  showActions?: boolean;
}

export default function RideCard({ ride, showActions = true }: RideCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const { isAuthenticated, user, userRole } = useAuth();
  const { requestRide } = useRides();
  const { toast } = useToast();
  const navigate = useNavigate();

  const driver = typeof ride.driverId === "string" ? null : ride.driverId;
  const driverId =
    typeof ride.driverId === "string" ? ride.driverId : ride.driverId?._id;
  const driverName = driver
    ? `${driver.first_name} ${driver.last_name}`.trim()
    : "Verified driver";
  const driverInitials = driverName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const rideDate = ride.date ? new Date(ride.date) : null;
  const hasValidDate = Boolean(rideDate && !Number.isNaN(rideDate.getTime()));
  const formattedDate = hasValidDate
    ? rideDate!.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "Date unavailable";
  const formattedTime = hasValidDate
    ? rideDate!.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time unavailable";

  const canRequestRide =
    isAuthenticated &&
    userRole === "passenger" &&
    ride.availableSeats > 0 &&
    user?.id !== driverId;

  const handleRequestRide = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsRequesting(true);
    try {
      await requestRide(ride._id);
      toast({
        title: "Ride requested",
        description: "Your request has been sent to the driver.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Request failed",
        description:
          error instanceof Error ? error.message : "Could not request this ride.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <>
      <Card className="card-lift group flex h-full flex-col overflow-hidden">
        <CardHeader className="border-b border-zinc-100 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lau-light px-2.5 py-1 text-xs font-bold text-lau-green">
                  <Users className="h-3.5 w-3.5" />
                  {ride.availableSeats} {ride.availableSeats === 1 ? "seat" : "seats"}
                </span>
                {ride.isFemaleOnly && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700"
                  >
                    Female only
                  </Badge>
                )}
              </div>
              <CardTitle className="mt-4 line-clamp-2 text-xl">
                {ride.pickupLocation} to {ride.destination}
              </CardTitle>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-zinc-950 text-white">
              <Car className="h-5 w-5" />
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-5">
          <div className="relative grid grid-cols-[14px_1fr] gap-x-3 gap-y-4">
            <div className="absolute bottom-2 left-[6px] top-2 w-px bg-zinc-200" />
            <span className="route-dot mt-1" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                Pickup
              </p>
              <p className="mt-0.5 truncate text-sm font-bold text-zinc-950">
                {ride.pickupLocation || "Pickup unavailable"}
              </p>
            </div>
            <span className="route-dot-dark mt-1" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                Destination
              </p>
              <p className="mt-0.5 truncate text-sm font-bold text-zinc-950">
                {ride.destination || "Destination unavailable"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                <CalendarDays className="h-3.5 w-3.5" /> Date
              </p>
              <p className="mt-1.5 text-sm font-bold text-zinc-950">{formattedDate}</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                <Clock3 className="h-3.5 w-3.5" /> Time
              </p>
              <p className="mt-1.5 text-sm font-bold text-zinc-950">{formattedTime}</p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 border-t border-zinc-100 pt-5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-900 text-xs font-extrabold text-white">
              {driverInitials || "DR"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold text-zinc-950">{driverName}</p>
                <ShieldCheck className="h-4 w-4 shrink-0 text-lau-green" />
              </div>
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {ride.route || "Route details not provided"}
              </p>
            </div>
          </div>

          {ride.notes && (
            <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs leading-5 text-zinc-600">
              {ride.notes}
            </div>
          )}
        </CardContent>

        <CardFooter className="mt-auto gap-3 border-t border-zinc-100 pt-5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/rides/${ride._id}`)}
          >
            Details <ArrowRight className="transition group-hover:translate-x-0.5" />
          </Button>
          {showActions && canRequestRide && (
            <Button className="flex-1" onClick={() => setIsDialogOpen(true)}>
              <UserPlus /> Request
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[1.4rem] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Request this ride?</DialogTitle>
            <DialogDescription className="leading-6">
              The driver will receive your request and can accept or reject it.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-4">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-zinc-900 font-bold text-white">
                  {driverInitials || "DR"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-zinc-950">{driverName}</p>
                <p className="text-sm text-zinc-500">
                  {driver?.universityEmail || "LAU driver"}
                </p>
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-[14px_1fr] gap-x-3 gap-y-4 rounded-xl border border-zinc-200 p-4">
              <div className="absolute bottom-6 left-[22px] top-6 w-px bg-zinc-200" />
              <span className="route-dot mt-1" />
              <div>
                <p className="text-xs font-semibold text-zinc-400">From</p>
                <p className="font-bold text-zinc-950">{ride.pickupLocation}</p>
              </div>
              <span className="route-dot-dark mt-1" />
              <div>
                <p className="text-xs font-semibold text-zinc-400">To</p>
                <p className="font-bold text-zinc-950">{ride.destination}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
              <MapPin className="h-4 w-4 text-lau-green" />
              {formattedDate} at {formattedTime}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isRequesting} onClick={handleRequestRide}>
              {isRequesting ? "Sending request…" : "Confirm request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
