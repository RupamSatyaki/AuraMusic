import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface TrackInfoProps {
  title: string;
  artist?: string;
}

export const TrackInfo = ({ title, artist }: TrackInfoProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.artist} numberOfLines={1}>
        {artist || 'Unknown Artist'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  artist: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
