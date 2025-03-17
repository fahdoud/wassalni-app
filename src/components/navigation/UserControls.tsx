
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import UserProfile from "../UserProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const UserControls = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // If no user is authenticated, show sign in and sign up buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/passenger-signin">
          <Button variant="outlined" size="sm">
            {t('nav.signIn')}
          </Button>
        </Link>
        <Link to="/passenger-signup">
          <Button size="sm">{t('nav.signUp')}</Button>
        </Link>
      </div>
    );
  }

  // If user is authenticated, show user profile and logout button
  return (
    <div className="flex items-center gap-3">
      <UserProfile />
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSignOut}
        className="flex items-center gap-2"
      >
        <LogOut size={16} />
        <span className="hidden md:inline">{t('nav.signOut')}</span>
      </Button>
    </div>
  );
};

export default UserControls;
