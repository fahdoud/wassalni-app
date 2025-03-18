
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const EmptyState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-10">
      <p className="text-gray-500 dark:text-gray-400">{t('rides.noRidesFound')}</p>
    </div>
  );
};

export default EmptyState;
