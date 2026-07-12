import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
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
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="destructive"
      className="fixed bottom-6 right-6 rounded-full w-14 h-14"
      disabled={busy}
      onClick={sendSOS}
    >
      <AlertTriangle />
    </Button>
  );
}
