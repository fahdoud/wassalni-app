
import { MapPin, Calendar, Clock, User } from "lucide-react";
import { Ride } from "@/services/rides/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

interface ReservationSidebarProps {
  ride: Ride | null;
  step?: number;
  passengerCount?: number;
  seats?: number;
  price?: number;
  reservationSuccess?: boolean;
}

const ReservationSidebar = ({ ride, step = 1, passengerCount, seats, price: externalPrice, reservationSuccess }: ReservationSidebarProps) => {
  const { language } = useLanguage();
  
  // Si ride est null, affichez un état de chargement
  if (!ride) {
    return (
      <div className="lg:w-80">
        <div className="glass-card p-6 rounded-xl sticky top-28 animate-pulse">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }
  
  const [availableSeats, setAvailableSeats] = useState(ride.seats);
  
  // Utilisez seats ou passengerCount pour la compatibilité
  const currentSeats = seats || passengerCount || 1;
  
  // Utilisez le prix fourni ou calculez à partir du trajet
  const baseFare = ride.price;
  const price = externalPrice || (baseFare * currentSeats);
  
  // Déterminez quelle étape nous sommes
  const currentStep = step === 2 || reservationSuccess ? 2 : 1;

  // Traductions de texte
  const reservationTitle = language === 'en' ? 'Ride Reservation' : 
                           language === 'fr' ? 'Réservation de Trajet' : 
                           'حجز رحلة';
  const fromText = language === 'en' ? 'From' : 
                   language === 'fr' ? 'De' : 
                   'من';
  const toText = language === 'en' ? 'To' : 
                 language === 'fr' ? 'À' : 
                 'إلى';
  const dateText = language === 'en' ? 'Date' : 
                   language === 'fr' ? 'Date' : 
                   'التاريخ';
  const timeText = language === 'en' ? 'Time' : 
                   language === 'fr' ? 'Heure' : 
                   'الوقت';
  const availableSeatsText = language === 'en' ? 'Available Seats' : 
                             language === 'fr' ? 'Places Disponibles' : 
                             'المقاعد المتاحة';
  const seatText = language === 'en' ? 'seat' : 
                   language === 'fr' ? 'place' : 
                   'مقعد';
  const seatsText = language === 'en' ? 'seats' : 
                    language === 'fr' ? 'places' : 
                    'مقاعد';
  const fullText = language === 'en' ? 'Full' : 
                   language === 'fr' ? 'Complet' : 
                   'ممتلئ';
  const priceText = language === 'en' ? 'Price' : 
                    language === 'fr' ? 'Prix' : 
                    'السعر';
  const passengersText = language === 'en' ? 'Passengers' : 
                         language === 'fr' ? 'Passagers' : 
                         'الركاب';
  const totalText = language === 'en' ? 'Total' : 
                    language === 'fr' ? 'Total' : 
                    'المجموع';

  // Mettez à jour availableSeats lorsque ride.seats change
  useEffect(() => {
    if (ride) {
      console.log("Ride seats updated in sidebar:", ride.seats);
      setAvailableSeats(ride.seats);
    }
  }, [ride?.seats]);

  return (
    <div className="lg:w-80">
      <div className="glass-card p-6 rounded-xl sticky top-28">
        <h3 className="font-semibold mb-4">{reservationTitle}</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} className="text-wassalni-green shrink-0 dark:text-wassalni-lightGreen" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{fromText}</p>
            <p className="font-medium">{ride.from}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} className="text-wassalni-blue shrink-0 dark:text-wassalni-lightBlue" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{toText}</p>
            <p className="font-medium">{ride.to}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <Calendar size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dateText}</p>
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
            <p className="text-sm text-gray-500 dark:text-gray-400">{timeText}</p>
            <p className="font-medium">{ride.time}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <User size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{availableSeatsText}</p>
            <p className={`font-medium ${availableSeats > 0 ? '' : 'text-red-500'}`}>
              {availableSeats > 0 
                ? `${availableSeats} ${availableSeats === 1 ? seatText : seatsText}` 
                : fullText}
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">{priceText}</span>
            <span className="font-medium">{baseFare} DZD</span>
          </div>
          {currentStep === 2 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-300">{passengersText}</span>
              <span className="font-medium">× {currentSeats}</span>
            </div>
          )}
          <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 font-medium dark:border-gray-700">
            <span>{totalText}</span>
            <span className="text-wassalni-green dark:text-wassalni-lightGreen">
              {currentStep === 1 ? baseFare : baseFare * currentSeats} DZD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSidebar;
