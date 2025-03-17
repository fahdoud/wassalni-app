
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import { Mail, Lock, User, Eye, EyeOff, Phone, Car, Calendar, FileImage, Camera, IdCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GradientText from "@/components/ui-components/GradientText";
import Logo from "@/components/ui-components/Logo";
import RoleSwitcher from "@/components/ui-components/RoleSwitcher";

const DriverSignUp = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [vehiclePhotoPreview, setVehiclePhotoPreview] = useState<string | null>(null);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleVehiclePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVehiclePhoto(file);
      setVehiclePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorTerms'),
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorPasswordMatch'),
      });
      return;
    }

    if (!profilePhoto) {
      toast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorProfilePhoto'),
      });
      return;
    }

    if (!vehiclePhoto) {
      toast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorVehiclePhoto'),
      });
      return;
    }
    
    // This would connect to registration in a real app
    if (fullName && email && phone && carModel && carYear && licenseNumber && registrationNumber && password) {
      toast({
        title: t('auth.successTitle'),
        description: t('auth.successDriverSignUp'),
      });
    } else {
      toast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorFields'),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row-reverse">
        {/* Left Side - Image for driver */}
        <div className="hidden md:w-2/5 md:flex bg-gradient-primary relative">
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
        <div className="w-full md:w-3/5 flex flex-col justify-center items-center p-8 md:p-16 overflow-y-auto">
          <div className="w-full max-w-xl">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Logo size="sm" />
              <h1 className="text-2xl font-bold tracking-tight">
                <GradientText>Wassalni</GradientText>
              </h1>
            </Link>
            
            <RoleSwitcher 
              currentRole="driver" 
              passengerLink="/passenger-signup" 
              driverLink="/driver-signup" 
            />
            
            <h2 className="text-3xl font-bold mb-2">{t('auth.createDriverAccount')}</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-300">
              {t('auth.driverSignUpDesc')}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col md:flex-row gap-6 items-start">
                  {/* Profile Photo Upload */}
                  <div className="space-y-2 w-full md:w-1/2">
                    <label className="text-sm font-medium">{t('auth.profilePhoto')}</label>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-40 h-40 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-wassalni-green">
                        {profilePhotoPreview ? (
                          <img src={profilePhotoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera size={32} className="text-gray-400" />
                        )}
                      </div>
                      <label className="cursor-pointer w-full">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleProfilePhotoChange}
                        />
                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-wassalni-green text-white rounded-lg w-full">
                          <FileImage size={16} />
                          <span>{t('auth.uploadProfilePhoto')}</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Vehicle Photo Upload */}
                  <div className="space-y-2 w-full md:w-1/2">
                    <label className="text-sm font-medium">{t('auth.vehiclePhoto')}</label>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-40 h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden border-2 border-wassalni-green">
                        {vehiclePhotoPreview ? (
                          <img src={vehiclePhotoPreview} alt="Vehicle Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Car size={32} className="text-gray-400" />
                        )}
                      </div>
                      <label className="cursor-pointer w-full">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleVehiclePhotoChange}
                        />
                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-wassalni-green text-white rounded-lg w-full">
                          <FileImage size={16} />
                          <span>{t('auth.uploadVehiclePhoto')}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.fullName')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('auth.fullNamePlaceholder')}
                    />
                  </div>
                </div>
                
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
                  <label className="text-sm font-medium">{t('auth.phone')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('auth.phonePlaceholder')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.carModel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('auth.carModelPlaceholder')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.carYear')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={carYear}
                      onChange={(e) => setCarYear(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('auth.carYearPlaceholder')}
                      min="1990"
                      max={new Date().getFullYear().toString()}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.registrationNumber')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdCard size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('auth.registrationNumberPlaceholder')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.licenseNumber')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IdCard size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('auth.licenseNumberPlaceholder')}
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.confirmPassword')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input 
                  id="agree-terms" 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-wassalni-green focus:ring-wassalni-green border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('auth.agreeTerms')} <a href="#" className="text-wassalni-green hover:text-wassalni-lightGreen">Terms of Service</a>
                </label>
              </div>
              
              <Button type="submit" className="w-full mt-4">
                {t('auth.signUp')}
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('auth.alreadyAccount')}{' '}
                  <Link to="/driver-signin" className="text-wassalni-green hover:text-wassalni-lightGreen dark:text-wassalni-lightGreen">
                    {t('auth.signIn')}
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

export default DriverSignUp;
