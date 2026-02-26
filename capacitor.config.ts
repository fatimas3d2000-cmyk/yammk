import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: 'يمك العافية',
  webDir: 'out',
  server: {
    url: 'http://192.168.200.66:3000',
    cleartext: true,
    allowNavigation: ['*']
  }
};

export default config;
