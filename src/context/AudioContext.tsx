import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { usePlayerStore } from '../store/usePlayerStore';
import { resolveSaavnTrack } from '../api/musicApi';

interface AudioContextType {
  togglePlayback: () => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  seek: (positionMillis: number) => Promise<void>;
  position: number;
  duration: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const { currentTrack, isPlaying, setIsPlaying, queue, setCurrentTrack } = usePlayerStore();

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (currentTrack) {
      playTrack(currentTrack.url);
    }
  }, [currentTrack]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      if (status.didJustFinish) {
        setIsPlaying(false);
        playNext();
      }
    }
  };

  const playTrack = async (source: any) => {
    try {
      // Clean up previous sound completely
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (e) {
          console.log('Cleanup error (non-fatal):', e);
        }
        soundRef.current = null;
      }

      let audioSource;
      if (typeof source === 'string') {
        let cleanedUrl = source.trim();
        if (!cleanedUrl) return;

        // Special handling for YouTube
        if (cleanedUrl.includes('YOUTUBE_ID:')) {
          // This part still uses YT resolver if explicitly requested via YT search
          const { getYouTubeAudioStream } = require('../api/youtubeApi');
          const videoId = currentTrack?.id.replace('yt-', '') || '';
          const resolvedStream = await getYouTubeAudioStream(videoId);
          if (resolvedStream) {
            cleanedUrl = resolvedStream;
          } else {
            console.error('Failed to resolve YT stream');
            return;
          }
        }

        // Special handling for iTunes Smart Linker (Now via JioSaavn)
        if (cleanedUrl.startsWith('ITUNES_RESOLVE:')) {
          const trackQuery = cleanedUrl.replace('ITUNES_RESOLVE:', '');
          console.log(`[Smart Linker] Resolving "${trackQuery}" on JioSaavn...`);
          const resolvedStream = await resolveSaavnTrack(trackQuery);
          
          if (resolvedStream) {
            cleanedUrl = resolvedStream;
          } else {
            console.warn('[Smart Linker] Saavn resolution failed, falling back to 30s preview');
            cleanedUrl = currentTrack?.uri || '';
          }
        }

        audioSource = { uri: cleanedUrl };
      } else {
        audioSource = source;
      }

      console.log('Playing from:', audioSource.uri?.substring(0, 50) + '...');

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true, progressUpdateIntervalMillis: 500 },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
      console.log('Track loaded and playing');
    } catch (error) {
      console.error('Playback Error:', error);
      setIsPlaying(false);
    }
  };

  const togglePlayback = async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const seek = async (positionMillis: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(positionMillis);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex < queue.length - 1) {
      setCurrentTrack(queue[currentIndex + 1]);
    } else {
      // Loop back to start or stop
      setCurrentTrack(queue[0]);
    }
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      setCurrentTrack(queue[currentIndex - 1]);
    } else {
      // Loop to end
      setCurrentTrack(queue[queue.length - 1]);
    }
  };

  return (
    <AudioContext.Provider value={{ togglePlayback, playNext, playPrevious, seek, position, duration }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
