import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MapPin, MessageSquare, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const tabs = [
    { path: '/', icon: Home, label: language === 'fr' ? 'Accueil' : language === 'ar' ? 'الرئيسية' : 'Home' },
    { path: '/rides', icon: MapPin, label: language === 'fr' ? 'Trajets' : language === 'ar' ? 'رحلات' : 'Rides' },
    { path: '/feedback', icon: MessageSquare, label: language === 'fr' ? 'Avis' : language === 'ar' ? 'تقييم' : 'Feedback' },
    { path: '/profile', icon: User, label: language === 'fr' ? 'Profil' : language === 'ar' ? 'الملف' : 'Profile' },
    { path: '/settings', icon: Settings, label: language === 'fr' ? 'Réglages' : language === 'ar' ? 'إعدادات' : 'Settings' },
  ];

  const hiddenPaths = ['/passenger-signin', '/driver-signin', '/passenger-signup', '/driver-signup', '/onboarding', '/verify-email', '/verify-phone', '/auth'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;
  if (location.pathname.startsWith('/reservation/') || location.pathname.startsWith('/ride/')) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <div className="mx-3 mb-2">
        <nav className="flex items-center justify-around h-[68px] max-w-lg mx-auto bg-card/90 backdrop-blur-2xl border border-border/60 rounded-[22px] shadow-[0_-4px_30px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_30px_-4px_rgba(0,0,0,0.4)] px-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                whileTap={{ scale: 0.85 }}
                className="relative flex flex-col items-center justify-center gap-[3px] flex-1 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-x-2 -top-[1px] h-[3px] bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
                <motion.div
                  animate={isActive ? { scale: 1, y: -2 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                    isActive ? 'bg-primary/12' : ''
                  }`}
                >
                  <Icon
                    className={`w-[22px] h-[22px] transition-all duration-200 ${
                      isActive ? 'text-primary stroke-[2.5]' : 'text-muted-foreground stroke-[1.8]'
                    }`}
                  />
                </motion.div>
                <motion.span
                  animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 0 }}
                  className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
