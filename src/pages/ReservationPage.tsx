
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

const ReservationPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("ride-details");
  
  const { user, userName, checkingAuth } = useAuthUser();
  
  const {
    ride,
    isLoading,
    seats,
    setSeats,
    price,
    makeReservation,
    reservationSuccess,
    reservationError,
    isAuthenticated
  } = useReservation(rideId || "");

  const rideLocations = useRideLocations(ride);

  // Preload map data as soon as ride data is available
  useEffect(() => {
    if (ride && rideId) {
      console.log("Preloading map data for ride:", rideId);
      // This forces the map components to start initializing early
      const preloadTab = document.createElement('div');
      preloadTab.style.position = 'absolute';
      preloadTab.style.visibility = 'hidden';
      document.body.appendChild(preloadTab);
      
      // Clean up
      return () => {
        document.body.removeChild(preloadTab);
      };
    }
  }, [ride, rideId]);

  // Automatically switch to tracking tab when reservation is successful
  useEffect(() => {
    if (reservationSuccess) {
      // Immediately switch to tracking tab on successful reservation
      console.log("Reservation successful, switching to tracking tab");
      toast.success(t('reservation.successNotification'));
      setActiveTab("tracking");
    }
  }, [reservationSuccess, t]);

  // Only show chat tab for authenticated users with a successful reservation on a real ride
  const showChatTab = reservationSuccess && user && ride && !/^\d+$/.test(ride.id);

  if (isLoading || checkingAuth) {
    return (
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => navigate(-1)}>
        <ChevronLeft size={16} />
        {t('back')}
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
