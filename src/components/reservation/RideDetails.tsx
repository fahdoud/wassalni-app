
import { Ride } from "@/services/rides/types";
import { MapPin, Calendar, Clock, User } from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { subscribeToRideUpdates } from "@/services/rides/rideQueries";

interface RideDetailsProps {
  ride: Ride;
  seats?: number;
  setSeats?: (seats: number) => void;
  goToPayment?: () => void;
  onContinue?: () => void;
}

const RideDetails = ({ ride, seats, setSeats, goToPayment, onContinue }: RideDetailsProps) => {
  const { language } = useLanguage();
  const [availableSeats, setAvailableSeats] = useState(ride.seats);
  
  // Handle both onContinue and goToPayment for backward compatibility
  const handleContinue = () => {
    if (goToPayment) {
      goToPayment();
    } else if (onContinue) {
      onContinue();
    }
  };

  // Text translations
  const rideDetailsText = language === 'en' ? 'Trip Details' : 
                       language === 'fr' ? 'Détails du Trajet' : 
                       'تفاصيل الرحلة';
  const estimatedArrivalText = language === 'en' ? 'Estimated arrival' : 
                            language === 'fr' ? 'Arrivée estimée' : 
                            'وقت الوصول المتوقع';
  const seatText = language === 'en' ? 'seat' : 
                language === 'fr' ? 'place' : 
                'مقعد';
  const seatsText = language === 'en' ? 'seats' : 
                 language === 'fr' ? 'places' : 
                 'مقاعد';
  const fullText = language === 'en' ? 'Full' : 
                language === 'fr' ? 'Complet' : 
                'ممتلئ';
  const paymentText = language === 'en' ? 'Payment' : 
                   language === 'fr' ? 'Paiement' : 
                   'الدفع';

  // Subscribe to real-time updates for available seats
  useEffect(() => {
    if (!ride.id) return;
    
    const subscription = subscribeToRideUpdates(ride.id, (updatedRide) => {
      console.log("Real-time seat update:", updatedRide.seats);
      setAvailableSeats(updatedRide.seats);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [ride.id]);

  return (
    <div className="glass-card p-8 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-6">{rideDetailsText}</h2>
      
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
              <p className="text-sm text-gray-500 dark:text-gray-400">{estimatedArrivalText}</p>
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
          availableSeats > 0 
            ? "bg-gray-100 dark:bg-gray-700"
            : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        }`}>
          <User size={16} className={availableSeats > 0 ? "text-wassalni-green dark:text-wassalni-lightGreen" : "text-red-500 dark:text-red-400"} />
          <span>
            {availableSeats > 0 
              ? `${availableSeats} ${availableSeats === 1 ? seatText : seatsText}`
              : fullText}
          </span>
        </div>
      </div>
      
      <div className="mt-8">
        <Button 
          className="w-full"
          onClick={handleContinue}
          disabled={availableSeats <= 0}
        >
          {availableSeats > 0 ? paymentText : fullText}
        </Button>
      </div>
    </div>
  );
};

export default RideDetails;
