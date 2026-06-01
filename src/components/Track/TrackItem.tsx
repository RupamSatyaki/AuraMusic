import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TrackThumbnail } from './TrackThumbnail';
import { TrackInfo } from './TrackInfo';
import { TrackOptionsButton } from './TrackOptionsButton';

interface TrackItemProps {
  title: string;
  artist?: string;
  thumbnail?: string;
  onPress?: () => void;
  onOptionsPress?: () => void;
}

export const TrackItem = ({
  title,
  artist,
  thumbnail,
  onPress,
  onOptionsPress,
}: TrackItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <TrackThumbnail uri={thumbnail} />
      <TrackInfo title={title} artist={artist} />
      <TrackOptionsButton onPress={onOptionsPress} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    // Removed background and border as requested
  },
});
