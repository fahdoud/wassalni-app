
// Define all the shared types for the ride service

export interface Ride {
  id: string;
  driver: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  price: number;
  seats: number;
  rating?: number;
  trip_id?: string;
  is_mock?: boolean;
  driverGender?: 'male' | 'female';
  timestamp?: number;
  // Location tracking properties
  currentLocation?: {
    lat: number;
    lng: number;
  };
  // Legacy fields for compatibility
  from?: string;
  to?: string;
  date?: string;
  time?: string;
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

export interface ProposedTrip {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  price: number;
  available_seats: number;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

// Verification interfaces
export interface EmailVerification {
  id: string;
  email: string;
  verified: boolean;
  verification_token?: string;
  token_expires_at?: string;
}

export interface PhoneVerification {
  id: string;
  phone: string;
  verified: boolean;
  verification_code?: string;
  code_expires_at?: string;
}
