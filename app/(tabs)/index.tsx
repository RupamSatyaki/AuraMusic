import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { useEffect, useState, useCallback } from 'react';
import { scanLocalMusic } from '@/src/services/localMedia';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { Music as MusicIcon, RefreshCcw } from 'lucide-react-native';

import { TrackItem } from '@/src/components/Track/TrackItem';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
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
    <TrackItem
      title={item.title || 'Unknown'}
      artist={item.artist || 'Unknown Artist'}
      thumbnail={item.thumbnail}
      onPress={() => setCurrentTrack(item)}
      onOptionsPress={() => console.log('Options for:', item.title)}
    />
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
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
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
    paddingVertical: 15,
    backgroundColor: Colors.background, // Match background
  },
  countText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
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
    paddingBottom: 100, // Space for mini player
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  }
});

