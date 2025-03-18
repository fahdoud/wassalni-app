
import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="flex justify-end gap-4 px-2">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Pick-up</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Drop-off</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-xs text-gray-600 dark:text-gray-300">Driver</span>
      </div>
    </div>
  );
};

export default MapLegend;
