
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Map as MapIcon, AlertTriangle } from 'lucide-react';

interface RideMapProps {
  rideId: string;
  originLocation?: { lat: number; lng: number };
  destinationLocation?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  className?: string;
}

// Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyAShg04o1uyNHkCNwWLwrEuV7jxZ8xiIU8";

const RideMap: React.FC<RideMapProps> = ({ 
  rideId,
  originLocation = { lat: 36.3535, lng: 6.6424 }, // Default to Constantine location
  destinationLocation = { lat: 36.3635, lng: 6.6524 }, // Slightly offset for demonstration
  driverLocation,
  className = "w-full h-64 md:h-[400px] lg:h-[500px] rounded-lg"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Starting driver location (if not provided)
  const [mockDriverLocation, setMockDriverLocation] = useState<{ lat: number; lng: number } | null>(
    driverLocation || { 
      lat: originLocation.lat - 0.008, 
      lng: originLocation.lng - 0.005 
    }
  );
  
  // Function to load Google Maps API script synchronously
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if Google Maps API is already loaded
        if (window.google && window.google.maps) {
          console.log('Google Maps API already loaded');
          resolve();
          return;
        }
        
        console.log('Loading Google Maps API script synchronously');
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = false; // Load synchronously
        script.defer = false;
        
        script.onload = () => {
          console.log('Google Maps API loaded successfully');
          resolve();
        };
        
        script.onerror = (e) => {
          console.error('Failed to load Google Maps API:', e);
          reject(new Error('Failed to load Google Maps API'));
        };
        
        document.head.appendChild(script);
      });
    };
    
    const initializeMap = async () => {
      try {
        // Load the script first
        await loadGoogleMapsScript();
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please refresh the page.');
      }
    };
    
    initializeMap();
  }, []);
  
  // Initialize map once Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInitialized || !window.google || !window.google.maps) {
      return;
    }
    
    try {
      console.log('Initializing map with center:', originLocation);
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: originLocation,
        zoom: 14,
        mapTypeControl: false,
        fullscreenControl: true,
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
      setIsMapReady(true);
      setMapInitialized(true);
      
      // Force map resize to ensure it renders properly
      setTimeout(() => {
        if (newMap) {
          console.log('Forcing map resize');
          window.google.maps.event.trigger(newMap, 'resize');
          newMap.setCenter(originLocation);
        }
      }, 500);
      
      // Add a listener to handle resize events
      const handleResize = () => {
        if (newMap) {
          newMap.setCenter(originLocation);
          window.google.maps.event.trigger(newMap, 'resize');
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map. Please try again later.');
    }
  }, [isLoaded, originLocation, mapInitialized]);
  
  // Add markers and directions once map is initialized
  useEffect(() => {
    if (!map || !isMapReady || !window.google || !window.google.maps) {
      console.log('Map not ready for adding markers and directions');
      return;
    }
    
    console.log('Adding markers and directions');
    
    // Clear any existing markers
    map.data?.forEach((feature) => {
      map.data?.remove(feature);
    });
    
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
          console.log('Directions fetched successfully');
          directionsRenderer.setDirections(response);
          
          // Fit bounds to include both origin and destination
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
          bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
          map.fitBounds(bounds);
          
          // Adjust zoom if too zoomed in
          const zoomListener = window.google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom() > 16) map.setZoom(16);
            window.google.maps.event.removeListener(zoomListener);
          });
        } else {
          console.error('Directions request failed due to ' + status);
          
          // Fallback: just fit bounds to markers
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
          bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
          map.fitBounds(bounds);
        }
      }
    );
    
    // Add driver marker and simulate movement
    if (mockDriverLocation) {
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
          
          // Update marker position
          driverMarker.setPosition({ lat: newLat, lng: newLng });
          
          return { lat: newLat, lng: newLng };
        });
      }, 2000);
      
      // Clean up
      return () => {
        clearInterval(interval);
        driverMarker.setMap(null);
        originMarker.setMap(null);
        destinationMarker.setMap(null);
        directionsRenderer.setMap(null);
      };
    }
    
    // Clean up if no driver
    return () => {
      originMarker.setMap(null);
      destinationMarker.setMap(null);
      directionsRenderer.setMap(null);
    };
  }, [map, isMapReady, originLocation, destinationLocation, mockDriverLocation]);
  
  if (error) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800 border border-red-300 dark:border-red-800`}>
        <div className="text-center p-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    );
  }
  
  if (!isLoaded) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-wassalni-green" />
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }
  
  if (!isMapReady) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
        <div className="text-center">
          <MapIcon className="h-12 w-12 mx-auto text-wassalni-green mb-2" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Preparing map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div ref={mapRef} className={`${className} shadow-md border border-gray-200 dark:border-gray-700`} />
      <div className="flex justify-end gap-4 px-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Pick-up</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Drop-off</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">Driver</span>
        </div>
      </div>
    </div>
  );
};

export default RideMap;
