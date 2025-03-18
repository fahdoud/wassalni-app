
// Define all the shared types for the ride service

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
  is_mock?: boolean;
  driverGender?: 'male' | 'female';
  // Location tracking properties
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  trip_id: string;
  passenger_id: string;
  seats_reserved: number;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
  trip?: {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    price: number;
    driver_id: string;
    profiles: {
      full_name: string;
    };
  };
}
