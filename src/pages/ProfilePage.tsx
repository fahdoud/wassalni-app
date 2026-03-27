import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { User, Phone, Camera, Star, MessageSquare, LogOut, ChevronRight, Settings } from "lucide-react";
import { uploadProfileImage, getUserFeedbacks } from "@/services/rides/profileService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(8, { message: "Phone number must be valid" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const txt = {
    profile: language === 'fr' ? 'Mon Profil' : language === 'ar' ? 'ملفي الشخصي' : 'My Profile',
    name: language === 'fr' ? 'Nom complet' : language === 'ar' ? 'الاسم الكامل' : 'Full Name',
    phone: language === 'fr' ? 'Téléphone' : language === 'ar' ? 'رقم الهاتف' : 'Phone',
    save: language === 'fr' ? 'Enregistrer' : language === 'ar' ? 'حفظ' : 'Save',
    saving: language === 'fr' ? 'Enregistrement...' : language === 'ar' ? '...حفظ' : 'Saving...',
    logout: language === 'fr' ? 'Déconnexion' : language === 'ar' ? 'تسجيل الخروج' : 'Log Out',
    feedback: language === 'fr' ? 'Avis reçus' : language === 'ar' ? 'التقييمات' : 'Feedback',
    settings: language === 'fr' ? 'Paramètres' : language === 'ar' ? 'الإعدادات' : 'Settings',
    noFeedback: language === 'fr' ? 'Aucun avis reçu' : language === 'ar' ? 'لا توجد تقييمات' : 'No feedback yet',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { full_name: "", phone: "" },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate("/passenger-signin"); return; }
      setUserId(data.user.id);
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
      if (profile) {
        form.reset({ full_name: profile.full_name || "", phone: profile.phone || "" });
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        const fb = await getUserFeedbacks(data.user.id);
        setFeedbacks(fb);
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({ full_name: data.full_name, phone: data.phone, updated_at: new Date().toISOString() }).eq("id", userId);
      if (error) throw error;
      toast.success(language === 'fr' ? 'Profil mis à jour' : 'Profile updated');
    } catch { toast.error(language === 'fr' ? 'Erreur de mise à jour' : 'Update error'); }
    finally { setSaving(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !userId) return;
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    try {
      setUploading(true);
      const url = await uploadProfileImage(file, userId);
      if (url) { setAvatarUrl(url); toast.success("Photo updated"); }
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const initials = form.watch("full_name") ? form.watch("full_name").split(" ").map(n => n[0]).join("").toUpperCase() : "U";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#00A693] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-20 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 max-w-lg mx-auto"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {avatarUrl ? <AvatarImage src={avatarUrl} alt="Avatar" /> : null}
              <AvatarFallback className="bg-gradient-to-br from-[#00A693] to-[#94C5FF] text-white text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#00A693] rounded-full flex items-center justify-center shadow-lg border-2 border-background"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
          </div>
          <h1 className="text-xl font-bold text-foreground mt-4">{form.watch("full_name") || txt.profile}</h1>
          <p className="text-sm text-muted-foreground">{form.watch("phone") || ""}</p>
        </div>

        {/* Edit Form */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4 mb-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                <User className="w-4 h-4 text-[#00A693]" /> {txt.name}
              </label>
              <Input {...form.register("full_name")} className="rounded-xl border-border" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                <Phone className="w-4 h-4 text-[#00A693]" /> {txt.phone}
              </label>
              <Input {...form.register("phone")} className="rounded-xl border-border" />
            </div>
            <Button type="submit" disabled={saving} className="w-full rounded-xl bg-[#00A693] hover:bg-[#00A693]/90 text-white">
              {saving ? txt.saving : txt.save}
            </Button>
          </form>
        </div>

        {/* Feedback Section */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#00A693]" /> {txt.feedback} ({feedbacks.length})
          </h2>
          {feedbacks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{txt.noFeedback}</p>
          ) : (
            <div className="space-y-3">
              {feedbacks.slice(0, 5).map((fb) => (
                <div key={fb.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{fb.profiles?.full_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-foreground">{fb.profiles?.full_name || "User"}</p>
                      <div className="flex items-center text-yellow-500 text-xs gap-0.5">
                        <Star className="w-3 h-3 fill-current" /> {fb.rating}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{fb.comment || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between bg-card border border-destructive/20 rounded-2xl p-4 shadow-sm text-destructive hover:bg-destructive/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">{txt.logout}</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
