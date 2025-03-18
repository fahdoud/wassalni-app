
import React from 'react';
import { Loader2, Map as MapIcon } from 'lucide-react';

interface MapLoadingStateProps {
  className?: string;
  isInitializing?: boolean;
}

const MapLoadingState: React.FC<MapLoadingStateProps> = ({ className, isInitializing = false }) => {
  if (isInitializing) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
        <div className="text-center">
          <MapIcon className="h-12 w-12 mx-auto text-wassalni-green mb-2 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Chargement de la carte...</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">Les données seront disponibles rapidement</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-wassalni-green" />
        <p className="mt-3 text-gray-600 dark:text-gray-300 font-medium text-sm">Chargement de la carte...</p>
      </div>
    </div>
  );
};

export default MapLoadingState;
