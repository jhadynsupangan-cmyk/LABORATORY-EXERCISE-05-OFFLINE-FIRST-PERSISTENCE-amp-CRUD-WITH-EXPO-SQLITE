/* eslint-env jest */

import React from 'react';

// AsyncStorage ships an official in-memory mock for tests.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// `expo-sqlite` is a native module with no Jest environment of its own. The
// mock mirrors the exact statements `src/services/db.ts` issues and throws on
// anything it does not recognise, so the two cannot drift apart silently.
jest.mock('expo-sqlite', () => require('./jest.sqlite-mock'));

// `SafeAreaProvider` withholds its children until it has measured real layout
// insets, which never happens in the test renderer. Swap in a pass-through
// version that returns fixed, realistic metrics.
jest.mock('react-native-safe-area-context', () => {
  const ReactLocal = require('react');
  const inset = { top: 47, right: 0, bottom: 34, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };

  return {
    SafeAreaProvider: ({ children, ...props }) =>
      ReactLocal.createElement(require('react-native').View, props, children),
    SafeAreaView: ({ children, ...props }) =>
      ReactLocal.createElement(require('react-native').View, props, children),
    SafeAreaInsetsContext: ReactLocal.createContext(inset),
    SafeAreaFrameContext: ReactLocal.createContext(frame),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets: inset, frame },
    withSafeAreaInsets: (Component) => Component,
  };
});

// Fonts download asynchronously on a device, and `App` parks on an empty view
// until they land. In tests there is no download, so short-circuit the hooks to
// report "loaded" on the very first render — no effects, no promise chain, and
// remounts behave the same as a cold start.
// The real font modules are kept so the `.ttf` asset transformer still runs.
jest.mock('@expo-google-fonts/dm-sans', () => ({
  ...jest.requireActual('@expo-google-fonts/dm-sans'),
  useFonts: () => [true, null],
}));
jest.mock('@expo-google-fonts/dm-serif-display', () => ({
  ...jest.requireActual('@expo-google-fonts/dm-serif-display'),
  useFonts: () => [true, null],
}));

// `expo-font` pulls in `expo-asset`, which is only nested under
// `node_modules/expo/node_modules`; mocking it keeps resolution out of the way.
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(async () => undefined),
  isLoaded: jest.fn(() => true),
}));

// Keep native-stack from needing a real native view hierarchy in tests.
jest.mock('react-native-screens', () => {
  const actual = jest.requireActual('react-native-screens');
  return { ...actual, enableScreens: jest.fn() };
});

// Give every test an empty database, the equivalent of a cold app launch.
//
// This used to happen by accident: the AsyncStorage mock's methods are
// `jest.fn()`, and `jest-expo` sets `resetMocks: true`, so Jest stripped their
// implementations between tests and every write silently did nothing. The SQLite
// mock is plain functions, so without this the basket, favourites and order
// history would leak from one test into the next.
beforeEach(() => {
  const db = require('./src/services/db');
  db.resetConnection();
  db.resetInitialisation();
  const inventory = require('./src/services/inventoryDb');
  inventory.resetInventoryConnection();
  require('./jest.sqlite-mock').__reset();
});