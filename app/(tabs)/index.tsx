import { StyleSheet, Text, View, FlatList } from 'react-native';
import { Colors } from '@/src/theme/colors';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Library</Text>
      <View style={styles.separator} />
      <Text style={styles.emptyText}>No local music found yet.</Text>
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
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: Colors.surface,
  },
  emptyText: {
    color: Colors.textMuted,
  }
});
