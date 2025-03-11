
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr' | 'ar';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.testimonials': 'Testimonials',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    
    // Hero
    'hero.tagline': 'The Smartest Way to Carpool',
    'hero.title': 'Share Your Journey with',
    'hero.description': 'Connect with fellow travelers, save money, reduce your carbon footprint, and make new friends along the way.',
    'hero.findRide': 'Find a Ride',
    'hero.offerRide': 'Offer a Ride',
    'hero.activeUsers': 'Active Users',
    'hero.ridesShared': 'Rides Shared',
    'hero.satisfaction': 'Satisfaction',
    
    // Form
    'form.from': 'From',
    'form.to': 'To',
    'form.when': 'When',
    'form.search': 'Search',
    'form.departurePlaceholder': 'Departure city',
    'form.destinationPlaceholder': 'Destination city',
    
    // Features
    'features.title': 'Why Choose',
    'features.subtitle': 'Our platform makes carpooling simple, safe, and enjoyable for everyone.',
    'features.convenience': 'Convenient Travel',
    'features.convenienceDesc': 'Find rides to your exact destination, no more transfers or waiting at stops.',
    'features.cost': 'Cost Effective',
    'features.costDesc': 'Save money by sharing fuel costs and tolls with fellow travelers.',
    'features.community': 'Community Building',
    'features.communityDesc': 'Connect with like-minded travelers and build your own trusted network.',
    'features.safety': 'Safe & Secure',
    'features.safetyDesc': 'Verified profiles, ratings, and reviews ensure a safe experience for everyone.',
    'features.fast': 'Fast & Flexible',
    'features.fastDesc': 'Book instantly or plan ahead with our easy-to-use platform.',
    'features.time': 'Time Saving',
    'features.timeDesc': 'No rigid schedules. Travel when it suits you with our flexible options.',
    
    // How It Works
    'how.title': 'How',
    'how.subtitle': 'Follow these simple steps to start sharing rides and saving money',
    'how.step1': 'Create Your Account',
    'how.step1Desc': 'Sign up in minutes with your email or social accounts. Verify your profile to build trust with other users.',
    'how.step2': 'Find or Offer a Ride',
    'how.step2Desc': 'Search for available rides or offer your own by setting your route, date, time, and available seats.',
    'how.step3': 'Connect & Confirm',
    'how.step3Desc': 'Chat with the driver or passengers through our secure messaging system and confirm your booking.',
    'how.step4': 'Travel Together',
    'how.step4Desc': 'Meet at the agreed pick-up point, enjoy your journey, and split travel costs through our secure payment system.',
    'how.step5': 'Rate Your Experience',
    'how.step5Desc': 'After the trip, rate your experience to help build our trusted community of carpoolers.',
    'how.startJourney': 'Start Your Journey',

    // Footer
    'footer.description': 'The smart way to share rides, save money, and meet new people.',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.careers': 'Careers',
    'footer.blog': 'Blog',
    'footer.press': 'Press',
    'footer.resources': 'Resources',
    'footer.help': 'Help Center',
    'footer.safety': 'Safety Guidelines',
    'footer.rules': 'Community Rules',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.address': 'Constantine, Algeria',
    'footer.rights': 'All rights reserved.',

    // Location & Currency
    'location.constantine': 'Constantine, Algeria',
    'currency.dzd': 'DZD',
    
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
  },
  fr: {
    // Navigation
    'nav.features': 'Fonctionnalités',
    'nav.howItWorks': 'Comment ça marche',
    'nav.testimonials': 'Témoignages',
    'nav.signIn': 'Connexion',
    'nav.signUp': 'Inscription',
    
    // Hero
    'hero.tagline': 'La manière intelligente de covoiturer',
    'hero.title': 'Partagez votre trajet avec',
    'hero.description': 'Connectez-vous avec d\'autres voyageurs, économisez de l\'argent, réduisez votre empreinte carbone et faites de nouvelles rencontres en chemin.',
    'hero.findRide': 'Trouver un trajet',
    'hero.offerRide': 'Proposer un trajet',
    'hero.activeUsers': 'Utilisateurs actifs',
    'hero.ridesShared': 'Trajets partagés',
    'hero.satisfaction': 'Satisfaction',
    
    // Form
    'form.from': 'De',
    'form.to': 'À',
    'form.when': 'Quand',
    'form.search': 'Rechercher',
    'form.departurePlaceholder': 'Ville de départ',
    'form.destinationPlaceholder': 'Ville de destination',
    
    // Features
    'features.title': 'Pourquoi choisir',
    'features.subtitle': 'Notre plateforme rend le covoiturage simple, sûr et agréable pour tous.',
    'features.convenience': 'Voyage pratique',
    'features.convenienceDesc': 'Trouvez des trajets vers votre destination exacte, plus de transferts ou d\'attente aux arrêts.',
    'features.cost': 'Économique',
    'features.costDesc': 'Économisez en partageant les frais de carburant et de péage avec d\'autres voyageurs.',
    'features.community': 'Construction communautaire',
    'features.communityDesc': 'Connectez-vous avec des voyageurs partageant les mêmes idées et créez votre propre réseau de confiance.',
    'features.safety': 'Sûr et sécurisé',
    'features.safetyDesc': 'Les profils vérifiés, les évaluations et les avis garantissent une expérience sûre pour tous.',
    'features.fast': 'Rapide et flexible',
    'features.fastDesc': 'Réservez instantanément ou planifiez à l\'avance avec notre plateforme facile à utiliser.',
    'features.time': 'Gain de temps',
    'features.timeDesc': 'Pas d\'horaires rigides. Voyagez quand cela vous convient avec nos options flexibles.',
    
    // How It Works
    'how.title': 'Comment',
    'how.subtitle': 'Suivez ces étapes simples pour commencer à partager des trajets et économiser',
    'how.step1': 'Créez votre compte',
    'how.step1Desc': 'Inscrivez-vous en quelques minutes avec votre email ou comptes sociaux. Vérifiez votre profil pour établir la confiance.',
    'how.step2': 'Trouvez ou proposez un trajet',
    'how.step2Desc': 'Recherchez des trajets disponibles ou proposez le vôtre en définissant votre itinéraire, date, heure et sièges disponibles.',
    'how.step3': 'Connectez et confirmez',
    'how.step3Desc': 'Discutez avec le conducteur ou les passagers via notre système de messagerie sécurisé et confirmez votre réservation.',
    'how.step4': 'Voyagez ensemble',
    'how.step4Desc': 'Rencontrez-vous au point de ramassage convenu, profitez de votre voyage et partagez les frais via notre système de paiement sécurisé.',
    'how.step5': 'Évaluez votre expérience',
    'how.step5Desc': 'Après le trajet, évaluez votre expérience pour aider à construire notre communauté de covoitureurs de confiance.',
    'how.startJourney': 'Commencez votre voyage',

    // Footer
    'footer.description': 'La façon intelligente de partager des trajets, économiser de l\'argent et rencontrer de nouvelles personnes.',
    'footer.company': 'Entreprise',
    'footer.about': 'À propos de nous',
    'footer.careers': 'Carrières',
    'footer.blog': 'Blog',
    'footer.press': 'Presse',
    'footer.resources': 'Ressources',
    'footer.help': 'Centre d\'aide',
    'footer.safety': 'Consignes de sécurité',
    'footer.rules': 'Règles communautaires',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.contact': 'Contact',
    'footer.address': 'Constantine, Algérie',
    'footer.rights': 'Tous droits réservés.',

    // Location & Currency
    'location.constantine': 'Constantine, Algérie',
    'currency.dzd': 'DZD',
    
    // Authentication
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
    'auth.signIn': 'Se connecter',
    'auth.noAccount': 'Vous n\'avez pas de compte?',
    'auth.createAccount': 'Créer un compte',
    'auth.createDriverAccount': 'Créer un compte chauffeur',
    'auth.areYouDriver': 'Êtes-vous un chauffeur?',
    'auth.areYouPassenger': 'Êtes-vous un passager?',
    'auth.signInAsDriver': 'Se connecter en tant que chauffeur',
    'auth.signInAsPassenger': 'Se connecter en tant que passager',
    'auth.passengerSignUpDesc': 'Créez un compte passager pour commencer à réserver des trajets à Constantine',
    'auth.driverSignUpDesc': 'Créez un compte chauffeur pour commencer à proposer des trajets à Constantine',
    'auth.fullName': 'Nom complet',
    'auth.fullNamePlaceholder': 'Entrez votre nom complet',
    'auth.phone': 'Numéro de téléphone',
    'auth.phonePlaceholder': 'Entrez votre numéro de téléphone',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.confirmPasswordPlaceholder': 'Confirmez votre mot de passe',
    'auth.agreeTerms': 'J\'accepte les',
    'auth.alreadyAccount': 'Vous avez déjà un compte?',
    'auth.wantToBeDriver': 'Vous voulez être chauffeur?',
    'auth.wantToBePassenger': 'Vous voulez être passager?',
    'auth.signUp': 'S\'inscrire',
    'auth.signUpAsDriver': 'S\'inscrire en tant que chauffeur',
    'auth.signUpAsPassenger': 'S\'inscrire en tant que passager',
    'auth.carModel': 'Modèle de voiture',
    'auth.carModelPlaceholder': 'Entrez le modèle de votre voiture',
    'auth.carYear': 'Année de la voiture',
    'auth.carYearPlaceholder': 'Entrez l\'année de la voiture',
    'auth.licenseNumber': 'Numéro de permis',
    'auth.licenseNumberPlaceholder': 'Entrez votre numéro de permis',
    'auth.joinAsPassenger': 'Rejoignez en tant que passager',
    'auth.joinAsDriver': 'Rejoignez en tant que chauffeur',
    'auth.passengerBenefits': 'Trouvez des trajets abordables, voyagez confortablement et connectez-vous avec des chauffeurs de confiance à Constantine.',
    'auth.driverBenefits': 'Gagnez un revenu supplémentaire, choisissez votre horaire et rencontrez de nouvelles personnes tout en aidant à réduire le trafic à Constantine.',
    'auth.successTitle': 'Succès!',
    'auth.successSignIn': 'Vous vous êtes connecté avec succès.',
    'auth.successSignUp': 'Votre compte a été créé avec succès.',
    'auth.successDriverSignUp': 'Votre compte chauffeur a été créé avec succès.',
    'auth.errorTitle': 'Erreur',
    'auth.errorFields': 'Veuillez remplir tous les champs requis.',
    'auth.errorTerms': 'Vous devez accepter les conditions de service.',
    'auth.errorPasswordMatch': 'Les mots de passe ne correspondent pas.',
  },
  ar: {
    // Navigation
    'nav.features': 'المميزات',
    'nav.howItWorks': 'كيف يعمل',
    'nav.testimonials': 'الشهادات',
    'nav.signIn': 'تسجيل الدخول',
    'nav.signUp': 'إنشاء حساب',
    
    // Hero
    'hero.tagline': 'الطريقة الأذكى للمشاركة في الرحلات',
    'hero.title': 'شارك رحلتك مع',
    'hero.description': 'تواصل مع المسافرين الآخرين، وفر المال، قلل من بصمتك الكربونية، وكوّن صداقات جديدة على طول الطريق.',
    'hero.findRide': 'ابحث عن رحلة',
    'hero.offerRide': 'اقترح رحلة',
    'hero.activeUsers': 'مستخدم نشط',
    'hero.ridesShared': 'رحلة مشتركة',
    'hero.satisfaction': 'نسبة الرضا',
    
    // Form
    'form.from': 'من',
    'form.to': 'إلى',
    'form.when': 'متى',
    'form.search': 'بحث',
    'form.departurePlaceholder': 'مدينة المغادرة',
    'form.destinationPlaceholder': 'مدينة الوصول',
    
    // Features
    'features.title': 'لماذا تختار',
    'features.subtitle': 'منصتنا تجعل مشاركة الرحلات بسيطة وآمنة وممتعة للجميع.',
    'features.convenience': 'سفر مريح',
    'features.convenienceDesc': 'ابحث عن رحلات إلى وجهتك المحددة، بدون تحويلات أو انتظار في المحطات.',
    'features.cost': 'توفير التكاليف',
    'features.costDesc': 'وفر المال من خلال مشاركة تكاليف الوقود والرسوم مع المسافرين الآخرين.',
    'features.community': 'بناء المجتمع',
    'features.communityDesc': 'تواصل مع مسافرين يشاركونك نفس الاهتمامات وابنِ شبكتك الخاصة الموثوقة.',
    'features.safety': 'آمن ومضمون',
    'features.safetyDesc': 'الملفات الشخصية المُتحقق منها والتقييمات والمراجعات تضمن تجربة آمنة للجميع.',
    'features.fast': 'سريع ومرن',
    'features.fastDesc': 'احجز فوراً أو خطط مسبقاً باستخدام منصتنا سهلة الاستخدام.',
    'features.time': 'توفير الوقت',
    'features.timeDesc': 'لا جداول صارمة. سافر عندما يناسبك مع خياراتنا المرنة.',
    
    // How It Works
    'how.title': 'كيف يعمل',
    'how.subtitle': 'اتبع هذه الخطوات البسيطة لبدء مشاركة الرحلات وتوفير المال',
    'how.step1': 'أنشئ حسابك',
    'how.step1Desc': 'سجل في دقائق باستخدام بريدك الإلكتروني أو حسابات التواصل الاجتماعي. تحقق من ملفك الشخصي لبناء الثقة مع المستخدمين الآخرين.',
    'how.step2': 'ابحث أو اقترح رحلة',
    'how.step2Desc': 'ابحث عن الرحلات المتاحة أو اقترح رحلتك الخاصة عن طريق تحديد مسارك والتاريخ والوقت والمقاعد المتاحة.',
    'how.step3': 'تواصل وأكد',
    'how.step3Desc': 'تحدث مع السائق أو الركاب من خلال نظام المراسلة الآمن لدينا وأكد حجزك.',
    'how.step4': 'سافر معاً',
    'how.step4Desc': 'التقِ في نقطة الالتقاء المتفق عليها، استمتع برحلتك، وشارك تكاليف السفر من خلال نظام الدفع الآمن لدينا.',
    'how.step5': 'قيّم تجربتك',
    'how.step5Desc': 'بعد الرحلة، قيّم تجربتك للمساعدة في بناء مجتمع موثوق من مشاركي الرحلات.',
    'how.startJourney': 'ابدأ رحلتك',

    // Footer
    'footer.description': 'الطريقة الذكية لمشاركة الرحلات وتوفير المال ومقابلة أشخاص جدد.',
    'footer.company': 'الشركة',
    'footer.about': 'من نحن',
    'footer.careers': 'وظائف',
    'footer.blog': 'المدونة',
    'footer.press': 'الصحافة',
    'footer.resources': 'الموارد',
    'footer.help': 'مركز المساعدة',
    'footer.safety': 'إرشادات السلامة',
    'footer.rules': 'قواعد المجتمع',
    'footer.terms': 'شروط الخدمة',
    'footer.contact': 'اتصل بنا',
    'footer.address': 'قسنطينة، الجزائر',
    'footer.rights': 'جميع الحقوق محفوظة.',

    // Location & Currency
    'location.constantine': 'قسنطينة، الجزائر',
    'currency.dzd': 'د.ج',
    
    // Authentication
    'auth.welcomeBack': 'مرحبًا بعودتك',
    'auth.welcomeBackDriver': 'مرحبًا بعودتك أيها السائق',
    'auth.passengerSignInDesc': 'سجل دخول إلى حساب الراكب الخاص بك لحجز رحلات في قسنطينة',
    'auth.driverSignInDesc': 'سجل دخول إلى حساب السائق الخاص بك لتقديم رحلات في قسنطينة',
    'auth.email': 'البريد الإلكتروني',
    'auth.emailPlaceholder': 'أدخل بريدك الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.passwordPlaceholder': 'أدخل كلمة المرور الخاصة بك',
    'auth.rememberMe': 'تذكرني',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.signIn': 'تسجيل الدخول',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.createAccount': 'إنشاء حساب',
    'auth.createDriverAccount': 'إنشاء حساب سائق',
    'auth.areYouDriver': 'هل أنت سائق؟',
    'auth.areYouPassenger': 'هل أنت راكب؟',
    'auth.signInAsDriver': 'تسجيل الدخول كسائق',
    'auth.signInAsPassenger': 'تسجيل الدخول كراكب',
    'auth.passengerSignUpDesc': 'أنشئ حساب راكب للبدء في حجز الرحلات في قسنطينة',
    'auth.driverSignUpDesc': 'أنشئ حساب سائق للبدء في تقديم الرحلات في قسنطينة',
    'auth.fullName': 'الاسم الكامل',
    'auth.fullNamePlaceholder': 'أدخل اسمك الكامل',
    'auth.phone': 'رقم الهاتف',
    'auth.phonePlaceholder': 'أدخل رقم هاتفك',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.confirmPasswordPlaceholder': 'تأكيد كلمة المرور الخاصة بك',
    'auth.agreeTerms': 'أوافق على',
    'auth.alreadyAccount': 'لديك حساب بالفعل؟',
    'auth.wantToBeDriver': 'هل تريد أن تكون سائقًا؟',
    'auth.wantToBePassenger': 'هل تريد أن تكون راكبًا؟',
    'auth.signUp': 'إنشاء حساب',
    'auth.signUpAsDriver': 'التسجيل كسائق',
    'auth.signUpAsPassenger': 'التسجيل كراكب',
    'auth.carModel': 'طراز السيارة',
    'auth.carModelPlaceholder': 'أدخل طراز سيارتك',
    'auth.carYear': 'سنة السيارة',
    'auth.carYearPlaceholder': 'أدخل سنة السيارة',
    'auth.licenseNumber': 'رقم رخصة القيادة',
    'auth.licenseNumberPlaceholder': 'أدخل رقم رخصة القيادة الخاصة بك',
    'auth.joinAsPassenger': 'انضم كراكب',
    'auth.joinAsDriver': 'انضم كسائق',
    'auth.passengerBenefits': 'ابحث عن رحلات بأسعار معقولة، وسافر براحة وتواصل مع سائقين موثوقين في قسنطينة.',
    'auth.driverBenefits': 'اكسب دخلاً إضافيًا، واختر جدولك الزمني، وقابل أشخاصًا جددًا مع المساعدة في تقليل حركة المرور في قسنطينة.',
    'auth.successTitle': 'تم بنجاح!',
    'auth.successSignIn': 'لقد قمت بتسجيل الدخول بنجاح.',
    'auth.successSignUp': 'تم إنشاء حسابك بنجاح.',
    'auth.successDriverSignUp': 'تم إنشاء حساب السائق الخاص بك بنجاح.',
    'auth.errorTitle': 'خطأ',
    'auth.errorFields': 'يرجى ملء جميع الحقول المطلوبة.',
    'auth.errorTerms': 'يجب أن توافق على شروط الخدمة.',
    'auth.errorPasswordMatch': 'كلمات المرور غير متطابقة.',
  }
};

const defaultLanguage: Language = 'en';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || defaultLanguage;
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Set direction for RTL support (Arabic)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Add language class to document for language-specific styles
    document.documentElement.lang = language;
    document.documentElement.classList.remove('en', 'fr', 'ar');
    document.documentElement.classList.add(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
