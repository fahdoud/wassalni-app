
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
          if (fetchedRide.seats < passengerCount) {
            setPassengerCount(Math.max(1, fetchedRide.seats));
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
    
    if (!/^\d+$/.test(rideId)) {
      const subscription = subscribeToRideUpdates(rideId, (updatedRide) => {
        console.log("Received ride update:", updatedRide);
        setRide(updatedRide);
        
        if (updatedRide.seats < passengerCount) {
          setPassengerCount(Math.max(1, updatedRide.seats));
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [rideId, ride, passengerCount]);

  // Handle reservation submission
  const handleReservation = async () => {
    if (!ride || !userId) return;
    
    setLoading(true);
    
    try {
      const { success, updatedSeats } = await createReservation(
        ride.trip_id || ride.id,
        userId,
        passengerCount
      );
      
      if (success) {
        setRide(prev => {
          if (prev) {
            return {
              ...prev,
              seats: updatedSeats !== undefined ? updatedSeats : (prev.seats - passengerCount)
            };
          }
          return prev;
        });
        
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
