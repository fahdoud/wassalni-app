
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Set high priority loading
    script.setAttribute('importance', 'high');
    
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      // Small timeout to ensure API is fully initialized
      setTimeout(() => resolve(), 100);
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Google Maps API:', e);
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });
};
