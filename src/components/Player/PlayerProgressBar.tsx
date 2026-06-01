import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';
import { Colors } from '../../theme/colors';
import { useAudioController } from '../../hooks/useAudioController';

interface PlayerProgressBarProps {
  position: number;
  duration: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_MARGIN = 30;
const BAR_WIDTH = SCREEN_WIDTH - (BAR_MARGIN * 2);

export const PlayerProgressBar = ({ position, duration }: PlayerProgressBarProps) => {
  const { seek } = useAudioController();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);

  const currentPos = isSeeking ? seekPosition : position;
  const progress = duration > 0 ? (currentPos / duration) * 100 : 0;

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setIsSeeking(true);
      handleSeek(evt.nativeEvent.locationX);
    },
    onPanResponderMove: (evt) => {
      handleSeek(evt.nativeEvent.locationX);
    },
    onPanResponderRelease: (evt) => {
      const newPos = handleSeek(evt.nativeEvent.locationX);
      seek(newPos);
      setIsSeeking(false);
    },
  });

  const handleSeek = (locationX: number) => {
    let newProgress = locationX / BAR_WIDTH;
    if (newProgress < 0) newProgress = 0;
    if (newProgress > 1) newProgress = 1;
    
    const newPosition = newProgress * duration;
    setSeekPosition(newPosition);
    return newPosition;
  };

  return (
    <View style={styles.container}>
      <View style={styles.barWrapper} {...panResponder.panHandlers}>
        <View style={styles.backgroundBar} />
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
        <View style={[styles.dot, { left: `${progress}%` }]} />
      </View>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{formatTime(currentPos)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: BAR_MARGIN,
    marginVertical: 15,
  },
  barWrapper: {
    height: 20, // Increased touch area
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundBar: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    position: 'absolute',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    marginLeft: -6,
  },
  timeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  }
});
