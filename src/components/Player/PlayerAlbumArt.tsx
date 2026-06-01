import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Music } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

const { width } = Dimensions.get('window');
const ART_SIZE = width * 0.85;

interface PlayerAlbumArtProps {
  uri?: string;
}

export const PlayerAlbumArt = ({ uri }: PlayerAlbumArtProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.shadowWrapper}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Music color={Colors.primary} size={ART_SIZE * 0.4} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  shadowWrapper: {
    width: ART_SIZE,
    height: ART_SIZE,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    overflow: 'hidden',
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
