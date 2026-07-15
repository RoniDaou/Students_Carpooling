import { useState } from "react";
import {
  Building2,
  Car,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const initials = `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`.toUpperCase();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBusy(true);

    try {
      await updateProfile({
        first_name: String(formData.get("first_name")),
        last_name: String(formData.get("last_name")),
        phoneNumber: String(formData.get("phoneNumber")),
        campusLocation: String(formData.get("campusLocation")),
        location: String(formData.get("location")),
        vehicleNumber: String(formData.get("vehicleNumber") || ""),
      });
      toast({ title: "Profile updated", description: "Your latest details have been saved." });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Account settings"
        title="My profile"
        description="Keep your contact, campus, and commuting information accurate for smoother ride coordination."
      />

      <section className="page-container py-10 md:py-14">
        <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="surface overflow-hidden lg:sticky lg:top-24">
            <div className="bg-zinc-950 p-6 text-white">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-lau-green text-xl font-extrabold shadow-lg shadow-lau-green/20">
                {initials || "U"}
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="mt-1 text-sm capitalize text-zinc-400">{user.role} account</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" /> LAU member
              </span>
            </div>

            <div className="space-y-4 p-6 text-sm">
              <p className="flex items-start gap-3 text-zinc-600">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span className="break-all">{user.universityEmail}</span>
              </p>
              <p className="flex items-start gap-3 text-zinc-600">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span>{user.universityName}</span>
              </p>
              <p className="flex items-start gap-3 text-zinc-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span>{user.campusLocation}</span>
              </p>
              {user.role === "driver" && (
                <p className="flex items-start gap-3 text-zinc-600">
                  <Car className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <span>{user.vehicleNumber || "Vehicle not provided"}</span>
                </p>
              )}
            </div>
          </aside>

          <form onSubmit={submit} className="surface overflow-hidden">
            <div className="border-b border-zinc-100 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-lau-light text-lau-green">
                  <UserRound className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-zinc-950">Personal details</h2>
                  <p className="mt-1 text-sm text-zinc-500">Information other members may use to identify or contact you.</p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="field-label">First name</span>
                  <Input name="first_name" defaultValue={user.first_name} required />
                </label>
                <label>
                  <span className="field-label">Last name</span>
                  <Input name="last_name" defaultValue={user.last_name} required />
                </label>
                <label className="sm:col-span-2">
                  <span className="field-label">University email</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input className="pl-11" disabled value={user.universityEmail} />
                  </div>
                  <span className="field-help">Your verified university email cannot be edited here.</span>
                </label>
                <label className="sm:col-span-2">
                  <span className="field-label">Phone number</span>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input name="phoneNumber" className="pl-11" defaultValue={user.phoneNumber} required />
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-950 text-white">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-zinc-950">Commute details</h2>
                  <p className="mt-1 text-sm text-zinc-500">Your campus, home area, and driver information.</p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="field-label">Campus location</span>
                  <Input name="campusLocation" defaultValue={user.campusLocation} required />
                </label>
                <label>
                  <span className="field-label">Home location</span>
                  <Input name="location" defaultValue={user.location} required />
                </label>
                {user.role === "driver" && (
                  <label className="sm:col-span-2">
                    <span className="field-label">Vehicle or plate number</span>
                    <div className="relative">
                      <Car className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input name="vehicleNumber" className="pl-11" defaultValue={user.vehicleNumber} />
                    </div>
                  </label>
                )}
              </div>

              <div className="mt-7 flex flex-col gap-4 rounded-xl bg-lau-light p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-lau-green" /> Review your details before saving.
                </p>
                <Button disabled={busy} type="submit">
                  <Save /> {busy ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
