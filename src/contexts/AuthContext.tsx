
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'passenger' | 'driver';
};

type PassengerDetails = {
  id: string;
  interests: string | null;
  preferred_payment_method: string | null;
  emergency_contact: string | null;
  email: string | null;
};

type DriverDetails = {
  id: string;
  driving_experience_years: number | null;
  preferred_routes: string | null;
  availability_hours: string | null;
  profile_photo_url: string | null;
  email: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  passengerDetails: PassengerDetails | null;
  driverDetails: DriverDetails | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile> & Partial<PassengerDetails> & Partial<DriverDetails>) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
  isDriver: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails | null>(null);
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up an auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setPassengerDetails(null);
          setDriverDetails(null);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch basic profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData as Profile);

      // Based on role, fetch additional details
      if (profileData.role === 'passenger') {
        const { data: passengerData, error: passengerError } = await supabase
          .from('passenger_details')
          .select('*')
          .eq('id', userId)
          .single();

        if (!passengerError) {
          // Ensure email is included when setting passenger details
          setPassengerDetails({
            ...passengerData,
            email: user?.email || null
          } as PassengerDetails);
        }
      } else if (profileData.role === 'driver') {
        const { data: driverData, error: driverError } = await supabase
          .from('driver_details')
          .select('*')
          .eq('id', userId)
          .single();

        if (!driverError) {
          // Ensure email is included when setting driver details
          setDriverDetails({
            ...driverData,
            email: user?.email || null
          } as DriverDetails);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Signed in successfully',
        description: 'Welcome back!',
      });

      // Automatically redirect based on role
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        // Always navigate after login is complete
        const redirectPath = profileData?.role === 'driver' ? '/offer-ride' : '/rides';
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message || 'Please check your credentials',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Use the full absolute URL for redirectTo, including protocol and domain
      const currentUrl = window.location.origin;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Redirecting to Google',
        description: 'Please complete the Google sign in process',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google sign in failed',
        description: error.message || 'Failed to initialize Google sign in',
      });
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile> & Partial<PassengerDetails> & Partial<DriverDetails>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role || 'passenger',
            ...(userData.role === 'passenger' ? {
              interests: userData.interests,
              preferred_payment_method: userData.preferred_payment_method,
              emergency_contact: userData.emergency_contact,
            } : {
              driving_experience_years: userData.driving_experience_years,
              preferred_routes: userData.preferred_routes,
              availability_hours: userData.availability_hours,
              profile_photo_url: userData.profile_photo_url,
            }),
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your registration',
      });

      // Directly signin after signup
      if (data.user) {
        const redirectPath = userData.role === 'driver' ? '/offer-ride' : '/rides';
        await signIn(email, password);
        navigate(redirectPath);
      } else {
        const redirectPath = userData.role === 'driver' ? '/driver-signin' : '/passenger-signin';
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message || 'Failed to create account',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to sign out',
      });
    } finally {
      setLoading(false);
    }
  };

  const isDriver = profile?.role === 'driver';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        passengerDetails,
        driverDetails,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        loading,
        isDriver
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
