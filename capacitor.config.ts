
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0efecf491e964b25bc908ab61034aec1',
  appName: 'grozo-delivery-hub',
  webDir: 'dist',
  server: {
    url: "https://0efecf49-1e96-4b25-bc90-8ab61034aec1.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0f1c",
      showSpinner: false
    }
  }
};

export default config;
