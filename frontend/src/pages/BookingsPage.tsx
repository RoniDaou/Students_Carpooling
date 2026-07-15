import { useCallback, useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Route,
  UserRound,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { useToast } from "@/hooks/use-toast";
import type {
  DriverSummary,
  PassengerSummary,
  Ride,
  RideRequest,
  RideRequestStatus,
} from "@/types";

const statusConfig: Record<
  RideRequestStatus,
  { label: string; className: string; icon: typeof Clock3 }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  accepted: {
    label: "Accepted",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
  },
};

function getRide(request: RideRequest): Ride | null {
  return request.rideId && typeof request.rideId !== "string" ? request.rideId : null;
}

function getPassenger(request: RideRequest): PassengerSummary | null {
  return request.passengerId && typeof request.passengerId !== "string"
    ? request.passengerId
    : null;
}

function getDriver(ride: Ride | null): DriverSummary | null {
  return ride?.driverId && typeof ride.driverId !== "string" ? ride.driverId : null;
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

export default function BookingsPage() {
  const { userRole } = useAuth();
  const { myRequests, driverRequests, respondToRequest } = useRides();
  const { toast } = useToast();

  const [items, setItems] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      const result = userRole === "driver" ? await driverRequests() : await myRequests();
      setItems(result);
    } catch (error) {
      toast({
        title: "Could not load requests",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [driverRequests, myRequests, toast, userRole]);

  useEffect(() => {
    void loadRequests();
    const intervalId = window.setInterval(() => void loadRequests(), 5000);
    return () => window.clearInterval(intervalId);
  }, [loadRequests]);

  const handleResponse = async (
    requestId: string,
    action: "accepted" | "rejected",
  ) => {
    setActingId(requestId);
    try {
      const updatedRequest = await respondToRequest(requestId, action);
      setItems((current) =>
        current.map((request) => (request._id === requestId ? updatedRequest : request)),
      );
      toast({
        title: action === "accepted" ? "Request accepted" : "Request rejected",
        description:
          action === "accepted"
            ? "The passenger can now see the accepted status and your contact details."
            : "The passenger can now see that the request was rejected.",
      });
    } catch (error) {
      toast({
        title: "Could not update request",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActingId(null);
    }
  };

  const isDriver = userRole === "driver";

  return (
    <Layout>
      <PageHeader
        eyebrow={isDriver ? "Driver inbox" : "Passenger activity"}
        title={isDriver ? "Passenger requests" : "My ride requests"}
        description={
          isDriver
            ? "Review passengers who requested your rides and respond from one organized workspace."
            : "Track every request and see when a driver accepts or rejects your ride."
        }
        action={
          <Button variant="outline" onClick={() => void loadRequests()}>
            <RefreshCw /> Refresh
          </Button>
        }
      />

      <section className="page-container py-10 md:py-14">
        {loading ? (
          <div className="surface flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-lau-green" />
              <p className="mt-3 text-sm font-semibold text-zinc-600">Loading requests…</p>
            </div>
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((request) => {
              const ride = getRide(request);
              const passenger = getPassenger(request);
              const driver = getDriver(ride);
              const status = statusConfig[request.status];
              const StatusIcon = status.icon;
              const passengerName = passenger
                ? `${passenger.first_name} ${passenger.last_name}`.trim()
                : "Passenger";
              const driverName = driver
                ? `${driver.first_name} ${driver.last_name}`.trim()
                : "Driver information unavailable";

              return (
                <article key={request._id} className="surface overflow-hidden">
                  <div className="flex items-start justify-between gap-4 border-b border-zinc-100 p-6">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">
                        Ride request
                      </p>
                      <h2 className="mt-2 text-xl font-bold leading-tight text-zinc-950">
                        {ride ? `${ride.pickupLocation} to ${ride.destination}` : "Ride unavailable"}
                      </h2>
                    </div>
                    <span className={`status-pill shrink-0 ${status.className}`}>
                      <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
                      {status.label}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-zinc-50 p-3.5">
                        <p className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                          <Clock3 className="h-3.5 w-3.5" /> Schedule
                        </p>
                        <p className="mt-1.5 text-sm font-bold text-zinc-950">
                          {formatDate(ride?.date)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-zinc-50 p-3.5">
                        <p className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                          <Route className="h-3.5 w-3.5" /> Route
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-sm font-bold text-zinc-950">
                          {ride?.route || "Route unavailable"}
                        </p>
                      </div>
                    </div>

                    {isDriver ? (
                      <>
                        <div className="mt-5 rounded-xl border border-zinc-100 p-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-xs font-extrabold text-white">
                              {passengerName.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <p className="font-bold text-zinc-950">{passengerName}</p>
                              <p className="text-xs text-zinc-500">Passenger requesting a seat</p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
                            {passenger?.universityEmail && (
                              <p className="flex items-start gap-2.5">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                                <span className="break-all">{passenger.universityEmail}</span>
                              </p>
                            )}
                            {passenger?.phoneNumber && (
                              <p className="flex items-start gap-2.5">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                                {passenger.phoneNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        {request.status === "pending" && (
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <Button
                              disabled={actingId === request._id}
                              onClick={() => void handleResponse(request._id, "accepted")}
                            >
                              <Check /> Accept
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800"
                              disabled={actingId === request._id}
                              onClick={() => void handleResponse(request._id, "rejected")}
                            >
                              <X /> Reject
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mt-5 flex items-center gap-3 rounded-xl border border-zinc-100 p-4">
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-950 text-xs font-extrabold text-white">
                            {driverName.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="text-xs text-zinc-500">Driver</p>
                            <p className="font-bold text-zinc-950">{driverName}</p>
                          </div>
                        </div>

                        {request.status === "accepted" && driver && (
                          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                              <CheckCircle2 className="h-4 w-4" /> Your request was accepted
                            </p>
                            <div className="mt-3 space-y-2 text-sm text-emerald-700">
                              <p className="flex items-start gap-2.5">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="break-all">{driver.universityEmail}</span>
                              </p>
                              {driver.vehicleNumber && (
                                <p className="flex items-start gap-2.5">
                                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                  Vehicle: {driver.vehicleNumber}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {request.status === "rejected" && (
                          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                            The driver rejected this request. You can return to the ride board and choose another option.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={isDriver ? UsersRound : UserRound}
            title={isDriver ? "No passenger requests yet" : "No ride requests yet"}
            description={
              isDriver
                ? "Requests will appear here as soon as passengers choose one of your published rides."
                : "Open the ride board, choose a suitable trip, and submit your first request."
            }
          />
        )}
      </section>
    </Layout>
  );
}
