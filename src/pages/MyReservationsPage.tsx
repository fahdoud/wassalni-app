
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, MapPin, Clock, Users, Ban } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getUserReservations, cancelReservation } from "@/services/rides/userReservationsQueries";
import { Reservation } from "@/services/rides/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientText from "@/components/ui-components/GradientText";

const MyReservationsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        navigate("/passenger-signin");
        return;
      }
      
      setAuthenticated(true);
      fetchReservations();
    };

    checkAuth();
  }, [navigate]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await getUserReservations();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load your reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      const success = await cancelReservation(id);
      if (success) {
        // Refresh the reservations list
        fetchReservations();
      }
    }
  };

  if (!authenticated) return null;

  const activeReservations = reservations.filter(r => r.status === 'confirmed');
  const pastReservations = reservations.filter(r => r.status !== 'confirmed');

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

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <GradientText>My Reservations</GradientText>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage all your ride reservations
            </p>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active Reservations</TabsTrigger>
              <TabsTrigger value="past">Past Reservations</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              {loading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wassalni-green"></div>
                </div>
              ) : activeReservations.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      No active reservations found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      You don't have any upcoming rides reserved
                    </p>
                    <Link to="/rides">
                      <Button>Find a Ride</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {activeReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancel={() => handleCancelReservation(reservation.id)}
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
              ) : pastReservations.length === 0 ? (
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      No past reservations found
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      You don't have any past ride history
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastReservations.map((reservation) => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
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

const ReservationCard = ({
  reservation,
  onCancel,
  isPast = false
}: {
  reservation: Reservation;
  onCancel?: () => void;
  isPast?: boolean;
}) => {
  if (!reservation.trip) return null;

  const formattedDate = new Date(reservation.trip.departure_time).toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = new Date(reservation.trip.departure_time).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const driverName = reservation.trip?.profiles?.full_name || "Unknown Driver";
  const driverInitials = driverName.split(' ').map(n => n[0]).join('').toUpperCase() || "U";
  
  const totalPrice = (reservation.trip.price * reservation.seats_reserved).toFixed(2);

  return (
    <Card className="overflow-hidden border-wassalni-green/10 shadow-md">
      <CardHeader className="bg-gradient-to-r from-wassalni-green/5 to-wassalni-blue/5 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{reservation.trip.origin} → {reservation.trip.destination}</CardTitle>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            reservation.status === 'confirmed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="col-span-3 space-y-3">
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
              <span className="text-sm">{reservation.trip.origin} → {reservation.trip.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-wassalni-green" />
              <span className="text-sm">{reservation.seats_reserved} seat(s) reserved</span>
            </div>
          </div>
          
          <div className="col-span-2 flex flex-col justify-between border-l pl-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 border border-wassalni-green/20">
                <AvatarFallback className="bg-wassalni-green/10 text-wassalni-green">
                  {driverInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{driverName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Driver</div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-wassalni-green dark:text-wassalni-lightGreen">
                {totalPrice} <span className="text-xs">DZD</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total for {reservation.seats_reserved} seat(s)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      {!isPast && reservation.status === 'confirmed' && onCancel && (
        <CardFooter className="border-t pt-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Reserved on {new Date(reservation.created_at).toLocaleDateString()}
            </div>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
              onClick={onCancel}
            >
              <Ban className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </CardFooter>
      )}
      
      {(isPast || reservation.status !== 'confirmed') && (
        <CardFooter className="border-t pt-3 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-full flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Reserved on {new Date(reservation.created_at).toLocaleDateString()}
            </div>
            {reservation.status === 'completed' && (
              <Link to={`/feedback?tripId=${reservation.trip_id}&driverId=${reservation.trip.driver_id}`}>
                <Button variant="outline">Leave Feedback</Button>
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyReservationsPage;
