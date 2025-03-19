
import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

export const useDriverSimulation = (
  initialDriverLocation: Location | null,
  destinationLocation: Location,
  map: google.maps.Map | null,
  isMapReady: boolean
) => {
  const [driverLocation, setDriverLocation] = useState<Location | null>(initialDriverLocation);
  
  useEffect(() => {
    if (!map || !isMapReady || !driverLocation || !window.google || !window.google.maps) {
      return;
    }
    
    // Create driver marker
    const driverMarker = new window.google.maps.Marker({
      position: driverLocation,
      map,
      title: 'Driver',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/cabs/cab.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Simulate driver movement
    const interval = setInterval(() => {
      const randomMovement = () => (Math.random() - 0.5) * 0.001;
      
      // Move driver toward destination
      setDriverLocation(prev => {
        if (!prev) return null;
        
        // Calculate direction toward destination
        const deltaLat = destinationLocation.lat - prev.lat;
        const deltaLng = destinationLocation.lng - prev.lng;
        
        // Normalize and scale movement
        const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
        
        // If driver is close to destination, stop moving
        if (distance < 0.001) {
          return prev;
        }
        
        // Calculate new position (move a bit toward destination + add some randomness)
        const newLat = prev.lat + (deltaLat / distance) * 0.001 + randomMovement();
        const newLng = prev.lng + (deltaLng / distance) * 0.001 + randomMovement();
        
        // Update marker position
        driverMarker.setPosition({ lat: newLat, lng: newLng });
        
        return { lat: newLat, lng: newLng };
      });
    }, 2000);
    
    // Clean up
    return () => {
      clearInterval(interval);
      driverMarker.setMap(null);
    };
  }, [map, isMapReady, driverLocation, destinationLocation]);
  
  return driverLocation;
};
