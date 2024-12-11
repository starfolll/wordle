import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Wordle plus',
  webDir: '../app/dist',

  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystorePassword: '1234567890',
      releaseType: 'APK',
      keystoreAlias: 'release-key',
      keystoreAliasPassword: '1234567890',
    },
  },
}

export default config
