import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { useToast } from "@/hooks/use-toast";
import type { RideRequestStatus } from "@/types";

export default function RideRequestNotifier() {
  const { isAuthenticated, user, userRole } = useAuth();
  const { myRequests } = useRides();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated || !user || userRole !== "passenger") {
      return;
    }

    let cancelled = false;
    const storageKey = `ride-request-statuses:${user.id}`;

    const checkForUpdates = async () => {
      try {
        const requests = await myRequests();

        if (cancelled) return;

        const savedStatuses = JSON.parse(
          localStorage.getItem(storageKey) || "{}",
        ) as Record<string, RideRequestStatus>;

        const nextStatuses: Record<string, RideRequestStatus> = {};

        requests.forEach((request) => {
          nextStatuses[request._id] = request.status;

          const previousStatus = savedStatuses[request._id];
          const statusChanged =
            previousStatus && previousStatus !== request.status;
          const firstSeenDecision =
            !previousStatus && request.status !== "pending";

          if (statusChanged || firstSeenDecision) {
            const ride =
              request.rideId && typeof request.rideId !== "string"
                ? request.rideId
                : null;

            const routeText = ride
              ? `${ride.pickupLocation} → ${ride.destination}`
              : "your ride request";

            toast({
              title:
                request.status === "accepted"
                  ? "Ride request accepted"
                  : "Ride request rejected",
              description:
                request.status === "accepted"
                  ? `The driver accepted ${routeText}.`
                  : `The driver rejected ${routeText}.`,
              variant:
                request.status === "rejected" ? "destructive" : "default",
            });
          }
        });

        localStorage.setItem(storageKey, JSON.stringify(nextStatuses));
      } catch (error) {
        console.error("Could not check ride request updates:", error);
      }
    };

    void checkForUpdates();

    const intervalId = window.setInterval(() => {
      void checkForUpdates();
    }, 8000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated, myRequests, toast, user, userRole]);

  return null;
}
