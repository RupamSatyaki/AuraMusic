import { Stack } from 'expo-router';
import { AudioProvider } from '@/src/context/AudioContext';

export default function RootLayout() {
  return (
    <AudioProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AudioProvider>
  );
}
