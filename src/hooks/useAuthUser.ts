
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthUser = () => {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      setCheckingAuth(true);
      console.log("Fetching user in AuthUser hook");
      const { data: { user } } = await supabase.auth.getUser();
      console.log("User data in AuthUser hook:", user ? "User found" : "No user");
      setUser(user);
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        setUserName(profile?.full_name || user.email || "User");
      }
      setCheckingAuth(false);
    };
    fetchUser();

    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in AuthUser hook:", event, "Session:", !!session);
      fetchUser(); // Refetch user data when auth state changes
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, userName, checkingAuth };
};
