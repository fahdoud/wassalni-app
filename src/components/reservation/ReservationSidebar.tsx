
import { MapPin, Calendar, Clock } from "lucide-react";
import { Ride } from "@/services/rides/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReservationSidebarProps {
  ride: Ride;
  step: number;
  passengerCount: number;
}

const ReservationSidebar = ({ ride, step, passengerCount }: ReservationSidebarProps) => {
  const { t } = useLanguage();

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
        
        <div className="flex items-center gap-3 mb-6">
          <Clock size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.time')}</p>
            <p className="font-medium">{ride.time}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">{t('reservation.price')}</span>
            <span className="font-medium">{ride.price} DZD</span>
          </div>
          {step === 2 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">{t('reservation.passengers')}</span>
              <span className="font-medium">× {passengerCount}</span>
            </div>
          )}
          <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 font-medium dark:border-gray-700">
            <span>{t('reservation.total')}</span>
            <span className="text-wassalni-green dark:text-wassalni-lightGreen">
              {step === 1 ? ride.price : ride.price * passengerCount} DZD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSidebar;
