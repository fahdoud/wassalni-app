
import { useState } from "react";
import { Ride } from "@/services/rides/types";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentDetailsProps {
  ride: Ride;
  passengerCount: number;
  setPassengerCount: (count: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const PaymentDetails = ({
  ride,
  passengerCount,
  setPassengerCount,
  onBack,
  onConfirm,
  loading
}: PaymentDetailsProps) => {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState("cash");

  return (
    <div className="glass-card p-8 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-6">{t('reservation.payment')}</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          {t('reservation.passengers')}
        </label>
        <div className="flex items-center">
          <button
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
            disabled={passengerCount <= 1}
          >
            -
          </button>
          <span className="mx-4 font-medium w-8 text-center">{passengerCount}</span>
          <button
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => setPassengerCount(Math.min(ride.seats, passengerCount + 1))}
            disabled={passengerCount >= ride.seats}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          {t('reservation.paymentMethod')}
        </label>
        <div className="space-y-3">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all flex items-center ${
              paymentMethod === 'cash' 
                ? 'border-wassalni-green bg-wassalni-green/5 dark:border-wassalni-lightGreen dark:bg-wassalni-lightGreen/10' 
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            }`}
            onClick={() => setPaymentMethod('cash')}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
              paymentMethod === 'cash' 
                ? 'border-wassalni-green dark:border-wassalni-lightGreen' 
                : 'border-gray-400 dark:border-gray-500'
            }`}>
              {paymentMethod === 'cash' && (
                <div className="w-3 h-3 rounded-full bg-wassalni-green dark:bg-wassalni-lightGreen"></div>
              )}
            </div>
            <div className="flex-grow">
              <p className="font-medium">{t('reservation.cash')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.payDriver')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.baseFare')}</span>
          <span>{ride.price} DZD</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">{t('reservation.passengers')} × {passengerCount}</span>
          <span>{ride.price * passengerCount} DZD</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>{t('reservation.total')}</span>
          <span className="text-wassalni-green dark:text-wassalni-lightGreen">{ride.price * passengerCount} DZD</span>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outlined" 
          className="flex-1" 
          onClick={onBack}
        >
          {t('reservation.back')}
        </Button>
        <Button 
          className="flex-1"
          onClick={onConfirm}
          isLoading={loading}
          disabled={loading}
        >
          {t('reservation.confirmReservation')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;
