
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
}
