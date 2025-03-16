
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

const DriverSignIn = () => {
  const { t } = useLanguage();
  const { signIn, signInWithGoogle, user, loading, profile } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in as a driver
  if (user && profile?.role === 'driver') {
    return <Navigate to="/offer-ride" />;
  }

  // Redirect if logged in as a passenger
  if (user && profile?.role === 'passenger') {
    return <Navigate to="/rides" />;
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error handling is done in the AuthContext
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row-reverse">
        {/* Left Side - Image for driver */}
        <div className="hidden md:w-1/2 md:flex bg-gradient-primary relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-wassalni-dark p-16">
            <Logo size="lg" />
            <h2 className="text-3xl font-bold mt-8 mb-4 text-center">{t('auth.joinAsDriver')}</h2>
            <p className="text-center max-w-md">
              {t('auth.driverBenefits')}
            </p>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
          <div className="w-full max-w-md">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Logo size="sm" />
              <h1 className="text-2xl font-bold tracking-tight">
                <GradientText>Wassalni</GradientText>
              </h1>
            </Link>
            
            <RoleSwitcher 
              currentRole="driver" 
              passengerLink="/passenger-signin" 
              driverLink="/driver-signin" 
            />
            
            <h2 className="text-3xl font-bold mb-2">{t('auth.welcomeBackDriver')}</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-300">
              {t('auth.driverSignInDesc')}
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

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {t('auth.orContinueWith')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <g transform="translate(0.000000,20.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                    <path
                      fill="#4285F4"
                      d="M142.9 24.2C97.2 39.9 59 73.5 37.5 116.5 17.1 155.9 8.7 198.5 8.5 242.7c0 148.5 112.6 275.1 258.7 295.3 45.6 5.9 91.7 1.6 136.5-12.1 43.7-13.8 83.9-37.6 116.5-69.5 31.2-30.4 54.3-66.3 69.5-105.4 16.2-41.6 22.8-86.3 19.5-130.1-2.8-39.8-14.8-79-35-113.2-9.5-15.8-21.3-30.2-34.3-43.3-12.7-12.6-27.1-23.6-42.3-33.3-39.3-25.1-84.9-39.2-131.2-41.5-44.5-2.5-89.5 5.8-131.4 24.1zm10.7 36.1c72.3-32.9 158.1-19.4 217.1 33.9 17.7 15.9 32.3 34.7 43.1 55.7 29.2 56.9 26 126.5-8.4 181C381.1 385 322.2 415.7 260 412c-8.5 0-17-0.6-25.5-1.9-63.8-9.2-119.3-52.6-142.3-114.7-9.8-26.6-13.2-55.3-9.9-83.5 3-28.3 12.5-55.5 27.6-79.5 27.1-43.1 71.5-71.8 121.9-81.9 7-1.4 14.2-2.2 21.3-2.6l0.4 0.4z"
                    />
                    <path
                      fill="#EA4335"
                      d="M415.4 273.5c-2.4-32.6-22.6-62.2-51.7-76.3l-34.7 34.7 14 9.3C348.5 245 352 251 353.3 257.7c1.3 6.6 0.7 13.5-1.9 19.7l-0.5 1.1c-4.5 13-15.1 22.9-28.5 26.7l-2.7 0.8c-3.7 1-7.5 1.5-11.3 1.5-7.7 0-15.3-2-22-5.8-1.4-0.8-2.7-1.7-4-2.6l33.6-33.6-50.4-30.2-39.8 39.8 0.5 0.5C239.9 287.9 257.1 294 275 294c7.8 0 15.6-1.2 23.1-3.4l0.8-0.2c29.2-8.9 51.1-31.7 58.9-61.2l0.9-3.4 0.3-1.1z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M189.2 401.5c42.2 15 89.3 12.8 129.7-6.3 4.3-2 8.4-4.3 12.5-6.7 2.2-1.3 4.3-2.7 6.3-4.1 1-0.7 2-1.5 3-2.2l-38.9-38.9-115.6 55.8 3.1 2.5 0 0z"
                    />
                    <path
                      fill="#34A853"
                      d="M348.8 442.3c69.9-45.8 101.8-131.8 77.4-213-1.7-5.7-3.7-11.3-6-16.7-2.5-5.8-5.3-11.4-8.5-16.9-2.5-4.3-5.3-8.5-8.3-12.5L277.7 308.8l-36.1 36.1 77.7 77.7 2.4-1.6c9.4-6.2 18.1-13.4 26-21.4l1-0.9 0.2-0.2z"
                    />
                  </g>
                </svg>
                <span>Google</span>
              </button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('auth.noAccount')}{' '}
                  <Link to="/driver-signup" className="text-wassalni-green hover:text-wassalni-lightGreen dark:text-wassalni-lightGreen">
                    {t('auth.createDriverAccount')}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverSignIn;
