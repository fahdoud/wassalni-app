
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { supabase } from "@/integrations/supabase/client";
import { User, Phone, Mail, Heart, CreditCard, Phone as ContactPhone } from "lucide-react";
import GradientText from "@/components/ui-components/GradientText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { user, profile, passengerDetails, driverDetails, isDriver } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    // Passenger specific fields
    interests: "",
    preferred_payment_method: "",
    emergency_contact: "",
    // Driver specific fields
    driving_experience_years: 0,
    preferred_routes: "",
    availability_hours: "",
    profile_photo_url: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/passenger-signin");
      return;
    }

    if (profile) {
      setFormData(prevState => ({
        ...prevState,
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        email: user.email || "",
      }));
    }

    if (isDriver && driverDetails) {
      setFormData(prevState => ({
        ...prevState,
        driving_experience_years: driverDetails.driving_experience_years || 0,
        preferred_routes: driverDetails.preferred_routes || "",
        availability_hours: driverDetails.availability_hours || "",
        profile_photo_url: driverDetails.profile_photo_url || ""
      }));
    } else if (!isDriver && passengerDetails) {
      setFormData(prevState => ({
        ...prevState,
        interests: passengerDetails.interests || "",
        preferred_payment_method: passengerDetails.preferred_payment_method || "",
        emergency_contact: passengerDetails.emergency_contact || ""
      }));
    }
  }, [user, profile, passengerDetails, driverDetails, isDriver, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update role-specific tables
      if (isDriver) {
        const { error: driverError } = await supabase
          .from('driver_details')
          .update({
            driving_experience_years: formData.driving_experience_years,
            preferred_routes: formData.preferred_routes,
            availability_hours: formData.availability_hours,
            profile_photo_url: formData.profile_photo_url
          })
          .eq('id', user.id);

        if (driverError) throw driverError;
      } else {
        const { error: passengerError } = await supabase
          .from('passenger_details')
          .update({
            interests: formData.interests,
            preferred_payment_method: formData.preferred_payment_method,
            emergency_contact: formData.emergency_contact
          })
          .eq('id', user.id);

        if (passengerError) throw passengerError;
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated."
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile information."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return <div>Loading...</div>;
  }

  const userInitials = formData.full_name
    ? formData.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="mb-4">
              <GradientText>Your Profile</GradientText>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Update your personal information and preferences
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-xl space-y-8">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.profile_photo_url} alt={formData.full_name} />
                  <AvatarFallback className="bg-wassalni-green text-white text-2xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {isDriver && (
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Profile Photo URL</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="profile_photo_url"
                        value={formData.profile_photo_url}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Enter image URL"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Your full name"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Your phone number"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 outline-none dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
                        placeholder="Your email address"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              {isDriver ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Driver Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Driving Experience (years)</label>
                      <input
                        type="number"
                        name="driving_experience_years"
                        value={formData.driving_experience_years}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Availability Hours</label>
                      <input
                        type="text"
                        name="availability_hours"
                        value={formData.availability_hours}
                        onChange={handleChange}
                        placeholder="e.g. Weekdays 8AM-5PM"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Preferred Routes</label>
                      <textarea
                        name="preferred_routes"
                        value={formData.preferred_routes}
                        onChange={handleChange}
                        placeholder="Describe your preferred routes or areas"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Passenger Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Preferred Payment Method</label>
                      <div className="relative">
                        <select
                          name="preferred_payment_method"
                          value={formData.preferred_payment_method || ""}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Select payment method</option>
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="mobile_wallet">Mobile Wallet</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard size={18} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Emergency Contact</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="emergency_contact"
                          value={formData.emergency_contact || ""}
                          onChange={handleChange}
                          placeholder="Emergency contact number"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <ContactPhone size={18} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Interests</label>
                      <div className="relative">
                        <textarea
                          name="interests"
                          value={formData.interests || ""}
                          onChange={handleChange}
                          placeholder="Share your interests (e.g. music, conversation topics)"
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-green/30 focus:border-wassalni-green outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        ></textarea>
                        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                          <Heart size={18} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button type="submit" size="lg" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
