import * as MediaLibrary from 'expo-media-library';

export const scanLocalMusic = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return [];

    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    });

    return assets.assets.map((asset) => ({
      id: asset.id,
      url: asset.uri,
      title: asset.filename ? asset.filename.replace(/\.[^/.]+$/, "") : 'Unknown',
      artist: 'Local Artist',
      duration: asset.duration,
    }));
  } catch (error) {
    console.error('Error scanning music:', error);
    return [];
  }
};
