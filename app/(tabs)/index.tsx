import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { useEffect, useState, useCallback } from 'react';
import { scanLocalMusic } from '@/src/services/localMedia';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { Shuffle, Play, RefreshCcw, MessageSquare, Music as MusicIcon, ChevronRight } from 'lucide-react-native';

const CATEGORIES = ['For You', 'Songs', 'Folders', 'Albums', 'Artists', 'Genres'];

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

  const renderActionCard = (title: string, Icon: any, color: string, onPress: () => void) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: color + '20' }]}>
        <Icon color={color} size={24} fill={title === 'Play' ? color : 'transparent'} />
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See All</Text>
        <ChevronRight color={Colors.primary} size={16} />
      </TouchableOpacity>
    </View>
  );

  const renderHorizontalTrack = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.horizontalTrack} onPress={() => setCurrentTrack(item)}>
      <View style={styles.trackBanner}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.bannerImage} />
        ) : (
          <View style={styles.bannerPlaceholder}>
            <MusicIcon color={Colors.primary} size={40} />
          </View>
        )}
      </View>
      <Text style={styles.trackName} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.trackArtist} numberOfLines={1}>{item.artist || 'Unknown Artist'}</Text>
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
      }
    >
      {/* Top Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((category, index) => (
          <TouchableOpacity 
            key={category} 
            style={[styles.categoryTab, index === 0 && styles.activeCategoryTab]}
          >
            <Text style={[styles.categoryText, index === 0 && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Actions Grid */}
      <View style={styles.actionsGrid}>
        {renderActionCard('Shuffle', Shuffle, '#FF5722', () => {})}
        {renderActionCard('Play', Play, Colors.primary, () => {})}
        {renderActionCard('Scan', RefreshCcw, '#2196F3', onRefresh)}
        {renderActionCard('Feedback', MessageSquare, '#9C27B0', () => {})}
      </View>

      {/* Last Added Section */}
      {renderSectionHeader('Last Added')}
      <FlatList
        horizontal
        data={queue.slice(0, 5)}
        renderItem={renderHorizontalTrack}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContent}
      />

      {/* Recently Played Section */}
      {renderSectionHeader('Recently Played')}
      <FlatList
        horizontal
        data={queue.slice(5, 10)}
        renderItem={renderHorizontalTrack}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContent}
      />

      {/* Most Played Section */}
      {renderSectionHeader('Most Played')}
      <FlatList
        horizontal
        data={queue.slice(10, 15)}
        renderItem={renderHorizontalTrack}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  categoryScroll: {
    paddingVertical: 15,
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeCategoryTab: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary + '40',
  },
  categoryText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: Colors.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 5,
  },
  actionCard: {
    width: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    margin: '2.5%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: Colors.primary,
    fontSize: 14,
    marginRight: 4,
  },
  horizontalListContent: {
    paddingHorizontal: 16,
  },
  horizontalTrack: {
    width: 150,
    marginRight: 15,
  },
  trackBanner: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  trackArtist: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
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
});

