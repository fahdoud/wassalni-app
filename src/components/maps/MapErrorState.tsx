
import React from 'react';
import { AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapErrorStateProps {
  error: string;
  className?: string;
  onRetry?: () => void;
}

const MapErrorState: React.FC<MapErrorStateProps> = ({ error, className, onRetry }) => {
  // Extract more specific error context if available
  const isApiKeyError = error.includes('API key') || 
                        error.includes('authentication') || 
                        error.includes('billing');
                        
  const isBillingError = error.includes('billing');

  return (
    <div className={`${className} bg-gray-100 flex items-center justify-center dark:bg-gray-800 border border-red-300 dark:border-red-800`}>
      <div className="text-center p-6 max-w-md">
        <div className="flex items-center justify-center mb-4">
          {isApiKeyError ? (
            <MapPin className="h-12 w-12 text-red-500" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-red-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {isBillingError ? "Google Maps Billing Required" : isApiKeyError ? "Google Maps API Key Error" : "Map Display Error"}
        </h3>
        
        <p className="text-red-500 dark:text-red-400 font-medium mb-3">{error}</p>
        
        {isApiKeyError ? (
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
            {isBillingError ? (
              <p className="font-medium mb-2">Your API key is valid, but billing needs to be enabled:</p>
            ) : (
              <p className="font-medium mb-2">API key is valid, but needs proper setup:</p>
            )}
            <ul className="list-disc text-left pl-5 space-y-1">
              <li>Enable the Google Maps JavaScript API in Google Cloud Console</li>
              <li className="font-medium text-red-500">Enable billing in your Google Cloud account</li>
              <li>Set up payment methods in Google Cloud Console</li>
              <li>Check domain restrictions if you've set any</li>
            </ul>
            
            <div className="mt-3 flex justify-center">
              <a 
                href="https://console.cloud.google.com/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200"
              >
                Open Google Cloud Billing <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
            Please check your internet connection and try again.
          </p>
        )}
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="mt-4 bg-wassalni-green text-white hover:bg-wassalni-green/90"
          >
            Retry Loading Map
          </Button>
        )}
      </div>
    </div>
  );
};

export default MapErrorState;
