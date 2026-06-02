import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TrackThumbnail } from './TrackThumbnail';
import { TrackInfo } from './TrackInfo';
import { TrackOptionsButton } from './TrackOptionsButton';

import { Volume2 } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

interface TrackItemProps {
  title: string;
  artist?: string;
  thumbnail?: string;
  onPress?: () => void;
  onOptionsPress?: () => void;
  isActive?: boolean;
  isPlaying?: boolean;
}

export const TrackItem = React.memo(({
  title,
  artist,
  thumbnail,
  onPress,
  onOptionsPress,
  isActive,
  isPlaying,
}: TrackItemProps) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isActive && styles.activeContainer]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <TrackThumbnail uri={thumbnail} />
      <TrackInfo title={title} artist={artist} isActive={isActive} />
      {isActive && isPlaying ? (
        <View style={styles.playingIndicator}>
          <Volume2 color={Colors.primary} size={18} />
        </View>
      ) : (
        <TrackOptionsButton onPress={onOptionsPress} />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  activeContainer: {
    backgroundColor: 'rgba(29, 185, 84, 0.05)',
  },
  playingIndicator: {
    padding: 8,
    marginLeft: 4,
  }
});
