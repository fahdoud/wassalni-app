
import { useState, useEffect, useCallback } from 'react';
import { Ride } from '@/services/rides/types';

export const useRideLocations = (ride: Ride | null) => {
  const [rideLocations, setRideLocations] = useState<{
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  } | null>(null);

  // Memoized function to get Constantine locations
  const getConstantineLocations = useCallback(() => {
    return {
      "Ain Abid": { lat: 36.232, lng: 6.942 },
      "Ali Mendjeli": { lat: 36.262, lng: 6.606 },
      "Bekira": { lat: 36.321, lng: 6.599 },
      "Boussouf": { lat: 36.369, lng: 6.608 },
      "Didouche Mourad": { lat: 36.451, lng: 6.604 },
      "El Khroub": { lat: 36.263, lng: 6.697 },
      "Hamma Bouziane": { lat: 36.412, lng: 6.599 },
      "Zighoud Youcef": { lat: 36.531, lng: 6.709 },
      "City Center": { lat: 36.365, lng: 6.614 },
      // Default to center of Constantine
      "Constantine": { lat: 36.365, lng: 6.614 }
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
      // Get the predefined Constantine locations
      const constantineLocations = getConstantineLocations();
      
      // Try to find locations by name, fallback to defaults
      const origin = constantineLocations[ride.from] || constantineLocations["Constantine"];
      const destination = constantineLocations[ride.to] || {
        lat: origin.lat + 0.05,
        lng: origin.lng + 0.05
      };
      
      console.log("Setting ride-specific locations:", { origin, destination });
      setRideLocations({ origin, destination });
    }
  }, [ride, getConstantineLocations]);

  return rideLocations;
};
