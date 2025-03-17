
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

type DriverProfile = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  car_model?: string;
  car_year?: string;
  verification_status?: string;
};

type PassengerProfile = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
};

type UserProfile = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
  avatar_url?: string;
};

const UserProfileMenu = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [passengerProfile, setPassengerProfile] = useState<PassengerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const fetchDriverProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching driver profile:", error);
        return null;
      }
      
      if (data) {
        console.log("Driver profile data loaded:", data);
        return data as DriverProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Unexpected error fetching driver profile:", error);
      return null;
    }
  };

  const fetchPassengerProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("passengers")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching passenger profile:", error);
        return null;
      }
      
      if (data) {
        console.log("Passenger profile data loaded:", data);
        return data as PassengerProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Unexpected error fetching passenger profile:", error);
      return null;
    }
  };

  const fetchLegacyProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching legacy profile:", error);
        return null;
      }
      
      if (data) {
        console.log("Legacy profile data loaded:", data);
        return data as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Unexpected error fetching legacy profile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check current auth state
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        
        if (data.user) {
          // First check if user has a legacy profile
          const legacyProfile = await fetchLegacyProfile(data.user.id);
          if (legacyProfile) {
            setProfile(legacyProfile);
            
            // Based on role, fetch the specific profile
            if (legacyProfile.role === 'driver') {
              const driverData = await fetchDriverProfile(data.user.id);
              if (driverData) {
                setDriverProfile(driverData);
              }
            } else {
              const passengerData = await fetchPassengerProfile(data.user.id);
              if (passengerData) {
                setPassengerProfile(passengerData);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking user:", error);
        toast.error("Error loading user profile");
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        
        // First check if user has a legacy profile
        const legacyProfile = await fetchLegacyProfile(session.user.id);
        if (legacyProfile) {
          setProfile(legacyProfile);
          
          // Based on role, fetch the specific profile
          if (legacyProfile.role === 'driver') {
            const driverData = await fetchDriverProfile(session.user.id);
            if (driverData) {
              setDriverProfile(driverData);
            }
          } else {
            const passengerData = await fetchPassengerProfile(session.user.id);
            if (passengerData) {
              setPassengerProfile(passengerData);
            }
          }
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setDriverProfile(null);
        setPassengerProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  if (!user) return null;

  // Get the appropriate profile based on user role
  const currentProfile = profile?.role === 'driver' ? driverProfile : passengerProfile;
  
  // Use initials from full name or email as fallback
  const fullName = currentProfile?.full_name || profile?.full_name || '';
  
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  // Get avatar URL from appropriate profile
  const avatarUrl = currentProfile?.avatar_url || profile?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={fullName || user.email || ""} />
            ) : null}
            <AvatarFallback className="bg-wassalni-green text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{fullName || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {profile?.role && (
              <p className="text-xs text-muted-foreground capitalize">
                Role: {profile.role}
              </p>
            )}
            {profile?.role === 'driver' && driverProfile?.verification_status && (
              <p className="text-xs text-muted-foreground capitalize">
                Status: {driverProfile.verification_status}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer w-full">
            My Profile
          </Link>
        </DropdownMenuItem>
        
        {profile?.role === 'driver' ? (
          <DropdownMenuItem asChild>
            <Link to="/my-trips" className="cursor-pointer w-full">
              My Trips
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/rides" className="cursor-pointer w-full">
              Available Rides
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/my-reservations" className="cursor-pointer w-full">
            My Reservations
          </Link>
        </DropdownMenuItem>
        
        {profile?.role === "driver" && (
          <DropdownMenuItem asChild>
            <Link to="/offer-ride" className="cursor-pointer w-full">
              Offer Ride
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/feedback" className="cursor-pointer w-full">
            Feedback
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
