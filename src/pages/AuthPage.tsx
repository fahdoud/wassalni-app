import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/ui-components/Logo";

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const txt = {
    login: language === 'fr' ? 'Connexion' : language === 'ar' ? 'تسجيل الدخول' : 'Sign In',
    signup: language === 'fr' ? 'Inscription' : language === 'ar' ? 'إنشاء حساب' : 'Sign Up',
    email: language === 'fr' ? 'Adresse email' : language === 'ar' ? 'البريد الإلكتروني' : 'Email address',
    password: language === 'fr' ? 'Mot de passe' : language === 'ar' ? 'كلمة المرور' : 'Password',
    confirmPwd: language === 'fr' ? 'Confirmer le mot de passe' : language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm password',
    name: language === 'fr' ? 'Nom complet' : language === 'ar' ? 'الاسم الكامل' : 'Full name',
    phone: language === 'fr' ? 'Numéro de téléphone' : language === 'ar' ? 'رقم الهاتف' : 'Phone number',
    loginBtn: language === 'fr' ? 'Se connecter' : language === 'ar' ? 'دخول' : 'Sign In',
    signupBtn: language === 'fr' ? "S'inscrire" : language === 'ar' ? 'تسجيل' : 'Sign Up',
    loading: language === 'fr' ? 'Chargement...' : language === 'ar' ? '...جاري' : 'Loading...',
    noAccount: language === 'fr' ? "Pas de compte ?" : language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?",
    hasAccount: language === 'fr' ? 'Déjà un compte ?' : language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    welcome: language === 'fr' ? 'Bon retour !' : language === 'ar' ? 'مرحبًا بعودتك!' : 'Welcome back!',
    welcomeNew: language === 'fr' ? 'Créez votre compte' : language === 'ar' ? 'أنشئ حسابك' : 'Create your account',
    welcomeDesc: language === 'fr' ? 'Connectez-vous pour accéder à vos trajets' : language === 'ar' ? 'سجل الدخول للوصول إلى رحلاتك' : 'Sign in to access your rides',
    welcomeNewDesc: language === 'fr' ? 'Rejoignez Wasslink et trouvez vos trajets' : language === 'ar' ? 'انضم إلى Wasslink واعثر على رحلاتك' : 'Join Wasslink and find your rides',
    forgotPwd: language === 'fr' ? 'Mot de passe oublié ?' : language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?',
    orDriver: language === 'fr' ? 'Inscription chauffeur' : language === 'ar' ? 'تسجيل كسائق' : 'Register as driver',
    pwdMismatch: language === 'fr' ? 'Les mots de passe ne correspondent pas' : language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
    fillFields: language === 'fr' ? 'Veuillez remplir tous les champs' : language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields',
  };

  const handleLogin = async () => {
    if (!email || !password) { toast.error(txt.fillFields); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success(language === 'fr' ? 'Connexion réussie' : 'Signed in successfully');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || txt.fillFields);
    } finally { setLoading(false); }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName) { toast.error(txt.fillFields); return; }
    if (password !== confirmPassword) { toast.error(txt.pwdMismatch); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, phone } }
      });
      if (error) throw error;
      toast.success(language === 'fr' ? 'Compte créé ! Vérifiez votre email.' : 'Account created! Check your email.');
      setMode("login");
    } catch (err: any) {
      toast.error(err.message || txt.fillFields);
    } finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mode === "login" ? handleLogin() : handleSignUp();
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Top section */}
      <div className="px-4 pt-12 pb-6 flex flex-col items-center">
        <button onClick={() => navigate('/')} className="self-start p-2 -ml-2 rounded-xl hover:bg-muted transition-colors mb-4">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
          <Logo size="lg" />
        </motion.div>
        <motion.h1
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground mt-4"
        >
          {mode === "login" ? txt.welcome : txt.welcomeNew}
        </motion.h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "login" ? txt.welcomeDesc : txt.welcomeNewDesc}
        </p>
      </div>

      {/* Toggle */}
      <div className="px-6 max-w-md mx-auto w-full">
        <div className="flex bg-muted rounded-2xl p-1 mb-6">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === m
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              {m === "login" ? txt.login : txt.signup}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="px-6 max-w-md mx-auto w-full flex-1">
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {mode === "signup" && (
              <>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={txt.name}
                    className="w-full pl-10 pr-4 py-3.5 bg-muted/60 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={txt.phone}
                    className="w-full pl-10 pr-4 py-3.5 bg-muted/60 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={txt.email}
                className="w-full pl-10 pr-4 py-3.5 bg-muted/60 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={txt.password}
                className="w-full pl-10 pr-12 py-3.5 bg-muted/60 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>

            {mode === "signup" && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={txt.confirmPwd}
                  className="w-full pl-10 pr-4 py-3.5 bg-muted/60 rounded-2xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button type="button" className="text-xs text-primary font-medium">{txt.forgotPwd}</button>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 disabled:opacity-60 transition-all"
            >
              {loading ? txt.loading : mode === "login" ? txt.loginBtn : txt.signupBtn}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Switch mode */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? txt.noAccount : txt.hasAccount}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-semibold">
              {mode === "login" ? txt.signup : txt.login}
            </button>
          </p>
        </div>

        {/* Driver signup link */}
        {mode === "signup" && (
          <div className="text-center mt-4">
            <button onClick={() => navigate('/driver-signup')} className="text-xs text-muted-foreground underline">
              {txt.orDriver}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
