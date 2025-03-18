
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
  
  // Load Google Maps API
  useEffect(() => {
    const initializeMap = async () => {
      try {
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
    
    // Clean up
    return () => {
      originMarker.setMap(null);
      destinationMarker.setMap(null);
      directionsRenderer.setMap(null);
    };
  }, [map, isMapReady, originLocation, destinationLocation]);
  
  return { mapRef, map, isLoaded, isMapReady, error };
};
