
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Car, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import RideMap from '@/components/maps/RideMap';
import { Ride } from '@/services/rides/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface TrackingSectionProps {
  ride: Ride | null;
  rideId: string;
  rideLocations: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  } | null;
}

const TrackingSection: React.FC<TrackingSectionProps> = ({ 
  ride, 
  rideId, 
  rideLocations 
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-wassalni-green" />
            {t('reservation.liveTracking')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {t('reservation.trackingDescription')}
          </p>
          
          {rideLocations ? (
            <RideMap 
              key={`map-${rideId}`}
              rideId={rideId} 
              originLocation={rideLocations.origin} 
              destinationLocation={rideLocations.destination}
            />
          ) : (
            <div className="space-y-2">
              <Skeleton className="w-full h-[400px] rounded-lg" />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-wassalni-green" />
            {t('reservation.driverInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-wassalni-green flex items-center justify-center text-white">
              {ride?.driver.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{ride?.driver}</p>
              <div className="flex items-center text-yellow-500 text-sm">
                {'★'.repeat(Math.floor(ride?.rating || 0))}
                <span className="text-gray-400 ml-1">{ride?.rating}</span>
              </div>
            </div>
          </div>
          
          {rideLocations && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  {t('reservation.pickup')}
                </p>
                <p className="whitespace-normal break-words">{ride?.from}</p>
                <p className="text-xs text-gray-500">{ride?.time}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  {t('reservation.dropoff')}
                </p>
                <p className="whitespace-normal break-words">{ride?.to}</p>
                <p className="text-xs text-gray-500">
                  {t('reservation.estimatedArrival')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingSection;
