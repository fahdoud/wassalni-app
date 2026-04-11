
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import GradientText from "@/components/ui-components/GradientText";
import Logo from "@/components/ui-components/Logo";
import RoleSwitcher from "@/components/ui-components/RoleSwitcher";
import { supabase } from "@/integrations/supabase/client";
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
      uiToast({ variant: "destructive", title: "Error", description: "You must agree to the terms of service" });
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      uiToast({ variant: "destructive", title: "Error", description: "Passwords do not match" });
      setIsLoading(false);
      return;
    }
    
    if (!fullName || !email || !phone || !password) {
      uiToast({ variant: "destructive", title: "Error", description: "Please fill in all fields" });
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone, role: 'passenger' },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUserId(data.user.id);
        setShowVerificationDialog(true);
        toast.success("Account created! Please verify your email.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "An error occurred during sign up");
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
              <h1 className="text-2xl font-bold tracking-tight"><GradientText>Wasslink</GradientText></h1>
            </Link>
            
            <RoleSwitcher currentRole="passenger" passengerLink="/passenger-signup" driverLink="/driver-signup" />
            
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-muted-foreground mb-8">Sign up as a passenger to book rides.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-muted-foreground" /></div>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder="Enter your full name" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={18} className="text-muted-foreground" /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder="Enter your email address" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={18} className="text-muted-foreground" /></div>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder="Enter your phone number" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-muted-foreground" /></div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder="Create a password" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} className="text-muted-foreground" /> : <Eye size={18} className="text-muted-foreground" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={18} className="text-muted-foreground" /></div>
                  <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" placeholder="Confirm your password" />
                </div>
              </div>
              
              <div className="flex items-center">
                <input id="agree-terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-input rounded" />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-muted-foreground">
                  I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                </label>
              </div>
              
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/passenger-signin" className="text-primary hover:text-primary/80">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        
        <div className="hidden md:w-1/2 md:flex bg-gradient-primary relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-foreground p-16">
            <Logo size="lg" />
            <h2 className="text-3xl font-bold mt-8 mb-4 text-center">Join as a Passenger</h2>
            <p className="text-center max-w-md">Enjoy convenient, affordable, and safe rides across the city.</p>
          </div>
        </div>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>We've sent a verification email to your inbox. Please check your email and click the verification link.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <p className="text-sm text-muted-foreground">If you don't receive the email within a few minutes, check your spam folder.</p>
          </div>
          <DialogFooter>
            <Button onClick={handleDialogClose}>Got It</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PassengerSignUp;
