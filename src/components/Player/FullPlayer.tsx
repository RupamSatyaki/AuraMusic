import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useAudioController } from '../../hooks/useAudioController';
import { PlayerHeader } from './PlayerHeader';
import { PlayerAlbumArt } from './PlayerAlbumArt';
import { PlayerInfo } from './PlayerInfo';
import { PlayerProgressBar } from './PlayerProgressBar';
import { PlayerControls } from './PlayerControls';

export const FullPlayer = () => {
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, isPlayerVisible, setPlayerVisible } = usePlayerStore();
  const { togglePlayback, playNext, playPrevious, position, duration } = useAudioController();

  if (!currentTrack) return null;

  return (
    <Modal
      visible={isPlayerVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setPlayerVisible(false)}
    >
      <LinearGradient
        colors={['#424242', '#121212', '#000000']}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        <PlayerHeader 
          onClose={() => setPlayerVisible(false)} 
          title={currentTrack.title} 
        />
        
        <View style={styles.content}>
          <PlayerAlbumArt uri={currentTrack.thumbnail} />
          <PlayerInfo 
            title={currentTrack.title} 
            artist={currentTrack.artist} 
          />
          
          <PlayerProgressBar position={position} duration={duration} />
          
          <PlayerControls 
            isPlaying={isPlaying} 
            onTogglePlay={togglePlayback} 
            onSkipNext={playNext}
            onSkipPrev={playPrevious}
          />
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
