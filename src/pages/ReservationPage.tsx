
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientText from "@/components/ui-components/GradientText";
import { useReservation } from "@/hooks/useReservation";
import LoadingState from "@/components/reservation/LoadingState";
import RideDetails from "@/components/reservation/RideDetails";
import PaymentDetails from "@/components/reservation/PaymentDetails";
import ConfirmationDetails from "@/components/reservation/ConfirmationDetails";
import ReservationSidebar from "@/components/reservation/ReservationSidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReservationPage = () => {
  const { t } = useLanguage();
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string>("");
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      const isLoggedIn = !!data.user;
      setIsAuthenticated(isLoggedIn);
      
      if (!isLoggedIn) {
        toast.error(t('auth.loginRequired') || "Please log in to make a reservation");
        navigate("/passenger-signin", { 
          state: { returnTo: `/reservation/${rideId}` } 
        });
      } else {
        // Get user name for chat
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user.id)
          .single();
          
        if (profile) {
          setUserName(profile.full_name || data.user.email || "User");
        }
      }
    };
    
    checkAuth();
  }, [navigate, rideId, t]);
  
  const {
    ride,
    passengerCount,
    setPassengerCount,
    loading,
    initialLoading,
    step,
    setStep,
    userId,
    handleReservation
  } = useReservation(rideId);

  // If still checking auth or auth check complete but not authenticated, show loading
  if (isAuthenticated === null || isAuthenticated === false) {
    return <LoadingState />;
  }

  if (initialLoading) {
    return <LoadingState />;
  }

  if (!ride) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <button 
            onClick={() => navigate("/rides")} 
            className="flex items-center text-gray-600 hover:text-wassalni-green mb-6 transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
          >
            <ChevronLeft size={18} />
            <span>{t('rides.title')}</span>
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <GradientText>{t('reservation.title')}</GradientText>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{t('reservation.subtitle')}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
              {step === 1 && (
                <RideDetails
                  ride={ride}
                  onContinue={() => setStep(2)}
                />
              )}
              
              {step === 2 && (
                <PaymentDetails
                  ride={ride}
                  passengerCount={passengerCount}
                  setPassengerCount={setPassengerCount}
                  onBack={() => setStep(1)}
                  onConfirm={handleReservation}
                  loading={loading}
                />
              )}
              
              {step === 3 && (
                <>
                  <ConfirmationDetails
                    ride={ride}
                    passengerCount={passengerCount}
                  />
                  
                  {/* Add chat interface after successful reservation */}
                  <div className="mt-8 glass-card p-6 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">{t('chat.title') || "Group Chat"}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {t('chat.description') || "Chat with the driver and other passengers"}
                    </p>
                    <div className="h-96 border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                      {userId && (
                        <ChatInterface 
                          rideId={ride.id || ride.trip_id || ''}
                          userId={userId}
                          userName={userName}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {/* Show chat tab for existing reservations */}
              {step === 1 && userId && (
                <div className="mt-8 glass-card p-6 rounded-xl">
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">{t('reservation.details') || "Ride Details"}</TabsTrigger>
                      <TabsTrigger value="chat">{t('chat.title') || "Group Chat"}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('reservation.detailsDescription') || "View detailed information about this ride."}
                      </p>
                    </TabsContent>
                    <TabsContent value="chat">
                      <div className="h-96 border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                        <ChatInterface 
                          rideId={ride.id || ride.trip_id || ''}
                          userId={userId}
                          userName={userName}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            
            {(step === 1 || step === 2) && (
              <ReservationSidebar
                ride={ride}
                step={step}
                passengerCount={passengerCount}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReservationPage;
