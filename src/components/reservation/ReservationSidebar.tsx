
import { MapPin, Calendar, Clock, User } from "lucide-react";
import { Ride } from "@/services/rides/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface ReservationSidebarProps {
  ride: Ride;
  step?: number;
  passengerCount?: number;
  seats?: number;
  price?: number;
  reservationSuccess?: boolean;
  seatAvailability?: {
    total: number;
    remaining: number;
    available: boolean;
  } | null;
}

const ReservationSidebar = ({ 
  ride, 
  step = 1, 
  passengerCount, 
  seats, 
  price: externalPrice, 
  reservationSuccess,
  seatAvailability
}: ReservationSidebarProps) => {
  const { t } = useLanguage();
  const [availableSeats, setAvailableSeats] = useState(ride.seats);
  
  // Use either seats or passengerCount for backward compatibility
  const currentSeats = seats || passengerCount || 1;
  
  // Use provided price or calculate from ride
  const price = externalPrice || ride.price;
  
  // Determine which step we're on
  const currentStep = step === 2 || reservationSuccess ? 2 : 1;

  // Update availableSeats whenever ride.seats changes or seatAvailability changes
  useEffect(() => {
    if (seatAvailability) {
      console.log("Seat availability updated in sidebar:", seatAvailability);
      setAvailableSeats(seatAvailability.remaining);
    } else {
      console.log("Ride seats updated in sidebar:", ride.seats);
      setAvailableSeats(ride.seats);
    }
  }, [ride.seats, seatAvailability]);

  return (
    <div className="lg:w-80">
      <div className="glass-card p-6 rounded-xl sticky top-28">
        <h3 className="font-semibold mb-4">{t('reservation.title')}</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} className="text-wassalni-green shrink-0 dark:text-wassalni-lightGreen" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('form.from')}</p>
            <p className="font-medium">{ride.from}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} className="text-wassalni-blue shrink-0 dark:text-wassalni-lightBlue" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('form.to')}</p>
            <p className="font-medium">{ride.to}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <Calendar size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.date')}</p>
            <p className="font-medium">
              {new Date(ride.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <Clock size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.time')}</p>
            <p className="font-medium">{ride.time}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <User size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.availableSeats')}</p>
            <p className={`font-medium ${availableSeats > 0 ? '' : 'text-red-500'}`}>
              {availableSeats > 0 
                ? `${availableSeats} ${availableSeats === 1 ? t('rides.seat') : t('rides.seats')}` 
                : t('rides.full')}
            </p>
          </div>
        </div>
        
        {seatAvailability && (
          <div className="flex items-center gap-3 mb-6">
            <User size={18} className="text-blue-500 shrink-0 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.totalSeats')}</p>
              <p className="font-medium text-blue-600 dark:text-blue-400">
                {seatAvailability.total}
              </p>
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">{t('reservation.price')}</span>
            <span className="font-medium">{price} DZD</span>
          </div>
          {currentStep === 2 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">{t('reservation.passengers')}</span>
              <span className="font-medium">× {currentSeats}</span>
            </div>
          )}
          <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 font-medium dark:border-gray-700">
            <span>{t('reservation.total')}</span>
            <span className="text-wassalni-green dark:text-wassalni-lightGreen">
              {currentStep === 1 ? price : price * currentSeats} DZD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSidebar;
