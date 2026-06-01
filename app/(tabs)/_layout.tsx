import { Tabs } from 'expo-router';
import { View, StyleSheet, Pressable } from 'react-native';
import { Home, Search, Library, User } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  useSharedValue,
  interpolate
} from 'react-native-reanimated';

import { Colors } from '../../src/theme/colors';
import TopHeader from '../../src/components/TopHeader';
import { MiniPlayer } from '../../src/components/Player/MiniPlayer';
import { FullPlayer } from '../../src/components/Player/FullPlayer';

const AnimatedIcon = ({ children, focused }: { children: React.ReactNode; focused: boolean }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(focused ? 1.2 : 1, { damping: 12 }) }],
      opacity: withTiming(focused ? 1 : 0.7),
    };
  });

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <TopHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginBottom: 4,
          },
          tabBarStyle: {
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            borderTopColor: 'rgba(255, 255, 255, 0.08)',
            height: 62,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            borderTopWidth: 1,
            paddingTop: 8,
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
                <Home color={color} size={24} />
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
                <Search color={color} size={24} />
              </AnimatedIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="playlist"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon focused={focused}>
                <Library color={color} size={24} />
              </AnimatedIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedIcon focused={focused}>
                <User color={color} size={24} />
              </AnimatedIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="downloader"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <MiniPlayer />
      <FullPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
