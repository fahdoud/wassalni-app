
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Car, MapPin, Bell, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const UserProfile = () => {
  const { user, profile, driverDetails, passengerDetails, signOut, isDriver } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock notification counter
  const notificationCount = 3;

  if (!user || !profile) {
    return null;
  }

  const userInitials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";
    
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          aria-label="User profile menu"
        >
          <Avatar className="h-10 w-10 border-2 border-wassalni-green transition-transform hover:scale-105">
            <AvatarImage 
              src={isDriver && driverDetails?.profile_photo_url ? driverDetails.profile_photo_url : ""} 
              alt={profile.full_name || "User"} 
            />
            <AvatarFallback className="bg-wassalni-green text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile.full_name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="pt-1">
              <Badge variant="outline" className="text-[10px] px-2 py-0 text-wassalni-green border-wassalni-green">
                {isDriver ? 'Driver' : 'Passenger'}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <Link to="/profile" onClick={() => setIsOpen(false)}>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        
        <Link to="/notifications" onClick={() => setIsOpen(false)}>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            {notificationCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {notificationCount}
              </Badge>
            )}
          </DropdownMenuItem>
        </Link>
        
        {isDriver ? (
          <>
            <Link to="/my-rides" onClick={() => setIsOpen(false)}>
              <DropdownMenuItem>
                <Car className="mr-2 h-4 w-4" />
                <span>My Offered Rides</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/earnings" onClick={() => setIsOpen(false)}>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Earnings</span>
              </DropdownMenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
              <DropdownMenuItem>
                <MapPin className="mr-2 h-4 w-4" />
                <span>My Bookings</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/payment-methods" onClick={() => setIsOpen(false)}>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Payment Methods</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
        
        <Link to="/settings" onClick={() => setIsOpen(false)}>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
