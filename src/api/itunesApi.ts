import { Track } from '../types/track';

/**
 * iTunes Search API - Extremely stable, no API key needed, high-quality metadata.
 */
const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';

export const searchItunesTracks = async (query: string): Promise<Track[]> => {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    const response = await fetch(`${ITUNES_SEARCH_URL}?term=${encodeURIComponent(cleanQuery)}&entity=song&limit=25`);
    if (!response.ok) throw new Error('iTunes API failed');
    
    const data = await response.json();
    const results = data.results || [];

    return results.map((item: any): Track => {
      // Convert iTunes 100x100 to 600x600 for better quality
      const highResArt = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : '';
      
      return {
        id: `itunes-${item.trackId}`,
        url: item.previewUrl, // 30-second high quality preview
        title: item.trackName,
        artist: item.artistName,
        thumbnail: highResArt,
        duration: Math.floor(item.trackTimeMillis / 1000) || 0,
        uri: item.previewUrl,
      };
    });
  } catch (error) {
    console.error('[iTunes API Error]:', error);
    return [];
  }
};
