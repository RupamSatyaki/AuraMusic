import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { usePlayerStore } from '../store/usePlayerStore';

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
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const audioSource = typeof source === 'string' ? { uri: source } : source;

      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing track:', error);
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
