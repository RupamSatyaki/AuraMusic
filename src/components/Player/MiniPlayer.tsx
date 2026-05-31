import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAudioController } from '../../hooks/useAudioController';
import { Colors } from '../../theme/colors';

export const MiniPlayer = () => {
  const { currentTrack, isPlaying } = usePlayerStore();
  const { togglePlayback } = useAudioController();

  if (!currentTrack) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist}>{currentTrack.artist || 'Local Artist'}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
            {isPlaying ? (
              <Pause color={Colors.text} size={30} fill={Colors.text} />
            ) : (
              <Play color={Colors.text} size={30} fill={Colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    marginRight: 10,
  }
});
