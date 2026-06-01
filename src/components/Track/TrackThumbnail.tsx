import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Music } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

interface TrackThumbnailProps {
  uri?: string;
  size?: number;
}

export const TrackThumbnail = ({ uri, size = 50 }: TrackThumbnailProps) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Music color={Colors.primary} size={size * 0.5} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
