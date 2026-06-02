import { Platform } from 'react-native';
import { Track } from '../types/track';

/**
 * Modern Approach: Using a more stable search structure
 * Since youtubei.js can be complex to setup in a pure Expo environment without many polyfills,
 * we will use a hybrid approach: search via a stable metadata API and stream via a reliable resolver.
 */

const STABLE_SEARCH_API = 'https://api.song.link/v1-alpha.1/search'; // Odesli API for metadata
const YT_SEARCH_FALLBACK = 'https://pipedapi.kavin.rocks/search?q=';

export const searchYouTubeTracks = async (query: string): Promise<Track[]> => {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    console.log(`[YT Search] Querying: ${cleanQuery}`);

    // We'll use a fast and open search that specifically targets Music
    // Piped is actually quite good if we use the right filter and fallback
    const response = await fetch(`${YT_SEARCH_FALLBACK}${encodeURIComponent(cleanQuery)}&filter=music_videos`);
    
    if (!response.ok) throw new Error('Search API failed');
    
    const data = await response.json();
    const results = data.items || [];

    return results.map((item: any): Track => {
      // Extract video ID safely
      let videoId = '';
      if (item.url) {
        const match = item.url.match(/[?&]v=([^&]+)/);
        videoId = match ? match[1] : (item.id || '');
      } else {
        videoId = item.id || '';
      }

      return {
        id: `yt-${videoId}`,
        url: `YOUTUBE_ID:${videoId}`,
        title: item.title || 'Unknown Title',
        artist: item.uploaderName || 'YouTube Artist',
        thumbnail: item.thumbnail || (item.thumbnails && item.thumbnails[0]?.url) || '',
        duration: item.duration || 0,
        uri: `YOUTUBE_ID:${videoId}`,
      };
    });
  } catch (error) {
    console.error('[YT Search Error]:', error);
    return [];
  }
};

/**
 * Resolves a YouTube ID to a playable audio stream.
 * We use a dedicated resolver that is much more stable than raw scraping.
 */
export const getYouTubeAudioStream = async (videoId: string): Promise<string | null> => {
  try {
    console.log(`[YT Stream] Resolving: ${videoId}`);
    
    // List of reliable stream resolvers
    const resolvers = [
      `https://pipedapi.kavin.rocks/streams/${videoId}`,
      `https://api.piped.victr.me/streams/${videoId}`,
      `https://piped-api.garudalinux.org/streams/${videoId}`
    ];

    for (const url of resolvers) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const audioStream = data.audioStreams?.find((s: any) => s.format === 'M4A' || s.codec === 'opus') || data.audioStreams?.[0];
          if (audioStream?.url) return audioStream.url;
        }
      } catch (e) {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('[YT Stream Resolution Error]:', error);
    return null;
  }
};
