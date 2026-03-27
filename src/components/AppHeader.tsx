import { useLocation } from 'react-router-dom';
import Logo from './ui-components/Logo';
import LanguageSwitcher from './ui-components/LanguageSwitcher';
import ThemeToggle from './ui-components/ThemeToggle';
import UserProfileMenu from './UserProfileMenu';
import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AppHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      setIsLoggedIn(event === 'SIGNED_IN');
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Hide on auth/onboarding pages
  const hiddenPaths = ['/passenger-signin', '/driver-signin', '/passenger-signup', '/driver-signup', '/onboarding', '/verify-email', '/verify-phone', '/auth'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;
  if (location.pathname.startsWith('/reservation/') || location.pathname.startsWith('/ride/')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border safe-area-top">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="text-lg font-bold bg-gradient-to-r from-[#00A693] to-[#94C5FF] bg-clip-text text-transparent">
            Wasslink
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
          {isLoggedIn && <UserProfileMenu />}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
