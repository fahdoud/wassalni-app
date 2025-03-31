
import { Check } from "lucide-react";
import { Ride } from "@/services/rides/types";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface ConfirmationDetailsProps {
  ride: Ride;
  seats?: number;
  passengerCount?: number;
}

const ConfirmationDetails = ({ ride, seats, passengerCount }: ConfirmationDetailsProps) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  // Use either seats or passengerCount for backward compatibility
  const currentSeats = seats || passengerCount || 1;
  // Calculate the total price based on the ride price and number of seats
  const totalPrice = ride.price * currentSeats;

  // Text translations
  const successTitle = language === 'en' ? 'Reservation Confirmed' : 
                       language === 'fr' ? 'Réservation Confirmée' : 
                       'تم تأكيد الحجز';
  const successMessage = language === 'en' ? 'Your ride has been successfully booked. The driver has been notified.' : 
                         language === 'fr' ? 'Votre trajet a été réservé avec succès. Le conducteur a été notifié.' : 
                         'تم حجز رحلتك بنجاح. تم إخطار السائق.';
  const reservationIdText = language === 'en' ? 'Reservation ID' : 
                            language === 'fr' ? 'Numéro de Réservation' : 
                            'رقم الحجز';
  const driverText = language === 'en' ? 'Driver' : 
                     language === 'fr' ? 'Conducteur' : 
                     'السائق';
  const dateText = language === 'en' ? 'Date' : 
                   language === 'fr' ? 'Date' : 
                   'التاريخ';
  const timeText = language === 'en' ? 'Time' : 
                   language === 'fr' ? 'Heure' : 
                   'الوقت';
  const fromText = language === 'en' ? 'From' : 
                   language === 'fr' ? 'De' : 
                   'من';
  const toText = language === 'en' ? 'To' : 
                 language === 'fr' ? 'À' : 
                 'إلى';
  const passengersText = language === 'en' ? 'Passengers' : 
                         language === 'fr' ? 'Passagers' : 
                         'الركاب';
  const totalText = language === 'en' ? 'Total' : 
                    language === 'fr' ? 'Total' : 
                    'المجموع';
  const ridesText = language === 'en' ? 'Available Rides' : 
                    language === 'fr' ? 'Trajets Disponibles' : 
                    'الرحلات المتاحة';

  return (
    <div className="glass-card p-8 rounded-xl mb-6 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
        <Check size={40} className="text-green-500 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">{successTitle}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto dark:text-gray-300">
        {successMessage}
      </p>
      
      <div className="glass-card border border-gray-200 p-6 rounded-lg mb-8 max-w-md mx-auto text-left dark:border-gray-700">
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{reservationIdText}</span>
          <span className="font-medium">WAS-{Math.floor(Math.random() * 10000)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{driverText}</span>
          <span className="font-medium">{ride.driver}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{dateText}</span>
          <span className="font-medium">
            {new Date(ride.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{timeText}</span>
          <span className="font-medium">{ride.time}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{fromText}</span>
          <span className="font-medium">{ride.from}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{toText}</span>
          <span className="font-medium">{ride.to}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-600 dark:text-gray-300">{passengersText}</span>
          <span className="font-medium">{currentSeats}</span>
        </div>
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300">{totalText}</span>
          <span className="font-medium text-wassalni-green dark:text-wassalni-lightGreen">{totalPrice} DZD</span>
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
          {ridesText}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationDetails;
