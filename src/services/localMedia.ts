import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';

// Using local assets for web view since scanning is not possible
const WEB_LOCAL_TRACKS = [
  {
    id: 'demo-1',
    url: require('../../assets/music/Raga of Revenge (From DC) - Anirudh Ravichander (youtube).mp3'),
    title: 'Raga of Revenge (From DC)',
    artist: 'Anirudh Ravichander',
    duration: 125,
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJOxL9fc1cFmdnpAEF6bp6zw1Bg7jhL6kpnQ&s',
    uri: require('../../assets/music/Raga of Revenge (From DC) - Anirudh Ravichander (youtube).mp3')
  },
  {
    id: 'demo-2',
    url: require('../../assets/music/Lokiverse (Background Score)   Anirudh Ravichander.m4a'),
    title: 'Lokiverse (Background Score)',
    artist: 'Anirudh Ravichander',
    duration: 156,
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/5/59/Vikram_soundtrack.jpg',
    uri: require('../../assets/music/Lokiverse (Background Score)   Anirudh Ravichander.m4a')
  },
  {
    id: 'demo-3',
    url: require('../../assets/music/Ordinary Person (From  Leo ).m4a'),
    title: 'Ordinary Person (From Leo)',
    artist: 'Anirudh Ravichander',
    duration: 195,
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b2737a2f3c25020768b5440b310f',
    uri: require('../../assets/music/Ordinary Person (From  Leo ).m4a')
  },
  {
    id: 'demo-4',
    url: require('../../assets/music/Dahaa Theme (From  Coolie ).m4a'),
    title: 'Dahaa Theme (From Coolie)',
    artist: 'Anirudh Ravichander',
    duration: 145,
    thumbnail: 'https://c.saavncdn.com/859/Dahaa-Theme-From-Coolie-English-2025-20250826171801-500x500.jpg',
    uri: require('../../assets/music/Dahaa Theme (From  Coolie ).m4a')
  },
  {
    id: 'demo-5',
    url: require('../../assets/music/Powerhouse (From  Coolie ) (Tamil).m4a'),
    title: 'Powerhouse (From Coolie)',
    artist: 'Anirudh Ravichander',
    duration: 188,
    thumbnail: 'https://i.scdn.co/image/ab67616d0000b273fb6b64d74a39c88ffb8737d9',
    uri: require('../../assets/music/Powerhouse (From  Coolie ) (Tamil).m4a')
  },
  {
    id: 'demo-6',
    url: require('../../assets/music/Shiva_Thandavame_From_Saripodhaa_Sanivaaram_Jakes_Bejoy.m4a'),
    title: 'Shiva Thandavame',
    artist: 'Jakes Bejoy',
    duration: 210,
    thumbnail: 'https://i.ytimg.com/vi/Xffhn3CZ8lI/maxresdefault.jpg',
    uri: require('../../assets/music/Shiva_Thandavame_From_Saripodhaa_Sanivaaram_Jakes_Bejoy.m4a')
  },
  {
    id: 'demo-7',
    url: require('../../assets/music/Trance of Omi (From  They Call Him OG ).m4a'),
    title: 'Trance of Omi',
    artist: 'Jakes Bejoy',
    duration: 175,
    thumbnail: 'https://c.saavncdn.com/443/Trance-of-Omi-From-They-Call-Him-OG-Telugu-2025-20250911200610-500x500.jpg',
    uri: require('../../assets/music/Trance of Omi (From  They Call Him OG ).m4a')
  }
];

export const scanLocalMusic = async () => {
  if (Platform.OS === 'web') {
    return WEB_LOCAL_TRACKS;
  }

  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access media library denied');
      return WEB_LOCAL_TRACKS;
    }

    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 1000,
      sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
    });

    if (assets.assets.length === 0) {
      return WEB_LOCAL_TRACKS;
    }

    const filteredTracks = assets.assets.filter(asset => asset.duration > 30); 

    return filteredTracks.map((asset) => {
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
    return WEB_LOCAL_TRACKS;
  }
};

export const pickLocalFiles = async (): Promise<any[]> => {
  if (Platform.OS !== 'web') return [];

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'audio/*';

    input.onchange = (e: any) => {
      const files = e.target.files;
      if (!files) return resolve([]);

      const pickedTracks = Array.from(files).map((file: any, index) => {
        const url = URL.createObjectURL(file);
        return {
          id: `picked-${Date.now()}-${index}`,
          url: url,
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Local File',
          duration: 0,
          uri: url,
          isLocalFile: true
        };
      });
      resolve(pickedTracks);
    };

    input.click();
  });
};
