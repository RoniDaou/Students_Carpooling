import { Navigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element;
  role?: "driver" | "passenger";
}) {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-lau-green" />
          <p className="mt-3 text-sm font-semibold text-zinc-600">
            Loading your account…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && userRole !== role) return <Navigate to="/rides" replace />;

  return children;
}
