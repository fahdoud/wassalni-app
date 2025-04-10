
import { useState, useEffect, useCallback } from 'react';
import { Ride } from '@/services/rides/types';

export const useRideLocations = (ride: Ride | null) => {
  const [rideLocations, setRideLocations] = useState<{
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  } | null>(null);

  // Memoized function to get locations
  const getLocations = useCallback(() => {
    return {
      // Constantine locations
      "Ain Abid": { lat: 36.232, lng: 6.942 },
      "Ali Mendjeli": { lat: 36.262, lng: 6.606 },
      "Bekira": { lat: 36.321, lng: 6.599 },
      "Boussouf": { lat: 36.369, lng: 6.608 },
      "Didouche Mourad": { lat: 36.451, lng: 6.604 },
      "El Khroub": { lat: 36.263, lng: 6.697 },
      "Hamma Bouziane": { lat: 36.412, lng: 6.599 },
      "Zighoud Youcef": { lat: 36.531, lng: 6.709 },
      "Constantine": { lat: 36.365, lng: 6.614 },
      
      // Alger locations
      "Sidi Yahia": { lat: 36.756, lng: 3.049 },
      "Hydra": { lat: 36.750, lng: 3.034 },
      "Bir Mourad Raïs": { lat: 36.737, lng: 3.051 },
      "Bab Ezzouar": { lat: 36.721, lng: 3.189 },
      "Bab El Oued": { lat: 36.798, lng: 3.055 },
      "El Biar": { lat: 36.766, lng: 3.041 },
      "Kouba": { lat: 36.723, lng: 3.089 },
      "Hussein Dey": { lat: 36.744, lng: 3.097 },
      "El Harrach": { lat: 36.717, lng: 3.125 },
      "Bologhine": { lat: 36.809, lng: 3.040 },
      "Dar El Beïda": { lat: 36.715, lng: 3.211 },
      "Alger Centre": { lat: 36.775, lng: 3.060 },
      "Bordj El Kiffan": { lat: 36.745, lng: 3.179 },
      "Dély Ibrahim": { lat: 36.751, lng: 3.000 },
      "Chéraga": { lat: 36.768, lng: 2.946 },
      
      // Default to center of Alger
      "Alger": { lat: 36.775, lng: 3.060 }
    };
  }, []);

  // Set locations immediately on mount, even before ride data is loaded
  useEffect(() => {
    // Default coordinates for Constantine city center
    const defaultLocations = {
      origin: { lat: 36.365, lng: 6.614 },
      destination: { lat: 36.365, lng: 6.624 }
    };
    console.log("Setting default Constantine locations immediately");
    setRideLocations(defaultLocations);
  }, []);

  // Update with real ride locations once available
  useEffect(() => {
    if (ride) {
      // Get the predefined locations
      const locations = getLocations();
      
      // Try to find locations by name, fallback to defaults
      const origin = locations[ride.from] || locations["Constantine"];
      const destination = locations[ride.to] || {
        lat: origin.lat + 0.05,
        lng: origin.lng + 0.05
      };
      
      console.log("Setting ride-specific locations:", { origin, destination });
      setRideLocations({ origin, destination });
    }
  }, [ride, getLocations]);

  return rideLocations;
};
