import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cryptalk.app',
  appName: 'cryptalk',
  webDir: 'www',
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;

