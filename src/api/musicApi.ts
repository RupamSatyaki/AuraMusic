import { Platform } from 'react-native';
import { Track } from '../types/track';

// Using a more stable and widely used JioSaavn API instance
const SAAVN_BASE_URL = 'https://saavn.dev/api';
const PROXY_URL = 'https://api.allorigins.win/get?url=';

/**
 * Searches for full songs using the JioSaavn API
 */
export const searchTracks = async (query: string, page: number = 1): Promise<Track[]> => {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    // Saavn.dev uses /search/songs?query=...&page=...&limit=...
    const targetUrl = `${SAAVN_BASE_URL}/search/songs?query=${encodeURIComponent(cleanQuery)}&page=${page}&limit=20`;
    
    let finalUrl = targetUrl;
    
    // For Web, we use AllOrigins proxy to bypass CORS
    if (Platform.OS === 'web') {
      finalUrl = `${PROXY_URL}${encodeURIComponent(targetUrl)}`;
    }

    console.log('Fetching Search:', finalUrl);
    
    const response = await fetch(finalUrl);
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('API Error Response:', responseText.substring(0, 200));
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let json;
    try {
      json = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse main response as JSON:', responseText.substring(0, 100));
      return [];
    }
    
    // If using AllOrigins, the actual data is inside json.contents
    if (Platform.OS === 'web' && json.contents) {
      try {
        json = JSON.parse(json.contents);
      } catch (e) {
        console.error('Failed to parse AllOrigins contents as JSON:', json.contents.substring(0, 100));
        return [];
      }
    }

    // Extract results - different API versions use different structures
    const results = json?.data?.results || json?.results || [];

    if (!Array.isArray(results)) {
      console.error('Invalid search results format:', json);
      return [];
    }

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
    console.error('Search API Error:', error);
    return [];
  }
};
