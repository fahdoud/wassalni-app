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
  
  // Check authentication status on load
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
      // Consider all these events as authenticated
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
  
  // Get the ride data
  useEffect(() => {
    const fetchRide = async () => {
      setIsLoading(true);
      
      try {
        const ride = await getRideById(rideId);
        
        if (ride) {
          // Ensure the driver is displayed as male
          if (ride.driver) {
            // Keep the driver name but ensure they are treated as male in the UI
            ride.driverGender = 'male';
          }
          
          setRide(ride);
          setPrice(ride.price);
          
          // For real rides, check seat availability
          if (!/^\d+$/.test(rideId)) {
            await fetchSeatAvailability(ride.trip_id || rideId);
          } else {
            // For mock rides, use the seats from the ride
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
  
  // Update price when seats change
  useEffect(() => {
    if (ride) {
      setPrice(ride.price * seats);
    }
  }, [seats, ride]);
  
  // Subscribe to real-time updates for the ride
  useEffect(() => {
    if (!rideId || !ride || /^\d+$/.test(rideId)) {
      // We don't subscribe to real-time updates for mock rides
      return;
    }
    
    const tripId = ride.trip_id || rideId;
    
    // Subscribe to seat_availability changes
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
            
            // Also update the ride object for backward compatibility
            setRide(prev => prev ? { 
              ...prev, 
              seats: payload.new.remaining_seats 
            } : null);
          }
        }
      )
      .subscribe();
    
    // Also keep the traditional ride updates
    const { unsubscribe } = subscribeToRideUpdates(rideId, (updatedRide) => {
      // Ensure the driver is displayed as male
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
  
  // Make a reservation
  const makeReservation = async () => {
    setReservationError(null);
    
    // Check if authenticated - only allow authenticated users to make reservations
    if (!isAuthenticated) {
      console.log("User is not authenticated");
      setReservationError("You must be logged in to make a reservation");
      toast.error("You must be logged in to make a reservation");
      return;
    }
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if ride exists
    if (!ride) {
      setReservationError("Ride not found");
      return;
    }
    
    // Check if enough seats are available
    const availableSeats = seatAvailability?.remaining || ride.seats;
    if (availableSeats < seats) {
      setReservationError("Not enough seats available");
      return;
    }
    
    try {
      // Create the reservation - only for authenticated users
      const userId = user?.id;
      
      if (!userId) {
        setReservationError("User not authenticated");
        return;
      }
      
      // Create the reservation
      const response = await createReservation(
        ride.trip_id || ride.id, 
        userId, 
        seats
      );
      
      if (response.success) {
        // Update the ride with the new seat count if provided
        if (response.updatedSeats !== undefined) {
          // Update both the ride object and the seatAvailability state
          setRide(prev => prev ? { ...prev, seats: response.updatedSeats! } : null);
          setSeatAvailability(prev => prev ? { 
            ...prev, 
            remaining: response.updatedSeats!,
            available: response.updatedSeats! > 0
          } : null);
        } else {
          // For mock rides, we manually update the UI
          setRide(prev => prev ? { ...prev, seats: prev.seats - seats } : null);
          setSeatAvailability(prev => {
            if (!prev) return null;
            const newRemaining = prev.remaining - seats;
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
