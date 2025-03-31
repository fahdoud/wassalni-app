
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReservationSidebar from '@/components/reservation/ReservationSidebar';
import LoadingState from '@/components/reservation/LoadingState';
import { useReservation } from '@/hooks/useReservation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useRideLocations } from '@/hooks/useRideLocations';
import { useAuthUser } from '@/hooks/useAuthUser';
import ReservationTabs from '@/components/reservation/ReservationTabs';
import { preloadGoogleMaps } from '@/components/maps/utils/googleMapsLoader';

const ReservationPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("ride-details");
  
  const { user, userName, checkingAuth } = useAuthUser();
  
  // Start preloading Google Maps immediately on component mount, before anything else
  useEffect(() => {
    console.log("Immediately preloading Google Maps on component mount");
    preloadGoogleMaps();
  }, []);
  
  const {
    ride,
    isLoading,
    seats,
    setSeats,
    price,
    makeReservation,
    reservationSuccess,
    reservationError,
    isAuthenticated,
    isReserving
  } = useReservation(rideId || "");

  const rideLocations = useRideLocations(ride);

  // Automatic tab switching after successful reservation
  useEffect(() => {
    if (reservationSuccess) {
      console.log("Reservation successful, switching to tracking tab");
      const successMessage = language === 'en' ? 'Reservation successful!' : 
                            language === 'fr' ? 'Réservation réussie!' : 
                            'تم الحجز بنجاح!';
      toast.success(successMessage);
      setActiveTab("tracking");
    }
  }, [reservationSuccess, language]);

  // Only show chat tab for authenticated users with a successful reservation on a real ride
  const showChatTab = reservationSuccess && user && ride && !/^\d+$/.test(ride.id);

  if (isLoading || checkingAuth) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <LoadingState />
      </div>
    );
  }

  const backText = language === 'en' ? 'Back' : language === 'fr' ? 'Retour' : 'رجوع';

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => navigate(-1)}>
        <ChevronLeft size={16} />
        {backText}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReservationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ride={ride}
            rideId={rideId || ''}
            seats={seats}
            setSeats={setSeats}
            price={price}
            makeReservation={makeReservation}
            reservationSuccess={reservationSuccess}
            reservationError={reservationError}
            isAuthenticated={isAuthenticated}
            showChatTab={showChatTab}
            rideLocations={rideLocations}
            userName={userName}
            userId={user?.id || ''}
            isReserving={isReserving}
          />
        </div>

        <ReservationSidebar 
          ride={ride!} 
          seats={seats} 
          price={price} 
          reservationSuccess={reservationSuccess} 
        />
      </div>
    </div>
  );
};

export default ReservationPage;
