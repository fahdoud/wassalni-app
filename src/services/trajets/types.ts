
export interface Trajet {
  id: string;
  chauffeur: string;
  origine: string;
  destination: string;
  date: string;
  heure: string;
  prix: number;
  places_dispo: number;
  note: number;
  chauffeur_id?: string;
  est_mock?: boolean;
}

export type StatutReservation = 'en_attente' | 'confirmée' | 'annulée' | 'terminée' | 'mock';

export interface ReservationTrajet {
  id: string;
  trajet_id: string;
  passager_id: string;
  places_reservees: number;
  statut: StatutReservation;
  created_at: string;
  updated_at: string;
  trajet?: {
    id: string;
    origine: string;
    destination: string;
    date_depart: string;
    prix: number;
    chauffeur_id: string;
    profiles: {
      full_name: string;
    };
  };
}

export const communesAlger = [
  "Sidi Yahia", "Hydra", "Bir Mourad Raïs", "Bab Ezzouar", "Bab El Oued", 
  "El Biar", "Kouba", "Hussein Dey", "El Harrach", "Bologhine", 
  "Dar El Beïda", "Alger Centre", "Bordj El Kiffan", "Dély Ibrahim", "Chéraga"
];
