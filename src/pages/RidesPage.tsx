
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useToast } from '@/components/ui/use-toast';

type Trip = {
  id: string;
  origin: string;
  destination: string;
  available_seats: number;
  price: number;
  departure_time: string;
  driver_id: string;
};

const RidesPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const { data: tripsData, isLoading, isError } = useQuery({
    queryKey: ['trips', date],
    queryFn: async () => {
      if (!date) return [];

      const formattedDate = format(date, 'yyyy-MM-dd');

      // We need to query the trips table instead of rides
      // and filter by date from the departure_time field
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .gte('available_seats', 1)
        .filter('departure_time', 'ilike', `${formattedDate}%`);

      if (error) {
        console.error("Error fetching trips:", error);
        throw error;
      }

      return data as Trip[];
    },
  });

  useEffect(() => {
    if (tripsData) {
      setTrips(tripsData);
    }
  }, [tripsData]);

  const handleRideReservation = async (tripId: string) => {
    if (!user) {
      navigate('/passenger-signin');
      return;
    }

    try {
      // First, get the trip to check available seats
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('available_seats')
        .eq('id', tripId)
        .single();

      if (tripError) {
        throw tripError;
      }

      // Make sure seats are available
      if (tripData.available_seats < 1) {
        toast({
          title: "Error",
          description: "No seats available for this trip",
          variant: "destructive"
        });
        return;
      }

      // Create reservation
      const { data, error } = await supabase.from('reservations').insert([
        { trip_id: tripId, passenger_id: user.id, seats_reserved: 1 }
      ]);

      if (error) {
        throw error;
      }

      // Update available seats by directly calculating the new value
      const newAvailableSeats = tripData.available_seats - 1;
      
      const { error: updateError } = await supabase
        .from('trips')
        .update({ available_seats: newAvailableSeats })
        .eq('id', tripId);

      if (updateError) {
        throw updateError;
      }

      // Update local state to reflect the change
      setTrips(trips.map(trip => 
        trip.id === tripId 
          ? { ...trip, available_seats: newAvailableSeats } 
          : trip
      ));

      toast({
        title: "Success",
        description: "Ride reserved successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reserve ride: " + error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <div>{t('common.loading')}...</div>;
  if (isError) return <div>{t('rides.errorLoadingRides')}</div>;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">{t('rides.availableRides')}</h1>

      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>{t('rides.pickADate')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date < new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {trips.length === 0 ? (
        <p>{t('rides.noRidesAvailable')}</p>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <CardHeader>
                <CardTitle>{trip.origin} - {trip.destination}</CardTitle>
                <CardDescription>
                  {t('rides.departure')}: {new Date(trip.departure_time).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('rides.availableSeats')}: {trip.available_seats}</p>
                <p>{t('rides.price')}: ${trip.price}</p>
                <Button onClick={() => handleRideReservation(trip.id)}>{t('rides.reserveRide')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RidesPage;
