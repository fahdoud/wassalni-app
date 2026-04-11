import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import { Mail, Lock, User, Eye, EyeOff, Phone, Car, Calendar, FileImage, Camera, IdCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GradientText from "@/components/ui-components/GradientText";
import Logo from "@/components/ui-components/Logo";
import RoleSwitcher from "@/components/ui-components/RoleSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LanguageSwitcher from "@/components/ui-components/LanguageSwitcher";

const DriverSignUp = () => {
  const { t } = useLanguage();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!agreeTerms) {
      uiToast({ variant: "destructive", title: t('auth.errorTitle'), description: t('auth.errorTerms') });
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      uiToast({ variant: "destructive", title: t('auth.errorTitle'), description: t('auth.errorPasswordMatch') });
      setIsLoading(false);
      return;
    }
    
    if (!fullName || !email || !phone || !carModel || !carYear || !licenseNumber || !registrationNumber || !password) {
      uiToast({ variant: "destructive", title: t('auth.errorTitle'), description: t('auth.errorFields') });
      setIsLoading(false);
      return;
    }
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: 'driver',
            car_model: carModel,
            car_year: carYear,
            license_number: licenseNumber,
            registration_number: registrationNumber
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (authError) throw authError;
      
      if (authData?.user) {
        const userId = authData.user.id;

        // Create driver record
        await supabase.from('drivers').insert({
          user_id: userId,
          numero_permis: licenseNumber,
        });

        // Create vehicle record
        await supabase.from('vehicles').insert({
          driver_id: userId,
          marque: carModel,
          immatriculation: registrationNumber,
        });
      }
      
      toast.success(t('auth.successDriverSignUp') || 'Account created! Please verify your email.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || t('auth.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>
      <div className="flex-1 flex flex-col md:flex-row-reverse">
        <div className="hidden md:w-2/5 md:flex bg-gradient-primary relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-foreground p-16">
            <Logo size="lg" />
            <h2 className="text-3xl font-bold mt-8 mb-4 text-center">{t('auth.joinAsDriver')}</h2>
            <p className="text-center max-w-md">{t('auth.driverBenefits')}</p>
          </div>
        </div>
        
        <div className="w-full md:w-3/5 flex flex-col justify-center items-center p-8 md:p-16 overflow-y-auto">
          <div className="w-full max-w-xl">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Logo size="sm" />
              <h1 className="text-2xl font-bold tracking-tight"><GradientText>Wasslink</GradientText></h1>
            </Link>
            
            <RoleSwitcher currentRole="driver" passengerLink="/passenger-signup" driverLink="/driver-signup" />
            
            <h2 className="text-3xl font-bold mb-2">{t('auth.createDriverAccount')}</h2>
            <p className="text-muted-foreground mb-8">{t('auth.driverSignUpDesc')}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col md:flex-row gap-6 items-start">
                  <div className="space-y-2 w-full md:w-1/2">
                    <label className="text-sm font-medium">{t('auth.profilePhoto')}</label>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-40 h-40 bg-muted rounded-full flex items-center justify-center overflow-hidden border-2 border-primary">
                        {profilePhotoPreview ? (
                          <img src={profilePhotoPreview} alt={t('auth.profilePreview')} className="w-full h-full object-cover" />
                        ) : (
                          <Camera size={32} className="text-muted-foreground" />
                        )}
                      </div>
                      <label className="cursor-pointer w-full">
                        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg w-full">
                          <FileImage size={16} />
                          <span>{t('auth.uploadProfilePhoto')}</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 w-full md:w-1/2">
                    <label className="text-sm font-medium">{t('auth.vehiclePhoto')}</label>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-40 h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden border-2 border-primary">
                        {vehiclePhotoPreview ? (
                          <img src={vehiclePhotoPreview} alt={t('auth.vehiclePreview')} className="w-full h-full object-cover" />
                        ) : (
                          <Car size={32} className="text-muted-foreground" />
                        )}
                      </div>
                      <label className="cursor-pointer w-full">
                        <input type="file" accept="image/*" className="hidden" onChange={handleVehiclePhotoChange} />
                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg w-full">
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-muted-foreground" /></div>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.fullNamePlaceholder')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.email')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={18} className="text-muted-foreground" /></div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.emailPlaceholder')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.phone')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={18} className="text-muted-foreground" /></div>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.phonePlaceholder')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.carModel')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Car size={18} className="text-muted-foreground" /></div>
                    <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.carModelPlaceholder')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.carYear')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar size={18} className="text-muted-foreground" /></div>
                    <input type="number" value={carYear} onChange={(e) => setCarYear(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.carYearPlaceholder')} min="1990" max={new Date().getFullYear().toString()} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.registrationNumber')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IdCard size={18} className="text-muted-foreground" /></div>
                    <input type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.registrationNumberPlaceholder')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.licenseNumber')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IdCard size={18} className="text-muted-foreground" /></div>
                    <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.licenseNumberPlaceholder')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.password')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-muted-foreground" /></div>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.passwordPlaceholder')} />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('auth.confirmPassword')}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-muted-foreground" /></div>
                    <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder={t('auth.confirmPasswordPlaceholder')} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input id="agree-terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-input rounded" />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-muted-foreground">
                  {t('auth.agreeTerms')} <a href="#" className="text-primary hover:text-primary/80">{t('auth.termsOfService')}</a>
                </label>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? t('auth.signingUp') : t('auth.signUp')}
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {t('auth.alreadyAccount')}{' '}
                  <Link to="/driver-signin" className="text-primary hover:text-primary/80">{t('auth.signIn')}</Link>
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
