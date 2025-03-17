
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, Car, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { user, profile, passengerDetails, driverDetails, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tab = "general" } = useParams();
  
  const [formState, setFormState] = useState({
    full_name: "",
    phone: "",
    // Passenger specific fields
    interests: "",
    preferred_payment_method: "",
    emergency_contact: "",
    // Driver specific fields
    driving_experience_years: "",
    preferred_routes: "",
    availability_hours: "",
    profile_photo_url: "",
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setFormState(prevState => ({
        ...prevState,
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      }));
    }
    
    if (profile?.role === "passenger" && passengerDetails) {
      setFormState(prevState => ({
        ...prevState,
        interests: passengerDetails.interests || "",
        preferred_payment_method: passengerDetails.preferred_payment_method || "",
        emergency_contact: passengerDetails.emergency_contact || "",
      }));
    }
    
    if (profile?.role === "driver" && driverDetails) {
      setFormState(prevState => ({
        ...prevState,
        driving_experience_years: driverDetails.driving_experience_years?.toString() || "",
        preferred_routes: driverDetails.preferred_routes || "",
        availability_hours: driverDetails.availability_hours || "",
        profile_photo_url: driverDetails.profile_photo_url || "",
      }));
    }
  }, [profile, passengerDetails, driverDetails]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formState.full_name,
          phone: formState.phone,
        })
        .eq("id", user.id);
      
      if (profileError) throw profileError;
      
      // Update role-specific details
      if (profile?.role === "passenger") {
        const { error: passengerError } = await supabase
          .from("passenger_details")
          .update({
            interests: formState.interests,
            preferred_payment_method: formState.preferred_payment_method,
            emergency_contact: formState.emergency_contact,
          })
          .eq("id", user.id);
        
        if (passengerError) throw passengerError;
      }
      
      if (profile?.role === "driver") {
        const { error: driverError } = await supabase
          .from("driver_details")
          .update({
            driving_experience_years: formState.driving_experience_years ? parseInt(formState.driving_experience_years) : null,
            preferred_routes: formState.preferred_routes,
            availability_hours: formState.availability_hours,
            profile_photo_url: formState.profile_photo_url,
          })
          .eq("id", user.id);
        
        if (driverError) throw driverError;
      }
      
      toast({
        title: t('profile.updateSuccess'),
        description: t('profile.profileUpdated'),
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: t('profile.updateError'),
        description: error.message || t('profile.errorUpdating'),
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-24 flex items-center justify-center">
        <div className="animate-pulse text-center">
          {t('common.loading')}...
        </div>
      </div>
    );
  }
  
  // Redirect if not logged in
  if (!user || !profile) {
    navigate("/passenger-signin");
    return null;
  }
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      const nameParts = profile.full_name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return profile.full_name.slice(0, 2).toUpperCase();
    }
    return user.email?.slice(0, 2).toUpperCase() || "NN";
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={driverDetails?.profile_photo_url || ""} />
            <AvatarFallback className="bg-wassalni-green text-white text-3xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{profile.full_name || user.email?.split("@")[0]}</h1>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Mail className="mr-1 h-4 w-4" />
                {user.email}
              </div>
              {profile.phone && (
                <div className="flex items-center">
                  <Phone className="mr-1 h-4 w-4" />
                  {profile.phone}
                </div>
              )}
              <div className="flex items-center bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                {profile.role === "driver" ? t('common.driver') : t('common.passenger')}
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="w-full pt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">{t('profile.generalInfo')}</TabsTrigger>
            <TabsTrigger value="details">
              {profile.role === "driver" ? t('profile.driverDetails') : t('profile.passengerDetails')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.personalInformation')}</CardTitle>
                <CardDescription>
                  {t('profile.updateYourPersonalInfo')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">{t('profile.fullName')}</Label>
                  <div className="flex">
                    <User className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formState.full_name}
                      onChange={handleInputChange}
                      placeholder={t('profile.enterFullName')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('profile.phoneNumber')}</Label>
                  <div className="flex">
                    <Phone className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      placeholder={t('profile.enterPhoneNumber')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.email')}</Label>
                  <div className="flex">
                    <Mail className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      value={user.email || ""}
                      readOnly
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{t('profile.emailCannotBeChanged')}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isUpdating}
                >
                  {isUpdating ? t('common.saving') : t('common.saveChanges')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {profile.role === "driver" ? t('profile.driverDetails') : t('profile.passengerDetails')}
                </CardTitle>
                <CardDescription>
                  {profile.role === "driver" 
                    ? t('profile.updateYourDriverInfo') 
                    : t('profile.updateYourPassengerInfo')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.role === "passenger" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="interests">{t('profile.interests')}</Label>
                      <Input
                        id="interests"
                        name="interests"
                        value={formState.interests}
                        onChange={handleInputChange}
                        placeholder={t('profile.enterYourInterests')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferred_payment_method">{t('profile.preferredPayment')}</Label>
                      <Input
                        id="preferred_payment_method"
                        name="preferred_payment_method"
                        value={formState.preferred_payment_method}
                        onChange={handleInputChange}
                        placeholder={t('profile.enterPreferredPayment')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact">{t('profile.emergencyContact')}</Label>
                      <Input
                        id="emergency_contact"
                        name="emergency_contact"
                        value={formState.emergency_contact}
                        onChange={handleInputChange}
                        placeholder={t('profile.enterEmergencyContact')}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="profile_photo_url">{t('profile.profilePhotoUrl')}</Label>
                      <Input
                        id="profile_photo_url"
                        name="profile_photo_url"
                        value={formState.profile_photo_url}
                        onChange={handleInputChange}
                        placeholder={t('profile.enterProfilePhotoUrl')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="driving_experience_years">{t('profile.drivingExperience')}</Label>
                      <div className="flex">
                        <Car className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="driving_experience_years"
                          name="driving_experience_years"
                          type="number"
                          value={formState.driving_experience_years}
                          onChange={handleInputChange}
                          placeholder={t('profile.enterYearsOfExperience')}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferred_routes">{t('profile.preferredRoutes')}</Label>
                      <div className="flex">
                        <MapPin className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="preferred_routes"
                          name="preferred_routes"
                          value={formState.preferred_routes}
                          onChange={handleInputChange}
                          placeholder={t('profile.enterPreferredRoutes')}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availability_hours">{t('profile.availabilityHours')}</Label>
                      <div className="flex">
                        <Clock className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="availability_hours"
                          name="availability_hours"
                          value={formState.availability_hours}
                          onChange={handleInputChange}
                          placeholder={t('profile.enterAvailabilityHours')}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isUpdating}
                >
                  {isUpdating ? t('common.saving') : t('common.saveChanges')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
