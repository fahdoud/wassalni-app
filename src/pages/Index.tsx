import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, Shield, Clock, Users, LogIn, Car, Globe, MessageSquare } from "lucide-react";
import { getMockRides } from "@/services/rides/mockRides";
import { getRides } from "@/services/rides";
import { Ride } from "@/services/rides/types";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [popularRides, setPopularRides] = useState<Ride[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const onboardingSeen = localStorage.getItem('wassalni_onboarding_seen');
    if (onboardingSeen !== 'true') {
      navigate('/onboarding');
    }
  }, [navigate]);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };
    check();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      setIsLoggedIn(event === 'SIGNED_IN');
    });
    return () => listener.subscription.unsubscribe();
  }, []);

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
  const loginTxt = language === 'fr' ? 'Connexion' : language === 'ar' ? 'تسجيل الدخول' : 'Sign In';
  const signupTxt = language === 'fr' ? 'Inscription' : language === 'ar' ? 'إنشاء حساب' : 'Sign Up';
  const loginDesc = language === 'fr' ? 'Accédez à votre compte' : language === 'ar' ? 'الوصول إلى حسابك' : 'Access your account';
  const signupDesc = language === 'fr' ? 'Créez un nouveau compte' : language === 'ar' ? 'إنشاء حساب جديد' : 'Create a new account';
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
      <motion.div variants={container} initial="hidden" animate="show" className="px-4 max-w-lg mx-auto space-y-6">
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

        {/* Auth Buttons - only show when not logged in */}
        {!isLoggedIn && (
          <motion.div variants={item}>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth')}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{loginTxt}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{loginDesc}</p>
                </div>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/auth')}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">{signupTxt}</p>
                  <p className="text-[10px] opacity-80 mt-0.5">{signupDesc}</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

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
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <f.icon className="w-4 h-4 text-primary" />
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
            <button onClick={() => navigate('/rides')} className="text-xs font-medium text-primary flex items-center gap-1">
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
                      <p className="text-sm font-bold text-primary">{ride.price} DZD</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="truncate">{ride.from}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
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
