
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import GradientText from "@/components/ui-components/GradientText";
import { Check, MapPin, Calendar, Clock, User, CreditCard, ChevronLeft } from "lucide-react";

interface Ride {
  id: number;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  rating: number;
}

const ReservationPage = () => {
  const { t } = useLanguage();
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Fetch ride data - in a real app, this would be an API call
  useEffect(() => {
    // Mocked ride data for now
    const rides: Ride[] = [
      {
        id: 1,
        driver: "Mohamed A.",
        from: "Ali Mendjeli",
        to: "City Center",
        date: "2023-06-24",
        time: "08:30",
        price: 200,
        seats: 3,
        rating: 4.8,
      },
      {
        id: 2,
        driver: "Sara B.",
        from: "City Center",
        to: "El Khroub",
        date: "2023-06-24",
        time: "10:15",
        price: 150,
        seats: 2,
        rating: 4.5,
      },
      {
        id: 3,
        driver: "Ahmed K.",
        from: "Boussouf",
        to: "Didouche Mourad",
        date: "2023-06-24",
        time: "12:00",
        price: 180,
        seats: 1,
        rating: 4.9,
      },
      {
        id: 4,
        driver: "Fatima Z.",
        from: "Zighoud Youcef",
        to: "Ain Abid",
        date: "2023-06-24",
        time: "15:30",
        price: 250,
        seats: 4,
        rating: 4.7,
      },
      {
        id: 5,
        driver: "Karim M.",
        from: "Hamma Bouziane",
        to: "Bekira",
        date: "2023-06-24",
        time: "17:45",
        price: 120,
        seats: 2,
        rating: 4.6,
      },
    ];

    const foundRide = rides.find(r => r.id === parseInt(rideId || "0"));
    if (foundRide) {
      setRide(foundRide);
    } else {
      // Handle ride not found
      navigate("/rides");
    }
  }, [rideId, navigate]);

  const handleReservation = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Move to success step
    }, 1500);
  };

  if (!ride) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <button 
            onClick={() => navigate("/rides")} 
            className="flex items-center text-gray-600 hover:text-wassalni-green mb-6 transition-colors dark:text-gray-300 dark:hover:text-wassalni-lightGreen"
          >
            <ChevronLeft size={18} />
            <span>{t('reservation.backToRides')}</span>
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <GradientText>{t('reservation.title')}</GradientText>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{t('reservation.subtitle')}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
              {step === 1 && (
                <div className="glass-card p-8 rounded-xl mb-6">
                  <h2 className="text-xl font-semibold mb-6">{t('reservation.tripDetails')}</h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mr-4">
                        {ride.driver.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{ride.driver}</p>
                        <div className="flex items-center text-yellow-500 text-sm">
                          {'★'.repeat(Math.floor(ride.rating))}
                          <span className="text-gray-400 ml-1">{ride.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-2 mt-6">
                      <div className="relative pl-8 pb-8">
                        <div className="absolute top-0 left-0 h-full w-[2px] bg-gray-200 dark:bg-gray-700"></div>
                        <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-wassalni-green -translate-x-1/2"></div>
                        <div>
                          <p className="font-medium">{ride.from}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{ride.time}</p>
                        </div>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-wassalni-blue -translate-x-1/2"></div>
                        <div>
                          <p className="font-medium">{ride.to}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.estimatedArrival')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-8">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-gray-700">
                      <Calendar size={16} className="text-wassalni-green dark:text-wassalni-lightGreen" />
                      <span>
                        {new Date(ride.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-gray-700">
                      <Clock size={16} className="text-wassalni-green dark:text-wassalni-lightGreen" />
                      <span>{ride.time}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full dark:bg-gray-700">
                      <User size={16} className="text-wassalni-green dark:text-wassalni-lightGreen" />
                      <span>{ride.seats} {ride.seats === 1 ? t('rides.seat') : t('rides.seats')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button 
                      className="w-full"
                      onClick={() => setStep(2)}
                    >
                      {t('reservation.continueToPayment')}
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="glass-card p-8 rounded-xl mb-6">
                  <h2 className="text-xl font-semibold mb-6">{t('reservation.paymentDetails')}</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                      {t('reservation.numberOfPassengers')}
                    </label>
                    <div className="flex items-center">
                      <button
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                        disabled={passengerCount <= 1}
                      >
                        -
                      </button>
                      <span className="mx-4 font-medium w-8 text-center">{passengerCount}</span>
                      <button
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        onClick={() => setPassengerCount(Math.min(ride.seats, passengerCount + 1))}
                        disabled={passengerCount >= ride.seats}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                      {t('reservation.paymentMethod')}
                    </label>
                    <div className="space-y-3">
                      <div 
                        className={`border rounded-lg p-4 cursor-pointer transition-all flex items-center ${
                          paymentMethod === 'cash' 
                            ? 'border-wassalni-green bg-wassalni-green/5 dark:border-wassalni-lightGreen dark:bg-wassalni-lightGreen/10' 
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          paymentMethod === 'cash' 
                            ? 'border-wassalni-green dark:border-wassalni-lightGreen' 
                            : 'border-gray-400 dark:border-gray-500'
                        }`}>
                          {paymentMethod === 'cash' && (
                            <div className="w-3 h-3 rounded-full bg-wassalni-green dark:bg-wassalni-lightGreen"></div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{t('reservation.cashPayment')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.payDriver')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.baseFare')}</span>
                      <span>{ride.price} DZD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.passengers')} × {passengerCount}</span>
                      <span>{ride.price * passengerCount} DZD</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span>{t('reservation.total')}</span>
                      <span className="text-wassalni-green dark:text-wassalni-lightGreen">{ride.price * passengerCount} DZD</span>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outlined" 
                      className="flex-1" 
                      onClick={() => setStep(1)}
                    >
                      {t('reservation.back')}
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleReservation}
                      isLoading={loading}
                    >
                      {t('reservation.confirmReservation')}
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="glass-card p-8 rounded-xl mb-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 dark:bg-green-900/30">
                    <Check size={40} className="text-green-500 dark:text-green-400" />
                  </div>
                  
                  <h2 className="text-2xl font-semibold mb-4">{t('reservation.reservationConfirmed')}</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto dark:text-gray-300">
                    {t('reservation.confirmationMessage')}
                  </p>
                  
                  <div className="glass-card border border-gray-200 p-6 rounded-lg mb-8 max-w-md mx-auto text-left dark:border-gray-700">
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.reservationId')}</span>
                      <span className="font-medium">WAS-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.driver')}</span>
                      <span className="font-medium">{ride.driver}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.date')}</span>
                      <span className="font-medium">
                        {new Date(ride.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.time')}</span>
                      <span className="font-medium">{ride.time}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.passengers')}</span>
                      <span className="font-medium">{passengerCount}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.total')}</span>
                      <span className="font-medium text-wassalni-green dark:text-wassalni-lightGreen">{ride.price * passengerCount} DZD</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outlined" 
                      className="flex-1" 
                      onClick={() => navigate('/rides')}
                    >
                      {t('reservation.backToRides')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {(step === 1 || step === 2) && (
              <div className="lg:w-80">
                <div className="glass-card p-6 rounded-xl sticky top-28">
                  <h3 className="font-semibold mb-4">{t('reservation.tripSummary')}</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin size={18} className="text-wassalni-green shrink-0 dark:text-wassalni-lightGreen" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('form.from')}</p>
                      <p className="font-medium">{ride.from}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin size={18} className="text-wassalni-blue shrink-0 dark:text-wassalni-lightBlue" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('form.to')}</p>
                      <p className="font-medium">{ride.to}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.date')}</p>
                      <p className="font-medium">
                        {new Date(ride.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <Clock size={18} className="text-gray-500 shrink-0 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('reservation.time')}</p>
                      <p className="font-medium">{ride.time}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">{t('reservation.price')}</span>
                      <span className="font-medium">{ride.price} DZD</span>
                    </div>
                    {step === 2 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-300">{t('reservation.passengers')}</span>
                        <span className="font-medium">× {passengerCount}</span>
                      </div>
                    )}
                    <div className="flex justify-between mt-2 pt-2 border-t border-gray-200 font-medium dark:border-gray-700">
                      <span>{t('reservation.total')}</span>
                      <span className="text-wassalni-green dark:text-wassalni-lightGreen">
                        {step === 1 ? ride.price : ride.price * passengerCount} DZD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReservationPage;
