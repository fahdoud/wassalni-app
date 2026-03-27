import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRides } from "@/services/rides";
import { Ride } from "@/services/rides/types";
import { getMockRides } from "@/services/rides/mockRides";
import { Loader2, Search, ArrowRight, Star, ChevronLeft, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { communesAlger } from "@/services/trajets/types";
import { motion } from "framer-motion";

const constantineAreas = ["Ain Abid", "Ali Mendjeli", "Bekira", "Boussouf", "Didouche Mourad", "El Khroub", "Hamma Bouziane", "Zighoud Youcef"];

const RidesPage = () => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState("");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveSeats, setLiveSeats] = useState<Record<string, number>>({});
  const [selectedWilaya, setSelectedWilaya] = useState<string>("constantine");
  const location = useLocation();
  const navigate = useNavigate();

  const txt = {
    title: language === 'fr' ? 'Trajets disponibles' : language === 'ar' ? 'الرحلات المتاحة' : 'Available Rides',
    search: language === 'fr' ? 'Rechercher un trajet...' : language === 'ar' ? '...ابحث عن رحلة' : 'Search a ride...',
    seats: language === 'fr' ? 'places' : language === 'ar' ? 'مقاعد' : 'seats',
    full: language === 'fr' ? 'Complet' : language === 'ar' ? 'ممتلئ' : 'Full',
    reserve: language === 'fr' ? 'Réserver' : language === 'ar' ? 'حجز' : 'Reserve',
    loading: language === 'fr' ? 'Chargement...' : language === 'ar' ? '...تحميل' : 'Loading...',
    noRides: language === 'fr' ? 'Aucun trajet trouvé' : language === 'ar' ? 'لم يتم العثور على رحلات' : 'No rides found',
    noRidesDesc: language === 'fr' ? 'Essayez une autre destination' : language === 'ar' ? 'جرب وجهة أخرى' : 'Try another destination',
  };

  const fetchRides = async (forceRefresh = false) => {
    setLoading(true);
    try {
      if (forceRefresh) setRides([]);
      const fetched = await getRides();
      if (fetched && fetched.length > 0) {
        setRides(fetched.map(r => ({ ...r, driverGender: 'male' as 'male' })));
      } else {
        setRides(getMockRides().map(r => ({ ...r, driverGender: 'male' as 'male' })));
      }
    } catch {
      setRides(getMockRides().map(r => ({ ...r, driverGender: 'male' as 'male' })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRides(true); }, []);
  useEffect(() => {
    if (location.pathname === '/rides') {
      const fromRes = sessionStorage.getItem('fromReservation');
      if (fromRes === 'true') { fetchRides(true); sessionStorage.removeItem('fromReservation'); }
    }
  }, [location]);

  useEffect(() => {
    if (!rides.length) return;
    const channels: any[] = [];
    rides.forEach(ride => {
      if (ride.trip_id && !/^\d+$/.test(ride.id)) {
        const ch = supabase.channel(`ride-${ride.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${ride.trip_id}` },
            (payload) => {
              if (payload.new && 'available_seats' in payload.new) {
                setLiveSeats(prev => ({ ...prev, [ride.id]: payload.new.available_seats }));
              }
            }).subscribe();
        channels.push(ch);
      }
    });
    return () => { channels.forEach(ch => supabase.removeChannel(ch)); };
  }, [rides]);

  const filteredRidesByWilaya = useMemo(() => {
    if (selectedWilaya === "alger") {
      return rides.filter(r => communesAlger.includes(r.from) || communesAlger.includes(r.to));
    }
    return rides.filter(r => constantineAreas.includes(r.from) || constantineAreas.includes(r.to) || r.from === "Constantine" || r.to === "Constantine");
  }, [rides, selectedWilaya]);

  const filteredRides = filter
    ? filteredRidesByWilaya.filter(r => r.from.toLowerCase().includes(filter.toLowerCase()) || r.to.toLowerCase().includes(filter.toLowerCase()))
    : filteredRidesByWilaya;

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground flex-1">{txt.title}</h1>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={txt.search}
            className="w-full pl-10 pr-4 py-3 bg-muted/60 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#00A693]/30 transition-all"
          />
        </div>

        {/* Wilaya Toggle */}
        <div className="flex gap-2 mb-5">
          {['constantine', 'alger'].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWilaya(w)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedWilaya === w
                  ? 'bg-[#00A693] text-white shadow-sm shadow-[#00A693]/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {w === 'constantine' ? 'Constantine' : 'Alger'}
            </button>
          ))}
        </div>

        {/* Rides List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#00A693]" />
            <p className="text-sm text-muted-foreground">{txt.loading}</p>
          </div>
        ) : filteredRides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Search className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-base font-medium text-foreground">{txt.noRides}</p>
            <p className="text-sm text-muted-foreground">{txt.noRidesDesc}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 pb-4"
          >
            {filteredRides.map((ride, i) => {
              const seats = ride.id in liveSeats ? liveSeats[ride.id] : ride.seats;
              return (
                <motion.button
                  key={ride.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/reservation/${ride.id}`)}
                  className="w-full bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C7FFD6] to-[#94C5FF] flex items-center justify-center text-sm font-bold text-[#1F2937] shrink-0 mt-0.5">
                      {ride.driver.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground truncate">{ride.driver}</p>
                        <p className="text-base font-bold text-[#00A693]">{ride.price} <span className="text-xs font-normal">DZD</span></p>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                          <div className="w-2 h-2 rounded-full bg-[#00A693] shrink-0" />
                          <span className="truncate">{ride.from}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                        <div className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                          <div className="w-2 h-2 rounded-full bg-[#94C5FF] shrink-0" />
                          <span className="truncate">{ride.to}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          {new Date(ride.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{ride.time}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${seats > 0 ? 'bg-[#00A693]/10 text-[#00A693]' : 'bg-destructive/10 text-destructive'}`}>
                          {seats > 0 ? `${seats} ${txt.seats}` : txt.full}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          {ride.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RidesPage;
