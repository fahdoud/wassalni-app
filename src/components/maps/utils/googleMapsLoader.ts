
// Google Maps API key
export const GOOGLE_MAPS_API_KEY = "AIzaSyAShg04o1uyNHkCNwWLwrEuV7jxZ8xiIU8";

// Function to load Google Maps API script with absolute highest priority
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded, resolving immediately');
      resolve();
      return;
    }
    
    console.log('Loading Google Maps API script with high priority');
    
    // Create the script element with highest priority
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMapCallback`;
    script.async = true;
    script.defer = false; // Remove defer to load immediately
    
    // Set absolute highest priority for loading
    script.setAttribute('importance', 'high');
    script.setAttribute('fetchpriority', 'high');
    
    // Force high-priority loading
    script.onload = () => {
      console.log('Google Maps script loaded via onload');
      if (!window.google || !window.google.maps) {
        // Wait a very short time for maps to initialize if needed
        setTimeout(() => {
          if (window.google && window.google.maps) {
            console.log('Maps loaded after brief delay');
            resolve();
          }
        }, 50);
      } else {
        resolve();
      }
    };
    
    // Define global callback as a backup
    window.initMapCallback = function() {
      console.log('Google Maps API loaded successfully via callback');
      resolve();
    };
    
    script.onerror = (e) => {
      console.error('Failed to load Google Maps API:', e);
      reject(new Error('Failed to load Google Maps API'));
    };
    
    // Insert at the beginning of head for highest priority
    document.head.insertBefore(script, document.head.firstChild);
  });
};

// Advanced preloading of Google Maps to make it load immediately
export const preloadGoogleMaps = () => {
  console.log('Preloading Google Maps with highest priority');
  
  // 1. DNS-prefetch
  const dnsPrefetch = document.createElement('link');
  dnsPrefetch.rel = 'dns-prefetch';
  dnsPrefetch.href = 'https://maps.googleapis.com';
  document.head.appendChild(dnsPrefetch);
  
  // 2. Preconnect
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://maps.googleapis.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);
  
  // 3. Preload with highest priority
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
  
  // 4. Start loading script immediately
  loadGoogleMapsScript().catch(err => console.error('Preload error:', err));
};

// Note: We don't need to declare the Window interface here
// It is now properly declared in src/types/google-maps.d.ts
