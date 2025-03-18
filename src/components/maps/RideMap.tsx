
import React, { useState } from 'react';
import MapErrorState from './MapErrorState';
import MapLoadingState from './MapLoadingState';
import MapLegend from './MapLegend';
import { useMapDirections } from './hooks/useMapDirections';
import { useDriverSimulation } from './hooks/useDriverSimulation';

interface RideMapProps {
  rideId: string;
  originLocation?: { lat: number; lng: number };
  destinationLocation?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  className?: string;
}

const RideMap: React.FC<RideMapProps> = ({ 
  rideId,
  originLocation = { lat: 36.3535, lng: 6.6424 }, // Default to Constantine location
  destinationLocation = { lat: 36.3635, lng: 6.6524 }, // Slightly offset for demonstration
  driverLocation,
  className = "w-full h-64 md:h-[400px] lg:h-[500px] rounded-lg"
}) => {
  // Initialize with provided driver location or calculate default position
  const initialDriverLocation = driverLocation || { 
    lat: originLocation.lat - 0.008, 
    lng: originLocation.lng - 0.005 
  };
  
  // Use our custom hooks for map directions and driver simulation
  const { mapRef, map, isLoaded, isMapReady, error } = useMapDirections({ 
    originLocation, 
    destinationLocation 
  });
  
  // Simulate driver movement
  useDriverSimulation(initialDriverLocation, destinationLocation, map, isMapReady);
  
  // Handle error state
  if (error) {
    return <MapErrorState error={error} className={className} />;
  }
  
  // Handle loading state
  if (!isLoaded) {
    return <MapLoadingState className={className} />;
  }
  
  // Handle initializing state
  if (!isMapReady) {
    return <MapLoadingState className={className} isInitializing={true} />;
  }
  
  // Render the map
  return (
    <div className="space-y-2">
      <div ref={mapRef} className={`${className} shadow-md border border-gray-200 dark:border-gray-700`} />
      <MapLegend />
    </div>
  );
};

export default RideMap;
