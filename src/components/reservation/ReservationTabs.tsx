
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';
import RideDetails from '@/components/reservation/RideDetails';
import PaymentDetails from '@/components/reservation/PaymentDetails';
import ConfirmationDetails from '@/components/reservation/ConfirmationDetails';
import ChatInterface from '@/components/chat/ChatInterface';
import TrackingSection from '@/components/reservation/TrackingSection';
import { Ride } from '@/services/rides/types';

interface ReservationTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  ride: Ride | null;
  rideId: string;
  seats: number;
  setSeats: (seats: number) => void;
  price: number;
  makeReservation: () => Promise<void>;
  reservationSuccess: boolean;
  reservationError: string | null;
  isAuthenticated: boolean;
  showChatTab: boolean;
  rideLocations: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  } | null;
  userName: string;
  userId: string;
  seatAvailability?: {
    total: number;
    remaining: number;
    available: boolean;
  } | null;
}

const ReservationTabs: React.FC<ReservationTabsProps> = ({
  activeTab,
  setActiveTab,
  ride,
  rideId,
  seats,
  setSeats,
  price,
  makeReservation,
  reservationSuccess,
  reservationError,
  isAuthenticated,
  showChatTab,
  rideLocations,
  userName,
  userId,
  seatAvailability
}) => {
  const { t, language } = useLanguage();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full mb-6 bg-gray-900 p-0 h-auto rounded-none dark:bg-gray-900 flex">
        <TabsTrigger 
          value="ride-details" 
          className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none truncate"
        >
          {t('reservation.rideDetails')}
        </TabsTrigger>
        <TabsTrigger 
          value="payment" 
          className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none truncate"
        >
          {t('reservation.payment')}
        </TabsTrigger>
        <TabsTrigger 
          value="confirmation" 
          className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none truncate" 
          disabled={!reservationSuccess}
        >
          {t('reservation.confirmation')}
        </TabsTrigger>
        {showChatTab && (
          <TabsTrigger 
            value="chat" 
            className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none truncate"
          >
            {t('chat.groupChat')}
          </TabsTrigger>
        )}
        {reservationSuccess && (
          <TabsTrigger 
            value="tracking" 
            className="flex-1 px-3 py-2.5 text-xs sm:text-sm font-medium text-gray-300 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none rounded-none truncate"
          >
            {language === 'fr' ? 'Suivi' : t('reservation.liveTracking')}
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="ride-details">
        {ride && (
          <RideDetails 
            ride={ride} 
            seats={seats} 
            setSeats={setSeats} 
            goToPayment={() => handleTabChange('payment')} 
            seatAvailability={seatAvailability}
          />
        )}
      </TabsContent>
      
      <TabsContent value="payment">
        <PaymentDetails 
          price={price} 
          seats={seats} 
          setPassengerCount={setSeats} 
          onSubmit={makeReservation} 
          error={reservationError} 
          isAuthenticated={isAuthenticated} 
          ride={ride}
          seatAvailability={seatAvailability}
        />
      </TabsContent>
      
      <TabsContent value="confirmation">
        <ConfirmationDetails ride={ride!} seats={seats} />
      </TabsContent>
      
      {showChatTab && (
        <TabsContent value="chat">
          {userId && ride && (
            <ChatInterface 
              rideId={ride.id} 
              userId={userId} 
              userName={userName} 
            />
          )}
        </TabsContent>
      )}
      
      <TabsContent value="tracking" className="mt-0">
        <TrackingSection 
          ride={ride} 
          rideId={rideId} 
          rideLocations={rideLocations} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ReservationTabs;
