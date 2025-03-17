
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Clock, Users, Ban, Car } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserProposedTrips, cancelTrip } from "@/services/rides/proposedTripsQueries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientText from "@/components/ui-components/GradientText";

const MyTripsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        navigate("/passenger-signin");
        return;
      }
      
      // Check if the user is a driver
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profile && profile.role === 'driver') {
        setIsDriver(true);
        setAuthenticated(true);
        fetchTrips();
      } else {
        // Redirect non-drivers to the passenger rides page
        navigate("/rides");
        toast.error("You need a driver account to access this page");
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await getUserProposedTrips();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load your trips");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this trip?")) {
      const success = await cancelTrip(id);
      if (success) {
        // Refresh the trips list
        fetchTrips();
      }
    }
  };

  if (!authenticated || !isDriver) return null;

  const activeTrips = trips.filter(t => t.status === 'active' && new Date(t.departure_time) >= new Date());
  const pastTrips = trips.filter(t => t.status !== 'active' || new Date(t.departure_time) < new Date());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-wassalni-green mb-6 transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
          >
            <ChevronLeft size={18} />
            <span>Home</span>
          </Link>

          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <GradientText>My Trips</GradientText>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                View and manage all your offered rides
              </p>
            </div>
            <Link to="/offer-ride">
              <Button className="bg-wassalni-green hover:bg-wassalni-green/90">
                <Car className="mr-2 h-4 w-4" /> Offer New Ride
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active Trips</TabsTrigger>
              <TabsTrigger value="past">Past Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {loading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wassalni-green"></div>
                </div>
              ) : activeTrips.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Car className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      No active trips found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      You don't have any upcoming rides offered
                    </p>
                    <Link to="/offer-ride">
                      <Button>Offer a Ride</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onCancel={() => handleCancelTrip(trip.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wassalni-green"></div>
                </div>
              ) : pastTrips.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      No past trips found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      You don't have any past rides offered
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      isPast={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const TripCard = ({
  trip,
  onCancel,
  isPast = false
}: {
  trip: any;
  onCancel?: () => void;
  isPast?: boolean;
}) => {
  const formattedDate = new Date(trip.departure_time).toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(trip.departure_time).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Count active reservations
  const activeReservations = trip.reservations ? 
    trip.reservations.filter((r: any) => r.status === 'confirmed').length : 0;
  
  const seatsReserved = trip.reservations ? 
    trip.reservations
      .filter((r: any) => r.status === 'confirmed')
      .reduce((sum: number, r: any) => sum + r.seats_reserved, 0) : 0;
  
  return (
    <Card className="overflow-hidden border-wassalni-green/10 shadow-md">
      <CardHeader className="bg-gradient-to-r from-wassalni-green/5 to-wassalni-blue/5 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{trip.origin} → {trip.destination}</CardTitle>
          <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-wassalni-green" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-wassalni-green" />
            <span className="text-sm">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-wassalni-green" />
            <span className="text-sm">{trip.origin} → {trip.destination}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-wassalni-green" />
              <span className="text-sm">{trip.available_seats} seat(s) available</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-wassalni-green dark:text-wassalni-lightGreen">
                {trip.price} <span className="text-xs">DZD</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                per seat
              </p>
            </div>
          </div>
        </div>
        
        {trip.reservations && trip.reservations.length > 0 ? (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Passengers ({activeReservations})</h4>
            <div className="flex flex-wrap gap-2">
              {trip.reservations
                .filter((r: any) => r.status === 'confirmed')
                .map((reservation: any) => (
                  <div key={reservation.id} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full pl-1 pr-3 py-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {reservation.profiles?.full_name ? 
                          reservation.profiles.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{reservation.profiles?.full_name || 'Unknown'} ({reservation.seats_reserved})</span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">No passengers yet</div>
        )}
      </CardContent>
      
      {!isPast && trip.status === 'active' && onCancel && (
        <CardFooter className="border-t pt-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Created on {new Date(trip.created_at).toLocaleDateString()}
            </div>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
              onClick={onCancel}
              disabled={seatsReserved > 0}
            >
              <Ban className="h-4 w-4 mr-1" /> Cancel Trip
            </Button>
          </div>
        </CardFooter>
      )}
      
      {(isPast || trip.status !== 'active') && (
        <CardFooter className="border-t pt-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Created on {new Date(trip.created_at).toLocaleDateString()}
            </div>
            {trip.status === 'completed' && (
              <Link to="/feedback">
                <Button variant="outline">View Feedback</Button>
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyTripsPage;
