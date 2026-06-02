import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/theme/colors';
import { Search, X, Mic, Music } from 'lucide-react-native';
import { TrackItem } from '@/src/components/Track/TrackItem';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { useSearchTracks } from '@/src/hooks/useSearchTracks';
import { SEARCH_CATEGORIES } from '@/src/constants/search';
import { Track } from '@/src/types/track';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { 
    query: searchQuery, 
    results, 
    loading, 
    loadingMore, 
    handleQueryChange, 
    loadMore, 
    clearSearch,
    hasMore,
    searchSource,
    toggleSource
  } = useSearchTracks();
  
  const { setCurrentTrack, currentTrack, isPlaying, addToQueue } = usePlayerStore();

  const handleTrackPress = (track: Track) => {
    addToQueue(track);
    setCurrentTrack(track);
  };

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
      onPress={() => handleQueryChange(item.title)}
    >
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <View style={styles.categoryIconContainer}>
        <Music color="rgba(255, 255, 255, 0.2)" size={40} style={styles.categoryIcon} />
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity 
          style={[
            styles.sourceToggle, 
            { 
              backgroundColor: 
                searchSource === 'itunes' ? '#007AFF22' : 
                searchSource === 'youtube' ? '#FF000022' : '#27d05d22' 
            }
          ]} 
          onPress={toggleSource}
        >
          <Music 
            color={
              searchSource === 'itunes' ? '#007AFF' : 
              searchSource === 'youtube' ? '#FF0000' : '#1DB954'
            } 
            size={20} 
          />
          <Text style={[
            styles.sourceText, 
            { 
              color: 
                searchSource === 'itunes' ? '#007AFF' : 
                searchSource === 'youtube' ? '#FF0000' : '#1DB954' 
            }
          ]}>
            {searchSource === 'itunes' ? 'iTunes' : searchSource === 'youtube' ? 'YouTube' : 'Saavn'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search color={Colors.textMuted} size={20} />
          <TextInput
            placeholder="What do you want to listen to?"
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleQueryChange}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={clearSearch}>
              <X color={Colors.text} size={20} />
            </TouchableOpacity>
          ) : (
            <Mic color={Colors.textMuted} size={20} />
          )}
        </View>
      </View>

      {searchQuery.length === 0 ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Browse all</Text>
          <View style={styles.categoriesGrid}>
            {SEARCH_CATEGORIES.map(item => (
              <View key={item.id} style={styles.categoryWrapper}>
                {renderCategoryCard({ item })}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => {
                const isActive = currentTrack?.id === item.id;
                return (
                  <TrackItem
                    title={item.title}
                    artist={item.artist}
                    thumbnail={item.thumbnail}
                    isActive={isActive}
                    isPlaying={isActive && isPlaying}
                    onPress={() => handleTrackPress(item)}
                  />
                );
              }}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              contentContainerStyle={styles.resultsList}
            />
          ) : (
            <View style={styles.centerContainer}>
              <Search color={Colors.textMuted} size={64} style={{ marginBottom: 20, opacity: 0.2 }} />
              <Text style={styles.emptyText}>Find your favorite songs, artists, or BGMs</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sourceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  sourceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryWrapper: {
    width: COLUMN_WIDTH,
    marginBottom: 16,
  },
  categoryCard: {
    height: 100,
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 1,
  },
  categoryIconContainer: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    transform: [{ rotate: '25deg' }],
  },
  categoryIcon: {
    opacity: 0.5,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsList: {
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  }
});
