
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import GradientText from "@/components/ui-components/GradientText";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, User, MapPin } from "lucide-react";

const constantineAreas = ["Ain Abid", "Ali Mendjeli", "Bekira", "Boussouf", "Didouche Mourad", "El Khroub", "Hamma Bouziane", "Zighoud Youcef"];

interface Ride {
  id: number | string;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  rating: number;
}

const RidesPage = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState<Ride[]>([]);
  const { toast } = useToast();

  // Fetch rides from Supabase or use sample data
  useEffect(() => {
    // For now, we'll use sample data until the Supabase integration is fully implemented
    setRides([
      {
        id: 1,
        driver: "Mohamed A.",
        from: "Ali Mendjeli",
        to: "City Center",
        date: "2023-06-24",
        time: "08:30",
        price: 200,
        seats: 3,
        rating: 4.8,
      },
      {
        id: 2,
        driver: "Sara B.",
        from: "City Center",
        to: "El Khroub",
        date: "2023-06-24",
        time: "10:15",
        price: 150,
        seats: 2,
        rating: 4.5,
      },
      {
        id: 3,
        driver: "Ahmed K.",
        from: "Boussouf",
        to: "Didouche Mourad",
        date: "2023-06-24",
        time: "12:00",
        price: 180,
        seats: 1,
        rating: 4.9,
      },
      {
        id: 4,
        driver: "Fatima Z.",
        from: "Zighoud Youcef",
        to: "Ain Abid",
        date: "2023-06-24",
        time: "15:30",
        price: 250,
        seats: 4,
        rating: 4.7,
      },
      {
        id: 5,
        driver: "Karim M.",
        from: "Hamma Bouziane",
        to: "Bekira",
        date: "2023-06-24",
        time: "17:45",
        price: 120,
        seats: 2,
        rating: 4.6,
      },
    ]);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    
    // Filter rides based on search criteria
    let filteredRides = [...rides];
    
    if (fromLocation) {
      filteredRides = filteredRides.filter(ride => 
        ride.from.toLowerCase().includes(fromLocation.toLowerCase())
      );
    }
    
    if (toLocation) {
      filteredRides = filteredRides.filter(ride => 
        ride.to.toLowerCase().includes(toLocation.toLowerCase())
      );
    }
    
    if (date) {
      filteredRides = filteredRides.filter(ride => 
        ride.date === date
      );
    }
    
    setRides(filteredRides);
    setLoading(false);
    
    toast({
      title: t('rides.searchResults'),
      description: `${filteredRides.length} ${t('rides.ridesFound')}`,
    });
  };

  const filteredRides = filter 
    ? rides.filter(ride => 
        ride.from.toLowerCase().includes(filter.toLowerCase()) || 
        ride.to.toLowerCase().includes(filter.toLowerCase())
      )
    : rides;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-4">
              <GradientText>Constantine</GradientText> {t('rides.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('rides.subtitle')}
            </p>
          </div>

          <div className="mb-8 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button 
                className="px-8" 
                onClick={handleSearch}
                isLoading={loading}
              >
                {t('form.search')}
              </Button>
            </div>
          </div>

          {filteredRides.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">{t('rides.noRidesFound')}</p>
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{t('rides.tryDifferentSearch')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRides.map((ride) => (
                <div 
                  key={ride.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-wassalni-green to-wassalni-blue flex items-center justify-center text-white">
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
                    
                    <div className="flex-grow flex flex-col gap-2 w-full md:w-auto">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-wassalni-green" />
                        <p className="text-gray-700 dark:text-gray-300">{ride.from}</p>
                      </div>
                      <div className="border-l-2 border-dashed border-gray-300 h-4 ml-2"></div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-wassalni-blue" />
                        <p className="text-gray-700 dark:text-gray-300">{ride.to}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-sm w-full md:w-auto">
                      <div className="px-2 py-1 bg-gray-100 rounded-full dark:bg-gray-700 flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(ride.date).toLocaleDateString('fr-FR', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="px-2 py-1 bg-gray-100 rounded-full dark:bg-gray-700 flex items-center gap-1">
                        <Clock size={14} />
                        {ride.time}
                      </div>
                      <div className="px-2 py-1 bg-gray-100 rounded-full dark:bg-gray-700 flex items-center gap-1">
                        <User size={14} />
                        {ride.seats} {ride.seats === 1 ? t('rides.seat') : t('rides.seats')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xl font-bold text-wassalni-green dark:text-wassalni-lightGreen">
                      {ride.price} <span className="text-sm">DZD</span>
                    </p>
                    <Link to={`/reservation/${ride.id}`}>
                      <Button size="sm">{t('rides.reserve')}</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RidesPage;
