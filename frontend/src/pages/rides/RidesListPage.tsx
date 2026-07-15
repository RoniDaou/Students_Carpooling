import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CarFront, Plus, Search, SlidersHorizontal } from "lucide-react";

import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import RideCard from "@/components/rides/RideCard";
import { useRides } from "@/contexts/RideContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RidesListPage() {
  const { rides, loading, loadRides } = useRides();
  const { userRole } = useAuth();
  const [query, setQuery] = useState("");

  useEffect(() => {
    void loadRides();
  }, [loadRides]);

  const filteredRides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rides;

    return rides.filter((ride) =>
      `${ride.pickupLocation} ${ride.destination} ${ride.route}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, rides]);

  return (
    <Layout>
      <PageHeader
        eyebrow="Live ride board"
        title="Find your next campus ride"
        description="Browse current trips by pickup area, destination, or route, then open a ride to review the full details."
        action={
          userRole === "driver" ? (
            <Button asChild size="lg">
              <Link to="/rides/create">
                <Plus /> Offer a ride
              </Link>
            </Button>
          ) : undefined
        }
      />

      <section className="page-container py-10 md:py-14">
        <div className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative w-full sm:max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              className="pl-11"
              placeholder="Search pickup, destination, or route"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-sm font-semibold text-zinc-500">
              {filteredRides.length} {filteredRides.length === 1 ? "ride" : "rides"}
            </span>
            <Button variant="outline" onClick={() => void loadRides()}>
              <SlidersHorizontal /> Refresh
            </Button>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="surface space-y-5 p-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-11 w-11 rounded-xl" />
                  </div>
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredRides.length > 0 ? (
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CarFront}
              title={query ? "No rides match your search" : "No rides are available yet"}
              description={
                query
                  ? "Try a broader location or clear the search to see all currently listed rides."
                  : "New rides will appear here as soon as drivers publish them."
              }
              action={
                query ? (
                  <Button variant="outline" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                ) : userRole === "driver" ? (
                  <Button asChild>
                    <Link to="/rides/create">
                      <Plus /> Offer the first ride
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
