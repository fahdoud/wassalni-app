
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GradientText from "@/components/ui-components/GradientText";
import Logo from "@/components/ui-components/Logo";
import RoleSwitcher from "@/components/ui-components/RoleSwitcher";

const PassengerSignIn = () => {
  const { t } = useLanguage();
  const { signIn, user, loading, profile } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in as a passenger
  if (user && profile?.role === 'passenger') {
    return <Navigate to="/rides" />;
  }

  // Redirect if logged in as a driver
  if (user && profile?.role === 'driver') {
    return <Navigate to="/offer-ride" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorFields'),
      });
      return;
    }
    
    try {
      await signIn(email, password);
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
          <div className="w-full max-w-md">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Logo size="sm" />
              <h1 className="text-2xl font-bold tracking-tight">
                <GradientText>Wassalni</GradientText>
              </h1>
            </Link>
            
            <RoleSwitcher 
              currentRole="passenger" 
              passengerLink="/passenger-signin" 
              driverLink="/driver-signin" 
            />
            
            <h2 className="text-3xl font-bold mb-2">{t('auth.welcomeBack')}</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-300">
              {t('auth.passengerSignInDesc')}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('auth.email')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('auth.password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={t('auth.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-wassalni-green focus:ring-wassalni-green border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    {t('auth.rememberMe')}
                  </label>
                </div>
                
                <a href="#" className="text-sm text-wassalni-green hover:text-wassalni-lightGreen dark:text-wassalni-lightGreen">
                  {t('auth.forgotPassword')}
                </a>
              </div>
              
              <Button type="submit" className="w-full mt-2" isLoading={loading}>
                {t('auth.signIn')}
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('auth.noAccount')}{' '}
                  <Link to="/passenger-signup" className="text-wassalni-green hover:text-wassalni-lightGreen dark:text-wassalni-lightGreen">
                    {t('auth.createAccount')}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right Side - Image */}
        <div className="hidden md:w-1/2 md:flex bg-gradient-primary relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-wassalni-dark p-16">
            <Logo size="lg" />
            <h2 className="text-3xl font-bold mt-8 mb-4 text-center">{t('auth.joinAsPassenger')}</h2>
            <p className="text-center max-w-md">
              {t('auth.passengerBenefits')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerSignIn;
