import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/src/theme/colors';
import { useEffect, useState } from 'react';
import { scanLocalMusic } from '@/src/services/localMedia';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { Music as MusicIcon } from 'lucide-react-native';

export default function LibraryScreen() {
  const [loading, setLoading] = useState(true);
  const { queue, addToQueue, clearQueue, setCurrentTrack } = usePlayerStore();

  useEffect(() => {
    loadMusic();
  }, []);

  const loadMusic = async () => {
    setLoading(true);
    try {
      const tracks = await scanLocalMusic();
      clearQueue();
      tracks.forEach(track => {
        if (track.id) addToQueue(track as any);
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const renderTrackItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.trackItem}
      onPress={() => setCurrentTrack(item)}
    >
      <View style={styles.iconContainer}>
        <MusicIcon color={Colors.primary} size={24} />
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title || 'Unknown'}</Text>
        <Text style={styles.trackArtist}>{item.artist || 'Unknown'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={queue}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No local music found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 10,
  },
  trackItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  trackArtist: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
  }
});
