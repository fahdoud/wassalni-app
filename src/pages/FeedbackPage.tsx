
import { useState } from "react";
import { MessageSquare, Star, Send, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { toast } from "@/hooks/use-toast";

const FeedbackPage = () => {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "rating" | "general">("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    console.log({
      feedbackType,
      name,
      email,
      message,
      rating: feedbackType === "rating" ? rating : undefined,
    });

    toast({
      title: t('feedback.successTitle'),
      description: t('feedback.successDescription'),
      duration: 5000,
    });

    // Reset form
    setName("");
    setEmail("");
    setMessage("");
    setRating(0);
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="mb-3">{t('feedback.title')}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {t('feedback.subtitle')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-10">
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              <FeedbackTypeButton
                icon={<MessageSquare size={20} />}
                title={t('feedback.generalFeedback')}
                active={feedbackType === "general"}
                onClick={() => setFeedbackType("general")}
              />
              <FeedbackTypeButton
                icon={<ThumbsUp size={20} />}
                title={t('feedback.suggestion')}
                active={feedbackType === "suggestion"}
                onClick={() => setFeedbackType("suggestion")}
              />
              <FeedbackTypeButton
                icon={<Star size={20} />}
                title={t('feedback.rating')}
                active={feedbackType === "rating"}
                onClick={() => setFeedbackType("rating")}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t('feedback.name')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wassalni-green dark:focus:ring-wassalni-lightGreen"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('feedback.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wassalni-green dark:focus:ring-wassalni-lightGreen"
                    required
                  />
                </div>
              </div>

              {feedbackType === "rating" && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    {t('feedback.rateExperience')}
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <Star
                          size={32}
                          className={`${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('feedback.yourFeedback')}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wassalni-green dark:focus:ring-wassalni-lightGreen"
                  required
                ></textarea>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="px-8 py-3 flex items-center gap-2"
                  size="lg"
                >
                  {t('feedback.submit')}
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h3 className="mb-4">{t('feedback.otherWaysTitle')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <h4 className="mb-2">{t('feedback.emailUs')}</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {t('feedback.emailDescription')}
                </p>
                <a
                  href="mailto:feedback@wassalni.com"
                  className="text-wassalni-green dark:text-wassalni-lightGreen hover:underline font-medium"
                >
                  feedback@wassalni.com
                </a>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <h4 className="mb-2">{t('feedback.socialMedia')}</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {t('feedback.socialDescription')}
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-wassalni-green dark:text-wassalni-lightGreen hover:underline font-medium">Twitter</a>
                  <a href="#" className="text-wassalni-green dark:text-wassalni-lightGreen hover:underline font-medium">Facebook</a>
                  <a href="#" className="text-wassalni-green dark:text-wassalni-lightGreen hover:underline font-medium">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Helper component for feedback type buttons
interface FeedbackTypeButtonProps {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}

const FeedbackTypeButton = ({ icon, title, active, onClick }: FeedbackTypeButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 py-3 px-5 rounded-full border transition-all ${
        active
          ? "bg-wassalni-green text-white border-wassalni-green dark:bg-wassalni-lightGreen dark:text-gray-900 dark:border-wassalni-lightGreen"
          : "bg-transparent border-gray-300 hover:border-wassalni-green dark:border-gray-700 dark:hover:border-wassalni-lightGreen"
      }`}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

export default FeedbackPage;
