
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import { useState } from "react";
import { toast } from "sonner";

interface RideSearchFormProps {
  onFilter: (filter: string) => void;
}

const constantineAreas = ["Ain Abid", "Ali Mendjeli", "Bekira", "Boussouf", "Didouche Mourad", "El Khroub", "Hamma Bouziane", "Zighoud Youcef"];

const RideSearchForm = ({ onFilter }: RideSearchFormProps) => {
  const { t } = useLanguage();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const handleSearch = () => {
    let filteredResults = "";
    
    if (fromLocation) {
      filteredResults += fromLocation.toLowerCase();
    }
    
    if (toLocation) {
      filteredResults += " " + toLocation.toLowerCase();
    }
    
    onFilter(filteredResults.trim());
    
    // Show toast notification for search
    if (fromLocation || toLocation || travelDate) {
      toast.info(t('form.searchApplied'));
    }
  };

  const resetSearch = () => {
    setFromLocation("");
    setToLocation("");
    setTravelDate("");
    onFilter("");
    toast.info(t('form.filtersReset'));
  };

  return (
    <div className="mb-10 bg-gray-50 p-6 rounded-xl dark:bg-gray-800/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('form.from')}</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
          >
            <option value="">{t('form.selectLocation')}</option>
            {constantineAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('form.to')}</label>
          <select 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          >
            <option value="">{t('form.selectLocation')}</option>
            {constantineAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('form.date')}</label>
          <input 
            type="date" 
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <Button className="px-8" onClick={handleSearch}>{t('form.search')}</Button>
        <Button variant="outlined" onClick={resetSearch}>{t('form.reset')}</Button>
      </div>
    </div>
  );
};

export default RideSearchForm;
