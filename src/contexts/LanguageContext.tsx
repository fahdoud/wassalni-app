
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { translations as simplifiedTranslations } from './translations';

// Define a recursive type for nested translations
type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationsType = { [key: string]: TranslationValue };

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
    // Authentication related translations
    "welcomeBack": "Welcome Back",
    "passengerSignInDesc": "Sign in to your passenger account to book rides, manage your reservations, and more.",
    "enterEmailPlaceholder": "Enter your email address",
    "password": "Password",
    "enterPasswordPlaceholder": "Enter your password",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "signingIn": "Signing in...",
    "signIn": "Sign In",
    "dontHaveAccount": "Don't have an account?",
    "createAccount": "Create an account",
    "joinAsPassenger": "Join as a Passenger",
    "joinPassengerDesc": "Enjoy convenient, affordable, and safe rides across the city. Connect with trusted drivers and experience hassle-free transportation.",
    "fillAllFields": "Please fill in all fields",
    "successSignIn": "You have successfully signed in",
    "errorSignIn": "An error occurred while signing in",
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
    // Authentication related translations
    "welcomeBack": "Bienvenue",
    "passengerSignInDesc": "Connectez-vous à votre compte passager pour réserver des trajets, gérer vos réservations et plus encore.",
    "enterEmailPlaceholder": "Entrez votre adresse e-mail",
    "password": "Mot de passe",
    "enterPasswordPlaceholder": "Entrez votre mot de passe",
    "rememberMe": "Se souvenir de moi",
    "forgotPassword": "Mot de passe oublié?",
    "signingIn": "Connexion en cours...",
    "signIn": "Se connecter",
    "dontHaveAccount": "Vous n'avez pas de compte?",
    "createAccount": "Créer un compte",
    "joinAsPassenger": "Rejoignez-nous en tant que passager",
    "joinPassengerDesc": "Profitez de trajets pratiques, abordables et sûrs dans toute la ville. Connectez-vous avec des chauffeurs de confiance et vivez une expérience de transport sans tracas.",
    "fillAllFields": "Veuillez remplir tous les champs",
    "successSignIn": "Vous vous êtes connecté avec succès",
    "errorSignIn": "Une erreur s'est produite lors de la connexion",
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
    // Authentication related translations
    "welcomeBack": "مرحباً بعودتك",
    "passengerSignInDesc": "سجل الدخول إلى حسابك كراكب لحجز الرحلات وإدارة حجوزاتك والمزيد.",
    "enterEmailPlaceholder": "أدخل عنوان بريدك الإلكتروني",
    "password": "كلمة المرور",
    "enterPasswordPlaceholder": "أدخل كلمة المرور الخاصة بك",
    "rememberMe": "تذكرني",
    "forgotPassword": "نسيت كلمة المرور؟",
    "signingIn": "جاري تسجيل الدخول...",
    "signIn": "تسجيل الدخول",
    "dontHaveAccount": "ليس لديك حساب؟",
    "createAccount": "إنشاء حساب",
    "joinAsPassenger": "انضم كراكب",
    "joinPassengerDesc": "استمتع برحلات مريحة وبأسعار معقولة وآمنة في جميع أنحاء المدينة. تواصل مع سائقين موثوقين واستمتع بتجربة نقل خالية من المتاعب.",
    "fillAllFields": "يرجى ملء جميع الحقول",
    "successSignIn": "لقد قمت بتسجيل الدخول بنجاح",
    "errorSignIn": "حدث خطأ أثناء تسجيل الدخول",
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

  // Helper function to get nested translation values
  const getNestedValue = (obj: any, path: string): string => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === undefined || result === null) return path;
      result = result[key];
    }
    
    return typeof result === 'string' ? result : path;
  };

  const t = (key: string): string => {
    if (!translations[language as keyof typeof translations]) {
      return key;
    }
    
    // Handle nested keys with dot notation (e.g., 'hero.tagline')
    if (key.includes('.')) {
      return getNestedValue(translations[language as keyof typeof translations], key);
    }
    
    const translationObj = translations[language as keyof typeof translations];
    const value = (translationObj as any)[key];
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
