
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

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
    'form.selectLocation': 'Select location',
    'form.date': 'Date',

    // Features Section
    'features.title': 'Why Choose',
    'features.subtitle': 'Discover the benefits of using our ride-sharing platform in Constantine',
    'features.convenience': 'Convenience',
    'features.convenienceDesc': 'Easy booking and scheduling for your daily commute',
    'features.cost': 'Cost-Effective',
    'features.costDesc': 'Save money on transportation with affordable shared rides',
    'features.community': 'Community',
    'features.communityDesc': 'Connect with people in your neighborhood going the same way',
    'features.safety': 'Safety',
    'features.safetyDesc': 'Verified drivers and passengers for peace of mind',
    'features.fast': 'Fast & Reliable',
    'features.fastDesc': 'Get to your destination on time, every time',
    'features.time': 'Time-Saving',
    'features.timeDesc': 'Spend less time waiting and more time living',

    // How It Works Section
    'how.title': 'How',
    'how.subtitle': 'Follow these simple steps to get started with Wassalni',
    'how.step1': 'Create an Account',
    'how.step1Desc': 'Sign up as a passenger or driver in just a few clicks',
    'how.step2': 'Set Your Route',
    'how.step2Desc': 'Enter your departure, destination and preferred time',
    'how.step3': 'Find or Offer a Ride',
    'how.step3Desc': 'Browse available rides or offer your own if you\'re driving',
    'how.step4': 'Connect and Confirm',
    'how.step4Desc': 'Communicate with your match and confirm details',
    'how.step5': 'Enjoy Your Ride',
    'how.step5Desc': 'Meet at the pickup point and enjoy your journey',
    'how.startJourney': 'Start Your Journey',
    
    // Location
    'location.constantine': 'Constantine, Algeria',
    
    // Rides Page
    'rides.title': 'Available Rides',
    'rides.subtitle': 'Find and book rides in Constantine and surrounding areas',
    'rides.seat': 'seat',
    'rides.seats': 'seats',
    'rides.reserve': 'Reserve',
    
    // Footer
    'footer.description': 'Wassalni is a ride-sharing platform connecting passengers and drivers in Constantine, making transportation more accessible, affordable, and efficient.',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.careers': 'Careers',
    'footer.blog': 'Blog',
    'footer.press': 'Press',
    'footer.resources': 'Resources',
    'footer.help': 'Help Center',
    'footer.safety': 'Safety',
    'footer.rules': 'Community Rules',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.address': 'Constantine, Algeria',
    'footer.rights': 'All rights reserved.',
    
    // Feedback
    'feedback.title': 'We Value Your Feedback',
    'feedback.subtitle': 'Help us improve your experience by sharing your thoughts, suggestions, or issues',
    'feedback.generalFeedback': 'General Feedback',
    'feedback.suggestion': 'Suggestion',
    'feedback.rating': 'Rate Experience',
    'feedback.name': 'Your Name',
    'feedback.email': 'Your Email',
    'feedback.yourFeedback': 'Your Feedback',
    'feedback.rateExperience': 'Rate your overall experience',
    'feedback.submit': 'Submit Feedback',
    'feedback.otherWaysTitle': 'Other Ways to Reach Us',
    'feedback.emailUs': 'Email Us',
    'feedback.emailDescription': 'Send us a detailed message and we\'ll get back to you soon',
    'feedback.socialMedia': 'Social Media',
    'feedback.socialDescription': 'Reach out to us on any of our social media channels',
    'feedback.successTitle': 'Thank You!',
    'feedback.successDescription': 'Your feedback has been submitted successfully. We appreciate your input!',

    // Authentication (already exists in the translations)
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

    // Profile
    'profile.passengerProfile': 'Passenger Profile',
    'profile.driverProfile': 'Driver Profile',
    
    // Reservation
    'reservation.title': 'Ride Reservation',
    'reservation.details': 'Ride Details',
    'reservation.passenger': 'Passenger Details',
    'reservation.payment': 'Payment Details',
    'reservation.driver': 'Driver',
    'reservation.from': 'From',
    'reservation.to': 'To',
    'reservation.date': 'Date',
    'reservation.time': 'Time',
    'reservation.price': 'Price',
    'reservation.seats': 'Available Seats',
    'reservation.bookSeats': 'Number of Seats to Book',
    'reservation.totalPrice': 'Total Price',
    'reservation.name': 'Full Name',
    'reservation.phone': 'Phone Number',
    'reservation.notes': 'Special Notes',
    'reservation.notesPlaceholder': 'Any information the driver should know',
    'reservation.paymentMethod': 'Payment Method',
    'reservation.cash': 'Cash on Pickup',
    'reservation.mobile': 'Mobile Payment',
    'reservation.terms': 'I agree to the terms and conditions',
    'reservation.confirmBooking': 'Confirm Booking',
    'reservation.contactDriver': 'Contact Driver',
    'reservation.successTitle': 'Booking Successful!',
    'reservation.successMessage': 'Your ride has been booked successfully. The driver will be notified.',
    'reservation.errorTitle': 'Booking Error',
    'reservation.errorMessage': 'There was an error processing your booking. Please try again.'
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
    'form.selectLocation': 'Sélectionnez un lieu',
    'form.date': 'Date',

    // Features Section
    'features.title': 'Pourquoi Choisir',
    'features.subtitle': 'Découvrez les avantages d\'utiliser notre plateforme de covoiturage à Constantine',
    'features.convenience': 'Commodité',
    'features.convenienceDesc': 'Réservation et planification faciles pour vos déplacements quotidiens',
    'features.cost': 'Économique',
    'features.costDesc': 'Économisez sur les transports avec des trajets partagés abordables',
    'features.community': 'Communauté',
    'features.communityDesc': 'Connectez-vous avec des personnes de votre quartier allant dans la même direction',
    'features.safety': 'Sécurité',
    'features.safetyDesc': 'Conducteurs et passagers vérifiés pour votre tranquillité d\'esprit',
    'features.fast': 'Rapide et Fiable',
    'features.fastDesc': 'Arrivez à destination à l\'heure, à chaque fois',
    'features.time': 'Gain de Temps',
    'features.timeDesc': 'Passez moins de temps à attendre et plus de temps à vivre',

    // How It Works Section
    'how.title': 'Comment',
    'how.subtitle': 'Suivez ces étapes simples pour commencer avec Wassalni',
    'how.step1': 'Créer un Compte',
    'how.step1Desc': 'Inscrivez-vous en tant que passager ou conducteur en quelques clics',
    'how.step2': 'Définir Votre Itinéraire',
    'how.step2Desc': 'Entrez votre départ, destination et heure préférée',
    'how.step3': 'Trouver ou Proposer un Trajet',
    'how.step3Desc': 'Parcourez les trajets disponibles ou proposez le vôtre si vous conduisez',
    'how.step4': 'Connecter et Confirmer',
    'how.step4Desc': 'Communiquez avec votre correspondant et confirmez les détails',
    'how.step5': 'Profitez de Votre Trajet',
    'how.step5Desc': 'Rencontrez-vous au point de ramassage et profitez de votre voyage',
    'how.startJourney': 'Commencez Votre Voyage',
    
    // Location
    'location.constantine': 'Constantine, Algérie',
    
    // Rides Page
    'rides.title': 'Trajets Disponibles',
    'rides.subtitle': 'Trouvez et réservez des trajets à Constantine et dans les environs',
    'rides.seat': 'siège',
    'rides.seats': 'sièges',
    'rides.reserve': 'Réserver',
    
    // Footer
    'footer.description': 'Wassalni est une plateforme de covoiturage reliant passagers et conducteurs à Constantine, rendant le transport plus accessible, abordable et efficace.',
    'footer.company': 'Entreprise',
    'footer.about': 'À Propos de Nous',
    'footer.careers': 'Carrières',
    'footer.blog': 'Blog',
    'footer.press': 'Presse',
    'footer.resources': 'Ressources',
    'footer.help': 'Centre d\'Aide',
    'footer.safety': 'Sécurité',
    'footer.rules': 'Règles Communautaires',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.contact': 'Contact',
    'footer.address': 'Constantine, Algérie',
    'footer.rights': 'Tous droits réservés.',
    
    // Feedback
    'feedback.title': 'Nous Valorisons Vos Commentaires',
    'feedback.subtitle': 'Aidez-nous à améliorer votre expérience en partageant vos pensées, suggestions ou problèmes',
    'feedback.generalFeedback': 'Commentaire Général',
    'feedback.suggestion': 'Suggestion',
    'feedback.rating': 'Évaluer l\'Expérience',
    'feedback.name': 'Votre Nom',
    'feedback.email': 'Votre Email',
    'feedback.yourFeedback': 'Vos Commentaires',
    'feedback.rateExperience': 'Évaluez votre expérience globale',
    'feedback.submit': 'Soumettre',
    'feedback.otherWaysTitle': 'Autres Façons de Nous Contacter',
    'feedback.emailUs': 'Envoyez-nous un Email',
    'feedback.emailDescription': 'Envoyez-nous un message détaillé et nous vous répondrons bientôt',
    'feedback.socialMedia': 'Réseaux Sociaux',
    'feedback.socialDescription': 'Contactez-nous sur n\'importe lequel de nos canaux de médias sociaux',
    'feedback.successTitle': 'Merci!',
    'feedback.successDescription': 'Vos commentaires ont été soumis avec succès. Nous apprécions votre contribution!',

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

    // Profile
    'profile.passengerProfile': 'Profil Passager',
    'profile.driverProfile': 'Profil Conducteur',
    
    // Reservation
    'reservation.title': 'Réservation de Trajet',
    'reservation.details': 'Détails du Trajet',
    'reservation.passenger': 'Détails du Passager',
    'reservation.payment': 'Détails du Paiement',
    'reservation.driver': 'Conducteur',
    'reservation.from': 'De',
    'reservation.to': 'À',
    'reservation.date': 'Date',
    'reservation.time': 'Heure',
    'reservation.price': 'Prix',
    'reservation.seats': 'Sièges Disponibles',
    'reservation.bookSeats': 'Nombre de Sièges à Réserver',
    'reservation.totalPrice': 'Prix Total',
    'reservation.name': 'Nom Complet',
    'reservation.phone': 'Numéro de Téléphone',
    'reservation.notes': 'Notes Spéciales',
    'reservation.notesPlaceholder': 'Toute information que le conducteur devrait savoir',
    'reservation.paymentMethod': 'Méthode de Paiement',
    'reservation.cash': 'Espèces au Ramassage',
    'reservation.mobile': 'Paiement Mobile',
    'reservation.terms': 'J\'accepte les termes et conditions',
    'reservation.confirmBooking': 'Confirmer la Réservation',
    'reservation.contactDriver': 'Contacter le Conducteur',
    'reservation.successTitle': 'Réservation Réussie!',
    'reservation.successMessage': 'Votre trajet a été réservé avec succès. Le conducteur sera notifié.',
    'reservation.errorTitle': 'Erreur de Réservation',
    'reservation.errorMessage': 'Une erreur s\'est produite lors du traitement de votre réservation. Veuillez réessayer.'
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
    'form.selectLocation': 'اختر موقعا',
    'form.date': 'تاريخ',

    // Features Section
    'features.title': 'لماذا تختار',
    'features.subtitle': 'اكتشف مزايا استخدام منصتنا لمشاركة الركوب في قسنطينة',
    'features.convenience': 'الراحة',
    'features.convenienceDesc': 'حجز وجدولة سهلة لتنقلاتك اليومية',
    'features.cost': 'فعالة من حيث التكلفة',
    'features.costDesc': 'وفر المال على وسائل النقل مع رحلات مشتركة بأسعار معقولة',
    'features.community': 'المجتمع',
    'features.communityDesc': 'تواصل مع الأشخاص في حيك الذين يسلكون نفس الطريق',
    'features.safety': 'الأمان',
    'features.safetyDesc': 'سائقون وركاب تم التحقق منهم لراحة بالك',
    'features.fast': 'سريع وموثوق',
    'features.fastDesc': 'الوصول إلى وجهتك في الوقت المحدد، في كل مرة',
    'features.time': 'توفير الوقت',
    'features.timeDesc': 'اقضِ وقتًا أقل في الانتظار ووقتًا أكثر في الحياة',

    // How It Works Section
    'how.title': 'كيف',
    'how.subtitle': 'اتبع هذه الخطوات البسيطة للبدء مع وصلني',
    'how.step1': 'إنشاء حساب',
    'how.step1Desc': 'سجل كراكب أو سائق في بضع نقرات فقط',
    'how.step2': 'حدد مسارك',
    'how.step2Desc': 'أدخل نقطة انطلاقك ووجهتك والوقت المفضل لديك',
    'how.step3': 'ابحث عن رحلة أو اعرض رحلة',
    'how.step3Desc': 'تصفح الرحلات المتاحة أو اعرض رحلتك الخاصة إذا كنت تقود',
    'how.step4': 'التواصل والتأكيد',
    'how.step4Desc': 'تواصل مع الطرف المقابل وأكد التفاصيل',
    'how.step5': 'استمتع برحلتك',
    'how.step5Desc': 'التقيا في نقطة الالتقاط واستمتع برحلتك',
    'how.startJourney': 'ابدأ رحلتك',
    
    // Location
    'location.constantine': 'قسنطينة، الجزائر',
    
    // Rides Page
    'rides.title': 'الرحلات المتاحة',
    'rides.subtitle': 'ابحث واحجز رحلات في قسنطينة والمناطق المحيطة بها',
    'rides.seat': 'مقعد',
    'rides.seats': 'مقاعد',
    'rides.reserve': 'حجز',
    
    // Footer
    'footer.description': 'وصلني هي منصة لمشاركة الركوب تربط الركاب والسائقين في قسنطينة، مما يجعل النقل أكثر سهولة وبأسعار معقولة وكفاءة.',
    'footer.company': 'الشركة',
    'footer.about': 'عنا',
    'footer.careers': 'وظائف',
    'footer.blog': 'مدونة',
    'footer.press': 'صحافة',
    'footer.resources': 'موارد',
    'footer.help': 'مركز المساعدة',
    'footer.safety': 'الأمان',
    'footer.rules': 'قواعد المجتمع',
    'footer.terms': 'شروط الخدمة',
    'footer.contact': 'اتصل بنا',
    'footer.address': 'قسنطينة، الجزائر',
    'footer.rights': 'جميع الحقوق محفوظة.',
    
    // Feedback
    'feedback.title': 'نحن نقدر ملاحظاتك',
    'feedback.subtitle': 'ساعدنا على تحسين تجربتك من خلال مشاركة أفكارك أو اقتراحاتك أو مشاكلك',
    'feedback.generalFeedback': 'ملاحظات عامة',
    'feedback.suggestion': 'اقتراح',
    'feedback.rating': 'قيّم التجربة',
    'feedback.name': 'اسمك',
    'feedback.email': 'بريدك الإلكتروني',
    'feedback.yourFeedback': 'ملاحظاتك',
    'feedback.rateExperience': 'قيّم تجربتك الإجمالية',
    'feedback.submit': 'إرسال',
    'feedback.otherWaysTitle': 'طرق أخرى للتواصل معنا',
    'feedback.emailUs': 'راسلنا عبر البريد الإلكتروني',
    'feedback.emailDescription': 'أرسل لنا رسالة مفصلة وسنرد عليك قريبًا',
    'feedback.socialMedia': 'وسائل التواصل الاجتماعي',
    'feedback.socialDescription': 'تواصل معنا عبر أي من قنوات التواصل الاجتماعي الخاصة بنا',
    'feedback.successTitle': 'شكرا لك!',
    'feedback.successDescription': 'تم إرسال ملاحظاتك بنجاح. نقدر مساهمتك!',

    // Authentication
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

    // Profile
    'profile.passengerProfile': 'ملف الراكب الشخصي',
    'profile.driverProfile': 'ملف السائق الشخصي',
    
    // Reservation
    'reservation.title': 'حجز رحلة',
    'reservation.details': 'تفاصيل الرحلة',
    'reservation.passenger': 'تفاصيل الراكب',
    'reservation.payment': 'تفاصيل الدفع',
    'reservation.driver': 'السائق',
    'reservation.from': 'من',
    'reservation.to': 'إلى',
    'reservation.date': 'التاريخ',
    'reservation.time': 'الوقت',
    'reservation.price': 'السعر',
    'reservation.seats': 'المقاعد المتاحة',
    'reservation.bookSeats': 'عدد المقاعد للحجز',
    'reservation.totalPrice': 'السعر الإجمالي',
    'reservation.name': 'الاسم الكامل',
    'reservation.phone': 'رقم الهاتف',
    'reservation.notes': 'ملاحظات خاصة',
    'reservation.notesPlaceholder': 'أي معلومات يجب أن يعرفها السائق',
    'reservation.paymentMethod': 'طريقة الدفع',
    'reservation.cash': 'نقدًا عند الالتقاط',
    'reservation.mobile': 'دفع بالهاتف المحمول',
    'reservation.terms': 'أوافق على الشروط والأحكام',
    'reservation.confirmBooking': 'تأكيد الحجز',
    'reservation.contactDriver': 'الاتصال بالسائق',
    'reservation.successTitle': 'تم الحجز بنجاح!',
    'reservation.successMessage': 'تم حجز رحلتك بنجاح. سيتم إخطار السائق.',
    'reservation.errorTitle': 'خطأ في الحجز',
    'reservation.errorMessage': 'حدث خطأ أثناء معالجة حجزك. يرجى المحاولة مرة أخرى.'
  }
};

const defaultLanguage: string = 'fr';

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>(() => {
    // Try to get the language from localStorage or use default
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || defaultLanguage;
  });

  // Determine the text direction based on the selected language
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Effect to save the language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update the document direction
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  // Translate function
  const t = (key: string): string => {
    const selectedLanguage = language as keyof typeof translations;
    const translationObject = translations[selectedLanguage] || translations.en;
    return translationObject[key as keyof typeof translationObject] || key;
  };

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      dir,
    }),
    [language, dir]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
