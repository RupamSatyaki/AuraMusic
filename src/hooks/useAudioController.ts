import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { usePlayerStore } from '../store/usePlayerStore';

export const useAudioController = () => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const { currentTrack, isPlaying, setIsPlaying } = usePlayerStore();

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
      }
    }
  };

  const playTrack = async (url: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
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

  return { togglePlayback, position, duration };
};
