
import React, { useState, useCallback, useEffect } from 'react';
import MapErrorState from './MapErrorState';
import MapLoadingState from './MapLoadingState';
import MapLegend from './MapLegend';
import { useMapDirections } from './hooks/useMapDirections';
import { useDriverSimulation } from './hooks/useDriverSimulation';
import { loadGoogleMapsScript, GOOGLE_MAPS_API_KEY } from './utils/googleMapsLoader';
import { toast } from "sonner";

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
  // Track retry attempts
  const [retryCount, setRetryCount] = useState(0);
  const [retryLoading, setRetryLoading] = useState(false);
  
  // Initialize with provided driver location or calculate default position
  const initialDriverLocation = driverLocation || { 
    lat: originLocation.lat - 0.008, 
    lng: originLocation.lng - 0.005 
  };
  
  // Handle retrying the map load
  const handleRetry = useCallback(() => {
    console.log('Retrying map load attempt:', retryCount + 1);
    setRetryLoading(true);
    setRetryCount(prev => prev + 1);
    
    // Check if API key exists and is not empty
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.trim() === '') {
      toast.error('Google Maps API key is missing. Please check your configuration.');
      setRetryLoading(false);
      return;
    }
    
    loadGoogleMapsScript()
      .then(() => {
        console.log('Google Maps reloaded successfully');
        toast.success('Map reloaded successfully');
        setRetryLoading(false);
      })
      .catch(err => {
        console.error('Map reload failed:', err);
        toast.error('Map reload failed. Please check the console for more details.');
        setRetryLoading(false);
      });
  }, [retryCount]);
  
  // Use our custom hooks for map directions and driver simulation
  const { mapRef, map, isLoaded, isMapReady, error } = useMapDirections({ 
    originLocation, 
    destinationLocation,
    retryCount // Pass retry count to force rehook execution
  });
  
  // Simulate driver movement
  useDriverSimulation(initialDriverLocation, destinationLocation, map, isMapReady);
  
  // Handle error state with retry button
  if (error) {
    return (
      <MapErrorState 
        error={error} 
        className={className} 
        onRetry={retryLoading ? undefined : handleRetry} 
      />
    );
  }
  
  // Render the map container immediately, even while loading
  return (
    <div className="space-y-2 relative">
      {/* Always render the map container to ensure it's available immediately */}
      <div ref={mapRef} className={`${className} shadow-md border border-gray-200 dark:border-gray-700`} />
      
      {/* Show loading state if still loading */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <MapLoadingState className={className} />
        </div>
      )}
      
      {/* Show initializing state if loaded but not ready */}
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
