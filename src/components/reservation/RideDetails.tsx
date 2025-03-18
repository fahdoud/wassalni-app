
import { Ride } from "@/services/rides/types";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { subscribeToRideUpdates } from "@/services/rides/rideQueries";
import { supabase } from "@/integrations/supabase/client";

interface RideDetailsProps {
  ride: Ride;
  seats?: number;
  setSeats?: (seats: number) => void;
  goToPayment?: () => void;
  onContinue?: () => void;
  seatAvailability?: {
    total: number;
    remaining: number;
    available: boolean;
  } | null;
}

const RideDetails = ({ 
  ride, 
  seats, 
  setSeats, 
  goToPayment, 
  onContinue,
  seatAvailability 
}: RideDetailsProps) => {
  const { t } = useLanguage();
  const [availableSeats, setAvailableSeats] = useState(ride.seats);
  
  // Handle both onContinue and goToPayment for backward compatibility
  const handleContinue = () => {
    if (goToPayment) {
      goToPayment();
    } else if (onContinue) {
      onContinue();
    }
  };

  // Subscribe to real-time updates for available seats
  useEffect(() => {
    if (!ride.id) return;
    
    // Initialize seats from the ride or seatAvailability
    if (seatAvailability) {
      console.log("Using provided seat availability:", seatAvailability);
      setAvailableSeats(seatAvailability.remaining);
    } else {
      console.log("Using ride seats:", ride.seats);
      setAvailableSeats(ride.seats);
    }
    
    // Set up real-time subscription only for non-mock rides
    if (!/^\d+$/.test(ride.id)) {
      console.log("Setting up real-time subscription for seat updates");
      const subscription = subscribeToRideUpdates(ride.id, (updatedRide) => {
        console.log("Real-time seat update:", updatedRide.seats);
        setAvailableSeats(updatedRide.seats);
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [ride.id, seatAvailability, ride.seats]);

  // Subscribe to real-time updates for seat availability
  useEffect(() => {
    if (!ride.id || !ride.trip_id || /^\d+$/.test(ride.id)) {
      // Don't subscribe for mock rides
      return;
    }
    
    const tripId = ride.trip_id;
    console.log("Setting up real-time subscription for seat availability:", tripId);
    
    const channel = supabase
      .channel(`seat-channel-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'seat_availability',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          console.log("Received seat availability update:", payload);
          if (payload.new && 'remaining_seats' in payload.new) {
            console.log(`Updating available seats from ${availableSeats} to ${payload.new.remaining_seats}`);
            setAvailableSeats(payload.new.remaining_seats);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [ride.id, ride.trip_id, availableSeats]);

  return (
    <div className="glass-card p-8 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-6">{t('reservation.details')}</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
            {ride.driver.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{ride.driver}</p>
            <div className="flex items-center text-yellow-500 text-sm">
              {'★'.repeat(Math.floor(ride.rating))}
              <span className="text-gray-400 ml-1">{ride.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-2 mt-6">
          <div className="relative pl-8 pb-8">
            <div className="absolute top-0 left-0 h-full w-[2px] bg-gray-200 dark:bg-gray-700"></div>
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-wassalni-green -translate-x-1/2"></div>
            <div>
              <p className="font-medium">{ride.from}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ride.time}</p>
            </div>
          </div>
          <div className="relative pl-8">
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-wassalni-blue -translate-x-1/2"></div>
            <div>
              <p className="font-medium">{ride.to}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.estimatedArrival')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-gray-700">
          <Calendar size={16} className="text-wassalni-green dark:text-wassalni-lightGreen" />
          <span>
            {new Date(ride.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-gray-700">
          <Clock size={16} className="text-wassalni-green dark:text-wassalni-lightGreen" />
          <span>{ride.time}</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          availableSeats > 0 
            ? "bg-gray-100 dark:bg-gray-700"
            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <User size={16} className={availableSeats > 0 ? "text-wassalni-green dark:text-wassalni-lightGreen" : "text-red-500 dark:text-red-400"} />
          <span>
            {availableSeats > 0 
              ? `${availableSeats} ${availableSeats === 1 ? t('rides.seat') : t('rides.seats')}`
              : t('rides.full')}
          </span>
        </div>
        
        {seatAvailability && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
            <User size={16} className="text-blue-600 dark:text-blue-400" />
            <span>
              {t('reservation.totalSeats')}: {seatAvailability.total}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <Button 
          className="w-full"
          onClick={handleContinue}
          disabled={availableSeats <= 0}
        >
          {availableSeats > 0 ? t('reservation.payment') : t('rides.full')}
        </Button>
      </div>
    </div>
  );
};

export default RideDetails;
