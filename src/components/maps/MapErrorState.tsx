
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MapErrorStateProps {
  error: string;
  className?: string;
}

const MapErrorState: React.FC<MapErrorStateProps> = ({ error, className }) => {
  return (
    <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800 border border-red-300 dark:border-red-800`}>
      <div className="text-center p-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
};

export default MapErrorState;
