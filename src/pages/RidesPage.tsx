
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import GradientText from "@/components/ui-components/GradientText";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Search, Filter, Users, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const constantineAreas = [
  "Ain Abid", 
  "Ali Mendjeli", 
  "Bekira", 
  "Boussouf", 
  "Centre Ville", 
  "Didouche Mourad", 
  "El Khroub", 
  "Hamma Bouziane", 
  "Zighoud Youcef"
];

interface Ride {
  id: number;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  rating: number;
  driverAvatar?: string;
}

const RidesPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [searchDate, setSearchDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    maxPrice: 300,
    minRating: 0,
    minSeats: 1,
    timeOfDay: "all", // "morning", "afternoon", "evening", "all"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Sample rides data - in a real app, this would come from an API
  const sampleRides: Ride[] = [
    {
      id: 1,
      driver: "Mohamed A.",
      from: "Ali Mendjeli",
      to: "Centre Ville",
      date: new Date().toISOString().split('T')[0],
      time: "08:30",
      price: 200,
      seats: 3,
      rating: 4.8,
      driverAvatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      driver: "Sara B.",
      from: "Centre Ville",
      to: "El Khroub",
      date: new Date().toISOString().split('T')[0],
      time: "10:15",
      price: 150,
      seats: 2,
      rating: 4.5,
      driverAvatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      driver: "Ahmed K.",
      from: "Boussouf",
      to: "Didouche Mourad",
      date: new Date().toISOString().split('T')[0],
      time: "12:00",
      price: 180,
      seats: 1,
      rating: 4.9,
      driverAvatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      driver: "Fatima Z.",
      from: "Zighoud Youcef",
      to: "Ain Abid",
      date: new Date().toISOString().split('T')[0],
      time: "15:30",
      price: 250,
      seats: 4,
      rating: 4.7,
      driverAvatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 5,
      driver: "Karim M.",
      from: "Hamma Bouziane",
      to: "Bekira",
      date: new Date().toISOString().split('T')[0],
      time: "17:45",
      price: 120,
      seats: 2,
      rating: 4.6,
      driverAvatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 6,
      driver: "Amina R.",
      from: "Centre Ville",
      to: "Ali Mendjeli",
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: "09:00",
      price: 190,
      seats: 3,
      rating: 4.7,
      driverAvatar: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: 7,
      driver: "Youcef B.",
      from: "El Khroub",
      to: "Didouche Mourad",
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: "14:30",
      price: 210,
      seats: 1,
      rating: 4.3,
      driverAvatar: "https://i.pravatar.cc/150?img=7",
    },
  ];

  useEffect(() => {
    // In a real app, we would fetch rides from the API
    setRides(sampleRides);
    setFilteredRides(sampleRides);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [fromLocation, toLocation, searchDate, activeFilters]);

  const applyFilters = () => {
    let filtered = rides;
    
    // Filter by locations if selected
    if (fromLocation) {
      filtered = filtered.filter(ride => ride.from === fromLocation);
    }
    
    if (toLocation) {
      filtered = filtered.filter(ride => ride.to === toLocation);
    }
    
    // Filter by date
    if (searchDate) {
      filtered = filtered.filter(ride => ride.date === searchDate);
    }
    
    // Apply active filters
    filtered = filtered.filter(ride => {
      // Price filter
      if (ride.price > activeFilters.maxPrice) return false;
      
      // Rating filter
      if (ride.rating < activeFilters.minRating) return false;
      
      // Seats filter
      if (ride.seats < activeFilters.minSeats) return false;
      
      // Time of day filter
      if (activeFilters.timeOfDay !== "all") {
        const hour = parseInt(ride.time.split(":")[0]);
        if (
          (activeFilters.timeOfDay === "morning" && (hour < 5 || hour >= 12)) ||
          (activeFilters.timeOfDay === "afternoon" && (hour < 12 || hour >= 17)) ||
          (activeFilters.timeOfDay === "evening" && (hour < 17 || hour >= 22))
        ) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredRides(filtered);
  };

  const handleSearch = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      applyFilters();
      setLoading(false);
      
      toast({
        title: t('search.completed'),
        description: filteredRides.length > 0 
          ? t('search.foundRides', { count: filteredRides.length }) 
          : t('search.noRidesFound'),
      });
    }, 1000);
  };

  const handleReservation = (rideId: number) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: t('auth.required'),
        description: t('auth.loginToBook'),
      });
      navigate('/passenger-signin');
      return;
    }
    
    navigate(`/reservation/${rideId}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 5 && hour < 12) return "🌅"; // Morning
    if (hour >= 12 && hour < 17) return "☀️"; // Afternoon
    if (hour >= 17 && hour < 22) return "🌇"; // Evening
    return "🌙"; // Night
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <section className="mb-12">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h1 className="mb-4">
                <GradientText>Constantine</GradientText> {t('rides.title')}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('rides.subtitle')}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm dark:bg-gray-800/50 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    <MapPin className="inline-block w-4 h-4 mr-1" />
                    {t('form.from')}
                  </label>
                  <select 
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">{t('form.selectLocation')}</option>
                    {constantineAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    <MapPin className="inline-block w-4 h-4 mr-1" />
                    {t('form.to')}
                  </label>
                  <select 
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">{t('form.selectLocation')}</option>
                    {constantineAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                    <Calendar className="inline-block w-4 h-4 mr-1" />
                    {t('form.date')}
                  </label>
                  <input 
                    type="date" 
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSearch} 
                      className="flex-grow flex items-center justify-center gap-2"
                      isLoading={loading}
                    >
                      <Search size={18} />
                      {t('form.search')}
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={toggleFilters}
                      className="px-3"
                    >
                      <Filter size={18} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Advanced filters section */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      {t('filters.maxPrice')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={activeFilters.maxPrice}
                        onChange={(e) => setActiveFilters({...activeFilters, maxPrice: parseInt(e.target.value)})}
                        className="w-full"
                      />
                      <span className="text-sm font-medium">{activeFilters.maxPrice} DZD</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      {t('filters.minRating')}
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={activeFilters.minRating}
                        onChange={(e) => setActiveFilters({...activeFilters, minRating: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="0">Any rating</option>
                        <option value="3">3+ ⭐</option>
                        <option value="4">4+ ⭐</option>
                        <option value="4.5">4.5+ ⭐</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      {t('filters.minSeats')}
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={activeFilters.minSeats}
                        onChange={(e) => setActiveFilters({...activeFilters, minSeats: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                      {t('filters.timeOfDay')}
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={activeFilters.timeOfDay}
                        onChange={(e) => setActiveFilters({...activeFilters, timeOfDay: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="all">Any time</option>
                        <option value="morning">Morning (5-12)</option>
                        <option value="afternoon">Afternoon (12-17)</option>
                        <option value="evening">Evening (17-22)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {filteredRides.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {t('rides.noRidesFound')}
                </p>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {t('rides.tryDifferentSearch')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredRides.map((ride) => (
                  <div 
                    key={ride.id}
                    className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden">
                            {ride.driverAvatar ? (
                              <img src={ride.driverAvatar} alt={ride.driver} className="w-full h-full object-cover" />
                            ) : (
                              ride.driver.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{ride.driver}</p>
                            <div className="flex items-center text-yellow-500 text-sm">
                              {'★'.repeat(Math.floor(ride.rating))}
                              <span className="text-gray-400 ml-1">{ride.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col md:flex-row gap-4 md:items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-wassalni-green"></div>
                            <p className="text-gray-700 dark:text-gray-300">{ride.from}</p>
                          </div>
                          <div className="hidden md:block h-px w-10 bg-gray-300 dark:bg-gray-600"></div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-wassalni-blue"></div>
                            <p className="text-gray-700 dark:text-gray-300">{ride.to}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1 dark:bg-gray-700">
                          <Calendar size={14} />
                          {new Date(ride.date).toLocaleDateString('fr-FR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1 dark:bg-gray-700">
                          <Clock size={14} />
                          <span>{getTimeIcon(ride.time)}</span>
                          {ride.time}
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1 dark:bg-gray-700">
                          <Users size={14} />
                          {ride.seats} {ride.seats === 1 ? t('rides.seat') : t('rides.seats')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-4">
                      <p className="text-2xl font-bold text-wassalni-green dark:text-wassalni-lightGreen">
                        {ride.price} <span className="text-sm">DZD</span>
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => handleReservation(ride.id)}
                        className="w-full md:w-auto"
                      >
                        {t('rides.reserve')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RidesPage;
