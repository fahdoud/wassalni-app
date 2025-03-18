
import { useNavigate } from "react-router-dom";
import { Trajet } from "@/services/trajets/types";
import { useRealTimeSeats } from "@/hooks/useRealTimeSeats";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import TrajetCard from "./TrajetCard";

interface TrajetListProps {
  trajets: Trajet[];
  loading: boolean;
}

const TrajetList = ({ trajets, loading }: TrajetListProps) => {
  const navigate = useNavigate();
  const placesDispoEnTempsReel = useRealTimeSeats(trajets);

  const handleReserveClick = (trajetId: string) => {
    navigate(`/reservation/${trajetId}`);
    // Store in sessionStorage that we're coming from a reservation
    sessionStorage.setItem('fromReservation', 'true');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (trajets.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {trajets.map((trajet) => {
        // Use real-time seat count if available, otherwise use the original seat count
        const placesActuelles = trajet.id in placesDispoEnTempsReel 
          ? placesDispoEnTempsReel[trajet.id] 
          : trajet.places_dispo;
        
        console.log(`Affichage du trajet ${trajet.id}: ${placesActuelles} places disponibles`);
        
        return (
          <TrajetCard 
            key={trajet.id}
            trajet={trajet}
            placesActuelles={placesActuelles}
            onReserveClick={handleReserveClick}
          />
        );
      })}
    </div>
  );
};

export default TrajetList;
