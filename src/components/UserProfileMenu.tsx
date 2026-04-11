
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

type UserProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  avatar_url: string | null;
};

const UserProfileMenu = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      return data as UserProfile;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        
        if (data.user) {
          const profileData = await fetchProfile(data.user.id);
          if (profileData) setProfile(profileData);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        if (profileData) setProfile(profileData);
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
    return <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>;
  }

  if (!user) return null;

  const fullName = profile?.full_name || '';
  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
    : user.email?.[0].toUpperCase() || "U";
  const avatarUrl = profile?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName || user.email || ""} /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{fullName || user.email}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {profile?.role && (
              <p className="text-xs text-muted-foreground capitalize">Role: {profile.role}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer w-full">My Profile</Link>
        </DropdownMenuItem>
        {profile?.role === 'driver' ? (
          <DropdownMenuItem asChild>
            <Link to="/my-trips" className="cursor-pointer w-full">My Trips</Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link to="/rides" className="cursor-pointer w-full">Available Rides</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/my-reservations" className="cursor-pointer w-full">My Reservations</Link>
        </DropdownMenuItem>
        {profile?.role === "driver" && (
          <DropdownMenuItem asChild>
            <Link to="/offer-ride" className="cursor-pointer w-full">Offer Ride</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/feedback" className="cursor-pointer w-full">Feedback</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
