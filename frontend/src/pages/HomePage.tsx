import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Car, MapPin, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import type { Ride } from "@/types";

function formatRideDate(dateValue?: string) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const rideDate = new Date(dateValue);

  if (Number.isNaN(rideDate.getTime())) {
    return "Date unavailable";
  }

  return rideDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDriverName(driverId: Ride["driverId"] | null | undefined) {
  if (!driverId || typeof driverId === "string") {
    return "Driver information unavailable";
  }

  const firstName = driverId.first_name?.trim() || "";
  const lastName = driverId.last_name?.trim() || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Driver information unavailable";
}

export default function HomePage() {
  const { isAuthenticated, userRole } = useAuth();
  const { rides } = useRides();

  const [isLoaded, setIsLoaded] = useState(false);

  const featuredRides: Ride[] = Array.isArray(rides)
    ? rides
        .filter((ride): ride is Ride => Boolean(ride && ride._id))
        .slice(0, 3)
    : [];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section
        id="hero-section"
        className={`bg-gradient-to-r from-lau-green to-lau-dark py-16 transition-opacity duration-500 md:py-24 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="text-white md:w-1/2">
              <h1 className="mb-4 text-3xl font-bold md:text-5xl">
                Share a Ride with LAU Students
              </h1>

              <p className="mb-8 text-lg md:text-xl">
                Connect with fellow students and share rides to and from campus
                safely and conveniently.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-lau-green hover:bg-gray-100"
                      asChild
                    >
                      <Link to="/rides">Find a Ride</Link>
                    </Button>

                    {userRole === "driver" && (
                      <Button
                        size="lg"
                        className="bg-white text-lau-green hover:bg-gray-100"
                        asChild
                      >
                        <Link to="/rides/create">Offer a Ride</Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-white text-lau-green hover:bg-gray-100"
                      asChild
                    >
                      <Link to="/register">Get Started</Link>
                    </Button>

                    <Button
                      size="lg"
                      className="bg-white text-lau-green hover:bg-gray-100"
                      asChild
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/3">
              <img
                src="/placeholder.png"
                alt="Students sharing rides"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="hover-scale flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-lau-light">
                <UserPlus className="h-10 w-10 text-lau-green" />
              </div>

              <h3 className="mb-2 text-xl font-semibold">Create an Account</h3>

              <p className="max-w-md text-gray-600">
                Sign up as a driver or passenger using your LAU email and verify
                your identity.
              </p>
            </div>

            <div className="hover-scale flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-lau-light">
                <Car className="h-10 w-10 text-lau-green" />
              </div>

              <h3 className="mb-2 text-xl font-semibold">
                Find or Offer Rides
              </h3>

              <p className="max-w-md text-gray-600">
                Search for available rides or offer your own to help fellow
                students commute.
              </p>
            </div>

            <div className="hover-scale flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-lau-light">
                <MapPin className="h-10 w-10 text-lau-green" />
              </div>

              <h3 className="mb-2 text-xl font-semibold">Travel Together</h3>

              <p className="max-w-md text-gray-600">
                Connect safely via QR verification, save money, reduce traffic,
                and make new friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rides */}
      <section
        id="featured-section"
        className={`bg-gray-50 py-16 transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Rides</h2>

            <Button variant="ghost" asChild>
              <Link to="/rides" className="flex items-center">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredRides.length === 0 ? (
              <p className="text-gray-600 md:col-span-2 lg:col-span-3">
                No available rides at the moment.
              </p>
            ) : (
              featuredRides.map((ride) => {
                const pickupLocation =
                  ride.pickupLocation?.trim() || "Unknown pickup";

                const destination =
                  ride.destination?.trim() || "Unknown destination";

                const route = ride.route?.trim() || "Not provided";

                const seats =
                  typeof ride.availableSeats === "number"
                    ? ride.availableSeats
                    : 0;

                return (
                  <Card
                    key={ride._id}
                    className="flex h-full flex-col overflow-hidden"
                  >
                    <CardHeader>
                      <CardTitle className="line-clamp-3 text-lg">
                        {pickupLocation} → {destination}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      <p>{formatRideDate(ride.date)}</p>

                      <p>Route: {route}</p>

                      <p>Seats: {seats}</p>

                      <p>Driver: {getDriverName(ride.driverId)}</p>
                    </CardContent>

                    <CardFooter className="mt-auto pt-0">
                      <Button
                        asChild
                        className="w-full bg-lau-green hover:bg-lau-dark"
                      >
                        <Link to={`/rides/${ride._id}`}>View ride</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Share a Ride?
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="hover-scale rounded-lg bg-lau-light p-6">
              <h3 className="mb-3 text-xl font-semibold">Save Money</h3>

              <p className="text-gray-600">
                Split fuel and parking costs with fellow students, making
                commuting more affordable for everyone.
              </p>
            </div>

            <div className="hover-scale rounded-lg bg-lau-light p-6">
              <h3 className="mb-3 text-xl font-semibold">Reduce Stress</h3>

              <p className="text-gray-600">
                Avoid the hassle of finding parking and navigating traffic
                alone. Share the driving responsibility.
              </p>
            </div>

            <div className="hover-scale rounded-lg bg-lau-light p-6">
              <h3 className="mb-3 text-xl font-semibold">
                Environmental Impact
              </h3>

              <p className="text-gray-600">
                Reduce carbon emissions by sharing rides and contributing to a
                greener campus environment.
              </p>
            </div>

            <div className="hover-scale rounded-lg bg-lau-light p-6">
              <h3 className="mb-3 text-xl font-semibold">Community Building</h3>

              <p className="text-gray-600">
                Connect with fellow LAU students, build relationships, and
                strengthen our university community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-lau-green py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Share a Ride?</h2>

          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Join our community of LAU students sharing rides to make commuting
            easier, cheaper, and more sustainable.
          </p>

          {isAuthenticated ? (
            <Button
              size="lg"
              className="bg-white text-lau-green hover:bg-gray-100"
              asChild
            >
              <Link to="/rides">Find Available Rides</Link>
            </Button>
          ) : (
            <Button
              size="lg"
              className="bg-white text-lau-green hover:bg-gray-100"
              asChild
            >
              <Link to="/register">Sign Up Now</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
