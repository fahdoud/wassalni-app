
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { createReservation } from "@/services/rides/reservationService";
import { getRideById, subscribeToRideUpdates } from "@/services/rides/rideQueries";
import { Ride } from "@/services/rides/types";

export const useReservation = (rideId: string | undefined) => {
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        toast.error("Please login to make a reservation");
        navigate("/passenger-signin");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch ride data
  useEffect(() => {
    const fetchRide = async () => {
      setInitialLoading(true);
      if (!rideId) {
        navigate("/rides");
        return;
      }

      try {
        const fetchedRide = await getRideById(rideId);
        if (fetchedRide) {
          setRide(fetchedRide);
          
          // Make sure passenger count doesn't exceed available seats
          if (fetchedRide.seats < passengerCount) {
            setPassengerCount(Math.max(1, fetchedRide.seats));
          } else if (fetchedRide.seats === 0) {
            // If no seats available, show message
            toast.error("This ride is fully booked");
          }
        } else {
          toast.error("Ride not found");
          navigate("/rides");
        }
      } catch (error) {
        console.error("Error fetching ride:", error);
        toast.error("Failed to load ride details");
        navigate("/rides");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchRide();
  }, [rideId, navigate, passengerCount]);

  // Set up real-time subscription
  useEffect(() => {
    if (!rideId || !ride) return;
    
    console.log("Setting up real-time subscription for ride:", rideId);
    
    // Only subscribe to real-time updates for actual database trips
    if (!/^\d+$/.test(rideId)) {
      const subscription = subscribeToRideUpdates(rideId, (updatedRide) => {
        console.log("Received ride update:", updatedRide);
        
        setRide(updatedRide);
        
        // Auto-adjust passenger count if it exceeds available seats
        if (updatedRide.seats < passengerCount) {
          if (updatedRide.seats <= 0) {
            // If ride becomes fully booked during reservation process
            if (step === 1) {
              toast.error("This ride is now fully booked");
            }
          }
          setPassengerCount(Math.max(1, updatedRide.seats));
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [rideId, ride, passengerCount, step]);

  // Handle reservation submission
  const handleReservation = async () => {
    if (!ride || !userId) return;
    
    // Check if there are still enough seats available
    if (ride.seats < passengerCount) {
      toast.error(`Only ${ride.seats} seats available now. Please adjust your booking.`);
      return;
    }
    
    setLoading(true);
    
    try {
      const { success, updatedSeats } = await createReservation(
        ride.trip_id || ride.id,
        userId,
        passengerCount
      );
      
      if (success) {
        // Immediately update the local state to reflect the new seat count
        setRide(prev => {
          if (prev) {
            return {
              ...prev,
              seats: updatedSeats !== undefined ? updatedSeats : (prev.seats - passengerCount)
            };
          }
          return prev;
        });
        
        // Set a flag in session storage to force refresh rides list when returning
        sessionStorage.setItem('fromReservation', 'true');
        
        setStep(3);
        toast.success("Reservation successful!");
      } else {
        toast.error("Failed to make reservation. Please try again.");
      }
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("An error occurred during reservation");
    } finally {
      setLoading(false);
    }
  };

  return {
    ride,
    setRide,
    passengerCount,
    setPassengerCount,
    loading,
    initialLoading,
    step,
    setStep,
    userId,
    handleReservation
  };
};
