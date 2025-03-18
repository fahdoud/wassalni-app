
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
  
  // Track whether the map is visible in the viewport
  const [isVisible, setIsVisible] = useState(true); // Changed to true by default to ensure initial visibility
  
  // Mock driver movement
  const [mockDriverLocation, setMockDriverLocation] = useState<{ lat: number; lng: number } | null>(
    driverLocation || { 
      lat: originLocation.lat - 0.008, 
      lng: originLocation.lng - 0.005 
    }
  );
  
  // Observer to detect when map is visible
  useEffect(() => {
    if (!mapRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(mapRef.current);
    
    return () => {
      if (mapRef.current) {
        observer.unobserve(mapRef.current);
      }
    };
  }, [mapRef]);
  
  // Function to load Google Maps API script
  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      setIsLoaded(true);
      return;
    }
    
    const loadGoogleMapsApi = () => {
      // Only add the script tag if it doesn't exist
      if (!document.getElementById('google-maps-script')) {
        console.log('Loading Google Maps API script');
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Define global callback function that Google Maps will call when loaded
        window.initMap = () => {
          console.log('Google Maps API initialized via callback');
          setIsLoaded(true);
        };
        
        script.onerror = (e) => {
          console.error('Failed to load Google Maps API:', e);
          setError('Failed to load Google Maps. Please try again later.');
        };
        
        document.head.appendChild(script);
      }
    };
    
    loadGoogleMapsApi();
    
    // Cleanup function
    return () => {
      // Clean up global callback if component unmounts before API loads
      if (window.initMap) {
        window.initMap = undefined;
      }
    };
  }, []);
  
  // Initialize map once Google Maps is loaded and component is visible
  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      console.log('Not ready to initialize map yet:', { isLoaded, isVisible, mapRef: !!mapRef.current });
      return;
    }
    
    try {
      if (!window.google || !window.google.maps) {
        console.error('Google Maps API not available despite isLoaded=true');
        setError('Google Maps API not available. Please refresh the page.');
        return;
      }
      
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
  }, [isLoaded, originLocation]);
  
  // Add markers and directions once map is initialized
  useEffect(() => {
    if (!map || !isMapReady || !window.google || !window.google.maps) return;
    
    console.log('Adding markers and directions');
    
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
        }
      }
    );
    
    // Clean up on unmount
    return () => {
      originMarker.setMap(null);
      destinationMarker.setMap(null);
      directionsRenderer.setMap(null);
    };
  }, [map, isMapReady, originLocation, destinationLocation]);
  
  // Add driver marker and simulate movement
  useEffect(() => {
    if (!map || !isMapReady || !mockDriverLocation || !window.google || !window.google.maps) return;
    
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
    
    // Only simulate movement when component is visible
    let interval: number | null = null;
    
    if (isVisible) {
      interval = window.setInterval(() => {
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
    }
    
    // Update marker position when mockDriverLocation changes
    if (mockDriverLocation) {
      driverMarker.setPosition(mockDriverLocation);
    }
    
    // Clean up
    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
      driverMarker.setMap(null);
    };
  }, [map, isMapReady, mockDriverLocation, destinationLocation, isVisible]);
  
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
      </div>
    </div>
  );
};

export default RideMap;
