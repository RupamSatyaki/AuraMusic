import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

interface PlayerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipNext?: () => void;
  onSkipPrev?: () => void;
}

export const PlayerControls = ({ isPlaying, onTogglePlay, onSkipNext, onSkipPrev }: PlayerControlsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.secondaryButton}>
        <Shuffle color="rgba(255, 255, 255, 0.5)" size={24} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.mainButton} onPress={onSkipPrev}>
        <SkipBack color="#FFFFFF" size={36} fill="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.playButton} onPress={onTogglePlay}>
        {isPlaying ? (
          <Pause color="#000000" size={40} fill="#000000" />
        ) : (
          <Play color="#000000" size={40} fill="#000000" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.mainButton} onPress={onSkipNext}>
        <SkipForward color="#FFFFFF" size={36} fill="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}>
        <Repeat color="rgba(255, 255, 255, 0.5)" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginVertical: 30,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    padding: 10,
  },
  secondaryButton: {
    padding: 10,
  }
});
