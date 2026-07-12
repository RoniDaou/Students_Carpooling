import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Clock,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const statusClasses: Record<RideRequestStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  accepted: "border-green-300 bg-green-50 text-green-700",
  rejected: "border-red-300 bg-red-50 text-red-700",
};

function getRide(request: RideRequest): Ride | null {
  return request.rideId && typeof request.rideId !== "string"
    ? request.rideId
    : null;
}

function getPassenger(
  request: RideRequest
): PassengerSummary | null {
  return request.passengerId &&
    typeof request.passengerId !== "string"
    ? request.passengerId
    : null;
}

function getDriver(ride: Ride | null): DriverSummary | null {
  return ride?.driverId && typeof ride.driverId !== "string"
    ? ride.driverId
    : null;
}

function formatDate(value?: string) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleString();
}

export default function BookingsPage() {
  const { userRole } = useAuth();
  const {
    myRequests,
    driverRequests,
    respondToRequest,
  } = useRides();
  const { toast } = useToast();

  const [items, setItems] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      const result =
        userRole === "driver"
          ? await driverRequests()
          : await myRequests();

      setItems(result);
    } catch (error) {
      toast({
        title: "Could not load requests",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [driverRequests, myRequests, toast, userRole]);

  useEffect(() => {
    void loadRequests();

    const intervalId = window.setInterval(() => {
      void loadRequests();
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [loadRequests]);

  const handleResponse = async (
    requestId: string,
    action: "accepted" | "rejected"
  ) => {
    setActingId(requestId);

    try {
      const updatedRequest = await respondToRequest(
        requestId,
        action
      );

      setItems((current) =>
        current.map((request) =>
          request._id === requestId ? updatedRequest : request
        )
      );

      toast({
        title:
          action === "accepted"
            ? "Request accepted"
            : "Request rejected",
        description:
          action === "accepted"
            ? "The passenger can now see that the ride was accepted."
            : "The passenger can now see that the ride was rejected.",
      });
    } catch (error) {
      toast({
        title: "Could not update request",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActingId(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">
              {userRole === "driver"
                ? "Passenger requests"
                : "My ride requests"}
            </h1>

            <p className="mt-1 text-gray-600">
              {userRole === "driver"
                ? "Accept or reject passengers who requested your rides."
                : "The status updates automatically after the driver responds."}
            </p>
          </div>

          <Button variant="outline" onClick={() => void loadRequests()}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <p>Loading requests...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((request) => {
              const ride = getRide(request);
              const passenger = getPassenger(request);
              const driver = getDriver(ride);

              return (
                <Card key={request._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg">
                        {ride
                          ? `${ride.pickupLocation} → ${ride.destination}`
                          : "Ride unavailable"}
                      </CardTitle>

                      <Badge
                        variant="outline"
                        className={statusClasses[request.status]}
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {formatDate(ride?.date)}
                    </p>

                    {ride && (
                      <p className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {ride.route}
                      </p>
                    )}

                    {userRole === "driver" ? (
                      <>
                        <div className="rounded-md bg-gray-50 p-3">
                          <p className="font-semibold">
                            {passenger
                              ? `${passenger.first_name} ${passenger.last_name}`
                              : "Passenger"}
                          </p>

                          {passenger?.universityEmail && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="h-4 w-4" />
                              {passenger.universityEmail}
                            </p>
                          )}

                          {passenger?.phoneNumber && (
                            <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              {passenger.phoneNumber}
                            </p>
                          )}
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-3">
                            <Button
                              className="flex-1 bg-lau-green hover:bg-lau-dark"
                              disabled={actingId === request._id}
                              onClick={() =>
                                void handleResponse(
                                  request._id,
                                  "accepted"
                                )
                              }
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Accept
                            </Button>

                            <Button
                              variant="destructive"
                              className="flex-1"
                              disabled={actingId === request._id}
                              onClick={() =>
                                void handleResponse(
                                  request._id,
                                  "rejected"
                                )
                              }
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          <span className="font-semibold">Driver:</span>{" "}
                          {driver
                            ? `${driver.first_name} ${driver.last_name}`
                            : "Driver information unavailable"}
                        </p>

                        {request.status === "accepted" && driver && (
                          <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm">
                            <p className="font-semibold text-green-800">
                              Your request was accepted.
                            </p>
                            <p className="mt-1 text-green-700">
                              Contact: {driver.universityEmail}
                            </p>
                            {driver.vehicleNumber && (
                              <p className="text-green-700">
                                Vehicle: {driver.vehicleNumber}
                              </p>
                            )}
                          </div>
                        )}

                        {request.status === "rejected" && (
                          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            The driver rejected this request. You can choose another ride.
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {items.length === 0 && (
              <p>
                {userRole === "driver"
                  ? "No passengers have requested your rides yet."
                  : "You have not requested any rides yet."}
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
