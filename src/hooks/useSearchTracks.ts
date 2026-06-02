import { useState, useCallback, useEffect, useRef } from 'react';
import { searchTracks } from '../api/musicApi';
import { searchYouTubeTracks } from '../api/youtubeApi';
import { searchItunesTracks } from '../api/itunesApi';
import { Track } from '../types/track';
import { debounce } from '../utils/debounce';

export const useSearchTracks = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchSource, setSearchSource] = useState<'saavn' | 'youtube' | 'itunes'>('itunes');

  // Use ref to keep track of the current query for the debounced function
  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const performSearch = useCallback(async (searchQuery: string, searchPage: number, append: boolean = false) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    if (searchPage === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      let newResults: Track[] = [];
      
      console.log(`[Search] Query: "${searchQuery}", Source: ${searchSource}`);

      if (searchSource === 'youtube') {
        newResults = await searchYouTubeTracks(searchQuery);
        setHasMore(false);
      } else if (searchSource === 'itunes') {
        newResults = await searchItunesTracks(searchQuery);
        setHasMore(false);
      } else {
        newResults = await searchTracks(searchQuery, searchPage);
        setHasMore(newResults.length >= 10);
      }
      
      console.log(`[Search] Found ${newResults.length} results`);

      if (append) {
        setResults(prev => [...prev, ...newResults]);
      } else {
        setResults(newResults);
      }
    } catch (error) {
      console.error('[Search Hook Error]:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchSource]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      setPage(1);
      performSearch(q, 1, false);
    }, 500),
    [performSearch]
  );

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      setLoading(false);
    } else {
      debouncedSearch(text);
    }
  };

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore && query.length >= 2) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(query, nextPage, true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setPage(1);
    setHasMore(true);
  };

  const toggleSource = () => {
    let nextSource: 'saavn' | 'youtube' | 'itunes';
    if (searchSource === 'itunes') nextSource = 'youtube';
    else if (searchSource === 'youtube') nextSource = 'saavn';
    else nextSource = 'itunes';
    
    setSearchSource(nextSource);
    if (query.length >= 2) {
      performSearch(query, 1, false);
    }
  };

  return {
    query,
    results,
    loading,
    loadingMore,
    handleQueryChange,
    loadMore,
    clearSearch,
    hasMore,
    searchSource,
    toggleSource
  };
};
