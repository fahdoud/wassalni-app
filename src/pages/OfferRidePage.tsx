
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import GradientText from "@/components/ui-components/GradientText";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const constantineAreas = ["Ain Abid", "Ali Mendjeli", "Bekira", "Boussouf", "Didouche Mourad", "El Khroub", "Hamma Bouziane", "Zighoud Youcef"];

const OfferRidePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1,
    price: 150,
    description: ""
  });

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        toast.error("Please login to offer a ride");
        navigate("/driver-signin");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to offer a ride");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Submitting ride offer:", formData);
      
      // Combine date and time for departure_time
      const departureTimeStr = `${formData.date}T${formData.time}:00`;
      const departureTime = new Date(departureTimeStr);
      
      // Create the trip in the database
      const { data, error } = await supabase
        .from('trips')
        .insert({
          driver_id: user.id,
          origin: formData.from,
          destination: formData.to,
          departure_time: departureTime.toISOString(),
          price: parseFloat(formData.price as any),
          available_seats: parseInt(formData.seats as any),
          status: 'active',
          // Add any other required fields
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating trip:", error);
        throw new Error(error.message);
      }
      
      console.log("Trip created successfully:", data);
      
      // Show success toast
      toast.success("Ride offered successfully!");
      
      // Reset form
      setFormData({
        from: "",
        to: "",
        date: "",
        time: "",
        seats: 1,
        price: 150,
        description: ""
      });
      
      // Redirect to rides page after a short delay
      setTimeout(() => {
        navigate("/rides");
      }, 1500);
      
    } catch (error: any) {
      console.error("Failed to offer ride:", error);
      toast.error(error.message || "Failed to offer ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <section className="section">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="mb-4">
              <GradientText>Offer a Ride</GradientText>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Share your journey and help others while saving on travel costs
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-xl">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">From</label>
                    <select 
                      name="from"
                      value={formData.from}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    >
                      <option value="">Select pickup location</option>
                      {constantineAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">To</label>
                    <select 
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    >
                      <option value="">Select destination</option>
                      {constantineAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Date</label>
                    <input 
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Time</label>
                    <input 
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Available Seats</label>
                    <input 
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      min="1"
                      max="7"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Price per Seat (DZD)</label>
                    <input 
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="50"
                      step="10"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Additional Information</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add any details about your ride, such as meetup point, luggage space, etc."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  ></textarea>
                </div>

                <div className="flex justify-center">
                  <Button type="submit" size="lg" isLoading={loading} disabled={loading}>
                    {loading ? "Offering Ride..." : "Offer Ride"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OfferRidePage;
