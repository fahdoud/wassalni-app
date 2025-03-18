
// Google Maps API key
export const GOOGLE_MAPS_API_KEY = "AIzaSyAShg04o1uyNHkCNwWLwrEuV7jxZ8xiIU8";

// Function to load Google Maps API script with higher priority
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      resolve();
      return;
    }
    
    console.log('Loading Google Maps API script');
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMapCallback`;
    script.async = true;
    script.defer = true;
    
    // Set high priority loading
    script.setAttribute('importance', 'high');
    
    // Define global callback
    window.initMapCallback = function() {
      console.log('Google Maps API loaded successfully via callback');
      resolve();
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Google Maps API:', e);
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });
};

// Preload Google Maps
export const preloadGoogleMaps = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  document.head.appendChild(link);
  
  // Start loading script after a small delay
  setTimeout(() => {
    loadGoogleMapsScript().catch(err => console.error('Preload error:', err));
  }, 500);
};

// Note: We don't need to declare the Window interface here
// It is now properly declared in src/types/google-maps.d.ts
