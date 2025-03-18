
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import GradientText from "@/components/ui-components/GradientText";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRides } from "@/services/rides";
import { Ride } from "@/services/rides/types";
import { getMockRides } from "@/services/rides/mockRides";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const constantineAreas = ["Ain Abid", "Ali Mendjeli", "Bekira", "Boussouf", "Didouche Mourad", "El Khroub", "Hamma Bouziane", "Zighoud Youcef"];

const RidesPage = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveSeats, setLiveSeats] = useState<Record<string, number>>({});
  const location = useLocation();
  const navigate = useNavigate();

  const fetchRides = async (forceRefresh = false) => {
    setLoading(true);
    try {
      console.log("Fetching rides, forceRefresh:", forceRefresh);
      
      if (forceRefresh) {
        setRides([]);
      }
      
      const fetchedRides = await getRides();
      if (fetchedRides && fetchedRides.length > 0) {
        console.log("Fetched rides:", fetchedRides);
        
        const ridesWithMaleDrivers = fetchedRides.map(ride => ({
          ...ride,
          driverGender: 'male' as 'male'
        }));
        
        setRides(ridesWithMaleDrivers);
      } else {
        console.log("No rides found, using mock rides");
        const mockRides = getMockRides().map(ride => ({
          ...ride,
          driverGender: 'male' as 'male'
        }));
        setRides(mockRides);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
      const mockRides = getMockRides().map(ride => ({
        ...ride,
        driverGender: 'male' as 'male'
      }));
      setRides(mockRides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides(true);
    
    const handleBeforeUnload = () => {
      localStorage.setItem('ridesPageReloaded', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    const handleFocus = () => {
      fetchRides(true);
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/rides') {
      const fromReservation = sessionStorage.getItem('fromReservation');
      
      if (fromReservation === 'true') {
        console.log("Returning from reservation page, force refreshing rides");
        fetchRides(true);
        sessionStorage.removeItem('fromReservation');
      } else {
        fetchRides();
      }
    }
  }, [location]);

  // Subscribe to real-time seat availability updates
  useEffect(() => {
    if (rides.length === 0) return;
    
    const channels: any[] = [];
    
    rides.forEach(ride => {
      if (ride.trip_id && !/^\d+$/.test(ride.id)) {
        // First subscribe to trips table updates (legacy)
        const tripChannel = supabase
          .channel(`ride-${ride.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'trips',
              filter: `id=eq.${ride.trip_id}`
            },
            (payload) => {
              console.log("Received real-time seat update from trips:", payload);
              if (payload.new && 'available_seats' in payload.new) {
                setLiveSeats(prev => ({
                  ...prev,
                  [ride.id]: payload.new.available_seats
                }));
              }
            }
          )
          .subscribe();
          
        channels.push(tripChannel);
        
        // Also subscribe to seat_availability table for more accurate updates
        const seatChannel = supabase
          .channel(`seat-availability-${ride.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'seat_availability',
              filter: `trip_id=eq.${ride.trip_id}`
            },
            (payload) => {
              console.log("Received real-time seat update from seat_availability:", payload);
              if (payload.new && 'remaining_seats' in payload.new) {
                setLiveSeats(prev => ({
                  ...prev,
                  [ride.id]: payload.new.remaining_seats
                }));
              }
            }
          )
          .subscribe();
          
        channels.push(seatChannel);
      }
    });
    
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [rides]);

  const handleReserveClick = (rideId: string | number) => {
    navigate(`/reservation/${rideId}`);
    // Set a session flag to force refresh rides when returning
    sessionStorage.setItem('fromReservation', 'true');
  };

  const filteredRides = filter 
    ? rides.filter(ride => 
        ride.from.toLowerCase().includes(filter.toLowerCase()) || 
        ride.to.toLowerCase().includes(filter.toLowerCase())
      )
    : rides;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <section className="section">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="mb-4">
              <GradientText>Constantine</GradientText> {t('rides.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('rides.subtitle')}
            </p>
          </div>

          <div className="mb-10 bg-gray-50 p-6 rounded-xl dark:bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">{t('form.from')}</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button className="px-8">{t('form.search')}</Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-wassalni-green" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading rides...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredRides.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">{t('rides.noRidesFound')}</p>
                </div>
              ) : (
                filteredRides.map((ride) => {
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
                })
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RidesPage;
