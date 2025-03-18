
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getRides } from "@/services/rides";
import { Ride } from "@/services/rides/types";
import { getMockRides } from "@/services/rides/mockRides";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRides = () => {
  const [filter, setFilter] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveSeats, setLiveSeats] = useState<Record<string, number>>({});
  const location = useLocation();

  const fetchRides = async (forceRefresh = false) => {
    setLoading(true);
    try {
      console.log("Fetching rides, forceRefresh:", forceRefresh);
      
      if (forceRefresh) {
        setRides([]);
        setLiveSeats({}); // Also reset live seats state when force refreshing
      }
      
      const fetchedRides = await getRides();
      if (fetchedRides && fetchedRides.length > 0) {
        console.log("Fetched rides:", fetchedRides);
        
        const ridesWithMaleDrivers = fetchedRides.map(ride => ({
          ...ride,
          driverGender: 'male' as 'male'
        }));
        
        setRides(ridesWithMaleDrivers);
        
        // For real rides, fetch seat availability information
        const realRideIds = ridesWithMaleDrivers
          .filter(ride => !/^\d+$/.test(ride.id))
          .map(ride => ride.trip_id);
          
        if (realRideIds.length > 0) {
          const { data, error } = await supabase
            .from('seat_availability')
            .select('trip_id, remaining_seats')
            .in('trip_id', realRideIds);
            
          if (!error && data) {
            // Create a mapping of trip_id to remaining_seats
            const newLiveSeats = { ...liveSeats };
            data.forEach(seat => {
              // Find the ride with this trip_id
              const ride = ridesWithMaleDrivers.find(r => r.trip_id === seat.trip_id);
              if (ride) {
                newLiveSeats[ride.id] = seat.remaining_seats;
                
                // Also update the ride.seats property for consistency
                ride.seats = seat.remaining_seats;
              }
            });
            setLiveSeats(newLiveSeats);
          }
        }
      } else {
        console.log("No rides found, using mock rides");
        const mockRides = getMockRides().map(ride => ({
          ...ride,
          driverGender: 'male' as 'male'
        }));
        setRides(mockRides);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
      const mockRides = getMockRides().map(ride => ({
        ...ride,
        driverGender: 'male' as 'male'
      }));
      setRides(mockRides);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and page refresh handlers
  useEffect(() => {
    fetchRides(true);
    
    const handleBeforeUnload = () => {
      localStorage.setItem('ridesPageReloaded', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    const handleFocus = () => {
      fetchRides(true);
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Check if coming back from reservation
  useEffect(() => {
    if (location.pathname === '/rides') {
      const fromReservation = sessionStorage.getItem('fromReservation');
      
      if (fromReservation === 'true') {
        console.log("Returning from reservation page, force refreshing rides");
        fetchRides(true);
        sessionStorage.removeItem('fromReservation');
        toast.success("Available seats have been updated");
      } else {
        fetchRides();
      }
    }
  }, [location]);

  // Set up real-time seat availability subscriptions
  useEffect(() => {
    if (rides.length === 0) return;
    
    const channels: any[] = [];
    
    rides.forEach(ride => {
      if (ride.trip_id && !/^\d+$/.test(ride.id)) {
        // First subscribe to trips table updates (legacy)
        const tripChannel = supabase
          .channel(`ride-${ride.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'trips',
              filter: `id=eq.${ride.trip_id}`
            },
            (payload) => {
              console.log("Received real-time seat update from trips:", payload);
              if (payload.new && 'available_seats' in payload.new) {
                const newSeatCount = payload.new.available_seats;
                console.log(`Updating seat count for ride ${ride.id} to ${newSeatCount}`);
                
                setLiveSeats(prev => ({
                  ...prev,
                  [ride.id]: newSeatCount
                }));
                
                // Also update the ride object directly
                setRides(prevRides => 
                  prevRides.map(r => 
                    r.id === ride.id 
                      ? {...r, seats: newSeatCount} 
                      : r
                  )
                );
              }
            }
          )
          .subscribe();
          
        channels.push(tripChannel);
        
        // Also subscribe to seat_availability table for more accurate updates
        const seatChannel = supabase
          .channel(`seat-availability-${ride.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'seat_availability',
              filter: `trip_id=eq.${ride.trip_id}`
            },
            (payload) => {
              console.log("Received real-time seat update from seat_availability:", payload);
              if (payload.new && 'remaining_seats' in payload.new) {
                const newSeatCount = payload.new.remaining_seats;
                console.log(`Updating seat count for ride ${ride.id} to ${newSeatCount} (from seat_availability)`);
                
                setLiveSeats(prev => ({
                  ...prev,
                  [ride.id]: newSeatCount
                }));
                
                // Also update the ride object directly
                setRides(prevRides => 
                  prevRides.map(r => 
                    r.id === ride.id 
                      ? {...r, seats: newSeatCount} 
                      : r
                  )
                );
              }
            }
          )
          .subscribe();
          
        channels.push(seatChannel);
        
        // Also subscribe to reservations table for mock rides
        const reservationChannel = supabase
          .channel(`reservations-${ride.id}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'reservations',
              filter: `trip_id=eq.${ride.trip_id}`
            },
            (payload) => {
              console.log("Received new reservation:", payload);
              if (payload.new && payload.new.seats_reserved) {
                // Decrease available seats
                const seatsReserved = payload.new.seats_reserved;
                console.log(`New reservation with ${seatsReserved} seats for ride ${ride.id}`);
                
                setLiveSeats(prev => {
                  const currentSeats = prev[ride.id] || ride.seats;
                  const newSeatCount = Math.max(0, currentSeats - seatsReserved);
                  console.log(`Decreasing seats for ride ${ride.id} from ${currentSeats} to ${newSeatCount}`);
                  return {
                    ...prev,
                    [ride.id]: newSeatCount
                  };
                });
                
                // Also update the ride object directly
                setRides(prevRides => 
                  prevRides.map(r => {
                    if (r.id === ride.id) {
                      const newSeatCount = Math.max(0, r.seats - seatsReserved);
                      console.log(`Updating ride object seat count from ${r.seats} to ${newSeatCount}`);
                      return {...r, seats: newSeatCount};
                    }
                    return r;
                  })
                );

                // Show notification about seat update
                toast.info(`Seats updated for a ride from ${ride.from} to ${ride.to}`);
              }
            }
          )
          .subscribe();
          
        channels.push(reservationChannel);
      }
    });
    
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [rides]);

  const filteredRides = filter 
    ? rides.filter(ride => 
        ride.from.toLowerCase().includes(filter.toLowerCase()) || 
        ride.to.toLowerCase().includes(filter.toLowerCase())
      )
    : rides;

  return {
    rides: filteredRides,
    loading,
    liveSeats,
    filter,
    setFilter
  };
};
