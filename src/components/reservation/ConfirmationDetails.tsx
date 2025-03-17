
import { Check } from "lucide-react";
import { Ride } from "@/services/rides/types";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface ConfirmationDetailsProps {
  ride: Ride;
  passengerCount: number;
}

const ConfirmationDetails = ({ ride, passengerCount }: ConfirmationDetailsProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="glass-card p-8 rounded-xl mb-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
        <Check size={40} className="text-green-500 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">{t('reservation.successTitle')}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto dark:text-gray-300">
        {t('reservation.successMessage')}
      </p>
      
      <div className="glass-card border border-gray-200 p-6 rounded-lg mb-8 max-w-md mx-auto text-left dark:border-gray-700">
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.reservationId')}</span>
          <span className="font-medium">WAS-{Math.floor(Math.random() * 10000)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.driver')}</span>
          <span className="font-medium">{ride.driver}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.date')}</span>
          <span className="font-medium">
            {new Date(ride.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.time')}</span>
          <span className="font-medium">{ride.time}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.passengers')}</span>
          <span className="font-medium">{passengerCount}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.total')}</span>
          <span className="font-medium text-wassalni-green dark:text-wassalni-lightGreen">{ride.price * passengerCount} DZD</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outlined" 
          className="flex-1" 
          onClick={() => {
            sessionStorage.setItem('fromReservation', 'true');
            navigate('/rides');
          }}
        >
          {t('rides.title')}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationDetails;
