import { useState, useEffect } from "react";
import { MessageSquare, Star, Send, ThumbsUp, AlertTriangle, Flag, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { submitFeedback } from "@/services/rides/index";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

const FEEDBACK_TYPES = [
  { key: "general", icon: MessageSquare },
  { key: "suggestion", icon: ThumbsUp },
  { key: "complaint", icon: AlertTriangle },
  { key: "reclamation", icon: Flag },
  { key: "issue", icon: HelpCircle },
  { key: "rating", icon: Star },
] as const;

type FeedbackType = typeof FEEDBACK_TYPES[number]["key"];

const FeedbackPage = () => {
  const { language } = useLanguage();
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const txt = {
    title: language === 'fr' ? 'Votre avis compte' : language === 'ar' ? 'رأيك يهمنا' : 'Your feedback matters',
    subtitle: language === 'fr' ? 'Aidez-nous à améliorer votre expérience' : language === 'ar' ? 'ساعدنا في تحسين تجربتك' : 'Help us improve your experience',
    general: language === 'fr' ? 'Général' : language === 'ar' ? 'عام' : 'General',
    suggestion: language === 'fr' ? 'Suggestion' : language === 'ar' ? 'اقتراح' : 'Suggestion',
    complaint: language === 'fr' ? 'Plainte' : language === 'ar' ? 'شكوى' : 'Complaint',
    reclamation: language === 'fr' ? 'Réclamation' : language === 'ar' ? 'مطالبة' : 'Claim',
    issue: language === 'fr' ? 'Problème' : language === 'ar' ? 'مشكلة' : 'Issue',
    rating: language === 'fr' ? 'Évaluation' : language === 'ar' ? 'تقييم' : 'Rating',
    rateExp: language === 'fr' ? 'Comment évaluez-vous votre expérience ?' : language === 'ar' ? 'كيف تقيم تجربتك؟' : 'How would you rate your experience?',
    placeholder: language === 'fr' ? 'Décrivez votre expérience...' : language === 'ar' ? 'صف تجربتك...' : 'Describe your experience...',
    send: language === 'fr' ? 'Envoyer' : language === 'ar' ? 'إرسال' : 'Send',
    sending: language === 'fr' ? 'Envoi...' : language === 'ar' ? '...إرسال' : 'Sending...',
    thanks: language === 'fr' ? 'Merci pour votre avis !' : language === 'ar' ? 'شكراً لتقييمك!' : 'Thanks for your feedback!',
    thanksDesc: language === 'fr' ? 'Nous avons bien reçu votre message' : language === 'ar' ? 'لقد تلقينا رسالتك' : 'We received your message',
    another: language === 'fr' ? 'Envoyer un autre' : language === 'ar' ? 'إرسال آخر' : 'Send another',
    yourMsg: language === 'fr' ? 'Votre message' : language === 'ar' ? 'رسالتك' : 'Your message',
    contact: language === 'fr' ? 'Ou contactez-nous' : language === 'ar' ? 'أو تواصل معنا' : 'Or contact us',
  };

  const typeLabels: Record<FeedbackType, string> = {
    general: txt.general, suggestion: txt.suggestion, complaint: txt.complaint,
    reclamation: txt.reclamation, issue: txt.issue, rating: txt.rating,
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message && feedbackType !== "rating") return;
    if (feedbackType === "rating" && rating === 0) return;
    setLoading(true);

    try {
      if (isLoggedIn) {
        const feedbackRating = feedbackType === "rating" ? rating :
          feedbackType === "general" ? 0 : feedbackType === "suggestion" ? 4 :
          feedbackType === "complaint" ? 2 : 1;

        await submitFeedback({
          toUserId: null,
          rating: feedbackRating,
          comment: message,
          feedbackType,
        });
      }
      setSubmitted(true);
      toast.success(txt.thanks);
    } catch {
      toast.error(language === 'fr' ? 'Erreur lors de l\'envoi' : 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMessage("");
    setRating(0);
    setFeedbackType("general");
    setSubmitted(false);
  };

  return (
    <div className="pb-20 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 max-w-lg mx-auto py-4"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{txt.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{txt.subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary fill-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{txt.thanks}</h2>
              <p className="text-sm text-muted-foreground mt-2">{txt.thanksDesc}</p>
              <button
                onClick={resetForm}
                className="mt-6 px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium"
              >
                {txt.another}
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Type selector */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {FEEDBACK_TYPES.map(({ key, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setFeedbackType(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      feedbackType === key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {typeLabels[key]}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                {feedbackType === "rating" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center"
                  >
                    <p className="text-sm font-medium text-foreground mb-4">{txt.rateExp}</p>
                    <div className="flex items-center justify-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          whileTap={{ scale: 1.2 }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              star <= (hoveredRating || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Message */}
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <label className="text-sm font-medium text-foreground mb-2 block">{txt.yourMsg}</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={txt.placeholder}
                    className="border-0 bg-muted/40 rounded-xl resize-none min-h-[120px] focus-visible:ring-1 focus-visible:ring-primary/30"
                    required={feedbackType !== "rating"}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? txt.sending : txt.send}
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>

              {/* Contact */}
              <div className="mt-6 bg-card border border-border rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground mb-3">{txt.contact}</p>
                <div className="flex gap-3">
                  <a href="mailto:contact@wasslink.com" className="flex-1 py-2.5 rounded-xl bg-muted text-center text-xs font-medium text-foreground">
                    Email
                  </a>
                  <a href="#" className="flex-1 py-2.5 rounded-xl bg-muted text-center text-xs font-medium text-foreground">
                    Facebook
                  </a>
                  <a href="#" className="flex-1 py-2.5 rounded-xl bg-muted text-center text-xs font-medium text-foreground">
                    Instagram
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
