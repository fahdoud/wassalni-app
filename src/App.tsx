import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
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
import ContactPage from "@/pages/ContactPage";
import ReservationPage from "@/pages/ReservationPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Toaster } from "@/components/ui/sonner";
import VerifyEmailPage from "@/pages/VerifyEmailPage";
import VerifyPhonePage from "@/pages/VerifyPhonePage";
import OnboardingPage from "@/pages/OnboardingPage";
import SplashScreen from "@/components/SplashScreen";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splash_shown');
  });

  useEffect(() => {
    const isInStandaloneMode = () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isInStandaloneMode()) {
      document.body.classList.add('ios-pwa');
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem('splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <div className={theme}>
      <Router>
        <LanguageProvider>
          <ThemeProvider>
            <div className="bg-background min-h-screen min-h-[100dvh] max-w-screen overflow-x-hidden">
              <AnimatePresence mode="wait">
                {showSplash ? (
                  <SplashScreen key="splash" onFinish={handleSplashFinish} />
                ) : (
                  <motion.div
                    key="app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col min-h-screen min-h-[100dvh]"
                  >
                    <AppHeader />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/onboarding" element={<OnboardingPage />} />
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<AuthPage />} />
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
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/ride/:rideId" element={<ReservationPage />} />
                        <Route path="/reservation/:rideId" element={<ReservationPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <BottomNav />
                    <Toaster position="top-center" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </Router>
    </div>
  );
}

export default App;
