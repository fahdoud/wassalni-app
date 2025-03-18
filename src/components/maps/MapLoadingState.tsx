
import React, { useEffect, useState } from 'react';
import { Loader2, Map as MapIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MapLoadingStateProps {
  className?: string;
  isInitializing?: boolean;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ className, isInitializing = false }) => {
  const [loadingTime, setLoadingTime] = useState(0);
  
  // Make the loading progress faster
  useEffect(() => {
    // Start at 30% to make it feel faster
    setLoadingTime(30);
    
    const interval = setInterval(() => {
      setLoadingTime(prev => {
        if (prev < 70) return prev + 10; // Load quickly to 70%
        if (prev < 90) return prev + 3;  // Slow down a bit
        return prev;                     // Stay at 90% until actual load
      });
    }, 150); // Faster interval
    
    // Force complete after reasonable timeout
    const timeout = setTimeout(() => {
      setLoadingTime(100);
    }, 2000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);
  
  if (isInitializing) {
    return (
      <div className={`${className} bg-gray-900/90 backdrop-blur-sm flex items-center justify-center dark:bg-gray-800/90 rounded-lg overflow-hidden absolute inset-0 z-10`}>
        <div className="text-center p-6 bg-gray-950/80 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 max-w-xs w-full">
          <MapIcon className="h-12 w-12 mx-auto text-wassalni-green mb-2 animate-pulse" />
          <p className="text-gray-200 dark:text-gray-200 font-medium">Chargement de la carte...</p>
          <p className="text-gray-400 dark:text-gray-400 text-xs mt-1">Presque prêt</p>
          <Progress 
            value={loadingTime} 
            className="h-1.5 mt-3 bg-gray-800"
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} bg-gray-900/90 backdrop-blur-sm flex items-center justify-center dark:bg-gray-800/90 rounded-lg overflow-hidden absolute inset-0 z-10`}>
      <div className="text-center p-6 bg-gray-950/80 backdrop-blur-md rounded-lg shadow-xl border border-gray-700 max-w-xs w-full">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-wassalni-green" />
        <p className="mt-2 text-gray-200 dark:text-gray-200 font-medium">Chargement de la carte...</p>
        <p className="text-gray-400 dark:text-gray-400 text-xs mt-1">Les données seront disponibles rapidement</p>
        <Progress 
          value={loadingTime} 
          className="h-1.5 mt-3 bg-gray-800"
        />
      </div>
    </div>
  );
};

export default MapLoadingState;
