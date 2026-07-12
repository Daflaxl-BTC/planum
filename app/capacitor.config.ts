import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.planumplants.app',
  appName: 'Planum Plants',
  // Vite baut mit `--mode capacitor` (base '/') nach dist -> lokal gebündelt.
  webDir: 'dist',
  ios: {
    // Universal Links / NFC-Taps auf planumplants.de fängt die App ab,
    // sonst greift die Web-Rückfallebene. Assoziation via Associated Domains
    // (siehe native/entitlements/) + AASA (native/aasa/).
    scheme: 'Planum Plants',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
