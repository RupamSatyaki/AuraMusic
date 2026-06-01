import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../theme/colors';

interface PlayerProgressBarProps {
  position: number;
  duration: number;
}

export const PlayerProgressBar = ({ position, duration }: PlayerProgressBarProps) => {
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.barWrapper}>
        <View style={styles.backgroundBar} />
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
        <View style={[styles.dot, { left: `${progress}%` }]} />
      </View>
      <View style={styles.timeWrapper}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    marginVertical: 15,
  },
  barWrapper: {
    height: 4,
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundBar: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
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
