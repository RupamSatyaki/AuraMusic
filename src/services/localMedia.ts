import * as MediaLibrary from 'expo-media-library';

export const scanLocalMusic = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access media library denied');
      return [];
    }

    // Increasing 'first' to get more songs (default is 20)
    // and ensuring we only get audio files
    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 1000, // Fetch up to 1000 audio files
      sortBy: [[MediaLibrary.SortBy.modificationTime, false]], // Latest first
    });

    // Filtering to remove short audio clips (like notifications or very short recordings)
    // Most songs are > 60 seconds. Call recordings can be any length, 
    // but this helps filter out UI sounds and small clips.
    const filteredTracks = assets.assets.filter(asset => asset.duration > 30); 

    return filteredTracks.map((asset) => ({
      id: asset.id,
      url: asset.uri,
      title: asset.filename ? asset.filename.replace(/\.[^/.]+$/, "") : 'Unknown Track',
      artist: 'Local Artist',
      duration: asset.duration,
    }));
  } catch (error) {
    console.error('Error scanning music:', error);
    return [];
  }
};
