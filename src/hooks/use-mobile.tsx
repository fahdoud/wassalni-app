
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Detect mobile device based on user agent as a fallback
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      if (mobileRegex.test(userAgent)) {
        return true;
      }
      // Check screen width as well
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add a device type detection
  const deviceType = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent;
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return 'ios';
      } else if (/Android/i.test(userAgent)) {
        return 'android';
      }
    }
    return 'desktop';
  }, []);

  return { isMobile, deviceType };
}

// Export the simpler version for backward compatibility
export default function useIsMobileSimple(): boolean {
  const { isMobile } = useIsMobile();
  return isMobile;
}
