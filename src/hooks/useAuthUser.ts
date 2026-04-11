
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthUser = () => {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      setCheckingAuth(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        setUserName(profile?.full_name || user.email || "User");
      }
      setCheckingAuth(false);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, userName, checkingAuth };
};
