import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Car,
  Clock,
  MapPin,
  User,
  Users,
  UserPlus,
} from "lucide-react";

import { Ride } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
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
    ? `${driver.first_name} ${driver.last_name}`
    : "Driver";

  const driverInitials = driverName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const rideDate = ride.date ? new Date(ride.date) : null;

  const hasValidDate = rideDate && !Number.isNaN(rideDate.getTime());

  const formattedDate = hasValidDate
    ? rideDate.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date unavailable";

  const formattedTime = hasValidDate
    ? rideDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time unavailable";

  const canRequestRide =
    isAuthenticated &&
    userRole === "passenger" &&
    ride.availableSeats > 0 &&
    user?.id !== driverId;

  const handleViewRide = () => {
    navigate(`/rides/${ride._id}`);
  };

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
          error instanceof Error
            ? error.message
            : "Could not request this ride.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-3">
            <div>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-1 text-lau-green" />
                {ride.pickupLocation} to {ride.destination}
              </CardTitle>

              <CardDescription className="flex flex-wrap items-center mt-2">
                <Calendar className="w-4 h-4 mr-1" />
                {formattedDate}

                <span className="mx-2">•</span>

                <Clock className="w-4 h-4 mr-1" />
                {formattedTime}
              </CardDescription>
            </div>

            {ride.isFemaleOnly && (
              <Badge
                variant="outline"
                className="border-pink-300 text-pink-500"
              >
                Female Only
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-500" />

              <span className="text-sm">
                Route: {ride.route || "Not provided"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />

              <span className="text-sm">Driver: {driverName}</span>
            </div>

            {driver?.vehicleNumber && (
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-gray-500" />

                <span className="text-sm">Vehicle: {driver.vehicleNumber}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />

              <span className="text-sm">
                {ride.availableSeats} seats available
              </span>
            </div>

            {ride.notes && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Note:</span> {ride.notes}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <div className="flex justify-between gap-3 w-full">
            <Button variant="outline" size="sm" onClick={handleViewRide}>
              View Details
            </Button>

            {showActions && canRequestRide && (
              <Button
                size="sm"
                className="bg-lau-green hover:bg-lau-dark"
                onClick={() => setIsDialogOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Request Ride
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Ride</DialogTitle>

            <DialogDescription>
              Are you sure you want to request this ride?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback>{driverInitials}</AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-medium">{driverName}</h4>

                {driver?.universityEmail && (
                  <p className="text-sm text-muted-foreground">
                    {driver.universityEmail}
                  </p>
                )}
              </div>
            </div>

            <div className="border rounded-md p-3 bg-muted/50">
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">From:</span>{" "}
                  {ride.pickupLocation}
                </p>

                <p>
                  <span className="font-medium">To:</span> {ride.destination}
                </p>

                <p>
                  <span className="font-medium">Date:</span> {formattedDate}
                </p>

                <p>
                  <span className="font-medium">Time:</span> {formattedTime}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>

            <Button
              disabled={isRequesting}
              className="bg-lau-green hover:bg-lau-dark"
              onClick={handleRequestRide}
            >
              {isRequesting ? "Requesting..." : "Confirm Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
