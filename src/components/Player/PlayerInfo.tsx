import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart, PlusCircle } from 'lucide-react-native';

interface PlayerInfoProps {
  title: string;
  artist?: string;
}

export const PlayerInfo = ({ title, artist }: PlayerInfoProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{artist || 'Unknown Artist'}</Text>
      </View>
      <TouchableOpacity style={styles.iconButton}>
        <PlusCircle color="#FFFFFF" size={28} />
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
    marginVertical: 20,
  },
  textWrapper: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  artist: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 18,
    marginTop: 5,
  },
  iconButton: {
    padding: 5,
  }
});
