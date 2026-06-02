import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { scanLocalMusic, pickLocalFiles } from '@/src/services/localMedia';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { Shuffle, PlayCircle, RefreshCw, MessageSquare, Music as MusicIcon, ChevronRight, Folder, ChevronLeft } from 'lucide-react-native';

import { TrackItem } from '@/src/components/Track/TrackItem';

const CATEGORIES = ['For You', 'Songs', 'Folders', 'Albums', 'Artists', 'Genres'];

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('For You');
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
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

  const handleScan = useCallback(async () => {
    if (Platform.OS === 'web') {
      const pickedTracks = await pickLocalFiles();
      pickedTracks.forEach(track => {
        addToQueue(track as any);
      });
      // Optionally set the first picked track as current
      if (pickedTracks.length > 0) {
        setCurrentTrack(pickedTracks[0] as any);
      }
    } else {
      setRefreshing(true);
      loadMusic();
    }
  }, [loadMusic, addToQueue, setCurrentTrack]);

  const onRefresh = () => {
    if (Platform.OS === 'web') {
      loadMusic(); // Reload samples
    } else {
      setRefreshing(true);
      loadMusic();
    }
  };

  const handleCategoryPress = (category: string) => {
    if (category === activeCategory) return;
    
    setSelectedFolder(null);
    setCategoryLoading(true);
    setActiveCategory(category);
    
    // Smooth transition for all categories
    setTimeout(() => {
      setCategoryLoading(false);
    }, 400);
  };

  const handleFolderPress = (folderName: string) => {
    setCategoryLoading(true);
    setSelectedFolder(folderName);
    setTimeout(() => {
      setCategoryLoading(false);
    }, 400);
  };

  const sortedGroupedSongs = useMemo(() => {
    if (queue.length === 0) return [];
    
    const sortedSongs = [...queue].sort((a, b) => a.title.localeCompare(b.title));
    const grouped: any[] = [];
    let lastDivider = '';

    sortedSongs.forEach(song => {
      const firstChar = song.title.charAt(0).toUpperCase();
      const currentDivider = /[A-Z]/.test(firstChar) ? firstChar : '#';
      
      if (currentDivider !== lastDivider) {
        grouped.push({ type: 'divider', label: currentDivider });
        lastDivider = currentDivider;
      }
      grouped.push({ type: 'song', ...song });
    });
    return grouped;
  }, [queue]);

  const folders = useMemo(() => {
    const folderMap: { [key: string]: any[] } = {};
    queue.forEach(track => {
      let folderName = 'Internal Storage';
      
      if (typeof track.uri === 'string' && track.uri.includes('/')) {
        folderName = track.uri.split('/').slice(-2, -1)[0];
      } else if (typeof track.uri === 'number') {
        folderName = 'App Music';
      }
      
      if (!folderMap[folderName]) {
        folderMap[folderName] = [];
      }
      folderMap[folderName].push(track);
    });

    return Object.keys(folderMap).map(name => ({
      name,
      tracks: folderMap[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [queue]);

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
    if (categoryLoading) {
      return (
        <View style={styles.categoryLoadingContainer}>
          <ActivityIndicator size="medium" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading songs...</Text>
        </View>
      );
    }

    return (
      <View style={styles.songsListContainer}>
        {sortedGroupedSongs.map((item, index) => {
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

  const renderFoldersList = () => {
    if (categoryLoading) {
      return (
        <View style={styles.categoryLoadingContainer}>
          <ActivityIndicator size="medium" color={Colors.primary} />
          <Text style={styles.loadingText}>
            {selectedFolder ? `Opening ${selectedFolder}...` : 'Scanning folders...'}
          </Text>
        </View>
      );
    }

    if (selectedFolder) {
      const folderData = folders.find(f => f.name === selectedFolder);
      return (
        <View style={styles.folderContentContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              setCategoryLoading(true);
              setSelectedFolder(null);
              setTimeout(() => setCategoryLoading(false), 300);
            }}
          >
            <ChevronLeft color={Colors.primary} size={20} />
            <Text style={styles.backButtonText}>Back to Folders</Text>
          </TouchableOpacity>
          
          <View style={styles.folderHeader}>
            <Folder color={Colors.primary} size={30} fill={Colors.primary + '20'} />
            <View style={styles.folderHeaderText}>
              <Text style={styles.folderTitle}>{selectedFolder}</Text>
              <Text style={styles.folderSubtitle}>{folderData?.tracks.length} Songs</Text>
            </View>
          </View>

          {folderData?.tracks.map(track => (
            <TrackItem
              key={track.id}
              title={track.title}
              artist={track.artist || 'Unknown Artist'}
              thumbnail={track.thumbnail}
              onPress={() => setCurrentTrack(track)}
            />
          ))}
        </View>
      );
    }

    return (
      <View style={styles.foldersGrid}>
        {folders.map((folder) => (
          <TouchableOpacity 
            key={folder.name} 
            style={styles.folderCard}
            onPress={() => handleFolderPress(folder.name)}
          >
            <View style={styles.folderIconWrapper}>
              <Folder color="#888888" size={32} />
              <View style={styles.trackCountBadge}>
                <Text style={styles.trackCountText}>{folder.tracks.length}</Text>
              </View>
            </View>
            <Text style={styles.folderName} numberOfLines={1}>{folder.name}</Text>
            <Text style={styles.folderInfo}>Folder</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderComingSoon = () => {
    if (categoryLoading) {
      return (
        <View style={styles.categoryLoadingContainer}>
          <ActivityIndicator size="medium" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading {activeCategory}...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <MusicIcon color="rgba(255, 255, 255, 0.1)" size={80} style={{ marginBottom: 20 }} />
        <Text style={styles.emptyText}>{activeCategory} feature is coming soon!</Text>
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
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity 
            key={category} 
            onPress={() => handleCategoryPress(category)}
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
          <View style={styles.actionsGrid}>
            {renderActionCard('Shuffle', Shuffle, () => {})}
            {renderActionCard('Play', PlayCircle, () => {})}
            {renderActionCard('Scan', RefreshCw, handleScan)}
            {renderActionCard('Feedback', MessageSquare, () => {})}
          </View>

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
      ) : activeCategory === 'Folders' ? (
        renderFoldersList()
      ) : (
        renderComingSoon()
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
    paddingVertical: 10,
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
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
    fontSize: 13,
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
    backgroundColor: 'transparent',
  },
  actionTitle: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
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
    paddingVertical: 50,
  },
  loadingText: {
    color: Colors.textMuted,
    marginTop: 10,
  },
  categoryLoadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
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
  foldersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 10,
  },
  folderCard: {
    width: '30%',
    margin: '1.66%',
    alignItems: 'center',
    marginBottom: 20,
  },
  folderIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  trackCountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  trackCountText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  folderName: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  folderInfo: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  folderContentContainer: {
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
  },
  folderHeaderText: {
    marginLeft: 15,
  },
  folderTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  folderSubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
