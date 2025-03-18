import { useState, useEffect } from 'react';
import { getRideById, subscribeToRideUpdates } from '@/services/rides/rideQueries';
import { createReservation } from '@/services/rides/reservationService';
import { Ride } from '@/services/rides/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useReservation = (rideId: string) => {
  const [ride, setRide] = useState<Ride | null>(null);
  const [seats, setSeats] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [seatAvailability, setSeatAvailability] = useState<{
    total: number,
    remaining: number, 
    available: boolean
  } | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      const isAuthed = !!data.user;
      console.log("Initial auth check in useReservation:", isAuthed, "User:", data.user?.id);
      setIsAuthenticated(isAuthed);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in useReservation:", event, "Session:", !!session);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || session?.user) {
        console.log("User is authenticated after auth state change");
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsAuthenticated(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    const fetchRide = async () => {
      setIsLoading(true);
      
      try {
        const ride = await getRideById(rideId);
        
        if (ride) {
          if (ride.driver) {
            ride.driverGender = 'male';
          }
          
          setRide(ride);
          setPrice(ride.price);
          
          if (!/^\d+$/.test(rideId)) {
            await fetchSeatAvailability(ride.trip_id || rideId);
          } else {
            setSeatAvailability({
              total: ride.seats,
              remaining: ride.seats,
              available: ride.seats > 0
            });
          }
        }
      } catch (error) {
        console.error("Error fetching ride:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchSeatAvailability = async (tripId: string) => {
      try {
        console.log("Fetching seat availability for trip:", tripId);
        const { data, error } = await supabase
          .from('seat_availability')
          .select('total_seats, remaining_seats, seats_available')
          .eq('trip_id', tripId)
          .single();
          
        if (error) {
          console.error("Error fetching seat availability:", error);
          return;
        }
        
        if (data) {
          console.log("Seat availability data:", data);
          setSeatAvailability({
            total: data.total_seats,
            remaining: data.remaining_seats,
            available: data.seats_available
          });
        }
      } catch (error) {
        console.error("Error in fetchSeatAvailability:", error);
      }
    };
    
    if (rideId) {
      fetchRide();
    }
  }, [rideId]);
  
  useEffect(() => {
    if (ride) {
      setPrice(ride.price * seats);
    }
  }, [seats, ride]);
  
  useEffect(() => {
    if (!rideId || !ride || /^\d+$/.test(rideId)) {
      return;
    }
    
    const tripId = ride.trip_id || rideId;
    console.log("Setting up real-time subscription for trip:", tripId);
    
    const seatChannel = supabase
      .channel(`seat-availability-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'seat_availability',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          console.log("Seat availability real-time update:", payload);
          if (payload.new) {
            setSeatAvailability({
              total: payload.new.total_seats,
              remaining: payload.new.remaining_seats,
              available: payload.new.seats_available
            });
            
            setRide(prev => prev ? { 
              ...prev, 
              seats: payload.new.remaining_seats 
            } : null);
          }
        }
      )
      .subscribe();
    
    const { unsubscribe } = subscribeToRideUpdates(rideId, (updatedRide) => {
      if (updatedRide.driver) {
        updatedRide.driverGender = 'male';
      }
      
      setRide(updatedRide);
    });
    
    return () => {
      unsubscribe();
      supabase.removeChannel(seatChannel);
    };
  }, [rideId, ride]);
  
  const makeReservation = async () => {
    setReservationError(null);
    
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      setReservationError("You must be logged in to make a reservation");
      toast.error("You must be logged in to make a reservation");
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!ride) {
      setReservationError("Ride not found");
      return;
    }
    
    const availableSeats = seatAvailability?.remaining || ride.seats;
    if (availableSeats < seats) {
      setReservationError("Not enough seats available");
      return;
    }
    
    try {
      const userId = user?.id;
      
      if (!userId) {
        setReservationError("User not authenticated");
        return;
      }
      
      const response = await createReservation(
        ride.trip_id || ride.id, 
        userId, 
        seats
      );
      
      if (response.success) {
        if (response.updatedSeats !== undefined) {
          console.log("Updated seat count from reservation:", response.updatedSeats);
          setRide(prev => prev ? { ...prev, seats: response.updatedSeats! } : null);
          setSeatAvailability(prev => prev ? { 
            ...prev, 
            remaining: response.updatedSeats!,
            available: response.updatedSeats! > 0
          } : null);
        } else {
          console.log("Manually decreasing seat count for mock ride");
          const newSeatCount = Math.max(0, (ride.seats - seats));
          setRide(prev => prev ? { ...prev, seats: newSeatCount } : null);
          setSeatAvailability(prev => {
            if (!prev) return null;
            const newRemaining = Math.max(0, prev.remaining - seats);
            return {
              ...prev,
              remaining: newRemaining,
              available: newRemaining > 0
            };
          });
        }
        
        setReservationSuccess(true);
        toast.success("Reservation successful!");
      } else {
        setReservationError("Failed to make reservation. Please try again.");
      }
    } catch (error) {
      console.error("Error making reservation:", error);
      setReservationError("An error occurred. Please try again.");
    }
  };
  
  return {
    ride,
    isLoading,
    seats,
    setSeats,
    price,
    makeReservation,
    reservationSuccess,
    reservationError,
    isAuthenticated,
    seatAvailability
  };
};
