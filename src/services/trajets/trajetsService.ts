
import { supabase } from "@/integrations/supabase/client";
import { Trajet } from "./types";
import { getMockRides } from "@/services/rides/mockRides";

// Obtenir tous les trajets disponibles
export const getTrajets = async (): Promise<Trajet[]> => {
  try {
    console.log("Récupération des trajets");
    
    // Essayer d'abord d'obtenir les trajets depuis la base de données
    const { data: trajets, error } = await supabase
      .from('trajets')
      .select(`
        id,
        origine,
        destination,
        date_depart,
        prix,
        places_dispo,
        chauffeur_id,
        profiles:chauffeur_id(full_name)
      `)
      .eq('statut', 'actif');
    
    if (error) {
      console.error("Erreur lors de la récupération des trajets:", error);
      throw new Error(error.message);
    }

    // Si nous avons récupéré des trajets avec succès, les transformer en objets Trajet
    if (trajets && trajets.length > 0) {
      console.log("Trajets récupérés avec succès:", trajets);
      
      // Transformer les données pour correspondre à notre interface Trajet
      const ridesTransformed: Trajet[] = trajets.map(trajet => {
        // Obtenir le nom du chauffeur depuis la jointure des profils ou utiliser une valeur par défaut
        const nomChauffeur = trajet.profiles && 
          typeof trajet.profiles === 'object' && 
          'full_name' in trajet.profiles ? 
          String(trajet.profiles.full_name || "Chauffeur inconnu") : 
          "Chauffeur inconnu";

        return {
          id: trajet.id,
          chauffeur: nomChauffeur,
          origine: trajet.origine,
          destination: trajet.destination,
          date: new Date(trajet.date_depart).toISOString().split('T')[0],
          heure: new Date(trajet.date_depart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          prix: trajet.prix,
          places_dispo: trajet.places_dispo,
          note: 4.7, // Note par défaut - dans une vraie application, proviendrait des avis
          chauffeur_id: trajet.chauffeur_id
        };
      });

      console.log("Données des trajets transformées:", ridesTransformed);
      return ridesTransformed;
    }
    
    // Si aucun trajet réel dans la base de données, retourner des trajets simulés
    const mockRides = getMockRides();
    return mockRides.map(ride => ({
      id: ride.id,
      chauffeur: ride.driver,
      origine: ride.from,
      destination: ride.to,
      date: ride.date,
      heure: ride.time,
      prix: ride.price,
      places_dispo: ride.seats,
      note: ride.rating,
      est_mock: true
    }));
  } catch (error) {
    console.error("Échec de la récupération des trajets:", error);
    const mockRides = getMockRides();
    return mockRides.map(ride => ({
      id: ride.id,
      chauffeur: ride.driver,
      origine: ride.from,
      destination: ride.to,
      date: ride.date,
      heure: ride.time,
      prix: ride.price,
      places_dispo: ride.seats,
      note: ride.rating,
      est_mock: true
    }));
  }
};

// Obtenir un trajet spécifique par ID
export const getTrajetById = async (trajetId: string): Promise<Trajet | null> => {
  // Vérifier si l'ID provient d'un trajet simulé (ID numérique simple)
  if (/^\d+$/.test(trajetId)) {
    console.log("Utilisation d'un trajet simulé avec ID:", trajetId);
    const mockRides = getMockRides();
    const mockRide = mockRides.find(ride => ride.id === trajetId);
    if (mockRide) {
      return {
        id: mockRide.id,
        chauffeur: mockRide.driver,
        origine: mockRide.from,
        destination: mockRide.to,
        date: mockRide.date,
        heure: mockRide.time,
        prix: mockRide.price,
        places_dispo: mockRide.seats,
        note: mockRide.rating,
        est_mock: true
      };
    }
    return null;
  }
  
  // Sinon, essayer de récupérer depuis Supabase (format UUID)
  try {
    console.log("Récupération d'un trajet réel avec ID:", trajetId);
    
    // Récupérer les données du trajet avec jointure du chauffeur
    const { data: trajet, error } = await supabase
      .from('trajets')
      .select(`
        id,
        origine,
        destination,
        date_depart,
        prix,
        places_dispo,
        chauffeur_id,
        profiles:chauffeur_id(full_name)
      `)
      .eq('id', trajetId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération du trajet:", error);
      return null;
    }

    console.log("Données du trajet récupérées:", trajet);

    // Obtenir le nom du chauffeur depuis la jointure des profils ou utiliser une valeur par défaut
    const nomChauffeur = trajet.profiles && 
      typeof trajet.profiles === 'object' && 
      'full_name' in trajet.profiles ? 
      String(trajet.profiles.full_name || "Chauffeur inconnu") : 
      "Chauffeur inconnu";

    // Transformer les données du trajet selon notre interface Trajet
    const trajetTransformed: Trajet = {
      id: trajet.id,
      chauffeur: nomChauffeur,
      origine: trajet.origine,
      destination: trajet.destination,
      date: new Date(trajet.date_depart).toISOString().split('T')[0],
      heure: new Date(trajet.date_depart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prix: trajet.prix,
      places_dispo: trajet.places_dispo,
      note: 4.7, // Note par défaut - proviendrait des avis
      chauffeur_id: trajet.chauffeur_id
    };

    console.log("Données du trajet transformées:", trajetTransformed);
    return trajetTransformed;
  } catch (error) {
    console.error("Échec de la récupération du trajet:", error);
    return null;
  }
};

// S'abonner aux changements pour un trajet spécifique
export const subscribeToTrajetUpdates = (trajetId: string, callback: (trajet: Trajet) => void) => {
  if (/^\d+$/.test(trajetId)) {
    // Les trajets simulés ne prennent pas en charge les mises à jour en temps réel
    console.log("Les trajets simulés ne prennent pas en charge les mises à jour en temps réel");
    return { unsubscribe: () => {} };
  }

  console.log("Configuration d'un abonnement en temps réel pour le trajet:", trajetId);
  
  const channel = supabase
    .channel(`trajet-${trajetId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'trajets',
        filter: `id=eq.${trajetId}`
      },
      async (payload) => {
        console.log("Mise à jour en temps réel reçue pour le trajet:", payload);
        
        // Récupérer les données mises à jour du trajet
        const trajetMisAJour = await getTrajetById(trajetId);
        if (trajetMisAJour) {
          callback(trajetMisAJour);
        }
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      console.log("Désabonnement des mises à jour du trajet");
      supabase.removeChannel(channel);
    }
  };
};

// Créer une réservation
export const createReservationTrajet = async (
  trajetId: string, 
  passagerId: string, 
  placesReservees: number
): Promise<{ success: boolean, placesDispoMisesAJour?: number }> => {
  try {
    // Pour les trajets simulés, créer une réservation réelle avec une étiquette "mock"
    if (/^\d+$/.test(trajetId)) {
      console.log("Création d'une réservation simulée avec ID:", trajetId);
      
      // Créer une entrée de réservation pour les trajets simulés
      const { data: reservation, error: reservationError } = await supabase
        .from('reservations_trajets')
        .insert({
          trajet_id: null, // Pas d'ID de trajet réel pour les trajets simulés
          passager_id: passagerId,
          places_reservees: placesReservees,
          statut: 'mock' as StatutReservation
        })
        .select()
        .single();
      
      if (reservationError) {
        console.error("Erreur lors de la création de la réservation simulée:", reservationError);
        throw new Error(reservationError.message);
      }
      
      console.log("Réservation simulée créée avec succès:", reservation);
      
      // Pour les trajets simulés, nous décrémentons manuellement les places
      return { success: true };
    }
    
    // Pour les trajets réels avec des ID UUID
    console.log("Création d'une réservation réelle avec trajetId:", trajetId);
    
    // D'abord, récupérer les places disponibles actuelles
    const { data: trajetActuel, error: trajetError } = await supabase
      .from('trajets')
      .select('places_dispo')
      .eq('id', trajetId)
      .single();
      
    if (trajetError) {
      console.error("Erreur lors de la récupération des places du trajet actuel:", trajetError);
      throw new Error(trajetError.message);
    }
    
    if (trajetActuel.places_dispo < placesReservees) {
      console.error("Pas assez de places disponibles");
      return { success: false };
    }
    
    // 1. Créer la réservation
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations_trajets')
      .insert({
        trajet_id: trajetId,
        passager_id: passagerId,
        places_reservees: placesReservees,
        statut: 'confirmée'
      })
      .select()
      .single();
    
    if (reservationError) {
      console.error("Erreur lors de la création de la réservation:", reservationError);
      throw new Error(reservationError.message);
    }

    console.log("Enregistrement de réservation créé:", reservation);

    // La mise à jour est gérée par le trigger dans la base de données,
    // mais nous allons quand même vérifier que ça a fonctionné

    // Récupérer le nombre de places mises à jour pour confirmer
    const { data: trajetMisAJour, error: fetchError } = await supabase
      .from('trajets')
      .select('places_dispo')
      .eq('id', trajetId)
      .single();

    if (fetchError) {
      console.error("Erreur lors de la récupération du nombre de places mises à jour:", fetchError);
    }

    console.log("Réservation créée avec succès. Trajet mis à jour:", trajetMisAJour);
    return { 
      success: true, 
      placesDispoMisesAJour: trajetMisAJour?.places_dispo
    };
  } catch (error) {
    console.error("Échec de la création de la réservation:", error);
    return { success: false };
  }
};
