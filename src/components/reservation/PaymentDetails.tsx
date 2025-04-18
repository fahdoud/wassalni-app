
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
  const { language } = useLanguage();
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
    const loginText = language === 'en' ? 'Login' : language === 'fr' ? 'Se Connecter' : 'تسجيل الدخول';
    const errorText = language === 'en' ? 'An error occurred. Please try again.' : 
                      language === 'fr' ? 'Une erreur s\'est produite. Veuillez réessayer.' : 
                      'حدث خطأ. يرجى المحاولة مرة أخرى.';
                      
    if (!isAuthenticated) {
      toast.error(loginText);
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
      toast.error(errorText);
    } finally {
      setReservationInProgress(false);
    }
  };
  
  // Calculate available seats from ride if available
  const availableSeats = ride?.seats || 4; // Default to 4 if no ride provided
  
  // Calculate displayed price based on what's available
  const displayPrice = price || (ride ? ride.price : 0);
  
  // For the base fare always show the ride's original price
  const baseFare = ride ? ride.price : displayPrice;
  
  // Calculate total price (base price * number of seats)
  const totalPrice = baseFare * currentSeats;

  // Text translations based on language
  const paymentText = language === 'en' ? 'Payment Details' : language === 'fr' ? 'Détails du Paiement' : 'تفاصيل الدفع';
  const passengersText = language === 'en' ? 'Passengers' : language === 'fr' ? 'Passagers' : 'الركاب';
  const notEnoughSeatsText = language === 'en' ? 'Not enough available seats' : 
                             language === 'fr' ? 'Pas assez de places disponibles' : 
                             'لا توجد مقاعد كافية';
  const loginRequiredText = language === 'en' ? 'Login Required' : language === 'fr' ? 'Connexion Requise' : 'تسجيل الدخول مطلوب';
  const loginToReserveText = language === 'en' ? 'Login to book your ride' : 
                             language === 'fr' ? 'Connectez-vous pour réserver votre trajet' : 
                             'سجل الدخول لحجز رحلتك';
  const loginText = language === 'en' ? 'Login' : language === 'fr' ? 'Se Connecter' : 'تسجيل الدخول';
  const registerText = language === 'en' ? 'Register' : language === 'fr' ? 'S\'inscrire' : 'التسجيل';
  const paymentMethodText = language === 'en' ? 'Payment Method' : language === 'fr' ? 'Mode de Paiement' : 'طريقة الدفع';
  const cashText = language === 'en' ? 'Cash' : language === 'fr' ? 'Espèces' : 'نقدا';
  const payDriverText = language === 'en' ? 'Pay the driver directly' : 
                        language === 'fr' ? 'Payer directement au conducteur' : 
                        'ادفع للسائق مباشرة';
  const baseFareText = language === 'en' ? 'Base fare' : language === 'fr' ? 'Tarif de base' : 'السعر الأساسي';
  const totalText = language === 'en' ? 'Total' : language === 'fr' ? 'Total' : 'المجموع';
  const backText = language === 'en' ? 'Back' : language === 'fr' ? 'Retour' : 'رجوع';
  const confirmReservationText = language === 'en' ? 'Confirm Reservation' : 
                                 language === 'fr' ? 'Confirmer la Réservation' : 
                                 'تأكيد الحجز';
  const loginToConfirmText = language === 'en' ? 'Login to confirm' : 
                             language === 'fr' ? 'Connectez-vous pour confirmer' : 
                             'سجل الدخول للتأكيد';

  return (
    <div className="glass-card p-8 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-6">{paymentText}</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          {passengersText}
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
            {notEnoughSeatsText}
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
            <h3 className="font-medium text-lg">{loginRequiredText}</h3>
          </div>
          <p className="mb-4">{loginToReserveText}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/passenger-signin" 
              className="text-center py-2 px-4 bg-wassalni-blue text-white font-medium rounded-lg hover:bg-wassalni-blue/90 transition-colors dark:bg-wassalni-lightBlue dark:hover:bg-wassalni-lightBlue/90"
            >
              {loginText}
            </Link>
            <Link 
              to="/passenger-signup" 
              className="text-center py-2 px-4 bg-wassalni-green text-white font-medium rounded-lg hover:bg-wassalni-green/90 transition-colors dark:bg-wassalni-lightGreen dark:hover:bg-wassalni-lightGreen/90"
            >
              {registerText}
            </Link>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          {paymentMethodText}
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
              <p className="font-medium">{cashText}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{payDriverText}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">{baseFareText}</span>
          <span>{baseFare} DZD</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-300">{passengersText} × {currentSeats}</span>
          <span>{totalPrice} DZD</span>
        </div>
        <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>{totalText}</span>
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
          {backText}
        </Button>
        <Button 
          className="flex-1"
          onClick={handleSubmit}
          isLoading={loading || reservationInProgress}
          disabled={loading || reservationInProgress || (ride && currentSeats > ride.seats) || !isAuthenticated}
        >
          {isAuthenticated 
            ? confirmReservationText 
            : loginToConfirmText}
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;
