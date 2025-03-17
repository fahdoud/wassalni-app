
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import RidesPage from "./pages/RidesPage";
import OfferRidePage from "./pages/OfferRidePage";
import PassengerSignIn from "./pages/PassengerSignIn";
import PassengerSignUp from "./pages/PassengerSignUp";
import DriverSignIn from "./pages/DriverSignIn";
import DriverSignUp from "./pages/DriverSignUp";
import FeedbackPage from "./pages/FeedbackPage";
import ProfilePage from "./pages/ProfilePage";
import ReservationPage from "./pages/ReservationPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

// Auth callback handler
const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { hash } = window.location;
      if (hash) {
        await supabase.auth.getSession();
      }
    };

    handleAuthCallback();
  }, []);

  return <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/rides" element={
                  <ProtectedRoute requiredRole="passenger">
                    <RidesPage />
                  </ProtectedRoute>
                } />
                <Route path="/offer-ride" element={
                  <ProtectedRoute requiredRole="driver">
                    <OfferRidePage />
                  </ProtectedRoute>
                } />
                <Route path="/passenger-signin" element={<PassengerSignIn />} />
                <Route path="/passenger-signup" element={<PassengerSignUp />} />
                <Route path="/driver-signin" element={<DriverSignIn />} />
                <Route path="/driver-signup" element={<DriverSignUp />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <FeedbackPage />
                  </ProtectedRoute>
                } />
                <Route path="/reservation/:rideId" element={
                  <ProtectedRoute requiredRole="passenger">
                    <ReservationPage />
                  </ProtectedRoute>
                } />
                <Route path="/auth/callback" element={<AuthCallback />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
