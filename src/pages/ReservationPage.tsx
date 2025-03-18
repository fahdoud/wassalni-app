
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
import { ChevronLeft, Car, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '@/components/chat/ChatInterface';
import RideMap from '@/components/maps/RideMap';
import { Skeleton } from '@/components/ui/skeleton';

const ReservationPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("ride-details");
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [rideLocations, setRideLocations] = useState<{
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  } | null>(null);

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

  // Set some random but realistic locations for Constantine
  useEffect(() => {
    if (ride) {
      // These would normally come from your database
      // Using some realistic locations in Constantine
      const constantineLocations: Record<string, {
        lat: number;
        lng: number;
      }> = {
        "Ain Abid": { lat: 36.232, lng: 6.942 },
        "Ali Mendjeli": { lat: 36.262, lng: 6.606 },
        "Bekira": { lat: 36.321, lng: 6.599 },
        "Boussouf": { lat: 36.369, lng: 6.608 },
        "Didouche Mourad": { lat: 36.451, lng: 6.604 },
        "El Khroub": { lat: 36.263, lng: 6.697 },
        "Hamma Bouziane": { lat: 36.412, lng: 6.599 },
        "Zighoud Youcef": { lat: 36.531, lng: 6.709 },
        "City Center": { lat: 36.365, lng: 6.614 },
        // Default to center of Constantine
        "Constantine": { lat: 36.365, lng: 6.614 }
      };

      // Try to find locations by name, fallback to defaults
      const origin = constantineLocations[ride.from] || constantineLocations["Constantine"];
      const destination = constantineLocations[ride.to] || {
        lat: origin.lat + Math.random() * 0.1,
        lng: origin.lng + Math.random() * 0.1
      };
      setRideLocations({ origin, destination });
    }
  }, [ride]);

  // Automatically switch to tracking tab when reservation is successful
  useEffect(() => {
    if (reservationSuccess) {
      // Small delay to ensure UI is ready before switching
      setTimeout(() => {
        setActiveTab("tracking");
      }, 100);
    }
  }, [reservationSuccess]);

  useEffect(() => {
    const fetchUser = async () => {
      setCheckingAuth(true);
      console.log("Fetching user in ReservationPage");
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User data in ReservationPage:", user ? "User found" : "No user");
      setUser(user);
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        setUserName(profile?.full_name || user.email || "User");
      }
      setCheckingAuth(false);
    };
    fetchUser();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in ReservationPage:", event, "Session:", !!session);
      fetchUser(); // Refetch user data when auth state changes
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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
              {reservationSuccess && (
                <TabsTrigger value="tracking" className="flex-1">
                  {t('reservation.liveTracking')}
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
                    setPassengerCount={setSeats} 
                    onSubmit={makeReservation} 
                    error={reservationError} 
                    isAuthenticated={isAuthenticated} 
                  />
                </TabsContent>
                
                <TabsContent value="confirmation">
                  <ConfirmationDetails ride={ride} seats={seats} />
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
                
                <TabsContent value="tracking" className="mt-0">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Car className="h-5 w-5 text-wassalni-green" />
                          {t('reservation.liveTracking')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {t('reservation.trackingDescription')}
                        </p>
                        
                        {rideLocations ? (
                          <RideMap 
                            rideId={rideId || ''} 
                            originLocation={rideLocations.origin} 
                            destinationLocation={rideLocations.destination}
                          />
                        ) : (
                          <div className="space-y-2">
                            <Skeleton className="w-full h-[400px] rounded-lg" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-wassalni-green" />
                          {t('reservation.driverInfo')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-wassalni-green flex items-center justify-center text-white">
                            {ride?.driver.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{ride?.driver}</p>
                            <div className="flex items-center text-yellow-500 text-sm">
                              {'★'.repeat(Math.floor(ride?.rating || 0))}
                              <span className="text-gray-400 ml-1">{ride?.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        {rideLocations && (
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-600 dark:text-gray-300">
                                {t('reservation.pickup')}
                              </p>
                              <p className="whitespace-normal break-words">{ride?.from}</p>
                              <p className="text-xs text-gray-500">{ride?.time}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-gray-600 dark:text-gray-300">
                                {t('reservation.dropoff')}
                              </p>
                              <p className="whitespace-normal break-words">{ride?.to}</p>
                              <p className="text-xs text-gray-500">
                                {t('reservation.estimatedArrival')}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
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
