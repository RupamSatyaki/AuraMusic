import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Colors } from '@/src/theme/colors';
import { useEffect, useState, useCallback } from 'react';
import { scanLocalMusic } from '@/src/services/localMedia';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { Music as MusicIcon, RefreshCcw } from 'lucide-react-native';

export default function LibraryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { queue, addToQueue, clearQueue, setCurrentTrack } = usePlayerStore();

  const loadMusic = useCallback(async () => {
    const tracks = await scanLocalMusic();
    clearQueue();
    tracks.forEach(track => {
      if (track.id) addToQueue(track as any);
    });
    setLoading(false);
    setRefreshing(false);
  }, [clearQueue, addToQueue]);

  useEffect(() => {
    loadMusic();
  }, [loadMusic]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMusic();
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
      <Text style={styles.duration}>
        {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Scanning your music...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.countText}>{queue.length} Songs Found</Text>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
          <RefreshCcw color={Colors.primary} size={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={queue}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No music found. Add some songs to your device!</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
  },
  countText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.textMuted,
    marginTop: 10,
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
  duration: {
    color: Colors.textMuted,
    fontSize: 12,
    marginLeft: 10,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  }
});
