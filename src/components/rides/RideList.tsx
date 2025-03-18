
import { useLanguage } from "@/contexts/LanguageContext";
import { Ride } from "@/services/rides/types";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { Loader2 } from "lucide-react";

interface RideListProps {
  rides: Ride[];
  loading: boolean;
  liveSeats: Record<string, number>;
}

const RideList = ({ rides, loading, liveSeats }: RideListProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleReserveClick = (rideId: string | number) => {
    navigate(`/reservation/${rideId}`);
    // Set a session flag to force refresh rides when returning
    sessionStorage.setItem('fromReservation', 'true');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-wassalni-green" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Loading rides...</span>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">{t('rides.noRidesFound')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {rides.map((ride) => {
        // Use live seat count from real-time updates if available, otherwise use ride.seats
        const currentSeats = ride.id in liveSeats ? liveSeats[ride.id] : ride.seats;
        
        return (
          <div 
            key={ride.id}
            className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
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
                <div className="flex-grow flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-wassalni-green"></div>
                    <p className="text-gray-700 dark:text-gray-300">{ride.from}</p>
                  </div>
                  <div className="h-px w-10 bg-gray-300 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-wassalni-blue"></div>
                    <p className="text-gray-700 dark:text-gray-300">{ride.to}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="px-3 py-1 bg-gray-100 rounded-full dark:bg-gray-700">
                  {new Date(ride.date).toLocaleDateString('fr-FR', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full dark:bg-gray-700">
                  {ride.time}
                </div>
                <div className={`px-3 py-1 rounded-full ${
                  currentSeats > 0 
                    ? "bg-gray-100 dark:bg-gray-700" 
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {currentSeats > 0 
                    ? `${currentSeats} ${currentSeats === 1 ? t('rides.seat') : t('rides.seats')}` 
                    : t('rides.full')}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <p className="text-2xl font-bold text-wassalni-green dark:text-wassalni-lightGreen">
                {ride.price} <span className="text-sm">DZD</span>
              </p>
              {currentSeats > 0 ? (
                <Button 
                  size="sm" 
                  onClick={() => handleReserveClick(ride.id)}
                >
                  {t('rides.reserve')}
                </Button>
              ) : (
                <Button size="sm" variant="outlined" disabled>
                  {t('rides.full')}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RideList;
