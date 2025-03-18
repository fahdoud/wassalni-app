
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

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'mock';

export interface Reservation {
  id: string;
  trip_id: string | null;
  passenger_id: string | null;
  seats_reserved: number;
  status: ReservationStatus;
  created_at: string | null;
  updated_at: string | null;
  passenger_name: string | null;
  origin: string | null;
  destination: string | null;
  price: number | null;
  reservation_date: string | null;
  trip?: {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    price: number;
    driver_id: string;
    profiles?: {
      full_name: string | null;
    } | null;
  };
  trips?: {
    id: string;
    origin: string;
    destination: string;
    departure_time: string;
    price: number;
    driver_id: string;
    profiles?: {
      full_name: string | null;
    } | null;
  };
}
