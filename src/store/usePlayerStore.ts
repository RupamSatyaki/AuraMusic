import { create } from 'zustand';

export interface Track {
  id: string;
  url: string;
  title: string;
  artist?: string;
  thumbnail?: string;
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  isPlayerVisible: boolean;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlayerVisible: (visible: boolean) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  isPlayerVisible: false,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setPlayerVisible: (isPlayerVisible) => set({ isPlayerVisible }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  removeFromQueue: (trackId) =>
    set((state) => ({ queue: state.queue.filter((t) => t.id !== trackId) })),
  clearQueue: () => set({ queue: [] }),
}));
