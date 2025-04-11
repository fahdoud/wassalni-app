
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
  const { language } = useLanguage();
  
  // Définir les textes en fonction de la langue
  const liveTrackingText = language === 'en' ? 'Live Tracking' : 
                            language === 'fr' ? 'Suivi en Direct' : 
                            'تتبع مباشر';
  
  const trackingDescriptionText = language === 'en' ? 'Track your ride in real-time and see the estimated arrival time.' : 
                                  language === 'fr' ? 'Suivez votre trajet en temps réel et consultez l\'heure d\'arrivée estimée.' : 
                                  'تتبع رحلتك في الوقت الفعلي ومعرفة وقت الوصول المقدر.';
  
  const infoText = language === 'en' ? 'Driver Info' : 
                   language === 'fr' ? 'Info Conducteur' : 
                   'معلومات السائق';
  
  const pickupText = language === 'en' ? 'Pick up' : 
                     language === 'fr' ? 'Départ' : 
                     'نقطة الانطلاق';
  
  const dropoffText = language === 'en' ? 'Drop off' : 
                      language === 'fr' ? 'Arrivée' : 
                      'نقطة الوصول';
  
  const estimatedArrivalText = language === 'en' ? 'Est. arrival: 30-45 min' : 
                               language === 'fr' ? 'Arrivée est.: 30-45 min' : 
                               'الوصول المقدر: 30-45 دقيقة';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-wassalni-green" />
            {liveTrackingText}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {trackingDescriptionText}
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
            {infoText}
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
                  {pickupText}
                </p>
                <p className="whitespace-normal break-words">{ride?.from}</p>
                <p className="text-xs text-gray-500">{ride?.time}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  {dropoffText}
                </p>
                <p className="whitespace-normal break-words">{ride?.to}</p>
                <p className="text-xs text-gray-500">
                  {estimatedArrivalText}
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
