import React, { useState } from 'react';
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
import { Search, X, Mic, Play, ChevronRight, Music } from 'lucide-react-native';
import { TrackItem } from '@/src/components/Track/TrackItem';
import { usePlayerStore } from '@/src/store/usePlayerStore';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  { id: '1', title: 'Podcasts', color: '#E13300' },
  { id: '2', title: 'Live Events', color: '#7358FF' },
  { id: '3', title: 'Made For You', color: '#1E3264' },
  { id: '4', title: 'New Releases', color: '#E8115B' },
  { id: '5', title: 'BGM', color: '#509BF5' },
  { id: '6', title: 'Pop', color: '#148A08' },
  { id: '7', title: 'Indie', color: '#D84000' },
  { id: '8', title: 'Hip-Hop', color: '#BC5900' },
  { id: '9', title: 'Rock', color: '#E91429' },
  { id: '10', title: 'Discover', color: '#8D67AB' },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { setCurrentTrack, currentTrack, isPlaying } = usePlayerStore();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setLoading(true);
      // Mock search results for now
      setTimeout(() => {
        setLoading(false);
        // This will be replaced by actual API call later
      }, 500);
    } else {
      setResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  const renderCategoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
    >
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <View style={styles.categoryIconContainer}>
        <Music color="rgba(255, 255, 255, 0.2)" size={40} style={styles.categoryIcon} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.headerTitle}>Search</Text>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search color={Colors.textMuted} size={20} />
          <TextInput
            placeholder="What do you want to listen to?"
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
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
            {CATEGORIES.map(item => (
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isActive = currentTrack?.id === item.id;
                return (
                  <TrackItem
                    title={item.title}
                    artist={item.artist}
                    thumbnail={item.thumbnail}
                    isActive={isActive}
                    isPlaying={isActive && isPlaying}
                    onPress={() => setCurrentTrack(item)}
                  />
                );
              }}
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
    paddingHorizontal: 16,
    marginBottom: 16,
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
});
