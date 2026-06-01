import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/src/theme/colors';

export default function PlaylistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playlists</Text>
      <Text style={styles.text}>Your custom collections</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  text: {
    color: Colors.textMuted,
    marginTop: 10,
  }
});
