
import React, { useEffect, useState } from 'react';
import { Loader2, Map as MapIcon } from 'lucide-react';

interface MapLoadingStateProps {
  className?: string;
  isInitializing?: boolean;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ className, isInitializing = false }) => {
  const [loadingTime, setLoadingTime] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTime(prev => {
        // Don't exceed 100%
        return prev < 100 ? prev + 5 : 100;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  if (isInitializing) {
    return (
      <div className={`${className} bg-gray-900 flex items-center justify-center dark:bg-gray-800 border border-gray-700 dark:border-gray-700 p-4 rounded-lg`}>
        <div className="text-center">
          <MapIcon className="h-12 w-12 mx-auto text-wassalni-green mb-2 animate-pulse" />
          <p className="text-gray-200 dark:text-gray-300 font-medium text-sm">Chargement de la carte...</p>
          <p className="text-gray-400 dark:text-gray-400 text-xs mt-2">Les données seront disponibles rapidement</p>
          <div className="mt-3 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-wassalni-green h-full transition-all duration-300 rounded-full" 
              style={{ width: `${loadingTime}%` }}
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} bg-gray-900 flex items-center justify-center dark:bg-gray-800 border border-gray-700 dark:border-gray-700 p-4 rounded-lg`}>
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-wassalni-green" />
        <p className="mt-3 text-gray-200 dark:text-gray-300 font-medium text-sm">Chargement de la carte...</p>
        <div className="mt-3 w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-wassalni-green h-full transition-all duration-300 rounded-full" 
            style={{ width: `${loadingTime}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapLoadingState;
