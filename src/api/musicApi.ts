import { Track } from '../types/track';

// Stable JioSaavn API Instance
const SAAVN_BASE_URL = 'https://jiosaavn-api-tau.vercel.app/api';

/**
 * Searches for full songs using the JioSaavn API
 */
export const searchTracks = async (query: string, page: number = 1): Promise<Track[]> => {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    // Construct URL with explicit '?' separator
    const finalUrl = `${SAAVN_BASE_URL}/search/songs?query=${encodeURIComponent(cleanQuery)}&page=${page}&limit=20`;
    
    console.log('[Saavn API] Fetching:', finalUrl);
    
    const response = await fetch(finalUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const json = await response.json();
    
    // Standard JioSaavn API structure
    const results = json?.data?.results || json?.results || [];

    if (!Array.isArray(results)) return [];

    return results
      .filter((item: any) => item.downloadUrl && item.downloadUrl.length > 0)
      .map((item: any): Track => {
        const downloadUrls = item.downloadUrl || [];
        // Extract 320kbps link
        let audioUrl = downloadUrls.find((d: any) => d.quality === '320kbps')?.link || 
                       downloadUrls[downloadUrls.length - 1]?.link;

        if (audioUrl && audioUrl.startsWith('http:')) {
          audioUrl = audioUrl.replace('http:', 'https:');
        }

        const thumbnails = item.image || [];
        let highResThumbnail = thumbnails.find((img: any) => img.quality === '500x500')?.link ||
                               thumbnails[thumbnails.length - 1]?.link || 
                               thumbnails[0]?.link;

        if (highResThumbnail && highResThumbnail.startsWith('http:')) {
          highResThumbnail = highResThumbnail.replace('http:', 'https:');
        }

        return {
          id: `saavn-${item.id}`,
          url: audioUrl,
          title: (item.name || 'Unknown').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'"),
          artist: item.artists?.primary?.map((a: any) => a.name).join(', ') || 'Various Artists',
          thumbnail: highResThumbnail,
          duration: parseInt(item.duration) || 0,
          uri: audioUrl,
        };
      });
  } catch (error) {
    console.error('[Saavn API Error]:', error);
    return [];
  }
};

/**
 * Resolves a track name to a full JioSaavn audio link.
 * Used for the Smart Linker approach.
 */
export const resolveSaavnTrack = async (query: string): Promise<string | null> => {
  try {
    const results = await searchTracks(query, 1);
    if (results && results.length > 0) {
      return results[0].url;
    }
    return null;
  } catch (error) {
    return null;
  }
};
