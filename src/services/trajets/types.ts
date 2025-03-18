
export interface Trajet {
  id: string;
  chauffeur: string;
  origine: string;
  destination: string;
  date: string;
  heure: string;
  prix: number;
  places: number;
  places_dispo: number;
  note: number;
  chauffeur_id?: string;
  est_mock?: boolean;
  trip_id?: string;
}

export type StatutReservation = 'en_attente' | 'confirmée' | 'annulée' | 'terminée' | 'mock' | string;

export interface ReservationTrajet {
  id: string;
  trajet_id: string;
  passager_id: string;
  places_reservees: number;
  statut: StatutReservation;
  created_at: string;
  updated_at?: string;
  origine?: string;
  destination?: string;
  prix?: number;
  date_reservation?: string;
  passager_nom?: string;
  trajet?: {
    id: string;
    origine: string;
    destination: string;
    date_depart: string;
    prix: number;
    chauffeur_id: string;
    profiles?: {
      full_name: string | null;
    } | null;
  };
}
