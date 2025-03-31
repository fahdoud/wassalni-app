import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { translations as simplifiedTranslations } from './translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  dir: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (key: string) => key,
  dir: "ltr",
});

interface LanguageProviderProps {
  children: ReactNode;
}

// Our translations object
const translations = {
  en: {
    "selectLanguage": "Select Language",
    "home": "Home",
    "rides": "Rides",
    "reservations": "Reservations",
    "profile": "Profile",
    "logout": "Logout",
    "login": "Login",
    "register": "Register",
    "settings": "Settings",
    "editProfile": "Edit Profile",
    "changePassword": "Change Password",
    "notifications": "Notifications",
    "help": "Help",
    "about": "About",
    "contactUs": "Contact Us",
    "termsOfService": "Terms of Service",
    "privacyPolicy": "Privacy Policy",
    "version": "Version",
    "general": "General",
    "account": "Account",
    "security": "Security",
    "support": "Support",
    "aboutUs": "About Us",
    "wassalni": "Wassalni",
    "allRightsReserved": "All Rights Reserved",
    "search": "Search",
    "from": "From",
    "to": "To",
    "date": "Date",
    "time": "Time",
    "price": "Price",
    "seats": "Seats",
    "bookNow": "Book Now",
    "availableRides": "Available Rides",
    "noRidesAvailable": "No rides available",
    "myReservations": "My Reservations",
    "upcomingRides": "Upcoming Rides",
    "pastRides": "Past Rides",
    "noReservations": "No reservations",
    "cancelReservation": "Cancel Reservation",
    "reservationDetails": "Reservation Details",
    "rideDetails": "Ride Details",
    "driver": "Driver",
    "origin": "Origin",
    "destination": "Destination",
    "departureTime": "Departure Time",
    "numberOfSeats": "Number of Seats",
    "totalPrice": "Total Price",
    "paymentMethod": "Payment Method",
    "cash": "Cash",
    "payDriver": "Pay the driver directly",
    "confirmReservation": "Confirm Reservation",
    "reservationSuccessful": "Reservation Successful",
    "thankYou": "Thank You",
    "yourReservationHasBeenConfirmed": "Your reservation has been confirmed",
    "viewReservationDetails": "View Reservation Details",
    "backToHome": "Back to Home",
    "edit": "Edit",
    "save": "Save",
    "fullName": "Full Name",
    "email": "Email",
    "phone": "Phone",
    "currentPassword": "Current Password",
    "newPassword": "New Password",
    "confirmNewPassword": "Confirm New Password",
    "updatePassword": "Update Password",
    "enterYourMessage": "Enter your message",
    "sendMessage": "Send Message",
    "chat": "Chat",
    "groupChat": "Group Chat",
    "liveTracking": "Live Tracking",
    "tracking": "Tracking",
    "successNotification": "Reservation successful!",
    "payment": "Payment Details",
    "passengers": "Passengers",
    "notEnoughSeats": "Not enough available seats",
    "loginToBook": "Login to book your ride",
    "baseFare": "Base fare",
    "total": "Total",
    "loginToConfirm": "Login to confirm",
    "back": "Back",
    "error": "An error occurred. Please try again.",
    ...simplifiedTranslations.en
  },
  fr: {
    "selectLanguage": "Sélectionner la langue",
    "home": "Accueil",
    "rides": "Trajets",
    "reservations": "Réservations",
    "profile": "Profil",
    "logout": "Déconnexion",
    "login": "Connexion",
    "register": "Inscription",
    "settings": "Paramètres",
    "editProfile": "Modifier le profil",
    "changePassword": "Changer le mot de passe",
    "notifications": "Notifications",
    "help": "Aide",
    "about": "À propos",
    "contactUs": "Contactez-nous",
    "termsOfService": "Conditions d'utilisation",
    "privacyPolicy": "Politique de confidentialité",
    "version": "Version",
    "general": "Général",
    "account": "Compte",
    "security": "Sécurité",
    "support": "Support",
    "aboutUs": "À propos de nous",
    "wassalni": "Wassalni",
    "allRightsReserved": "Tous droits réservés",
    "search": "Rechercher",
    "from": "De",
    "to": "À",
    "date": "Date",
    "time": "Heure",
    "price": "Prix",
    "seats": "Places",
    "bookNow": "Réserver maintenant",
    "availableRides": "Trajets disponibles",
    "noRidesAvailable": "Aucun trajet disponible",
    "myReservations": "Mes réservations",
    "upcomingRides": "Trajets à venir",
    "pastRides": "Trajets passés",
    "noReservations": "Aucune réservation",
    "cancelReservation": "Annuler la réservation",
    "reservationDetails": "Détails de la réservation",
    "rideDetails": "Détails du trajet",
    "driver": "Chauffeur",
    "origin": "Origine",
    "destination": "Destination",
    "departureTime": "Heure de départ",
    "numberOfSeats": "Nombre de places",
    "totalPrice": "Prix total",
    "paymentMethod": "Mode de paiement",
    "cash": "Espèces",
    "payDriver": "Payer directement au chauffeur",
    "confirmReservation": "Confirmer la réservation",
    "reservationSuccessful": "Réservation réussie",
    "thankYou": "Merci",
    "yourReservationHasBeenConfirmed": "Votre réservation a été confirmée",
    "viewReservationDetails": "Voir les détails de la réservation",
    "backToHome": "Retour à l'accueil",
    "edit": "Modifier",
    "save": "Enregistrer",
    "fullName": "Nom complet",
    "email": "E-mail",
    "phone": "Téléphone",
    "currentPassword": "Mot de passe actuel",
    "newPassword": "Nouveau mot de passe",
    "confirmNewPassword": "Confirmer le nouveau mot de passe",
    "updatePassword": "Mettre à jour le mot de passe",
    "enterYourMessage": "Entrez votre message",
    "sendMessage": "Envoyer le message",
    "chat": "Discussion",
    "groupChat": "Discussion de groupe",
    "liveTracking": "Suivi en direct",
    "tracking": "Suivi",
    "successNotification": "Réservation réussie!",
    "payment": "Détails du Paiement",
    "passengers": "Passagers",
    "notEnoughSeats": "Pas assez de places disponibles",
    "loginToBook": "Connectez-vous pour réserver votre trajet",
    "baseFare": "Tarif de base",
    "total": "Total",
    "loginToConfirm": "Connectez-vous pour confirmer",
    "back": "Retour",
    "error": "Une erreur s'est produite. Veuillez réessayer.",
    ...simplifiedTranslations.fr
  },
  ar: {
    "selectLanguage": "إختر اللغة",
    "home": "الرئيسية",
    "rides": "الرحلات",
    "reservations": "الحجوزات",
    "profile": "الملف الشخصي",
    "logout": "تسجيل الخروج",
    "login": "تسجيل الدخول",
    "register": "تسجيل",
    "settings": "إعدادات",
    "editProfile": "تعديل الملف الشخصي",
    "changePassword": "تغيير كلمة المرور",
    "notifications": "إشعارات",
    "help": "مساعدة",
    "about": "حول",
    "contactUs": "اتصل بنا",
    "termsOfService": "شروط الخدمة",
    "privacyPolicy": "سياسة الخصوصية",
    "version": "الإصدار",
    "general": "عام",
    "account": "الحساب",
    "security": "الأمان",
    "support": "الدعم",
    "aboutUs": "معلومات عنا",
    "wassalni": "وصلني",
    "allRightsReserved": "جميع الحقوق محفوظة",
    "search": "بحث",
    "from": "من",
    "to": "إلى",
    "date": "تاريخ",
    "time": "وقت",
    "price": "السعر",
    "seats": "مقاعد",
    "bookNow": "احجز الآن",
    "availableRides": "الرحلات المتاحة",
    "noRidesAvailable": "لا توجد رحلات متاحة",
    "myReservations": "حجوزاتي",
    "upcomingRides": "الرحلات القادمة",
    "pastRides": "الرحلات السابقة",
    "noReservations": "لا توجد حجوزات",
    "cancelReservation": "إلغاء الحجز",
    "reservationDetails": "تفاصيل الحجز",
    "rideDetails": "تفاصيل الرحلة",
    "driver": "سائق",
    "origin": "الأصل",
    "destination": "الوجهة",
    "departureTime": "وقت المغادرة",
    "numberOfSeats": "عدد المقاعد",
    "totalPrice": "السعر الكلي",
    "paymentMethod": "طريقة الدفع او السداد",
    "cash": "الدفع كاش",
    "payDriver": "ادفع للسائق مباشرة",
    "confirmReservation": "تأكيد الحجز",
    "reservationSuccessful": "تم الحجز بنجاح",
    "thankYou": "شكرا",
    "yourReservationHasBeenConfirmed": "تم تأكيد حجزك",
    "viewReservationDetails": "عرض تفاصيل الحجز",
    "backToHome": "العودة إلى الرئيسية",
    "edit": "تعديل",
    "save": "حفظ",
    "fullName": "الاسم الكامل",
    "email": "بريد إلكتروني",
    "phone": "هاتف",
    "currentPassword": "كلمة المرور الحالية",
    "newPassword": "كلمة مرور جديدة",
    "confirmNewPassword": "تأكيد كلمة المرور الجديدة",
    "updatePassword": "تحديث كلمة المرور",
    "enterYourMessage": "أدخل رسالتك",
    "sendMessage": "أرسل رسالة",
    "chat": "دردشة",
    "groupChat": "محادثة جماعية",
    "liveTracking": "تتبع مباشر",
    "tracking": "تتبع",
    "successNotification": "تم الحجز بنجاح!",
    "payment": "تفاصيل الدفع",
    "passengers": "الركاب",
    "notEnoughSeats": "لا توجد مقاعد كافية",
    "loginToBook": "سجل الدخول لحجز رحلتك",
    "baseFare": "السعر الأساسي",
    "total": "المجموع",
    "loginToConfirm": "سجل الدخول للتأكيد",
    "back": "رجوع",
    "error": "حدث خطأ. يرجى المحاولة مرة أخرى.",
    ...simplifiedTranslations.ar
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    const storedLang = localStorage.getItem('wassalni_language');
    return storedLang || 'fr';
  });

  const dir = useMemo(() => (language === 'ar' ? 'rtl' : 'ltr'), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('wassalni_language', language);
  }, [language, dir]);

  const t = (key: string): string => {
    if (!translations[language as keyof typeof translations]) {
      return key;
    }
    
    return (translations[language as keyof typeof translations] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
