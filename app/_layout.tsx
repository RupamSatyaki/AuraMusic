import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AudioProvider } from '@/src/context/AudioContext';

export default function RootLayout() {
  return (
    <AudioProvider>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AudioProvider>
  );
}
