import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MapPin, User, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const tabs = [
    {
      path: '/',
      icon: Home,
      label: language === 'fr' ? 'Accueil' : language === 'ar' ? 'الرئيسية' : 'Home',
    },
    {
      path: '/rides',
      icon: Search,
      label: language === 'fr' ? 'Trajets' : language === 'ar' ? 'رحلات' : 'Rides',
    },
    {
      path: '/offer-ride',
      icon: PlusCircle,
      label: language === 'fr' ? 'Proposer' : language === 'ar' ? 'عرض' : 'Offer',
      isCenter: true,
    },
    {
      path: '/my-reservations',
      icon: MapPin,
      label: language === 'fr' ? 'Réservations' : language === 'ar' ? 'حجوزات' : 'Bookings',
    },
    {
      path: '/profile',
      icon: User,
      label: language === 'fr' ? 'Profil' : language === 'ar' ? 'الملف' : 'Profile',
    },
  ];

  // Don't show on auth pages, onboarding, or reservation detail
  const hiddenPaths = ['/passenger-signin', '/driver-signin', '/passenger-signup', '/driver-signup', '/onboarding', '/verify-email', '/verify-phone'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;
  if (location.pathname.startsWith('/reservation/') || location.pathname.startsWith('/ride/')) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <nav className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-[#00A693] shadow-lg shadow-[#00A693]/30 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#00A693] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#00A693]' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[#00A693]' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
