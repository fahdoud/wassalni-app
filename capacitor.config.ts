
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.40c89940f5b643c797f2d51bd2a896e3',
  appName: 'Wassalni',
  webDir: 'dist',
  server: {
    url: 'https://40c89940-f5b6-43c7-97f2-d51bd2a896e3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#00A672", // Using the wassalni-green color
      showSpinner: true,
      spinnerColor: "#ffffff"
    }
  }
};

export default config;
