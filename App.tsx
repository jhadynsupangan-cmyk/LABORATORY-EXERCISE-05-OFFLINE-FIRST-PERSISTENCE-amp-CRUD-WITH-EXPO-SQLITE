import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  useFonts as useDMSans,
} from '@expo-google-fonts/dm-sans';
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
  useFonts as useDMSerif,
} from '@expo-google-fonts/dm-serif-display';
import { colors } from './src/theme/theme';
import { ShopProvider } from './src/context/ShopContext';
import { RootNavigator } from './src/navigation/RootNavigator';

/**
 * Mochito — a Matcha Mochi shop built to the Figma design.
 *
 * Fonts are gated on `useFonts` so the first frame never renders in a
 * fallback face and then reflows.
 */
export default function App() {
  const [dmSansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  const [dmSerifLoaded] = useDMSerif({
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  const fontsLoaded = dmSansLoaded && dmSerifLoaded;

  if (!fontsLoaded) {
    // Holds the splash screen; the view is empty so there is no flash of
    // mis-styled text while the typefaces download.
    return <View style={styles.loading} />;
  }

  return (
    <SafeAreaProvider>
      <ShopProvider>
        {/* `expo-status-bar` handles the bar on both platforms; the Android
            background comes from `app.json` so there is no flash on launch. */}
        <StatusBar style="dark" />
        <RootNavigator />
      </ShopProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.cream,
  },
});
