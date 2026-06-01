import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Home, Search, Library, User } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { Colors } from '@/src/theme/colors';
import { MiniPlayer } from '@/src/components/Player/MiniPlayer';

const AnimatedIcon = ({ children, focused }: { children: React.ReactNode; focused: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: focused ? withSpring(1.2) : withSpring(1) }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
            height: 70,
            paddingBottom: 12,
            paddingTop: 8,
            elevation: 0,
            borderTopWidth: 1,
          },
          headerStyle: {
            backgroundColor: Colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon focused={focused}>
                <Home color={color} size={26} />
              </AnimatedIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon focused={focused}>
                <Search color={color} size={26} />
              </AnimatedIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="playlist"
          options={{
            title: 'Playlist',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon focused={focused}>
                <Library color={color} size={26} />
              </AnimatedIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon focused={focused}>
                <User color={color} size={26} />
              </AnimatedIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="downloader"
          options={{
            href: null, // Hiding downloader from tab bar as per user request (Home, Search, Playlist, Acc)
          }}
        />
      </Tabs>
      <MiniPlayer />
    </View>
  );
}
