
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/ui-components/Logo";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/ui-components/GradientText";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyPhonePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || !userId) {
      toast.error("Please enter both verification code and user ID");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the verify-phone edge function
      const { data, error } = await supabase.functions.invoke('verify-phone', {
        body: { code: verificationCode, userId }
      });

      if (error) {
        setVerificationStatus('error');
        setErrorMessage(error.message || "Failed to verify phone number");
        toast.error(error.message || "Failed to verify phone number");
      } else if (data?.verified) {
        setVerificationStatus('success');
        toast.success("Phone number verified successfully!");
      } else {
        setVerificationStatus('error');
        setErrorMessage(data?.error || "Unknown verification error");
        toast.error(data?.error || "Unknown verification error");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      setVerificationStatus('error');
      setErrorMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!userId) {
      toast.error("Please enter your user ID");
      return;
    }

    try {
      // Get user's phone number from the database
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", userId)
        .single();

      if (userError || !userData?.phone) {
        toast.error("Could not find your phone number");
        return;
      }

      // Call the send-sms-verification edge function
      setIsSubmitting(true);
      const { error } = await supabase.functions.invoke('send-sms-verification', {
        body: { userId, phone: userData.phone }
      });

      if (error) {
        toast.error(error.message || "Failed to send verification code");
      } else {
        toast.success("Verification code sent successfully!");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">
          <GradientText>Phone Verification</GradientText>
        </h1>
        
        {verificationStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('verification.phoneSuccess')}</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              {t('verification.phoneSuccessMessage')}
            </p>
            <Button 
              onClick={() => navigate('/passenger-signin')}
              className="w-full"
            >
              {t('verification.continueToLogin')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {verificationStatus === 'error' && (
              <div className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-500 bg-red-50 dark:text-red-400 dark:bg-gray-700 dark:border-red-400">
                <XCircle className="h-5 w-5 mr-2" />
                <span>{errorMessage}</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('verification.userId')}
              </label>
              <Input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={t('verification.enterUserId')}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('verification.userIdHelp')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('verification.verificationCode')}
              </label>
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={setVerificationCode}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, i) => (
                      <InputOTPSlot key={i} {...slot} index={i} />
                    ))}
                  </InputOTPGroup>
                )}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  className="text-xs text-wassalni-green mt-2 hover:underline"
                >
                  {t('verification.resendCode')}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('verification.verifying')}
                </>
              ) : (
                t('verification.verifyPhone')
              )}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              {t('verification.backToHome')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyPhonePage;
