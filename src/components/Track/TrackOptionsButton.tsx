import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { Colors } from '../../theme/colors';

interface TrackOptionsButtonProps {
  onPress?: () => void;
}

export const TrackOptionsButton = ({ onPress }: TrackOptionsButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <MoreVertical color={Colors.textMuted} size={22} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginRight: -10, // Offset padding for better alignment
  },
});
