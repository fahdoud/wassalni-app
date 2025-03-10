
import Button from "./Button";
import GradientText from "./ui-components/GradientText";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] aspect-[1/0.5] bg-gradient-radial opacity-20"></div>
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-wassalni-blue/10 blur-3xl"></div>
        <div className="absolute -bottom-[200px] -right-[300px] w-[500px] h-[500px] rounded-full bg-wassalni-purple/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-wassalni-blue/10 text-wassalni-blue text-sm font-medium rounded-full animate-fade-in">
              The Smartest Way to Carpool
            </div>
            <h1 className="animate-slide-up">
              Share Your Journey with
              <br />
              <GradientText>Wassalni</GradientText>
            </h1>
            <p className="text-lg text-gray-600 md:text-xl max-w-2xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Connect with fellow travelers, save money, reduce your carbon footprint, and make new friends along the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button>Find a Ride</Button>
              <Button variant="outlined">Offer a Ride</Button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-wassalni-blue">500K+</span>
                <span className="text-sm text-gray-500">Active Users</span>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-wassalni-blue">10M+</span>
                <span className="text-sm text-gray-500">Rides Shared</span>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-bold text-wassalni-blue">95%</span>
                <span className="text-sm text-gray-500">Satisfaction</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative aspect-[4/3] max-w-xl mx-auto">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-10 blur-xl"></div>
              <div className="relative glass-card rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-wassalni-blue to-wassalni-purple p-6 text-white">
                  <h3 className="text-xl font-semibold">Find a Ride</h3>
                  <p className="text-white/80 text-sm mt-1">Where would you like to go?</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">From</label>
                    <input
                      type="text"
                      placeholder="Departure city"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-blue/30 focus:border-wassalni-blue outline-none transition-all"
                      defaultValue="Tunis, Tunisia"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <input
                      type="text"
                      placeholder="Destination city"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-blue/30 focus:border-wassalni-blue outline-none transition-all"
                      defaultValue="Sousse, Tunisia"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">When</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-wassalni-blue/30 focus:border-wassalni-blue outline-none transition-all"
                    />
                  </div>
                  <Button className="w-full mt-2">Search</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
