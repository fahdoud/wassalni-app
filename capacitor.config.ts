
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.40c89940f5b643c797f2d51bd2a896e3',
  appName: 'wassalni-app',
  webDir: 'dist',
  server: {
    url: "https://40c89940-f5b6-43c7-97f2-d51bd2a896e3.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF"
  },
  ios: {
    backgroundColor: "#FFFFFF",
    preferredContentMode: "mobile"
  }
};

export default config;
