import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import { useRides } from "@/contexts/RideContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function RideCreatePage() {
  const { addRide } = useRides();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const localDateValue = String(formData.get("date"));

    /*
     * datetime-local does not include a timezone.
     * Convert the selected local time to UTC before sending it.
     */
    const selectedDate = new Date(localDateValue);

    if (Number.isNaN(selectedDate.getTime())) {
      toast({
        title: "Invalid date",
        description: "Please select a valid ride date and time.",
        variant: "destructive",
      });

      return;
    }

    setBusy(true);

    try {
      const ride = await addRide({
        date: selectedDate.toISOString(),
        pickupLocation: String(formData.get("pickupLocation")),
        destination: String(formData.get("destination")),
        route: String(formData.get("route")),
        availableSeats: Number(formData.get("availableSeats")),
        notes: String(formData.get("notes") || ""),
        isFemaleOnly: formData.get("isFemaleOnly") === "on",
      });

      navigate(`/rides/${ride._id}`);
    } catch (error) {
      toast({
        title: "Could not create ride",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Offer a ride</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input
                name="pickupLocation"
                placeholder="Pickup location"
                required
              />

              <Input name="destination" placeholder="Destination" required />

              <Input name="route" placeholder="Route description" required />

              <Input name="date" type="datetime-local" required />

              <Input
                name="availableSeats"
                type="number"
                min="1"
                max="8"
                placeholder="Seats"
                required
              />

              <Input name="notes" placeholder="Notes (optional)" />

              <label className="flex gap-2">
                <input name="isFemaleOnly" type="checkbox" />
                Female-only ride
              </label>

              <Button disabled={busy} className="w-full bg-lau-green">
                {busy ? "Creating..." : "Create ride"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
