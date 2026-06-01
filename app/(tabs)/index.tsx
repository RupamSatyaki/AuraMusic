import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { useEffect, useState, useCallback } from 'react';
import { scanLocalMusic } from '@/src/services/localMedia';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { Shuffle, PlayCircle, RefreshCw, MessageSquare, Music as MusicIcon, ChevronRight } from 'lucide-react-native';

import { TrackItem } from '@/src/components/Track/TrackItem';

const CATEGORIES = ['For You', 'Songs', 'Folders', 'Albums', 'Artists', 'Genres'];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('For You');
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

  const renderActionCard = (title: string, Icon: any, onPress: () => void) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon color="#888888" size={24} />
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

  const renderSongsList = () => {
    const sortedSongs = [...queue].sort((a, b) => a.title.localeCompare(b.title));
    const groupedSongs: any[] = [];
    let lastChar = '';

    sortedSongs.forEach(song => {
      const firstChar = song.title.charAt(0).toUpperCase();
      if (firstChar !== lastChar) {
        groupedSongs.push({ type: 'divider', label: firstChar });
        lastChar = firstChar;
      }
      groupedSongs.push({ type: 'song', ...song });
    });

    return (
      <View style={styles.songsListContainer}>
        {groupedSongs.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <View key={`divider-${item.label}`} style={styles.dividerContainer}>
                <Text style={styles.dividerText}>{item.label}</Text>
                <View style={styles.dividerLine} />
              </View>
            );
          }
          return (
            <TrackItem
              key={item.id}
              title={item.title}
              artist={item.artist || 'Unknown Artist'}
              thumbnail={item.thumbnail}
              onPress={() => setCurrentTrack(item)}
            />
          );
        })}
      </View>
    );
  };

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
        {CATEGORIES.map((category) => (
          <TouchableOpacity 
            key={category} 
            onPress={() => setActiveCategory(category)}
            style={[styles.categoryTab, activeCategory === category && styles.activeCategoryTab]}
          >
            <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeCategory === 'For You' ? (
        <>
          {/* Quick Actions Grid */}
          <View style={styles.actionsGrid}>
            {renderActionCard('Shuffle', Shuffle, () => {})}
            {renderActionCard('Play', PlayCircle, () => {})}
            {renderActionCard('Scan', RefreshCw, onRefresh)}
            {renderActionCard('Feedback', MessageSquare, () => {})}
          </View>

          {/* Sections */}
          {renderSectionHeader('Last Added')}
          <FlatList
            horizontal
            data={queue.slice(0, 5)}
            renderItem={renderHorizontalTrack}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />

          {renderSectionHeader('Recently Played')}
          <FlatList
            horizontal
            data={queue.slice(5, 10)}
            renderItem={renderHorizontalTrack}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />

          {renderSectionHeader('Most Played')}
          <FlatList
            horizontal
            data={queue.slice(10, 15)}
            renderItem={renderHorizontalTrack}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </>
      ) : activeCategory === 'Songs' ? (
        renderSongsList()
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{activeCategory} content coming soon!</Text>
        </View>
      )}
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
    paddingVertical: 10, // Reduced from 15
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Very low grayish/white bg
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeCategoryTab: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary + '40',
  },
  categoryText: {
    color: Colors.textMuted,
    fontSize: 13, // Reduced from 14
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Subtle grayish bg
    borderRadius: 16,
    padding: 12,
    margin: '2.5%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: 'transparent', // Removed background
  },
  actionTitle: {
    color: '#888888', // Gray text to match icons
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20, // Reduced from 25
    marginBottom: 12, // Reduced from 15
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
  songsListContainer: {
    paddingHorizontal: 0,
    marginTop: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  dividerText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    width: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 10,
  },
});

