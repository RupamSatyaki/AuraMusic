import { Platform } from 'react-native';
import { Track } from '../types/track';

/**
 * Official YouTube Data API v3 integration for stable search.
 * NOTE: Replace YOUR_YOUTUBE_API_KEY with your actual key from Google Cloud Console.
 */
const YOUTUBE_API_KEY = 'AIzaSyBb7lIfZ8F_Brx4QNo5mmqze4GALnVKpiE';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Robust stream resolution using Piped (still needed for audio stream URLs)
 */
const PIPED_INSTANCES = [
  'https://api.piped.victr.me',
  'https://pipedapi.kavin.rocks',
  'https://piped-api.garudalinux.org',
  'https://api.piped.projectsegfau.lt'
];

let currentInstanceIndex = 0;

/**
 * Searches YouTube using the Official API (Metadata only)
 */
export const searchYouTubeTracks = async (query: string): Promise<Track[]> => {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.warn('YouTube API Key missing! Please add your key in youtubeApi.ts');
    }

    const url = `${YOUTUBE_SEARCH_URL}?part=snippet&q=${encodeURIComponent(cleanQuery)}&type=video&videoCategoryId=10&maxResults=20&key=${YOUTUBE_API_KEY}`;
    
    console.log('[YT Official API] Searching...');
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API Error');
    }

    const data = await response.json();
    const results = data.items || [];

    return results.map((item: any): Track => {
      const videoId = item.id.videoId;
      return {
        id: `yt-${videoId}`,
        url: `YOUTUBE_ID:${videoId}`,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        duration: 0, // YouTube search API doesn't provide duration by default
        uri: `YOUTUBE_ID:${videoId}`,
      };
    });
  } catch (error) {
    console.error('[YT Official Search Error]:', error);
    return [];
  }
};

/**
 * Resolves a YouTube ID to a playable audio stream using fallback resolvers
 */
export const getYouTubeAudioStream = async (videoId: string): Promise<string | null> => {
  let attempts = 0;
  
  while (attempts < PIPED_INSTANCES.length) {
    const instance = PIPED_INSTANCES[currentInstanceIndex];
    const targetUrl = `${instance}/streams/${videoId}`;
    let finalUrl = targetUrl;

    if (Platform.OS === 'web') {
      finalUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    }

    try {
      console.log(`[YT Resolver] Trying ${instance}...`);
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      let data = await response.json();
      if (Platform.OS === 'web' && data.contents) {
        data = JSON.parse(data.contents);
      }

      const audioStream = data.audioStreams?.find((s: any) => s.format === 'M4A' || s.codec === 'opus') || data.audioStreams?.[0];
      if (audioStream?.url) return audioStream.url;
      
      throw new Error('No audio stream');
    } catch (error) {
      currentInstanceIndex = (currentInstanceIndex + 1) % PIPED_INSTANCES.length;
      attempts++;
    }
  }
  return null;
};

/**
 * Smart Linker resolution
 */
export const findYouTubeFullTrack = async (query: string): Promise<string | null> => {
  try {
    const tracks = await searchYouTubeTracks(`${query} audio`);
    if (tracks.length > 0) {
      const videoId = tracks[0].id.replace('yt-', '');
      return await getYouTubeAudioStream(videoId);
    }
    return null;
  } catch (e) {
    return null;
  }
};
