
import { useState, useEffect } from "react";
import { MessageSquare, Star, Send, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { submitFeedback } from "@/services/rides/index";

const FeedbackPage = () => {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "rating" | "general">("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tripId, setTripId] = useState<string | undefined>(undefined);
  const [toUserId, setToUserId] = useState<string | undefined>(undefined);
  const [trips, setTrips] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
      
      if (data.user) {
        // Load user's completed trips
        const { data: reservations, error } = await supabase
          .from("reservations")
          .select(`
            trip_id,
            trip:trips(
              id,
              origin,
              destination,
              departure_time,
              driver_id,
              driver:profiles!driver_id(full_name)
            )
          `)
          .eq("passenger_id", data.user.id)
          .eq("status", "completed");
        
        if (error) {
          console.error("Error loading trips:", error);
        } else if (reservations && reservations.length > 0) {
          const uniqueTrips = reservations.filter((r: any) => r.trip !== null);
          setTrips(uniqueTrips.map((r: any) => r.trip));
          
          // Extract unique drivers
          const uniqueDrivers = Array.from(
            new Map(
              uniqueTrips
                .map((r: any) => [
                  r.trip.driver_id, 
                  { id: r.trip.driver_id, name: r.trip.driver?.full_name || "Driver" }
                ])
            ).values()
          );
          setDrivers(uniqueDrivers);
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLoggedIn) {
        if (feedbackType === "rating" && (!toUserId || rating === 0)) {
          toast.error("Please select a driver and rating");
          return;
        }
        
        if (feedbackType === "rating") {
          await submitFeedback({
            toUserId: toUserId!,
            rating,
            comment: message,
            tripId
          });
        } else {
          // For general feedback or suggestions
          // Store in feedback with system user as recipient
          const { data: adminData } = await supabase
            .from("profiles")
            .select("id")
            .eq("role", "admin")
            .limit(1);
            
          const adminId = adminData && adminData.length > 0 
            ? adminData[0].id 
            : "00000000-0000-0000-0000-000000000000"; // fallback
            
          await submitFeedback({
            toUserId: adminId,
            rating: 0,
            comment: message
          });
        }
        
        toast.success(t('feedback.successTitle'));
        
        // Reset form
        setName("");
        setEmail("");
        setMessage("");
        setRating(0);
        setTripId(undefined);
        setToUserId(undefined);
      } else {
        // For non-logged in users, store contact info
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
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
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
              {!isLoggedIn && (
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
              )}

              {feedbackType === "rating" && isLoggedIn && (
                <>
                  {drivers.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Driver
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wassalni-green dark:focus:ring-wassalni-lightGreen"
                        value={toUserId || ""}
                        onChange={(e) => setToUserId(e.target.value)}
                        required={feedbackType === "rating"}
                      >
                        <option value="">Select a driver</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {trips.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Select Trip (Optional)
                      </label>
                      <select
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wassalni-green dark:focus:ring-wassalni-lightGreen"
                        value={tripId || ""}
                        onChange={(e) => setTripId(e.target.value)}
                      >
                        <option value="">Select a trip</option>
                        {trips.map((trip) => (
                          <option key={trip.id} value={trip.id}>
                            {trip.origin} to {trip.destination} - {new Date(trip.departure_time).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

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
                </>
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
                  disabled={loading}
                >
                  {loading ? "Submitting..." : t('feedback.submit')}
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
