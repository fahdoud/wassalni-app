
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/ui-components/Logo";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/ui-components/GradientText";

const VerifyEmailPage = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [manualUserId, setManualUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Get token and userId from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if (!token || !userId) {
          setVerificationStatus('error');
          setErrorMessage("Missing verification information. Please check your email link.");
          setIsLoading(false);
          return;
        }

        // Call the verify-email edge function
        const { data, error } = await supabase.functions.invoke('verify-email', {
          body: { token, userId }
        });

        if (error) {
          console.error("Verification error:", error);
          setVerificationStatus('error');
          setErrorMessage(error.message || "Failed to verify email");
        } else if (data?.verified) {
          setVerificationStatus('success');
          toast.success("Email verified successfully!");
        } else {
          setVerificationStatus('error');
          setErrorMessage(data?.error || "Unknown verification error");
        }
      } catch (error) {
        console.error("Error during verification:", error);
        setVerificationStatus('error');
        setErrorMessage("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [location.search]);

  const handleManualVerification = async () => {
    if (!manualToken || !manualUserId) {
      toast.error("Please enter both token and user ID");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the verify-email edge function
      const { data, error } = await supabase.functions.invoke('verify-email', {
        body: { token: manualToken, userId: manualUserId }
      });

      if (error) {
        toast.error(error.message || "Failed to verify email");
      } else if (data?.verified) {
        setVerificationStatus('success');
        toast.success("Email verified successfully!");
      } else {
        toast.error(data?.error || "Unknown verification error");
      }
    } catch (error) {
      console.error("Error during manual verification:", error);
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
          <GradientText>Email Verification</GradientText>
        </h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-16 w-16 text-wassalni-green animate-spin mb-4" />
            <p className="text-center text-gray-600 dark:text-gray-300">
              {t('verification.verifying')}
            </p>
          </div>
        ) : verificationStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('verification.success')}</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              {t('verification.successMessage')}
            </p>
            <Button 
              onClick={() => navigate('/passenger-signin')}
              className="w-full"
            >
              {t('verification.continueToLogin')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('verification.failed')}</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              {errorMessage || t('verification.failedMessage')}
            </p>
            
            <div className="w-full border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
              <h3 className="font-medium mb-4">{t('verification.manualVerification')}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('verification.verificationToken')}
                  </label>
                  <Input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder={t('verification.enterToken')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('verification.userId')}
                  </label>
                  <Input
                    type="text"
                    value={manualUserId}
                    onChange={(e) => setManualUserId(e.target.value)}
                    placeholder={t('verification.enterUserId')}
                  />
                </div>
                
                <Button 
                  onClick={handleManualVerification}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('verification.verifying')}
                    </>
                  ) : (
                    t('verification.verifyManually')
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="mt-4 w-full"
            >
              {t('verification.backToHome')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
