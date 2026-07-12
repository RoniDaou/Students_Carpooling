import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { RideProvider } from "@/contexts/RideContext";

import ProtectedRoute from "@/components/common/ProtectedRoute";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import BookingsPage from "@/pages/BookingsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import RideCreatePage from "@/pages/rides/RideCreatePage";
import RideDetailPage from "@/pages/rides/RideDetailPage";
import RidesListPage from "@/pages/rides/RidesListPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RideProvider>
          <TooltipProvider>
            <Toaster />

            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/about" element={<AboutPage />} />

                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                <Route
                  path="/rides"
                  element={
                    <ProtectedRoute>
                      <RidesListPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/rides/create"
                  element={
                    <ProtectedRoute role="driver">
                      <RideCreatePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/rides/:rideId"
                  element={
                    <ProtectedRoute>
                      <RideDetailPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <BookingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RideProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
