
import { useEffect, useState } from "react";

// Interface for the detailed mobile information
export interface MobileInfo {
  isMobile: boolean;
  deviceType: string;
}

// This hook returns detailed mobile information
export const useIsMobile = (): MobileInfo => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<string>("desktop");

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      setIsMobile(mobile);
      
      if (/iphone|ipod|android|blackberry|windows phone/g.test(userAgent)) {
        setDeviceType("phone");
      } else if (/ipad/g.test(userAgent)) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return { isMobile, deviceType };
};

// This is a simplified version of the hook that only returns a boolean
export const useIsMobileSimple = (): boolean => {
  const { isMobile } = useIsMobile();
  return isMobile;
};

// Default export for backward compatibility
export default useIsMobileSimple;
