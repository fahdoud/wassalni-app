import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GradientText from "@/components/ui-components/GradientText";
import Logo from "@/components/ui-components/Logo";
import RoleSwitcher from "@/components/ui-components/RoleSwitcher";
import { supabase, sendEmailVerification, sendSMSNotification, sendWelcomeEmail, sendSMSVerification } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PassengerSignUp = () => {
  const { t } = useLanguage();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!agreeTerms) {
      uiToast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorTerms'),
      });
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      uiToast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorPasswordMatch'),
      });
      setIsLoading(false);
      return;
    }
    
    if (!fullName || !email || !phone || !password) {
      uiToast({
        variant: "destructive",
        title: t('auth.errorTitle'),
        description: t('auth.errorFields'),
      });
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Attempting to sign up with:", { email, fullName, phone, role: 'passenger' });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: 'passenger'
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        console.log("User created successfully:", data.user.id);
        setUserId(data.user.id);
        
        let formattedPhone = phone;
        if (!phone.startsWith('+')) {
          formattedPhone = `+213${phone.startsWith('0') ? phone.substring(1) : phone}`;
        }
        
        try {
          console.log("Sending email verification to:", email);
          const emailResult = await sendEmailVerification(data.user.id, email);
          console.log("Email verification result:", emailResult);
          toast.success(t('auth.verificationEmailSent'));
        } catch (verificationError) {
          console.error("Failed to send verification email:", verificationError);
          toast.error("Failed to send verification email. Please try again later.");
        }
        
        try {
          console.log("Sending welcome email to:", email);
          const welcomeResult = await sendWelcomeEmail(data.user.id, email, fullName);
          console.log("Welcome email result:", welcomeResult);
          toast.success("Welcome email sent successfully");
        } catch (welcomeError) {
          console.error("Failed to send welcome email:", welcomeError);
          toast.error("Failed to send welcome email. Please try again later.");
        }
        
        try {
          console.log("Sending SMS verification to:", formattedPhone);
          const smsVerificationResult = await sendSMSVerification(data.user.id, formattedPhone);
          console.log("SMS verification result:", smsVerificationResult);
          toast.success("SMS verification code sent");
        } catch (smsVerificationError) {
          console.error("Failed to send SMS verification:", smsVerificationError);
          toast.error("Failed to send SMS verification. Please try again later.");
        }
        
        try {
          const welcomeMessage = `Welcome to Wassalni, ${fullName}! Thank you for registering. Please verify your email to complete your account setup.`;
          console.log("Sending welcome SMS to:", formattedPhone);
          const smsResult = await sendSMSNotification(data.user.id, formattedPhone, welcomeMessage);
          console.log("Welcome SMS result:", smsResult);
          toast.success(t('auth.welcomeSmsSent'));
        } catch (smsError) {
          console.error("Failed to send welcome SMS:", smsError);
          toast.error(t('auth.smsError'));
        }
        
        setShowVerificationDialog(true);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || t('auth.errorGeneric'));
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowVerificationDialog(false);
    setIsLoading(false);
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
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
              passengerLink="/passenger-signup" 
              driverLink="/driver-signup" 
            />
            
            <h2 className="text-3xl font-bold mb-2">{t('auth.createAccount')}</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-300">
              {t('auth.passengerSignUpDesc')}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <p className="text-xs text-gray-500">Include country code for international format (e.g., +213...)</p>
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
              
              <div className="flex items-center">
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
              
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? t('auth.signingUp') : t('auth.signUp')}
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('auth.alreadyAccount')}{' '}
                  <Link to="/passenger-signin" className="text-wassalni-green hover:text-wassalni-lightGreen dark:text-wassalni-lightGreen">
                    {t('auth.signIn')}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        
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

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('auth.verifyYourEmail')}</DialogTitle>
            <DialogDescription>
              {t('auth.verificationEmailSentDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.verificationNote')}
            </p>
            
            <div className="grid gap-2">
              <Label htmlFor="user-id">{t('auth.yourUserId')}</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="user-id" 
                  value={userId} 
                  readOnly 
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(userId);
                    toast.success(t('auth.copiedToClipboard'));
                  }}
                >
                  {t('auth.copy')}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {t('auth.userIdHelp')}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleDialogClose}>
              {t('auth.gotIt')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PassengerSignUp;
