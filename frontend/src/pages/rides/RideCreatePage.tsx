import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarClock,
  Car,
  CheckCircle2,
  Info,
  MapPin,
  Route,
  ShieldCheck,
  Users,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { useRides } from "@/contexts/RideContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
      toast({ title: "Ride published", description: "Students can now find and request your ride." });
      navigate(`/rides/${ride._id}`);
    } catch (error) {
      toast({
        title: "Could not create ride",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Driver workspace"
        title="Offer a ride"
        description="Publish clear trip details so passengers can quickly decide whether your ride matches their commute."
      />

      <section className="page-container py-10 md:py-14">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form onSubmit={submit} className="surface overflow-hidden">
            <div className="border-b border-zinc-100 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-950 text-white">
                  <Route className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-zinc-950">Route information</h2>
                  <p className="mt-1 text-sm text-zinc-500">Where the ride begins, ends, and travels through.</p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="field-label">Pickup location</span>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input name="pickupLocation" className="pl-11" placeholder="e.g. Hamra" required />
                  </div>
                </label>
                <label>
                  <span className="field-label">Destination</span>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input name="destination" className="pl-11" placeholder="e.g. Byblos campus" required />
                  </div>
                </label>
                <label className="sm:col-span-2">
                  <span className="field-label">Route description</span>
                  <div className="relative">
                    <Route className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-zinc-400" />
                    <Input
                      name="route"
                      className="pl-11"
                      placeholder="e.g. Hamra → Dora → Byblos campus"
                      required
                    />
                  </div>
                  <span className="field-help">Include useful stops or major roads passengers should know.</span>
                </label>
              </div>
            </div>

            <div className="border-b border-zinc-100 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-lau-light text-lau-green">
                  <CalendarClock className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-zinc-950">Schedule and capacity</h2>
                  <p className="mt-1 text-sm text-zinc-500">Set the departure time and number of open seats.</p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="field-label">Departure date and time</span>
                  <Input name="date" type="datetime-local" required />
                </label>
                <label>
                  <span className="field-label">Available seats</span>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                      name="availableSeats"
                      type="number"
                      min="1"
                      max="8"
                      className="pl-11"
                      placeholder="1–8"
                      required
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-zinc-950">Preferences and notes</h2>
              <label className="mt-5 block">
                <span className="field-label">Notes for passengers</span>
                <Textarea
                  name="notes"
                  placeholder="Add pickup instructions, luggage limits, timing details, or anything else passengers should know."
                />
              </label>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 p-4 transition hover:border-lau-green/40 hover:bg-lau-light/40">
                <input
                  name="isFemaleOnly"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-[#006A4E]"
                />
                <span>
                  <span className="block text-sm font-bold text-zinc-950">Female-only ride</span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">
                    Mark this ride as available only to female passengers.
                  </span>
                </span>
              </label>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={() => navigate("/rides")}>
                  Cancel
                </Button>
                <Button disabled={busy} type="submit" className="sm:min-w-40">
                  <Car /> {busy ? "Publishing…" : "Publish ride"}
                </Button>
              </div>
            </div>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="surface p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-lau-green" />
                <h2 className="font-bold text-zinc-950">Create a reliable listing</h2>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  "Use a pickup point students can recognize.",
                  "Choose an accurate departure time.",
                  "Keep seat availability up to date.",
                  "Add any important route or vehicle notes.",
                ].map((tip) => (
                  <p key={tip} className="flex gap-3 text-sm leading-6 text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lau-green" />
                    {tip}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.25rem] bg-zinc-950 p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Info className="h-4 w-4 text-emerald-300" /> Before publishing
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Review all trip details carefully. Passengers will use this information to decide whether to request the ride.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
