
import React from 'react';
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
  
  // Render the map container immediately, even while loading
  return (
    <div className="space-y-2">
      {/* Always render the map container to ensure it's available immediately */}
      <div ref={mapRef} className={`${className} shadow-md border border-gray-200 dark:border-gray-700`} />
      
      {/* Show loading state on top if still loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <MapLoadingState className={className} />
        </div>
      )}
      
      {/* Show initializing state on top if loaded but not ready */}
      {isLoaded && !isMapReady && (
        <div className="absolute inset-0 z-10">
          <MapLoadingState className={className} isInitializing={true} />
        </div>
      )}
      
      <MapLegend />
    </div>
  );
};

export default RideMap;
