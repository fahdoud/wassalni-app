
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Ban, Car } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MyTripsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate("/passenger-signin"); return; }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
        
      if (profile?.role === 'driver') {
        setAuthenticated(true);
        fetchTrips(data.user.id);
      } else {
        navigate("/rides");
        toast.error("You need a driver account to access this page");
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchTrips = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('driver_id', userId)
        .order('date_heure', { ascending: false });
      
      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load your trips");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;
    const { error } = await supabase.from('trips').update({ statut: 'cancelled' }).eq('id', id);
    if (error) { toast.error("Failed to cancel"); return; }
    toast.success("Trip cancelled");
    setTrips(prev => prev.map(t => t.id === id ? { ...t, statut: 'cancelled' } : t));
  };

  if (!authenticated) return null;

  const now = new Date();
  const activeTrips = trips.filter(t => t.statut === 'active' && new Date(t.date_heure) >= now);
  const pastTrips = trips.filter(t => t.statut !== 'active' || new Date(t.date_heure) < now);

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 max-w-lg mx-auto">
        <div className="py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-1">My Trips</h1>
            <p className="text-sm text-muted-foreground">Manage your offered rides</p>
          </div>
          <Link to="/offer-ride">
            <Button className="bg-primary hover:bg-primary/90 rounded-xl" size="sm">
              <Car className="mr-1 h-4 w-4" /> New
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : activeTrips.length === 0 ? (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Car className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">No active trips</p>
                  <Link to="/offer-ride"><Button className="mt-4">Offer a Ride</Button></Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onCancel={() => handleCancelTrip(trip.id)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {loading ? (
              <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : pastTrips.length === 0 ? (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">No past trips</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} isPast />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const TripCard = ({ trip, onCancel, isPast = false }: { trip: any; onCancel?: () => void; isPast?: boolean }) => {
  const date = trip.date_heure ? new Date(trip.date_heure) : null;
  const formattedDate = date?.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' }) || '';
  const formattedTime = date?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{trip.lieu_depart} → {trip.lieu_arrivee}</CardTitle>
          <Badge variant={trip.statut === 'active' ? 'default' : 'secondary'}>
            {trip.statut?.charAt(0).toUpperCase() + trip.statut?.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-sm">{formattedDate}</span></div>
        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span className="text-sm">{formattedTime}</span></div>
        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span className="text-sm">{trip.lieu_depart} → {trip.lieu_arrivee}</span></div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><span className="text-sm">{trip.places_disponibles} seat(s)</span></div>
          <p className="text-lg font-bold text-primary">{trip.prix} <span className="text-xs">DZD</span></p>
        </div>
      </CardContent>
      {!isPast && trip.statut === 'active' && onCancel && (
        <CardFooter className="border-t pt-3 bg-muted/30">
          <div className="w-full flex justify-end">
            <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/5" onClick={onCancel}>
              <Ban className="h-4 w-4 mr-1" /> Cancel Trip
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MyTripsPage;
