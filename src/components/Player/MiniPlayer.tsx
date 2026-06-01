import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAudioController } from '../../hooks/useAudioController';
import { Colors } from '../../theme/colors';
import { TrackThumbnail } from '../Track/TrackThumbnail';

const { width } = Dimensions.get('window');

export const MiniPlayer = () => {
  const { currentTrack, isPlaying, setPlayerVisible } = usePlayerStore();
  const { togglePlayback, playNext, position, duration } = useAudioController();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={() => setPlayerVisible(true)}
        activeOpacity={0.9}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <TrackThumbnail uri={currentTrack.thumbnail} size={45} />
            <View style={styles.trackInfo}>
              <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
              <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist || 'Local Artist'}</Text>
            </View>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity onPress={togglePlayback} style={styles.controlButton}>
              {isPlaying ? (
                <Pause color={Colors.text} size={28} fill={Colors.text} />
              ) : (
                <Play color={Colors.text} size={28} fill={Colors.text} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={playNext} style={styles.controlButton}>
              <SkipForward color={Colors.text} size={24} fill={Colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 85, // Above the tab bar (assuming standard height)
    left: 10,
    right: 10,
    zIndex: 100,
  },
  container: {
    backgroundColor: Colors.surface,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackInfo: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginLeft: 4,
  },
  progressContainer: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    position: 'absolute',
    bottom: 0,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  }
});
