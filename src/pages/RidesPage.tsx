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

type Ride = {
  id: string;
  start_location: string;
  end_location: string;
  available_seats: number;
  price: number;
  departure_time: string;
  driver_id: string;
};

const RidesPage = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const { data: ridesData, isLoading, isError } = useQuery({
    queryKey: ['rides', date],
    queryFn: async () => {
      if (!date) return [];

      const formattedDate = format(date, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('departure_date', formattedDate)
        .gte('available_seats', 1);

      if (error) {
        console.error("Error fetching rides:", error);
        throw error;
      }

      return data as Ride[];
    },
  });

  useEffect(() => {
    if (ridesData) {
      setRides(ridesData);
    }
  }, [ridesData]);

  const handleRideReservation = async (rideId: string) => {
    if (!user) {
      navigate('/passenger-signin');
      return;
    }

    try {
      const { data, error } = await supabase.from('reservations').insert([
        { ride_id: rideId, user_id: user.id },
      ]);

      if (error) {
        throw error;
      }

      // Update available seats
      const { error: updateError } = await supabase
        .from('rides')
        .update({ available_seats: () => 'available_seats - 1' })
        .eq('id', rideId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Ride reserved successfully!",
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

      {rides.length === 0 ? (
        <p>{t('rides.noRidesAvailable')}</p>
      ) : (
        <div className="grid gap-4">
          {rides.map((ride) => (
            <Card key={ride.id}>
              <CardHeader>
                <CardTitle>{ride.start_location} - {ride.end_location}</CardTitle>
                <CardDescription>
                  {t('rides.departure')}: {new Date(ride.departure_time).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('rides.availableSeats')}: {ride.available_seats}</p>
                <p>{t('rides.price')}: ${ride.price}</p>
                <Button onClick={() => handleRideReservation(ride.id)}>{t('rides.reserveRide')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RidesPage;
