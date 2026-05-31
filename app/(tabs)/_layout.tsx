import { Tabs } from 'expo-router';
import { Music, Download } from 'lucide-react-native';

import { Colors } from '@/src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.surface,
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
  );
}
