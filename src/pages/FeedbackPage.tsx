
import { useState, useEffect } from "react";
import { MessageSquare, Star, Send, ThumbsUp, AlertTriangle, HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { submitFeedback } from "@/services/rides/index";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

// Example suggestions for different feedback types
const FEEDBACK_EXAMPLES = {
  general: [
    "I really enjoy using this service for my daily commute.",
    "The app is very intuitive and easy to use.",
    "I appreciate the quick response from customer service."
  ],
  suggestion: [
    "It would be great if you could add a feature to save favorite routes.",
    "Consider adding a loyalty program for frequent riders.",
    "Please add a dark mode option for the app."
  ],
  complaint: [
    "I had an issue with a driver cancelling at the last minute.",
    "The payment system failed to process my transaction.",
    "The pickup location was difficult to find."
  ],
  issue: [
    "The app crashes when I try to book a ride during peak hours.",
    "I'm unable to update my profile information.",
    "The notification system isn't working properly."
  ],
  other: [
    "How can I become a driver for Wassalni?",
    "Is there a corporate account option available?",
    "Do you offer services for events or group transportation?"
  ]
};

const FeedbackPage = () => {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState<
    "general" | "suggestion" | "complaint" | "issue" | "other" | "rating"
  >("general");
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
  const [exampleSuggestions, setExampleSuggestions] = useState<string[]>(FEEDBACK_EXAMPLES.general);
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  useEffect(() => {
    // Update example suggestions when feedback type changes
    switch (feedbackType) {
      case "general":
        setExampleSuggestions(FEEDBACK_EXAMPLES.general);
        break;
      case "suggestion":
        setExampleSuggestions(FEEDBACK_EXAMPLES.suggestion);
        break;
      case "complaint":
        setExampleSuggestions(FEEDBACK_EXAMPLES.complaint);
        break;
      case "issue":
        setExampleSuggestions(FEEDBACK_EXAMPLES.issue);
        break;
      case "other":
        setExampleSuggestions(FEEDBACK_EXAMPLES.other);
        break;
      default:
        setExampleSuggestions([]);
    }
  }, [feedbackType]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
      
      if (data.user) {
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

  const useSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLoggedIn) {
        if (feedbackType === "rating" && (!toUserId || rating === 0)) {
          toast.error("Please select a driver and rating");
          setLoading(false);
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
          // For all non-rating feedback types, use a consistent approach
          const { data: adminData } = await supabase
            .from("profiles")
            .select("id")
            .eq("role", "admin")
            .limit(1);
          
          // Use system feedback with no target user if no admin is found
          const adminId = adminData && adminData.length > 0 
            ? adminData[0].id 
            : null;
          
          // Use rating 0 for general feedback, 1-5 for others based on type
          const feedbackRating = feedbackType === "general" ? 0 : 
                               feedbackType === "suggestion" ? 4 : 
                               feedbackType === "complaint" ? 2 : 
                               feedbackType === "issue" ? 1 : 3;
          
          await submitFeedback({
            toUserId: adminId!,
            rating: feedbackRating,
            comment: `[${feedbackType.toUpperCase()}] ${message}`
          });
        }
        
        toast.success(t('feedback.successTitle'));
        
        setName("");
        setEmail("");
        setMessage("");
        setRating(0);
        setTripId(undefined);
        setToUserId(undefined);
      } else {
        console.log({
          feedbackType,
          name,
          email,
          message,
          rating: feedbackType === "rating" ? rating : undefined,
        });
        
        toast.success(t('feedback.successTitle'));
        
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
            <Tabs defaultValue="general" onValueChange={(value) => setFeedbackType(value as any)}>
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
                <TabsTrigger value="general" className="flex flex-col items-center gap-1 py-3 px-1">
                  <MessageSquare size={18} />
                  <span className="text-xs">General</span>
                </TabsTrigger>
                <TabsTrigger value="suggestion" className="flex flex-col items-center gap-1 py-3 px-1">
                  <ThumbsUp size={18} />
                  <span className="text-xs">Suggestions</span>
                </TabsTrigger>
                <TabsTrigger value="complaint" className="flex flex-col items-center gap-1 py-3 px-1">
                  <AlertTriangle size={18} />
                  <span className="text-xs">Complaints</span>
                </TabsTrigger>
                <TabsTrigger value="issue" className="flex flex-col items-center gap-1 py-3 px-1">
                  <HelpCircle size={18} />
                  <span className="text-xs">Issues</span>
                </TabsTrigger>
                <TabsTrigger value="other" className="flex flex-col items-center gap-1 py-3 px-1">
                  <MessageSquare size={18} />
                  <span className="text-xs">Other</span>
                </TabsTrigger>
                <TabsTrigger value="rating" className="flex flex-col items-center gap-1 py-3 px-1">
                  <Star size={18} />
                  <span className="text-xs">Rate Driver</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLoggedIn && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel htmlFor="name" className="block text-sm font-medium mb-2">
                        {t('feedback.name')}
                      </FormLabel>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <FormLabel htmlFor="email" className="block text-sm font-medium mb-2">
                        {t('feedback.email')}
                      </FormLabel>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                )}

                <TabsContent value="rating" className="space-y-6 mt-4">
                  {isLoggedIn && drivers.length > 0 && (
                    <div>
                      <FormLabel className="block text-sm font-medium mb-2">
                        Select Driver
                      </FormLabel>
                      <select
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wassalni-green dark:focus:ring-wassalni-lightGreen"
                        value={toUserId || ""}
                        onChange={(e) => setToUserId(e.target.value)}
                        required
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

                  {isLoggedIn && trips.length > 0 && (
                    <div>
                      <FormLabel className="block text-sm font-medium mb-2">
                        Select Trip (Optional)
                      </FormLabel>
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
                    <FormLabel className="block text-sm font-medium mb-3">
                      {t('feedback.rateExperience')}
                    </FormLabel>
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
                </TabsContent>

                {(feedbackType === "general" || 
                  feedbackType === "suggestion" || 
                  feedbackType === "complaint" || 
                  feedbackType === "issue" || 
                  feedbackType === "other") && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Example suggestions:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exampleSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => useSuggestion(suggestion)}
                          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full px-3 py-1 transition-colors"
                        >
                          {suggestion.length > 40 ? suggestion.substring(0, 37) + '...' : suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <FormLabel htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('feedback.yourFeedback')}
                  </FormLabel>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wassalni-green dark:focus:ring-wassalni-lightGreen"
                    required
                  />
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
            </Tabs>
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

export default FeedbackPage;
