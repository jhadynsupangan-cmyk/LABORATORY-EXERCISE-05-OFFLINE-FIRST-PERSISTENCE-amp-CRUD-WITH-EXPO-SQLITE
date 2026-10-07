/**
 * Jest configuration for the Mochito app.
 *
 * `jest-expo` supplies the React Native transform + module mocks; the setup
 * file adds the native modules the tests exercise (AsyncStorage, fonts).
 */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // The app mounts the full navigation tree plus a fair amount of SVG; give
  // each test room on slower machines.
  testTimeout: 30000,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-screens|react-native-safe-area-context))',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};