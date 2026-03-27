import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Search, Car, MapPin, Star, ArrowRight, Clock, Shield, Users } from "lucide-react";
import { getMockRides } from "@/services/rides/mockRides";
import { getRides } from "@/services/rides";
import { Ride } from "@/services/rides/types";

const Index = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [popularRides, setPopularRides] = useState<Ride[]>([]);

  useEffect(() => {
    const onboardingSeen = localStorage.getItem('wassalni_onboarding_seen');
    if (onboardingSeen !== 'true') {
      navigate('/onboarding');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const rides = await getRides();
        setPopularRides((rides && rides.length > 0 ? rides : getMockRides()).slice(0, 4));
      } catch {
        setPopularRides(getMockRides().slice(0, 4));
      }
    };
    fetchRides();
  }, []);

  const greeting = language === 'fr' ? 'Bonjour 👋' : language === 'ar' ? 'مرحبا 👋' : 'Hello 👋';
  const whereToGo = language === 'fr' ? 'Où allez-vous ?' : language === 'ar' ? 'إلى أين تذهب؟' : 'Where are you going?';
  const searchPlaceholder = language === 'fr' ? 'Rechercher une destination...' : language === 'ar' ? '...ابحث عن وجهة' : 'Search a destination...';
  const quickActions = language === 'fr' ? 'Actions rapides' : language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions';
  const findRide = language === 'fr' ? 'Trouver un trajet' : language === 'ar' ? 'ابحث عن رحلة' : 'Find a Ride';
  const offerRide = language === 'fr' ? 'Proposer un trajet' : language === 'ar' ? 'عرض رحلة' : 'Offer a Ride';
  const myBookings = language === 'fr' ? 'Mes réservations' : language === 'ar' ? 'حجوزاتي' : 'My Bookings';
  const myTrips = language === 'fr' ? 'Mes trajets' : language === 'ar' ? 'رحلاتي' : 'My Trips';
  const popularTitle = language === 'fr' ? 'Trajets populaires' : language === 'ar' ? 'الرحلات الشائعة' : 'Popular Rides';
  const seeAll = language === 'fr' ? 'Voir tout' : language === 'ar' ? 'عرض الكل' : 'See All';
  const seatLabel = language === 'fr' ? 'places' : language === 'ar' ? 'مقاعد' : 'seats';
  const whyTitle = language === 'fr' ? 'Pourquoi Wasslink ?' : language === 'ar' ? 'لماذا Wasslink؟' : 'Why Wasslink?';
  const safeTxt = language === 'fr' ? 'Sécurisé' : language === 'ar' ? 'آمن' : 'Safe';
  const fastTxt = language === 'fr' ? 'Rapide' : language === 'ar' ? 'سريع' : 'Fast';
  const communityTxt = language === 'fr' ? 'Communauté' : language === 'ar' ? 'مجتمع' : 'Community';

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="pb-20 pt-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 max-w-lg mx-auto space-y-6"
      >
        {/* Greeting */}
        <motion.div variants={item} className="pt-4">
          <p className="text-muted-foreground text-sm">{greeting}</p>
          <h1 className="text-2xl font-bold text-foreground mt-1">{whereToGo}</h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={item}>
          <button
            onClick={() => navigate('/rides')}
            className="w-full flex items-center gap-3 bg-muted/60 hover:bg-muted rounded-2xl px-4 py-3.5 transition-colors"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{searchPlaceholder}</span>
          </button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <h2 className="text-base font-semibold text-foreground mb-3">{quickActions}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: findRide, icon: Search, path: '/rides', color: 'from-[#00A693] to-[#00A693]/80' },
              { label: offerRide, icon: Car, path: '/offer-ride', color: 'from-[#94C5FF] to-[#94C5FF]/80' },
              { label: myBookings, icon: MapPin, path: '/my-reservations', color: 'from-[#00A693]/80 to-[#94C5FF]' },
              { label: myTrips, icon: Clock, path: '/my-trips', color: 'from-[#94C5FF]/80 to-[#00A693]' },
            ].map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Why Wasslink */}
        <motion.div variants={item}>
          <h2 className="text-base font-semibold text-foreground mb-3">{whyTitle}</h2>
          <div className="flex gap-3">
            {[
              { icon: Shield, label: safeTxt, desc: language === 'fr' ? 'Voyages vérifiés' : 'Verified rides' },
              { icon: Clock, label: fastTxt, desc: language === 'fr' ? 'Réservation rapide' : 'Quick booking' },
              { icon: Users, label: communityTxt, desc: language === 'fr' ? 'Conducteurs fiables' : 'Trusted drivers' },
            ].map((f) => (
              <div key={f.label} className="flex-1 bg-card border border-border rounded-2xl p-3 text-center shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#00A693]/10 flex items-center justify-center mx-auto mb-2">
                  <f.icon className="w-4 h-4 text-[#00A693]" />
                </div>
                <p className="text-xs font-semibold text-foreground">{f.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Popular Rides */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">{popularTitle}</h2>
            <button onClick={() => navigate('/rides')} className="text-xs font-medium text-[#00A693] flex items-center gap-1">
              {seeAll} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {popularRides.map((ride) => (
              <motion.button
                key={ride.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/reservation/${ride.id}`)}
                className="w-full bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C7FFD6] to-[#94C5FF] flex items-center justify-center text-sm font-bold text-[#1F2937] shrink-0">
                    {ride.driver.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground truncate">{ride.driver}</p>
                      <p className="text-sm font-bold text-[#00A693]">{ride.price} DZD</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00A693]" />
                        <span className="truncate">{ride.from}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#94C5FF]" />
                        <span className="truncate">{ride.to}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">{ride.time}</span>
                      <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">{ride.seats} {seatLabel}</span>
                      <div className="flex items-center gap-0.5 text-[10px] text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        {ride.rating}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
