import * as MediaLibrary from 'expo-media-library';

export const scanLocalMusic = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access media library denied');
      return [];
    }

    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 1000,
      sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
    });

    const filteredTracks = assets.assets.filter(asset => asset.duration > 30); 

    return filteredTracks.map((asset) => {
      // For local tracks, we can try to infer a folder from the URI or filename if available
      // For now, we'll just use the filename prefix or a placeholder if URI is complex
      return {
        id: asset.id,
        url: asset.uri,
        title: asset.filename ? asset.filename.replace(/\.[^/.]+$/, "") : 'Unknown Track',
        artist: 'Local Artist',
        duration: asset.duration,
        filename: asset.filename,
        uri: asset.uri
      };
    });
  } catch (error) {
    console.error('Error scanning music:', error);
    return [];
  }
};
