import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useRides } from "@/contexts/RideContext";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export default function RidesListPage() {
  const { rides, loading, loadRides } = useRides();
  const [q, setQ] = useState("");
  useEffect(() => {
    loadRides();
  }, []);
  const filtered = rides.filter((r) =>
    `${r.pickupLocation} ${r.destination} ${r.route}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Available rides</h1>
          <Input
            className="max-w-xs"
            placeholder="Search route"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <Card key={r._id}>
                <CardHeader>
                  <CardTitle>
                    {r.pickupLocation} → {r.destination}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>{new Date(r.date).toLocaleString()}</p>
                  <p>Route: {r.route}</p>
                  <p>Seats: {r.availableSeats}</p>
                  <p>
                    Driver:{" "}
                    {typeof r.driverId === "string"
                      ? "Driver"
                      : `${r.driverId.first_name} ${r.driverId.last_name}`}
                  </p>
                  <Button asChild className="w-full bg-lau-green">
                    <Link to={`/rides/${r._id}`}>View ride</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
