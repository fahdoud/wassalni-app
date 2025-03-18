
import { useState, useEffect, useRef } from 'react';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';

interface Location {
  lat: number;
  lng: number;
}

interface UseMapDirectionsProps {
  originLocation: Location;
  destinationLocation: Location;
}

interface UseMapDirectionsReturn {
  mapRef: React.RefObject<HTMLDivElement>;
  map: google.maps.Map | null;
  isLoaded: boolean;
  isMapReady: boolean;
  error: string | null;
}

export const useMapDirections = ({ 
  originLocation, 
  destinationLocation 
}: UseMapDirectionsProps): UseMapDirectionsReturn => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Immediately check if Google Maps is already loaded
  useEffect(() => {
    if (window.google && window.google.maps) {
      console.log('Google Maps already available, setting isLoaded true immediately');
      setIsLoaded(true);
    }
  }, []);
  
  // Load Google Maps API with highest priority if not already loaded
  useEffect(() => {
    if (isLoaded) return; // Skip if already loaded
    
    const initializeMap = async () => {
      try {
        console.log('Starting Google Maps initialization with highest priority');
        await loadGoogleMapsScript();
        console.log('Google Maps script loaded successfully and ready to use');
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please refresh the page.');
      }
    };
    
    // Start loading immediately
    initializeMap();
    
    // Set a timeout to force isLoaded after 2 seconds as a fallback
    const timeout = setTimeout(() => {
      if (window.google && window.google.maps && !isLoaded) {
        console.log('Forcing isLoaded after timeout');
        setIsLoaded(true);
      }
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [isLoaded]);
  
  // Initialize map as soon as Google Maps is loaded
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
        gestureHandling: 'cooperative',
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
      
      // Force resize immediately for correct rendering
      window.google.maps.event.trigger(newMap, 'resize');
      newMap.setCenter(originLocation);
      
      // Set another resize after a tiny delay to ensure proper sizing
      setTimeout(() => {
        if (newMap) {
          window.google.maps.event.trigger(newMap, 'resize');
          newMap.setCenter(originLocation);
        }
      }, 50);
      
      // Add resize handler
      const handleResize = () => {
        if (newMap) {
          window.google.maps.event.trigger(newMap, 'resize');
          newMap.setCenter(originLocation);
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
  
  // Add markers and directions immediately once map is ready
  useEffect(() => {
    if (!map || !isMapReady || !window.google || !window.google.maps) {
      return;
    }
    
    console.log('Adding markers and directions');
    
    // Clear existing markers
    map.data?.forEach((feature) => {
      map.data?.remove(feature);
    });
    
    // Create origin marker
    const originMarker = new window.google.maps.Marker({
      position: originLocation,
      map,
      title: 'Point de ramassage',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Create destination marker
    const destinationMarker = new window.google.maps.Marker({
      position: destinationLocation,
      map,
      title: 'Point de dépose',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Create a polyline first for immediate visual
    const directPath = new window.google.maps.Polyline({
      path: [originLocation, destinationLocation],
      geodesic: true,
      strokeColor: '#4CAF50',
      strokeOpacity: 0.7,
      strokeWeight: 4,
      map: map
    });
    
    // Set appropriate bounds immediately
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
    bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
    map.fitBounds(bounds);
    
    // Then fetch proper directions
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
    
    directionsService.route(
      {
        origin: originLocation,
        destination: destinationLocation,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === 'OK') {
          // Hide the temporary polyline when real directions arrive
          directPath.setMap(null);
          
          console.log('Directions fetched successfully');
          directionsRenderer.setDirections(response);
          
          // Adjust bounds to include origin and destination
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
          bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
          map.fitBounds(bounds);
          
          // Adjust zoom if too zoomed in
          const zoomListener = window.google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom() > 16) map.setZoom(16);
            window.google.maps.event.removeListener(zoomListener);
          });
        }
      }
    );
    
    // Cleanup
    return () => {
      originMarker.setMap(null);
      destinationMarker.setMap(null);
      directPath.setMap(null);
      directionsRenderer.setMap(null);
    };
  }, [map, isMapReady, originLocation, destinationLocation]);
  
  return { mapRef, map, isLoaded, isMapReady, error };
};
