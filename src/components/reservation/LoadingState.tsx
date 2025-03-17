
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoadingState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-wassalni-green" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading ride details...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingState;
