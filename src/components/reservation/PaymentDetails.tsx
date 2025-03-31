
import { useState } from "react";
import { Ride } from "@/services/rides/types";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { UserCheck, Lock } from "lucide-react";
import { toast } from "sonner";

interface PaymentDetailsProps {
  ride?: Ride;
  price?: number;
  seats?: number;
  passengerCount?: number;
  setPassengerCount?: (count: number) => void;
  setSeats?: (seats: number) => void;
  onBack?: () => void;
  onConfirm?: () => void;
  onSubmit?: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  isAuthenticated?: boolean;
}

const PaymentDetails = ({
  ride,
  price,
  seats,
  passengerCount,
  setPassengerCount,
  setSeats,
  onBack,
  onConfirm,
  onSubmit,
  loading,
  error,
  isAuthenticated
}: PaymentDetailsProps) => {
  const { t, language } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [reservationInProgress, setReservationInProgress] = useState(false);
  
  // Use either seats or passengerCount for backward compatibility
  const currentSeats = seats || passengerCount || 1;
  
  // Handle both setPassengerCount and setSeats for backward compatibility
  const handleSetSeats = (count: number) => {
    if (setPassengerCount) {
      setPassengerCount(count);
    }
    if (setSeats) {
      setSeats(count);
    }
  };
  
  // Handle submit function with error handling
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error(t('login'));
      return;
    }
    
    if (reservationInProgress) return;
    
    try {
      setReservationInProgress(true);
      
      if (onSubmit) {
        await onSubmit();
      } else if (onConfirm) {
        onConfirm();
      }
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(t('error'));
    } finally {
      setReservationInProgress(false);
    }
  };
  
  // Calculate available seats from ride if available
  const availableSeats = ride?.seats || 4; // Default to 4 if no ride provided
  
  // Calculate displayed price based on what's available
  const displayPrice = price || (ride ? ride.price : 0);
  const totalPrice = displayPrice * currentSeats;

  // Translation text mapping based on language
  const texts = {
    payment: t('payment'),
    passengers: t('passengers'),
    notEnoughSeats: t('notEnoughSeats'),
    loginRequired: t('login'),
    loginToReserve: t('loginToBook'),
    login: t('login'),
    register: t('register'),
    paymentMethod: t('paymentMethod'),
    cash: t('cash'),
    payDriver: t('payDriver'),
    baseFare: t('baseFare'),
    total: t('total'),
    back: t('back'),
    confirmReservation: t('confirmReservation'),
    loginToConfirm: t('loginToConfirm')
  };

  return (
    <div className="glass-card p-8 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-6">{texts.payment}</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          {texts.passengers}
        </label>
        <div className="flex items-center">
          <button
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => handleSetSeats(Math.max(1, currentSeats - 1))}
            disabled={currentSeats <= 1}
          >
            -
          </button>
          <span className="mx-4 font-medium w-8 text-center">{currentSeats}</span>
          <button
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => handleSetSeats(Math.min(availableSeats, currentSeats + 1))}
            disabled={currentSeats >= availableSeats}
          >
            +
          </button>
        </div>
        {ride && ride.seats < currentSeats && (
          <p className="text-sm text-red-500 mt-1">
            {texts.notEnoughSeats}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>
        )}
      </div>
      
      {!isAuthenticated && (
        <div className="mb-6 p-5 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-800">
              <Lock size={18} className="text-yellow-600 dark:text-yellow-300" />
            </div>
            <h3 className="font-medium text-lg">{texts.loginRequired}</h3>
          </div>
          <p className="mb-4">{texts.loginToReserve}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/passenger-signin" 
              className="text-center py-2 px-4 bg-wassalni-blue text-white font-medium rounded-lg hover:bg-wassalni-blue/90 transition-colors dark:bg-wassalni-lightBlue dark:hover:bg-wassalni-lightBlue/90"
            >
              {texts.login}
            </Link>
            <Link 
              to="/passenger-signup" 
              className="text-center py-2 px-4 bg-wassalni-green text-white font-medium rounded-lg hover:bg-wassalni-green/90 transition-colors dark:bg-wassalni-lightGreen dark:hover:bg-wassalni-lightGreen/90"
            >
              {texts.register}
            </Link>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          {texts.paymentMethod}
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
              <p className="font-medium">{texts.cash}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{texts.payDriver}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">{texts.baseFare}</span>
          <span>{displayPrice} DZD</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">{texts.passengers} × {currentSeats}</span>
          <span>{totalPrice} DZD</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>{texts.total}</span>
          <span className="text-wassalni-green dark:text-wassalni-lightGreen">{totalPrice} DZD</span>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outlined" 
          className="flex-1" 
          onClick={onBack}
          disabled={!onBack}
        >
          {texts.back}
        </Button>
        <Button 
          className="flex-1"
          onClick={handleSubmit}
          isLoading={loading || reservationInProgress}
          disabled={loading || reservationInProgress || (ride && currentSeats > ride.seats) || !isAuthenticated}
        >
          {isAuthenticated 
            ? texts.confirmReservation 
            : texts.loginToConfirm}
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;
