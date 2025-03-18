
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientText from "@/components/ui-components/GradientText";
import RideSearchForm from "@/components/rides/RideSearchForm";
import RideList from "@/components/rides/RideList";
import { useRides } from "@/hooks/useRides";

const RidesPage = () => {
  const { t } = useLanguage();
  const { rides, loading, liveSeats, setFilter } = useRides();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <section className="section">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="mb-4">
              <GradientText>Constantine</GradientText> {t('rides.title')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('rides.subtitle')}
            </p>
          </div>

          <RideSearchForm onFilter={setFilter} />
          <RideList rides={rides} loading={loading} liveSeats={liveSeats} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RidesPage;
