import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { Globe, Moon, Sun, Bell, Shield, Info, ChevronRight } from "lucide-react";
import LanguageSwitcher from "@/components/ui-components/LanguageSwitcher";

const SettingsPage = () => {
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const txt = {
    title: language === 'fr' ? 'Paramètres' : language === 'ar' ? 'الإعدادات' : 'Settings',
    appearance: language === 'fr' ? 'Apparence' : language === 'ar' ? 'المظهر' : 'Appearance',
    darkMode: language === 'fr' ? 'Mode sombre' : language === 'ar' ? 'الوضع الداكن' : 'Dark Mode',
    darkModeDesc: language === 'fr' ? 'Réduire la luminosité de l\'écran' : language === 'ar' ? 'تقليل سطوع الشاشة' : 'Reduce screen brightness',
    lang: language === 'fr' ? 'Langue' : language === 'ar' ? 'اللغة' : 'Language',
    langDesc: language === 'fr' ? 'Choisissez votre langue préférée' : language === 'ar' ? 'اختر لغتك المفضلة' : 'Choose your preferred language',
    notifications: language === 'fr' ? 'Notifications' : language === 'ar' ? 'الإشعارات' : 'Notifications',
    notifDesc: language === 'fr' ? 'Gérer les alertes et notifications' : language === 'ar' ? 'إدارة التنبيهات والإشعارات' : 'Manage alerts and notifications',
    privacy: language === 'fr' ? 'Confidentialité' : language === 'ar' ? 'الخصوصية' : 'Privacy',
    privacyDesc: language === 'fr' ? 'Contrôler vos données personnelles' : language === 'ar' ? 'التحكم في بياناتك الشخصية' : 'Control your personal data',
    about: language === 'fr' ? 'À propos' : language === 'ar' ? 'حول' : 'About',
    aboutDesc: language === 'fr' ? 'Version 1.0.0 • Wasslink' : language === 'ar' ? 'الإصدار 1.0.0 • Wasslink' : 'Version 1.0.0 • Wasslink',
  };

  const isDark = theme === 'dark';

  return (
    <div className="pb-20 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 max-w-lg mx-auto py-4"
      >
        <h1 className="text-xl font-bold text-foreground mb-6">{txt.title}</h1>

        <div className="space-y-3">
          {/* Dark Mode */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{txt.darkMode}</p>
                <p className="text-xs text-muted-foreground">{txt.darkModeDesc}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-muted'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Language */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{txt.lang}</p>
                <p className="text-xs text-muted-foreground">{txt.langDesc}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{txt.notifications}</p>
                <p className="text-xs text-muted-foreground">{txt.notifDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Privacy */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{txt.privacy}</p>
                <p className="text-xs text-muted-foreground">{txt.privacyDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* About */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{txt.about}</p>
                <p className="text-xs text-muted-foreground">{txt.aboutDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
