import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import AuthShell from "@/components/common/AuthShell";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      navigate("/rides");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your details.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in with your university account to find rides, review requests, and manage your profile."
    >
      <form onSubmit={submit} className="surface p-6 sm:p-7">
        <label className="block">
          <span className="field-label">University email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="email"
              className="pl-11"
              placeholder="name@lau.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className="mt-5 block">
          <span className="field-label">Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              type="password"
              className="pl-11"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </label>

        <Button disabled={busy} className="mt-6 w-full" size="lg">
          {busy ? "Signing in…" : "Sign in"}
          {!busy && <ArrowRight />}
        </Button>

        <p className="mt-6 text-center text-sm text-zinc-600">
          New to LAU Ride?{" "}
          <Link className="font-bold text-lau-green hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
