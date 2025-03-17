
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservationSidebar from '@/components/reservation/ReservationSidebar';
import RideDetails from '@/components/reservation/RideDetails';
import PaymentDetails from '@/components/reservation/PaymentDetails';
import ConfirmationDetails from '@/components/reservation/ConfirmationDetails';
import LoadingState from '@/components/reservation/LoadingState';
import { useReservation } from '@/hooks/useReservation';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/chat/ChatInterface';

const ReservationPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("ride-details");
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  
  const { 
    ride, 
    isLoading, 
    seats, 
    setSeats,
    price,
    makeReservation,
    reservationSuccess,
    reservationError
  } = useReservation(rideId || "");

  // Get the current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        setUserName(profile?.full_name || user.email || "User");
      }
    };
    
    fetchUser();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Show chat tab only if reservation is successful and we have a user
  const showChatTab = reservationSuccess && user && ride && !(/^\d+$/.test(ride.id));

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={16} />
        {t('back')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="ride-details" className="flex-1">
                {t('reservation.rideDetails')}
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-1">
                {t('reservation.payment')}
              </TabsTrigger>
              <TabsTrigger value="confirmation" className="flex-1" disabled={!reservationSuccess}>
                {t('reservation.confirmation')}
              </TabsTrigger>
              {showChatTab && (
                <TabsTrigger value="chat" className="flex-1">
                  {t('chat.groupChat')}
                </TabsTrigger>
              )}
            </TabsList>

            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                <TabsContent value="ride-details">
                  {ride && (
                    <RideDetails 
                      ride={ride} 
                      seats={seats} 
                      setSeats={setSeats} 
                      goToPayment={() => handleTabChange('payment')} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="payment">
                  <PaymentDetails 
                    price={price} 
                    seats={seats} 
                    onSubmit={makeReservation} 
                    error={reservationError}
                  />
                </TabsContent>
                
                <TabsContent value="confirmation">
                  <ConfirmationDetails 
                    ride={ride} 
                    seats={seats} 
                  />
                </TabsContent>
                
                {showChatTab && (
                  <TabsContent value="chat">
                    {user && ride && (
                      <ChatInterface 
                        rideId={ride.id} 
                        userId={user.id}
                        userName={userName}
                      />
                    )}
                  </TabsContent>
                )}
              </>
            )}
          </Tabs>
        </div>

        <ReservationSidebar 
          ride={ride} 
          seats={seats} 
          price={price}
          reservationSuccess={reservationSuccess}
        />
      </div>
    </div>
  );
};

export default ReservationPage;
