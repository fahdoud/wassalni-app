import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  dir: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
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
    // Navigation
    'nav.features': 'Features',
    'nav.howItWorks': 'How it Works',
    'nav.feedback': 'Feedback',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',

    // Hero Section
    'hero.tagline': 'Your ride, your way!',
    'hero.title': 'The best way to get around',
    'hero.description': 'Wassalni is a ride-sharing app that connects you with drivers in Constantine. Find a ride or offer a ride today!',
    'hero.findRide': 'Find a Ride',
    'hero.offerRide': 'Offer a Ride',

    // Form
    'form.from': 'From',
    'form.to': 'To',
    'form.when': 'When',
    'form.search': 'Search',
    'form.departurePlaceholder': 'Enter departure location',
    'form.destinationPlaceholder': 'Enter destination',

    // Features Section
    'features.title': 'Why Choose Wassalni?',
    'features.card1.title': 'Affordable Rides',
    'features.card1.description': 'Get access to low-cost rides that fit your budget.',
    'features.card2.title': 'Safe and Reliable',
    'features.card2.description': 'Verified drivers and real-time tracking for a secure journey.',
    'features.card3.title': 'Easy to Use',
    'features.card3.description': 'Simple interface for quick ride booking and ride offering.',

    // How It Works Section
    'howItWorks.title': 'How Wassalni Works',
    'howItWorks.step1.title': 'Find a Ride',
    'howItWorks.step1.description': 'Enter your destination and preferred time to find available rides.',
    'howItWorks.step2.title': 'Book a Ride',
    'howItWorks.step2.description': 'Choose a ride that suits your needs and confirm your booking.',
    'howItWorks.step3.title': 'Enjoy the Ride',
    'howItWorks.step3.description': 'Meet your driver and enjoy a comfortable and safe journey to your destination.',
    
    // Authentication
    'auth.welcomeBack': 'Welcome Back',
    'auth.welcomeBackDriver': 'Welcome Back Driver',
    'auth.passengerSignInDesc': 'Sign in to your passenger account to book rides in Constantine',
    'auth.driverSignInDesc': 'Sign in to your driver account to offer rides in Constantine',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signIn': 'Sign In',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.createAccount': 'Create an account',
    'auth.createDriverAccount': 'Create a driver account',
    'auth.areYouDriver': 'Are you a driver?',
    'auth.areYouPassenger': 'Are you a passenger?',
    'auth.signInAsDriver': 'Sign in as a driver',
    'auth.signInAsPassenger': 'Sign in as a passenger',
    'auth.passengerSignUpDesc': 'Create a passenger account to start booking rides in Constantine',
    'auth.driverSignUpDesc': 'Create a driver account to start offering rides in Constantine',
    'auth.fullName': 'Full Name',
    'auth.fullNamePlaceholder': 'Enter your full name',
    'auth.phone': 'Phone Number',
    'auth.phonePlaceholder': 'Enter your phone number',
    'auth.confirmPassword': 'Confirm Password',
    'auth.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.agreeTerms': 'I agree to the',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.wantToBeDriver': 'Want to be a driver?',
    'auth.wantToBePassenger': 'Want to be a passenger?',
    'auth.signUp': 'Sign Up',
    'auth.signUpAsDriver': 'Sign up as a driver',
    'auth.signUpAsPassenger': 'Sign up as a passenger',
    'auth.carModel': 'Car Model',
    'auth.carModelPlaceholder': 'Enter your car model',
    'auth.carYear': 'Car Year',
    'auth.carYearPlaceholder': 'Enter car year',
    'auth.licenseNumber': 'License Number',
    'auth.licenseNumberPlaceholder': 'Enter your license number',
    'auth.joinAsPassenger': 'Join as a Passenger',
    'auth.joinAsDriver': 'Join as a Driver',
    'auth.passengerBenefits': 'Find affordable rides, travel comfortably and connect with trusted drivers in Constantine.',
    'auth.driverBenefits': 'Earn extra income, choose your schedule, and meet new people while helping reduce traffic in Constantine.',
    'auth.successTitle': 'Success!',
    'auth.successSignIn': 'You have successfully signed in.',
    'auth.successSignUp': 'Your account has been created successfully.',
    'auth.successDriverSignUp': 'Your driver account has been created successfully.',
    'auth.errorTitle': 'Error',
    'auth.errorFields': 'Please fill in all required fields.',
    'auth.errorTerms': 'You must agree to the terms of service.',
    'auth.errorPasswordMatch': 'Passwords do not match.',
    'auth.asPassenger': 'Passenger',
    'auth.asDriver': 'Driver',
    'auth.chooseRole': 'Choose your role',
    'auth.switchRole': 'Switch role',
  },
  fr: {
    // Navigation
    'nav.features': 'Fonctionnalités',
    'nav.howItWorks': 'Comment ça marche',
    'nav.feedback': 'Commentaires',
    'nav.signIn': 'Se Connecter',
    'nav.signUp': 'S\'inscrire',

    // Hero Section
    'hero.tagline': 'Votre trajet, à votre façon!',
    'hero.title': 'La meilleure façon de se déplacer',
    'hero.description': 'Wassalni est une application de covoiturage qui vous met en relation avec des conducteurs à Constantine. Trouvez un trajet ou proposez un trajet dès aujourd\'hui!',
    'hero.findRide': 'Trouver un Trajet',
    'hero.offerRide': 'Proposer un Trajet',

    // Form
    'form.from': 'De',
    'form.to': 'À',
    'form.when': 'Quand',
    'form.search': 'Rechercher',
    'form.departurePlaceholder': 'Entrez le lieu de départ',
    'form.destinationPlaceholder': 'Entrez la destination',

    // Features Section
    'features.title': 'Pourquoi Choisir Wassalni?',
    'features.card1.title': 'Trajets Abordables',
    'features.card1.description': 'Accédez à des trajets à faible coût qui correspondent à votre budget.',
    'features.card2.title': 'Sûr et Fiable',
    'features.card2.description': 'Conducteurs vérifiés et suivi en temps réel pour un voyage sécurisé.',
    'features.card3.title': 'Facile à Utiliser',
    'features.card3.description': 'Interface simple pour une réservation rapide de trajets et une offre de trajets.',

    // How It Works Section
    'howItWorks.title': 'Comment Fonctionne Wassalni',
    'howItWorks.step1.title': 'Trouver un Trajet',
    'howItWorks.step1.description': 'Entrez votre destination et l\'heure préférée pour trouver les trajets disponibles.',
    'howItWorks.step2.title': 'Réserver un Trajet',
    'howItWorks.step2.description': 'Choisissez un trajet qui correspond à vos besoins et confirmez votre réservation.',
    'howItWorks.step3.title': 'Profitez du Trajet',
    'howItWorks.step3.description': 'Rencontrez votre chauffeur et profitez d\'un voyage confortable et sûr vers votre destination.',
    
    // Authentication (add new keys to French translations)
    'auth.welcomeBack': 'Bon Retour',
    'auth.welcomeBackDriver': 'Bon Retour Chauffeur',
    'auth.passengerSignInDesc': 'Connectez-vous à votre compte passager pour réserver des trajets à Constantine',
    'auth.driverSignInDesc': 'Connectez-vous à votre compte chauffeur pour proposer des trajets à Constantine',
    'auth.email': 'Email',
    'auth.emailPlaceholder': 'Entrez votre email',
    'auth.password': 'Mot de passe',
    'auth.passwordPlaceholder': 'Entrez votre mot de passe',
    'auth.rememberMe': 'Se souvenir de moi',
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.signIn': 'Se Connecter',
    'auth.noAccount': 'Vous n\'avez pas de compte?',
    'auth.createAccount': 'Créer un compte',
    'auth.createDriverAccount': 'Créer un compte chauffeur',
    'auth.areYouDriver': 'Êtes-vous un chauffeur?',
    'auth.areYouPassenger': 'Êtes-vous un passager?',
    'auth.signInAsDriver': 'Se connecter en tant que chauffeur',
    'auth.signInAsPassenger': 'Se connecter en tant que passager',
    'auth.passengerSignUpDesc': 'Créez un compte passager pour commencer à réserver des trajets à Constantine',
    'auth.driverSignUpDesc': 'Créez un compte chauffeur pour commencer à proposer des trajets à Constantine',
    'auth.fullName': 'Nom Complet',
    'auth.fullNamePlaceholder': 'Entrez votre nom complet',
    'auth.phone': 'Numéro de Téléphone',
    'auth.phonePlaceholder': 'Entrez votre numéro de téléphone',
    'auth.confirmPassword': 'Confirmer le Mot de Passe',
    'auth.confirmPasswordPlaceholder': 'Confirmez votre mot de passe',
    'auth.agreeTerms': 'J\'accepte les',
    'auth.alreadyAccount': 'Vous avez déjà un compte?',
    'auth.wantToBeDriver': 'Vous voulez devenir chauffeur?',
    'auth.wantToBePassenger': 'Vous voulez être un passager?',
    'auth.signUp': 'S\'inscrire',
    'auth.signUpAsDriver': 'S\'inscrire en tant que chauffeur',
    'auth.signUpAsPassenger': 'S\'inscrire en tant que passager',
    'auth.carModel': 'Modèle de Voiture',
    'auth.carModelPlaceholder': 'Entrez le modèle de votre voiture',
    'auth.carYear': 'Année de Voiture',
    'auth.carYearPlaceholder': 'Entrez l\'année de votre voiture',
    'auth.licenseNumber': 'Numéro de Permis',
    'auth.licenseNumberPlaceholder': 'Entrez votre numéro de permis',
    'auth.joinAsPassenger': 'Rejoindre en tant que Passager',
    'auth.joinAsDriver': 'Rejoindre en tant que Chauffeur',
    'auth.passengerBenefits': 'Trouvez des trajets abordables, voyagez confortablement et connectez-vous avec des conducteurs de confiance à Constantine.',
    'auth.driverBenefits': 'Gagnez un revenu supplémentaire, choisissez votre emploi du temps et rencontrez de nouvelles personnes tout en contribuant à réduire la circulation à Constantine.',
    'auth.successTitle': 'Succès!',
    'auth.successSignIn': 'Vous vous êtes connecté avec succès.',
    'auth.successSignUp': 'Votre compte a été créé avec succès.',
    'auth.successDriverSignUp': 'Votre compte chauffeur a été créé avec succès.',
    'auth.errorTitle': 'Erreur',
    'auth.errorFields': 'Veuillez remplir tous les champs obligatoires.',
    'auth.errorTerms': 'Vous devez accepter les conditions d\'utilisation.',
    'auth.errorPasswordMatch': 'Les mots de passe ne correspondent pas.',
    'auth.asPassenger': 'Passager',
    'auth.asDriver': 'Chauffeur',
    'auth.chooseRole': 'Choisissez votre rôle',
    'auth.switchRole': 'Changer de rôle',
  },
  ar: {
    // Navigation
    'nav.features': 'الميزات',
    'nav.howItWorks': 'كيف تعمل',
    'nav.feedback': 'ملاحظات',
    'nav.signIn': 'تسجيل الدخول',
    'nav.signUp': 'اشتراك',

    // Hero Section
    'hero.tagline': 'رحلتك، على طريقتك!',
    'hero.title': 'أفضل طريقة للتنقل',
    'hero.description': 'وصلني هو تطبيق لمشاركة الركوب يربطك بالسائقين في قسنطينة. ابحث عن رحلة أو قدم رحلة اليوم!',
    'hero.findRide': 'البحث عن رحلة',
    'hero.offerRide': 'عرض رحلة',

    // Form
    'form.from': 'من',
    'form.to': 'إلى',
    'form.when': 'متى',
    'form.search': 'بحث',
    'form.departurePlaceholder': 'أدخل موقع المغادرة',
    'form.destinationPlaceholder': 'أدخل الوجهة',

    // Features Section
    'features.title': 'لماذا تختار وصلني؟',
    'features.card1.title': 'رحلات بأسعار معقولة',
    'features.card1.description': 'احصل على رحلات منخفضة التكلفة تناسب ميزانيتك.',
    'features.card2.title': 'آمن وموثوق',
    'features.card2.description': 'سائقون تم التحقق منهم وتتبع في الوقت الفعلي لرحلة آمنة.',
    'features.card3.title': 'سهل الاستخدام',
    'features.card3.description': 'واجهة بسيطة لحجز الركوب السريع وتقديم الركوب.',

    // How It Works Section
    'howItWorks.title': 'كيف يعمل وصلني',
    'howItWorks.step1.title': 'البحث عن رحلة',
    'howItWorks.step1.description': 'أدخل وجهتك والوقت المفضل للعثور على الرحلات المتاحة.',
    'howItWorks.step2.title': 'حجز رحلة',
    'howItWorks.step2.description': 'اختر رحلة تناسب احتياجاتك وقم بتأكيد حجزك.',
    'howItWorks.step3.title': 'استمتع بالرحلة',
    'howItWorks.step3.description': 'قابل سائقك واستمتع برحلة مريحة وآمنة إلى وجهتك.',
    
    // Authentication (add new keys to Arabic translations)
    'auth.welcomeBack': 'مرحبًا بعودتك',
    'auth.welcomeBackDriver': 'مرحبًا بعودتك أيها السائق',
    'auth.passengerSignInDesc': 'سجل الدخول إلى حسابك كراكب لحجز رحلات في قسنطينة',
    'auth.driverSignInDesc': 'سجل الدخول إلى حسابك كسائق لتقديم رحلات في قسنطينة',
    'auth.email': 'البريد الإلكتروني',
    'auth.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.passwordPlaceholder': 'أدخل كلمة المرور الخاصة بك',
    'auth.rememberMe': 'تذكرني',
    'auth.forgotPassword': 'هل نسيت كلمة المرور؟',
    'auth.signIn': 'تسجيل الدخول',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.createAccount': 'إنشاء حساب',
    'auth.createDriverAccount': 'إنشاء حساب سائق',
    'auth.areYouDriver': 'هل أنت سائق؟',
    'auth.areYouPassenger': 'هل أنت راكب؟',
    'auth.signInAsDriver': 'تسجيل الدخول كسائق',
    'auth.signInAsPassenger': 'تسجيل الدخول كراكب',
    'auth.passengerSignUpDesc': 'أنشئ حساب راكب لتبدأ في حجز الرحلات في قسنطينة',
    'auth.driverSignUpDesc': 'أنشئ حساب سائق لتبدأ في تقديم الرحلات في قسنطينة',
    'auth.fullName': 'الاسم الكامل',
    'auth.fullNamePlaceholder': 'أدخل اسمك الكامل',
    'auth.phone': 'رقم الهاتف',
    'auth.phonePlaceholder': 'أدخل رقم هاتفك',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.confirmPasswordPlaceholder': 'أكد كلمة مرورك',
    'auth.agreeTerms': 'أوافق على',
    'auth.alreadyAccount': 'هل لديك حساب بالفعل؟',
    'auth.wantToBeDriver': 'هل تريد أن تكون سائقًا؟',
    'auth.wantToBePassenger': 'هل تريد أن تكون راكبًا؟',
    'auth.signUp': 'اشتراك',
    'auth.signUpAsDriver': 'الاشتراك كسائق',
    'auth.signUpAsPassenger': 'الاشتراك كراكب',
    'auth.carModel': 'موديل السيارة',
    'auth.carModelPlaceholder': 'أدخل موديل سيارتك',
    'auth.carYear': 'سنة الصنع',
    'auth.carYearPlaceholder': 'أدخل سنة صنع سيارتك',
    'auth.licenseNumber': 'رقم الرخصة',
    'auth.licenseNumberPlaceholder': 'أدخل رقم رخصتك',
    'auth.joinAsPassenger': 'انضم كراكب',
    'auth.joinAsDriver': 'انضم كسائق',
    'auth.passengerBenefits': 'ابحث عن رحلات بأسعار معقولة، وسافر براحة وتواصل مع سائقين موثوقين في قسنطينة.',
    'auth.driverBenefits': 'اربح دخلًا إضافيًا، واختر جدولك الزمني، وقابل أشخاصًا جدد مع المساعدة في تقليل حركة المرور في قسنطينة.',
    'auth.successTitle': '!نجاح',
    'auth.successSignIn': 'لقد قمت بتسجيل الدخول بنجاح.',
    'auth.successSignUp': 'تم إنشاء حسابك بنجاح.',
    'auth.successDriverSignUp': 'تم إنشاء حساب السائق الخاص بك بنجاح.',
    'auth.errorTitle': 'خطأ',
    'auth.errorFields': 'الرجاء ملء جميع الحقول المطلوبة.',
    'auth.errorTerms': 'يجب أن توافق على شروط الخدمة.',
    'auth.errorPasswordMatch': 'كلمات المرور غير متطابقة.',
    'auth.asPassenger': 'راكب',
    'auth.asDriver': 'سائق',
    'auth.chooseRole': 'اختر دورك',
    'auth.switchRole': 'تبديل الدور',
  }
};

const defaultLanguage: string = 'en';

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const [dir, setDir] = useState<string>('ltr');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || defaultLanguage;
    setLanguage(storedLanguage);
    setDir(storedLanguage === 'ar' ? 'rtl' : 'ltr');
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    setDir(language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
  }, [language, dir]);

  const t = (key: string) => {
    return translations[language as keyof typeof translations][key] || key;
  };

  const value = useMemo(() => ({ language, setLanguage, t, dir }), [language, t, dir]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { LanguageProvider, useLanguage };
