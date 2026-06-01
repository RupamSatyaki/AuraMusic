import React, { useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';
import { Music } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const ART_SIZE = width * 0.85;

interface PlayerAlbumArtProps {
  uri?: string;
  onSkipNext?: () => void;
  onSkipPrev?: () => void;
}

export const PlayerAlbumArt = ({ uri, onSkipNext, onSkipPrev }: PlayerAlbumArtProps) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          // Swipe Right -> Previous
          onSkipPrev?.();
        } else if (gestureState.dx < -100) {
          // Swipe Left -> Next
          onSkipNext?.();
        }
        
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const animatedStyle = {
    transform: [
      { translateX: pan.x },
      { rotate: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: ['-10deg', '0deg', '10deg'],
        })
      }
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        {...panResponder.panHandlers}
        style={[styles.shadowWrapper, animatedStyle]}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Music color={Colors.primary} size={ART_SIZE * 0.4} />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  shadowWrapper: {
    width: ART_SIZE,
    height: ART_SIZE,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
