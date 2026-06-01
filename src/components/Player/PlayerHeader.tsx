import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface PlayerHeaderProps {
  onClose: () => void;
  title: string;
}

export const PlayerHeader = ({ onClose, title }: PlayerHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.button}>
        <ChevronDown color="#FFFFFF" size={30} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.subTitle}>PLAYING FROM LIBRARY</Text>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    padding: 5,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  }
});
