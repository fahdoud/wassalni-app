
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
  
  // Charge l'API Google Maps avec priorité élevée
  useEffect(() => {
    const initializeMap = async () => {
      try {
        console.log('Starting Google Maps initialization with high priority');
        // Utilise la méthode améliorée pour charger l'API Google Maps
        await loadGoogleMapsScript();
        console.log('Google Maps script loaded successfully and ready to use');
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please refresh the page.');
      }
    };
    
    // Démarre immédiatement le chargement
    initializeMap();
  }, []);
  
  // Initialise la carte une fois Google Maps chargé
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
      
      // Force le redimensionnement immédiat de la carte pour s'assurer qu'elle se dessine correctement
      window.google.maps.event.trigger(newMap, 'resize');
      newMap.setCenter(originLocation);
      
      // Ajoute un écouteur pour gérer les événements de redimensionnement
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
  
  // Ajoute des marqueurs et des directions une fois la carte initialisée
  useEffect(() => {
    if (!map || !isMapReady || !window.google || !window.google.maps) {
      console.log('Map not ready for adding markers and directions');
      return;
    }
    
    console.log('Adding markers and directions');
    
    // Efface les marqueurs existants
    map.data?.forEach((feature) => {
      map.data?.remove(feature);
    });
    
    // Crée un marqueur pour l'origine
    const originMarker = new window.google.maps.Marker({
      position: originLocation,
      map,
      title: 'Point de ramassage',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Crée un marqueur pour la destination
    const destinationMarker = new window.google.maps.Marker({
      position: destinationLocation,
      map,
      title: 'Point de dépose',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });
    
    // Crée DirectionsService et DirectionsRenderer
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
    
    // Demande d'itinéraire
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
          
          // Ajuste les limites pour inclure à la fois l'origine et la destination
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
          bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
          map.fitBounds(bounds);
          
          // Ajuste le zoom s'il est trop zoomé
          const zoomListener = window.google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom() > 16) map.setZoom(16);
            window.google.maps.event.removeListener(zoomListener);
          });
        } else {
          console.error('Directions request failed due to ' + status);
          
          // Fallback: ajuste les limites aux marqueurs
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(originLocation.lat, originLocation.lng));
          bounds.extend(new window.google.maps.LatLng(destinationLocation.lat, destinationLocation.lng));
          map.fitBounds(bounds);
        }
      }
    );
    
    // Nettoyage
    return () => {
      originMarker.setMap(null);
      destinationMarker.setMap(null);
      directionsRenderer.setMap(null);
    };
  }, [map, isMapReady, originLocation, destinationLocation]);
  
  return { mapRef, map, isLoaded, isMapReady, error };
};
