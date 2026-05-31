import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Music, Download } from 'lucide-react-native';

import { Colors } from '@/src/theme/colors';
import { MiniPlayer } from '@/src/components/Player/MiniPlayer';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.surface,
            height: 60,
            paddingBottom: 10,
          },
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTitleStyle: {
            color: Colors.text,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => <Music color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="downloader"
          options={{
            title: 'Download',
            tabBarIcon: ({ color, size }) => <Download color={color} size={size} />,
          }}
        />
      </Tabs>
      <MiniPlayer />
    </View>
  );
}
