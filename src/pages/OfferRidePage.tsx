
import { useLanguage } from "@/contexts/LanguageContext";
import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const constantineAreas = ["Ain Abid", "Ali Mendjeli", "Bekira", "Boussouf", "Didouche Mourad", "El Khroub", "Hamma Bouziane", "Zighoud Youcef"];

const OfferRidePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: { from: "", to: "", date: "", time: "", seats: "1", price: "150", description: "" }
  });

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

  const handleSubmit = async (formData: any) => {
    if (!user) { toast.error("You must be logged in"); return; }
    setLoading(true);
    
    try {
      const departureTime = new Date(`${formData.date}T${formData.time}:00`);
      
      const { error } = await supabase
        .from('trips')
        .insert([{
          driver_id: user.id,
          lieu_depart: formData.from,
          lieu_arrivee: formData.to,
          date_heure: departureTime.toISOString(),
          prix: parseFloat(formData.price),
          places_disponibles: parseInt(formData.seats),
          statut: 'active'
        }]);
      
      if (error) throw new Error(error.message);
      
      toast.success("Ride offered successfully!");
      form.reset();
      setTimeout(() => navigate("/rides"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Failed to offer ride.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 max-w-lg mx-auto py-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground mb-1">Offer a Ride</h1>
          <p className="text-sm text-muted-foreground">Share your journey and help others</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="glass-card p-8 rounded-xl">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">From</label>
                    <select {...form.register("from")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" required>
                      <option value="">Select pickup location</option>
                      {constantineAreas.map(area => (<option key={area} value={area}>{area}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">To</label>
                    <select {...form.register("to")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" required>
                      <option value="">Select destination</option>
                      {constantineAreas.map(area => (<option key={area} value={area}>{area}</option>))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                    <input type="date" {...form.register("date")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                    <input type="time" {...form.register("time")} className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Available Seats</label>
                    <input type="number" {...form.register("seats")} min="1" max="7" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Price per Seat (DZD)</label>
                    <input type="number" {...form.register("price")} min="50" step="10" className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Additional Information</label>
                  <textarea {...form.register("description")} rows={4} placeholder="Add any details about your ride..." className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"></textarea>
                </div>

                <div className="flex justify-center">
                  <Button type="submit" size="lg" isLoading={loading} disabled={loading}>
                    {loading ? "Offering Ride..." : "Offer Ride"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OfferRidePage;
