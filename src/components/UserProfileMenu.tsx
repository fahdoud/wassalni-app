
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

type Profile = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
};

const UserProfileMenu = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Check current auth state
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        // Fetch user profile information
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        
        if (!error && profileData) {
          setProfile(profileData);
          console.log("Profile data loaded:", profileData);
        } else {
          console.error("Error fetching profile:", error);
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        
        // Fetch profile data
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (!error && profileData) {
          setProfile(profileData);
          console.log("Profile data loaded after sign in:", profileData);
        } else {
          console.error("Error fetching profile after sign in:", error);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  // Use initials from full name or email as fallback
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback className="bg-wassalni-green text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer w-full">
            {t('profile.myProfile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/rides" className="cursor-pointer w-full">
            {t('profile.myRides')}
          </Link>
        </DropdownMenuItem>
        {profile?.role === "driver" && (
          <DropdownMenuItem asChild>
            <Link to="/offer-ride" className="cursor-pointer w-full">
              {t('profile.offerRide')}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          {t('profile.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
