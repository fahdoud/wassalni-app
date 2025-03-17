
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Ride {
  id: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  rating: number;
  trip_id?: string;
}

// Get all available rides
export const getRides = async (): Promise<Ride[]> => {
  try {
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        driver_id,
        profiles(full_name)
      `)
      .eq('status', 'active')
      .gt('available_seats', 0);
    
    if (error) {
      console.error("Error fetching rides:", error);
      throw new Error(error.message);
    }

    // Transform the data to match our Ride interface
    const rides: Ride[] = trips.map(trip => ({
      id: trip.id,
      driver: trip.profiles?.full_name || "Unknown Driver",
      from: trip.origin,
      to: trip.destination,
      date: new Date(trip.departure_time).toISOString().split('T')[0],
      time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: trip.price,
      seats: trip.available_seats,
      rating: 4.7, // Default rating - in a real app would come from reviews
      trip_id: trip.id
    }));

    return rides;
  } catch (error) {
    console.error("Failed to get rides:", error);
    return [];
  }
};

// Get a specific ride by ID
export const getRideById = async (rideId: string): Promise<Ride | null> => {
  try {
    const { data: trip, error } = await supabase
      .from('trips')
      .select(`
        id,
        origin,
        destination,
        departure_time,
        price,
        available_seats,
        driver_id,
        profiles(full_name)
      `)
      .eq('id', rideId)
      .single();
    
    if (error) {
      console.error("Error fetching ride:", error);
      return null;
    }

    // Transform the trip data to our Ride interface
    const ride: Ride = {
      id: trip.id,
      driver: trip.profiles?.full_name || "Unknown Driver",
      from: trip.origin,
      to: trip.destination,
      date: new Date(trip.departure_time).toISOString().split('T')[0],
      time: new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: trip.price,
      seats: trip.available_seats,
      rating: 4.7, // Default rating - would come from reviews
      trip_id: trip.id
    };

    return ride;
  } catch (error) {
    console.error("Failed to get ride:", error);
    return null;
  }
};

// Create a reservation
export const createReservation = async (
  tripId: string, 
  passengerId: string, 
  seatsReserved: number
): Promise<boolean> => {
  try {
    // 1. Create the reservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .insert({
        trip_id: tripId,
        passenger_id: passengerId,
        seats_reserved: seatsReserved
      })
      .select()
      .single();
    
    if (reservationError) {
      console.error("Error creating reservation:", reservationError);
      throw new Error(reservationError.message);
    }

    // 2. Update the available seats in the trip
    const { error: updateError } = await supabase.rpc(
      'decrease_available_seats', 
      {
        trip_id: tripId,
        seats_count: seatsReserved
      }
    );

    if (updateError) {
      console.error("Error updating available seats:", updateError);
      // If there's an error updating seats, try to delete the reservation
      await supabase.from('reservations').delete().eq('id', reservation.id);
      throw new Error(updateError.message);
    }

    return true;
  } catch (error) {
    console.error("Failed to create reservation:", error);
    toast.error("Failed to create reservation. Please try again.");
    return false;
  }
};

// Mock rides for development when not using Supabase
export const getMockRides = (): Ride[] => {
  return [
    {
      id: "1",
      driver: "Mohamed A.",
      from: "Ali Mendjeli",
      to: "City Center",
      date: "2023-06-24",
      time: "08:30",
      price: 200,
      seats: 3,
      rating: 4.8,
    },
    {
      id: "2",
      driver: "Sara B.",
      from: "City Center",
      to: "El Khroub",
      date: "2023-06-24",
      time: "10:15",
      price: 150,
      seats: 2,
      rating: 4.5,
    },
    {
      id: "3",
      driver: "Ahmed K.",
      from: "Boussouf",
      to: "Didouche Mourad",
      date: "2023-06-24",
      time: "12:00",
      price: 180,
      seats: 1,
      rating: 4.9,
    },
    {
      id: "4",
      driver: "Fatima Z.",
      from: "Zighoud Youcef",
      to: "Ain Abid",
      date: "2023-06-24",
      time: "15:30",
      price: 250,
      seats: 4,
      rating: 4.7,
    },
    {
      id: "5",
      driver: "Karim M.",
      from: "Hamma Bouziane",
      to: "Bekira",
      date: "2023-06-24",
      time: "17:45",
      price: 120,
      seats: 2,
      rating: 4.6,
    },
  ];
};
