
import React from "react";
import { Trajet } from "@/services/trajets/types";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";

interface TrajetCardProps {
  trajet: Trajet;
  placesActuelles: number;
  onReserveClick: (trajetId: string) => void;
}

const TrajetCard = ({ trajet, placesActuelles, onReserveClick }: TrajetCardProps) => {
  const { t } = useLanguage();
  
  // Get proper text for seats (singular/plural)
  const placesText = placesActuelles === 1 
    ? t('rides.seat') 
    : t('rides.seats');
    
  return (
    <div 
      className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6"
    >
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              {trajet.chauffeur.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{trajet.chauffeur}</p>
              <div className="flex items-center text-yellow-500 text-sm">
                {'★'.repeat(Math.floor(trajet.note))}
                <span className="text-gray-400 ml-1">{trajet.note}</span>
              </div>
            </div>
          </div>
          <div className="flex-grow flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-wassalni-green"></div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">{trajet.origine}</p>
            </div>
            <div className="h-px w-10 bg-gray-300 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-wassalni-blue"></div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-normal break-words">{trajet.destination}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="px-3 py-1 bg-gray-100 rounded-full dark:bg-gray-700">
            {new Date(trajet.date).toLocaleDateString('fr-FR', {
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded-full dark:bg-gray-700">
            {trajet.heure}
          </div>
          <div className={`px-3 py-1 rounded-full ${
            placesActuelles > 0 
              ? "bg-gray-100 dark:bg-gray-700" 
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {placesActuelles > 0 
              ? `${placesActuelles} ${placesText}` 
              : t('rides.full')}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end gap-4">
        <p className="text-2xl font-bold text-wassalni-green dark:text-wassalni-lightGreen">
          {trajet.prix} <span className="text-sm">DZD</span>
        </p>
        {placesActuelles > 0 ? (
          <Button 
            size="sm" 
            onClick={() => onReserveClick(trajet.id)}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">{t('rides.reserve')}</span>
            <span className="absolute inset-0 bg-wassalni-blue scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
          </Button>
        ) : (
          <Button size="sm" variant="outlined" disabled className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
            {t('rides.full')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrajetCard;
