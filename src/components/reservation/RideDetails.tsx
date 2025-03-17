
import { Ride } from "@/services/rides/types";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";

interface RideDetailsProps {
  ride: Ride;
  onContinue: () => void;
}

const RideDetails = ({ ride, onContinue }: RideDetailsProps) => {
  const { t } = useLanguage();

  return (
    <div className="glass-card p-8 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-6">{t('reservation.details')}</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
            {ride.driver.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{ride.driver}</p>
            <div className="flex items-center text-yellow-500 text-sm">
              {'★'.repeat(Math.floor(ride.rating))}
              <span className="text-gray-400 ml-1">{ride.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-2 mt-6">
          <div className="relative pl-8 pb-8">
            <div className="absolute top-0 left-0 h-full w-[2px] bg-gray-200 dark:bg-gray-700"></div>
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-wassalni-green -translate-x-1/2"></div>
            <div>
              <p className="font-medium">{ride.from}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ride.time}</p>
            </div>
          </div>
          <div className="relative pl-8">
            <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-wassalni-blue -translate-x-1/2"></div>
            <div>
              <p className="font-medium">{ride.to}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.estimatedArrival')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-gray-700">
          <Calendar size={16} className="text-wassalni-green dark:text-wassalni-lightGreen" />
          <span>
            {new Date(ride.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-gray-700">
          <Clock size={16} className="text-wassalni-green dark:text-wassalni-lightGreen" />
          <span>{ride.time}</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          ride.seats > 0 
            ? "bg-gray-100 dark:bg-gray-700"
            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <User size={16} className={ride.seats > 0 ? "text-wassalni-green dark:text-wassalni-lightGreen" : "text-red-500 dark:text-red-400"} />
          <span>
            {ride.seats > 0 
              ? `${ride.seats} ${ride.seats === 1 ? t('rides.seat') : t('rides.seats')}`
              : t('rides.full')}
          </span>
        </div>
      </div>
      
      <div className="mt-8">
        <Button 
          className="w-full"
          onClick={onContinue}
          disabled={ride.seats <= 0}
        >
          {ride.seats > 0 ? t('reservation.payment') : t('rides.full')}
        </Button>
      </div>
    </div>
  );
};

export default RideDetails;
