
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import UserProfile from "../UserProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const UserControls = () => {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
