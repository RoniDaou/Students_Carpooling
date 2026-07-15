import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function SOSButton({ rideId }: { rideId?: string }) {
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const sendSOS = async () => {
    if (!rideId) {
      toast({ title: "Open a ride first", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      await api("/rides/sos", {
        method: "POST",
        body: JSON.stringify({ rideId }),
      });
      toast({ title: "SOS alert sent", variant: "destructive" });
    } catch (error) {
      toast({
        title: "SOS failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="fixed bottom-5 right-5 z-40 h-12 rounded-full px-4 shadow-[0_12px_35px_rgba(220,38,38,0.3)] sm:bottom-6 sm:right-6"
      disabled={busy}
      onClick={() => void sendSOS()}
      aria-label="Send emergency SOS alert"
      title="Send SOS alert"
    >
      <AlertTriangle />
      <span className="hidden sm:inline">SOS</span>
    </Button>
  );
}
