
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from "@/pages/Index";
import PassengerSignIn from "@/pages/PassengerSignIn";
import DriverSignIn from "@/pages/DriverSignIn";
import PassengerSignUp from "@/pages/PassengerSignUp";
import DriverSignUp from "@/pages/DriverSignUp";
import ProfilePage from "@/pages/ProfilePage";
import RidesPage from "@/pages/RidesPage";
import MyTripsPage from "@/pages/MyTripsPage";
import MyReservationsPage from "@/pages/MyReservationsPage";
import OfferRidePage from "@/pages/OfferRidePage";
import FeedbackPage from "@/pages/FeedbackPage";
import ReservationPage from "@/pages/ReservationPage";
import NotFound from "@/pages/NotFound";
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Toaster } from "@/components/ui/sonner";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import VerifyPhonePage from "@/pages/VerifyPhonePage";
import OnboardingPage from "@/pages/OnboardingPage";
import { useIsMobileSimple } from '@/hooks/use-mobile';

function App() {
  const { theme } = useTheme();
  const isMobile = useIsMobileSimple();
  
  // Add viewport meta tag for better mobile experience
  useEffect(() => {
    // Check for iOS PWA mode safely
    const isInStandaloneMode = () => 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    if (isInStandaloneMode()) {
      document.body.classList.add('ios-pwa');
    }
  }, []);

  return (
    <div className={theme}>
      <Router>
        <LanguageProvider>
          <ThemeProvider>
            <div className="dark:bg-gray-950 min-h-screen">
              <Routes>
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/" element={<Index />} />
                <Route path="/passenger-signin" element={<PassengerSignIn />} />
                <Route path="/driver-signin" element={<DriverSignIn />} />
                <Route path="/passenger-signup" element={<PassengerSignUp />} />
                <Route path="/driver-signup" element={<DriverSignUp />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/verify-phone" element={<VerifyPhonePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/rides" element={<RidesPage />} />
                <Route path="/my-trips" element={<MyTripsPage />} />
                <Route path="/my-reservations" element={<MyReservationsPage />} />
                <Route path="/offer-ride" element={<OfferRidePage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/ride/:rideId" element={<ReservationPage />} />
                <Route path="/reservation/:rideId" element={<ReservationPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position={isMobile ? "bottom-center" : "top-right"} />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </Router>
    </div>
  );
}

export default App;
