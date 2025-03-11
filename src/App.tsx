
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import RidesPage from "./pages/RidesPage";
import OfferRidePage from "./pages/OfferRidePage";
import PassengerSignIn from "./pages/PassengerSignIn";
import PassengerSignUp from "./pages/PassengerSignUp";
import DriverSignIn from "./pages/DriverSignIn";
import DriverSignUp from "./pages/DriverSignUp";
import FeedbackPage from "./pages/FeedbackPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rides" element={<RidesPage />} />
              <Route path="/offer-ride" element={<OfferRidePage />} />
              <Route path="/passenger-signin" element={<PassengerSignIn />} />
              <Route path="/passenger-signup" element={<PassengerSignUp />} />
              <Route path="/driver-signin" element={<DriverSignIn />} />
              <Route path="/driver-signup" element={<DriverSignUp />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
