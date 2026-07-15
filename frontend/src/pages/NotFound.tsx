import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, MapPinOff } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="map-grid flex min-h-screen flex-col bg-background p-5 sm:p-8">
      <BrandLogo />
      <main className="grid flex-1 place-items-center py-12">
        <div className="surface w-full max-w-xl p-8 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-lau-light text-lau-green">
            <MapPinOff className="h-7 w-7" />
          </span>
          <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.18em] text-lau-green">Error 404</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-950">This route does not exist.</h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-zinc-600">
            The page may have moved, or the address may be incorrect. Return to the home page to continue.
          </p>
          <Button asChild className="mt-7" size="lg">
            <Link to="/">
              <ArrowLeft /> Return home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
