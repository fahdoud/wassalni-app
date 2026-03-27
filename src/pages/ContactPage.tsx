import { useState } from "react";
import { Mail, Send, User, MessageSquare, Phone, MapPin, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ContactPage = () => {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const t = (fr: string, ar: string, en: string) =>
    language === 'fr' ? fr : language === 'ar' ? ar : en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setLoading(true);

    // Send via mailto as fallback (opens email client)
    const mailtoLink = `mailto:wassalniservices25@gmail.com?subject=${encodeURIComponent(subject || 'Contact - Wasslink')}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.open(mailtoLink, '_blank');

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success(t('Message envoyé !', 'تم الإرسال!', 'Message sent!'));
    }, 800);
  };

  const reset = () => {
    setName(""); setEmail(""); setSubject(""); setMessage(""); setSent(false);
  };

  return (
    <div className="pb-24 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 max-w-lg mx-auto py-4 space-y-5"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {t('Contactez-nous', 'اتصل بنا', 'Contact Us')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("Nous sommes là pour vous aider", "نحن هنا لمساعدتك", "We're here to help")}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="mailto:wassalniservices25@gmail.com"
            className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">Email</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 break-all">wassalniservices25@gmail.com</p>
          </a>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm text-center">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              {t('Localisation', 'الموقع', 'Location')}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {t('Algérie', 'الجزائر', 'Algeria')}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                {t('Message envoyé !', 'تم إرسال الرسالة!', 'Message Sent!')}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {t(
                  'Nous vous répondrons dans les plus brefs délais.',
                  'سنرد عليك في أقرب وقت ممكن.',
                  "We'll get back to you as soon as possible."
                )}
              </p>
              <button
                onClick={reset}
                className="mt-6 px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground text-sm font-medium"
              >
                {t('Envoyer un autre', 'إرسال آخر', 'Send Another')}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
                {/* Name */}
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    {t('Nom complet', 'الاسم الكامل', 'Full Name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('Votre nom', 'اسمك', 'Your name')}
                    required
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('Votre email', 'بريدك الإلكتروني', 'Your email')}
                    required
                    maxLength={255}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    {t('Sujet', 'الموضوع', 'Subject')}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('Sujet du message', 'موضوع الرسالة', 'Message subject')}
                    maxLength={200}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-muted-foreground" />
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('Votre message...', 'رسالتك...', 'Your message...')}
                    required
                    maxLength={1000}
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading
                  ? t('Envoi...', '...إرسال', 'Sending...')
                  : t('Envoyer', 'إرسال', 'Send')}
                <Send className="w-4 h-4" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Social */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            {t('Suivez-nous', 'تابعنا', 'Follow us')}
          </p>
          <div className="flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl bg-muted text-center text-xs font-medium text-foreground">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 rounded-xl bg-muted text-center text-xs font-medium text-foreground">
              Instagram
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;
