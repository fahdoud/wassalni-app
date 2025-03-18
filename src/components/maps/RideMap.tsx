
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RideMapProps {
  rideId: string;
  originLocation?: { lat: number; lng: number };
  destinationLocation?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  className?: string;
}

const GOOGLE_MAPS_API_KEY = "AIzaSyAShg04o1uyNHkCNwWLwrEuV7jxZ8xiIU8";

const RideMap: React.FC<RideMapProps> = ({ 
  rideId,
  originLocation = { lat: 36.3535, lng: 6.6424 }, // Default to Constantine location
  destinationLocation = { lat: 36.3635, lng: 6.6524 }, // Slightly offset for demonstration
  driverLocation,
  className = "w-full h-64 md:h-96 rounded-lg"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock driver movement
  const [mockDriverLocation, setMockDriverLocation] = useState<{ lat: number; lng: number } | null>(
    driverLocation || { 
      lat: originLocation.lat - 0.005, 
      lng: originLocation.lng - 0.005 
    }
  );
  
  // Function to load Google Maps API script
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }
    
    const loadGoogleMapsApi = () => {
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsLoaded(true);
        };
        
        script.onerror = () => {
          setError('Failed to load Google Maps. Please try again later.');
        };
        
        document.head.appendChild(script);
      }
    };
    
    loadGoogleMapsApi();
  }, []);
  
  // Initialize map once Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    
    try {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: originLocation,
        zoom: 13,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
      
      setMap(newMap);
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map. Please try again later.');
    }
  }, [isLoaded, originLocation]);
  
  // Add markers and directions once map is initialized
  useEffect(() => {
    if (!map || !isLoaded) return;
    
    // Create marker for origin
    const originMarker = new window.google.maps.Marker({
      position: originLocation,
      map,
      title: 'Pick-up Location',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Create marker for destination
    const destinationMarker = new window.google.maps.Marker({
      position: destinationLocation,
      map,
      title: 'Drop-off Location',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Create DirectionsService and DirectionsRenderer
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4CAF50',
        strokeOpacity: 0.8,
        strokeWeight: 5
      }
    });
    
    // Request directions
    directionsService.route(
      {
        origin: originLocation,
        destination: destinationLocation,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
    
    // Clean up on unmount
    return () => {
      originMarker.setMap(null);
      destinationMarker.setMap(null);
      directionsRenderer.setMap(null);
    };
  }, [map, isLoaded, originLocation, destinationLocation]);
  
  // Add driver marker and simulate movement
  useEffect(() => {
    if (!map || !isLoaded || !mockDriverLocation) return;
    
    // Create marker for driver
    const driverMarker = new window.google.maps.Marker({
      position: mockDriverLocation,
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
      setMockDriverLocation(prev => {
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
        
        return { lat: newLat, lng: newLng };
      });
    }, 2000);
    
    // Update marker position when mockDriverLocation changes
    if (mockDriverLocation) {
      driverMarker.setPosition(mockDriverLocation);
    }
    
    // Clean up
    return () => {
      clearInterval(interval);
      driverMarker.setMap(null);
    };
  }, [map, isLoaded, mockDriverLocation, destinationLocation]);
  
  if (error) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800`}>
        <div className="text-center p-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!isLoaded) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-wassalni-green" />
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading map...</p>
        </div>
      </div>
    );
  }
  
  return <div ref={mapRef} className={className} />;
};

export default RideMap;
