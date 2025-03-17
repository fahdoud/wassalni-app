
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

const ReservationPage = () => {
  const { t } = useLanguage();
  const { rideId } = useParams();
  const navigate = useNavigate();
  
  const {
    ride,
    passengerCount,
    setPassengerCount,
    loading,
    initialLoading,
    step,
    setStep,
    handleReservation
  } = useReservation(rideId);

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
                <ConfirmationDetails
                  ride={ride}
                  passengerCount={passengerCount}
                />
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
