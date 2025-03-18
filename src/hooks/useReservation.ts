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
          setRide(ride);
          setPrice(ride.price);
        }
      } catch (error) {
        console.error("Error fetching ride:", error);
      } finally {
        setIsLoading(false);
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
    
    const { unsubscribe } = subscribeToRideUpdates(rideId, (updatedRide) => {
      setRide(updatedRide);
    });
    
    return () => {
      unsubscribe();
    };
  }, [rideId, ride]);
  
  // Make a reservation
  const makeReservation = async () => {
    setReservationError(null);
    
    // Check if authenticated but allow guest users to continue
    if (!isAuthenticated) {
      console.log("User is not authenticated but continuing with reservation");
      // Note: This is where you would normally check for authentication
      // but we're allowing unauthenticated users to continue
    }
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if ride exists
    if (!ride) {
      setReservationError("Ride not found");
      return;
    }
    
    // Check if enough seats are available
    if (ride.seats < seats) {
      setReservationError("Not enough seats available");
      return;
    }
    
    try {
      // Create the reservation - we'll use the user ID if authenticated, otherwise use a guest ID
      const userId = user ? user.id : 'guest-user';
      
      // Create the reservation
      const response = await createReservation(
        ride.id, 
        userId, 
        seats
      );
      
      if (response.success) {
        // Update the ride with the new seat count if provided
        if (response.updatedSeats !== undefined) {
          setRide(prev => prev ? { ...prev, seats: response.updatedSeats! } : null);
        } else {
          // For mock rides, we manually update the UI
          setRide(prev => prev ? { ...prev, seats: prev.seats - seats } : null);
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
    isAuthenticated
  };
};
