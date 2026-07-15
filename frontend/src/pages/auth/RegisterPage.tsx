import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Car,
  GraduationCap,
  IdCard,
  MapPin,
  Phone,
  Upload,
  UserRound,
} from "lucide-react";

import AuthShell from "@/components/common/AuthShell";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<"driver" | "passenger">("passenger");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBusy(true);

    try {
      await register({
        universityEmail: String(formData.get("universityEmail")),
        password: String(formData.get("password")),
        confirmPassword: String(formData.get("confirmPassword")),
        first_name: String(formData.get("first_name")),
        last_name: String(formData.get("last_name")),
        universityName: String(formData.get("universityName")),
        campusLocation: String(formData.get("campusLocation")),
        phoneNumber: String(formData.get("phoneNumber")),
        location: String(formData.get("location")),
        role,
        vehicleNumber: String(formData.get("vehicleNumber") || ""),
        studentIdPic: formData.get("studentIdPic") as File,
        driverLicensePic: formData.get("driverLicensePic") as File,
      });
      navigate("/rides");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please review your details.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      wide
      title="Create your account"
      description="Join as a passenger or driver. Your submitted information is sent through the existing registration workflow without any API changes."
    >
      <form onSubmit={submit} className="surface overflow-hidden">
        <div className="border-b border-zinc-100 p-6 sm:p-7">
          <p className="field-label">How will you use LAU Ride?</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "passenger" as const,
                icon: UserRound,
                title: "Passenger",
                copy: "Find rides and request available seats.",
              },
              {
                value: "driver" as const,
                icon: Car,
                title: "Driver",
                copy: "Offer rides and manage passenger requests.",
              },
            ].map(({ value, icon: Icon, title, copy }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={cn(
                  "flex items-start gap-4 rounded-xl border p-4 text-left transition",
                  role === value
                    ? "border-lau-green bg-lau-light ring-2 ring-lau-green/10"
                    : "border-zinc-200 bg-white hover:border-zinc-300",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                    role === value ? "bg-lau-green text-white" : "bg-zinc-100 text-zinc-600",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-zinc-950">{title}</span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">{copy}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-zinc-100 p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-lau-green" />
            <h2 className="text-lg font-bold text-zinc-950">Personal and university details</h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label>
              <span className="field-label">First name</span>
              <Input name="first_name" placeholder="First name" required />
            </label>
            <label>
              <span className="field-label">Last name</span>
              <Input name="last_name" placeholder="Last name" required />
            </label>
            <label>
              <span className="field-label">University email</span>
              <Input name="universityEmail" type="email" placeholder="name@lau.edu" required />
            </label>
            <label>
              <span className="field-label">Phone number</span>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input name="phoneNumber" className="pl-11" placeholder="Phone number" required />
              </div>
            </label>
            <label>
              <span className="field-label">University</span>
              <Input
                name="universityName"
                defaultValue="Lebanese American University"
                required
              />
            </label>
            <label>
              <span className="field-label">Campus</span>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input name="campusLocation" className="pl-11" placeholder="Campus location" required />
              </div>
            </label>
            <label className="sm:col-span-2">
              <span className="field-label">Home location</span>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input name="location" className="pl-11" placeholder="Area or city" required />
              </div>
            </label>
          </div>
        </div>

        <div className="border-b border-zinc-100 p-6 sm:p-7">
          <h2 className="text-lg font-bold text-zinc-950">Account security</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label>
              <span className="field-label">Password</span>
              <Input name="password" type="password" placeholder="Create a password" required />
            </label>
            <label>
              <span className="field-label">Confirm password</span>
              <Input name="confirmPassword" type="password" placeholder="Repeat your password" required />
            </label>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <IdCard className="h-5 w-5 text-lau-green" />
            <h2 className="text-lg font-bold text-zinc-950">Verification documents</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Upload the same documents required by the current registration process.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className={cn(role !== "driver" && "sm:col-span-2")}>
              <span className="field-label">Student ID image</span>
              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                  <Upload className="h-4 w-4" /> Image file
                </div>
                <Input name="studentIdPic" type="file" accept="image/*" required className="bg-white" />
              </div>
            </label>

            {role === "driver" && (
              <>
                <label>
                  <span className="field-label">Vehicle or plate number</span>
                  <Input name="vehicleNumber" placeholder="Vehicle/plate number" required />
                </label>
                <label className="sm:col-span-2">
                  <span className="field-label">Driver license image</span>
                  <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                      <Upload className="h-4 w-4" /> Image file
                    </div>
                    <Input name="driverLicensePic" type="file" accept="image/*" required className="bg-white" />
                  </div>
                </label>
              </>
            )}
          </div>

          <Button disabled={busy} className="mt-7 w-full" size="lg">
            {busy ? "Creating account…" : "Create account"}
            {!busy && <ArrowRight />}
          </Button>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-lau-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
