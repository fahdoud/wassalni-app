
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

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isDriver: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data as Profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
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

      const redirectPath = profile?.role === 'driver' ? '/driver-dashboard' : '/rides';
      navigate(redirectPath);
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

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
            role: userData.role || 'passenger'
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

      // Navigate based on role
      const redirectPath = userData.role === 'driver' ? '/driver-signin' : '/passenger-signin';
      navigate(redirectPath);
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
        signIn,
        signUp,
        signOut,
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
