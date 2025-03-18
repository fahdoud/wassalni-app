import { useState, useEffect, useRef } from 'react';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';

interface Location {
  lat: number;
  lng: number;
}

interface UseMapDirectionsProps {
  originLocation: Location;
  destinationLocation: Location;
  retryCount?: number;
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
  destinationLocation,
  retryCount = 0
}: UseMapDirectionsProps): UseMapDirectionsReturn => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  useEffect(() => {
    if (retryCount > 0) {
      setError(null);
      setIsLoaded(false);
      setIsMapReady(false);
      setMapInitialized(false);
      setMap(null);
    }
  }, [retryCount]);
  
  useEffect(() => {
    if (window.google && window.google.maps) {
      console.log('Google Maps already available, setting isLoaded true immediately');
      setIsLoaded(true);
    }
  }, []);
  
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
        setError('Failed to load Google Maps. The API key may need to be configured properly with billing enabled.');
      }
    };
    
    initializeMap();
    
    const timeout = setTimeout(() => {
      if (window.google && window.google.maps && !isLoaded) {
        console.log('Forcing isLoaded after timeout');
        setIsLoaded(true);
      } else if (!window.google?.maps && !error) {
        console.log('Map did not load after timeout');
        setError('Google Maps API did not load. Please check if the API key is valid and billing is enabled.');
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [isLoaded, error]);
  
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
      
      window.google.maps.event.trigger(newMap, 'resize');
      newMap.setCenter(originLocation);
      
      setTimeout(() => {
        if (newMap) {
          window.google.maps.event.trigger(newMap, 'resize');
          newMap.setCenter(originLocation);
        }
      }, 50);
      
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
      setError('Failed to initialize map. Please verify that your Google Cloud billing account is properly set up.');
    }
  }, [isLoaded, originLocation, mapInitialized]);
  
  useEffect(() => {
    if (!map || !isMapReady || !window.google || !window.google.maps) {
      return;
    }
    
    console.log('Adding markers and directions');
    
    map.data?.forEach((feature) => {
      map.data?.remove(feature);
    });
    
    const originMarker = new window.google.maps.Marker({
      position: originLocation,
      map,
      title: 'Point de ramassage',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    const destinationMarker = new window.google.maps.Marker({
      position: destinationLocation,
      map,
      title: 'Point de dépose',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    const directPath = new window.google.maps.Polyline({
      path: [originLocation, destinationLocation],
      geodesic: true,
      strokeColor: '#4CAF50',
      strokeOpacity: 0.7,
      strokeWeight: 4,
      map: map
    });
    
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
    bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
    map.fitBounds(bounds);
    
    try {
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
            directPath.setMap(null);
            
            console.log('Directions fetched successfully');
            directionsRenderer.setDirections(response);
            
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
            bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
            map.fitBounds(bounds);
            
            const zoomListener = window.google.maps.event.addListener(map, 'idle', () => {
              if (map.getZoom() > 16) map.setZoom(16);
              window.google.maps.event.removeListener(zoomListener);
            });
          } else {
            console.warn('Directions request failed, using direct line instead. Status:', status);
            // Keep the direct line visible when directions fail
          }
        }
      );
    } catch (err) {
      console.error('Error fetching directions:', err);
      // The straight line is already visible as a fallback
    }
    
    return () => {
      originMarker.setMap(null);
      destinationMarker.setMap(null);
      directPath.setMap(null);
    };
  }, [map, isMapReady, originLocation, destinationLocation]);
  
  return { mapRef, map, isLoaded, isMapReady, error };
};
