import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Plus, UserRound, X } from "lucide-react";

import BrandLogo from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
    isActive
      ? "bg-zinc-100 text-zinc-950"
      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
  );

export default function Navbar() {
  const { isAuthenticated, logout, userRole, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login");
  };

  const firstName = user?.first_name?.trim() || "Profile";

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
      <div className="page-container flex h-[72px] items-center justify-between">
        <BrandLogo onClick={closeMobileMenu} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/rides" className={navLinkClass}>
                Find rides
              </NavLink>
              <NavLink to="/bookings" className={navLinkClass}>
                {userRole === "driver" ? "Requests" : "My rides"}
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthenticated ? (
            <>
              {userRole === "driver" && (
                <Button asChild size="sm" className="mr-1">
                  <Link to="/rides/create">
                    <Plus className="h-4 w-4" />
                    Offer a ride
                  </Link>
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile" aria-label="Open profile">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                  {firstName}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Create account</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-900 lg:hidden"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-[73px] z-40 h-[calc(100vh-73px)] border-t border-zinc-100 bg-white transition-all duration-300 lg:hidden",
          mobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0",
        )}
      >
        <div className="page-container flex h-full flex-col py-6">
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ...(isAuthenticated
                ? [
                    ["Find rides", "/rides"],
                    [userRole === "driver" ? "Passenger requests" : "My rides", "/bookings"],
                    ["My profile", "/profile"],
                  ]
                : []),
            ].map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between border-b border-zinc-100 py-4 text-lg font-bold",
                    isActive ? "text-lau-green" : "text-zinc-950",
                  )
                }
              >
                {label}
                <span className="text-zinc-300">→</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto grid gap-3 pb-6">
            {isAuthenticated ? (
              <>
                {userRole === "driver" && (
                  <Button asChild size="lg">
                    <Link to="/rides/create" onClick={closeMobileMenu}>
                      <Plus /> Offer a ride
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="lg" onClick={handleLogout}>
                  <LogOut /> Log out
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/register" onClick={closeMobileMenu}>
                    Create account
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/login" onClick={closeMobileMenu}>
                    Log in
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
