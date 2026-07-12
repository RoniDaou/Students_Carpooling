import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { isAuthenticated, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={closeMobileMenu}
        >
          <img
            src="/lovable-uploads/de2beea1-0f3a-4cca-9619-8f619db2c38c.png"
            alt="LAU Share a Ride"
            className="h-10"
          />

          <span className="hidden text-xl font-bold text-lau-green md:block">
            Share a Ride
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-gray-700 transition-colors hover:text-lau-green"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-gray-700 transition-colors hover:text-lau-green"
          >
            About Us
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/rides"
                className="text-gray-700 transition-colors hover:text-lau-green"
              >
                Find Rides
              </Link>

              {userRole === "driver" && (
                <Link
                  to="/rides/create"
                  className="text-gray-700 transition-colors hover:text-lau-green"
                >
                  Offer Ride
                </Link>
              )}

              <Link
                to="/bookings"
                className="text-gray-700 transition-colors hover:text-lau-green"
              >
                My Bookings
              </Link>

              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  aria-label="My profile"
                  className="text-gray-700 transition-colors hover:text-lau-green"
                >
                  <User className="h-5 w-5" />
                </Link>

                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>

              <Button asChild className="bg-lau-green hover:bg-lau-dark">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className="text-gray-700 md:hidden"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white px-6 pt-20 transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col gap-6">
          <Link
            to="/"
            className="border-b py-2 text-xl font-medium text-gray-800"
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="border-b py-2 text-xl font-medium text-gray-800"
            onClick={closeMobileMenu}
          >
            About Us
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/rides"
                className="border-b py-2 text-xl font-medium text-gray-800"
                onClick={closeMobileMenu}
              >
                Find Rides
              </Link>

              {userRole === "driver" && (
                <Link
                  to="/rides/create"
                  className="border-b py-2 text-xl font-medium text-gray-800"
                  onClick={closeMobileMenu}
                >
                  Offer Ride
                </Link>
              )}

              <Link
                to="/bookings"
                className="border-b py-2 text-xl font-medium text-gray-800"
                onClick={closeMobileMenu}
              >
                My Bookings
              </Link>

              <Link
                to="/profile"
                className="border-b py-2 text-xl font-medium text-gray-800"
                onClick={closeMobileMenu}
              >
                My Profile
              </Link>

              <Button variant="outline" className="mt-4" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={closeMobileMenu}>
                  Login
                </Link>
              </Button>

              <Button asChild className="bg-lau-green hover:bg-lau-dark">
                <Link to="/register" onClick={closeMobileMenu}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
