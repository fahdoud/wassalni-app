import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MapPin, MessageSquare, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div className="mx-4 mb-3">
        <nav className="relative flex items-center justify-around h-[72px] max-w-md mx-auto bg-card/80 backdrop-blur-3xl border border-border/40 rounded-[28px] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5)] dark:bg-card/60 px-1">
          {tabs.map((tab, index) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                whileTap={{ scale: 0.88 }}
                className="relative flex flex-col items-center justify-center flex-1 h-full py-1 group"
              >
                {/* Active background blob */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                      className="absolute inset-x-1 top-1 bottom-1 bg-primary/12 dark:bg-primary/20 rounded-[22px]"
                    />
                  )}
                </AnimatePresence>

                {/* Icon container */}
                <motion.div
                  animate={isActive 
                    ? { y: -1, scale: 1.1 } 
                    : { y: 0, scale: 1 }
                  }
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="relative z-10 flex items-center justify-center w-9 h-9"
                >
                  <Icon
                    className={`w-[21px] h-[21px] transition-all duration-300 ${
                      isActive 
                        ? 'text-primary stroke-[2.4] drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]' 
                        : 'text-muted-foreground stroke-[1.7] group-hover:text-foreground/70'
                    }`}
                  />
                </motion.div>

                {/* Label */}
                <motion.span
                  animate={isActive 
                    ? { opacity: 1, y: 0, scale: 1 } 
                    : { opacity: 0.55, y: 1, scale: 0.95 }
                  }
                  transition={{ duration: 0.2 }}
                  className={`relative z-10 text-[9.5px] font-bold tracking-wider uppercase transition-colors duration-300 ${
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground/70'
                  }`}
                >
                  {tab.label}
                </motion.span>

                {/* Active dot indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
                      className="absolute -top-[2px] w-5 h-[3px] bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
