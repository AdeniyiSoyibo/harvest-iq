import { create } from "zustand";
import type { PlatformMode, Beat, Track, Playlist, Artist, TransitionScore, VideoProject } from "./types";

interface PlatformState {
  activeMode: PlatformMode; setMode: (m: PlatformMode) => void;
  // Production
  currentBeat: Beat | null; beats: Beat[]; isPlaying: boolean; currentTime: number;
  setCurrentBeat: (b: Beat) => void; setBeats: (b: Beat[]) => void;
  setIsPlaying: (v: boolean) => void; setCurrentTime: (t: number) => void;
  // Streaming
  currentTrack: Track | null; queue: Track[]; playlists: Playlist[]; streamPlaying: boolean;
  setCurrentTrack: (t: Track) => void; setQueue: (q: Track[]) => void;
  setPlaylists: (p: Playlist[]) => void; setStreamPlaying: (v: boolean) => void;
  // DJ
  deckA: Track | null; deckB: Track | null; transitionScore: TransitionScore | null; crossfade: number;
  setDeckA: (t: Track | null) => void; setDeckB: (t: Track | null) => void;
  setTransitionScore: (s: TransitionScore | null) => void; setCrossfade: (v: number) => void;
  // A&R
  artists: Artist[]; selectedArtist: Artist | null;
  setArtists: (a: Artist[]) => void; setSelectedArtist: (a: Artist | null) => void;
  // Video
  videoProject: VideoProject | null; setVideoProject: (p: VideoProject | null) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  activeMode: "production", setMode: (m) => set({ activeMode: m }),
  currentBeat: null, beats: [], isPlaying: false, currentTime: 0,
  setCurrentBeat: (b) => set({ currentBeat: b }), setBeats: (b) => set({ beats: b }),
  setIsPlaying: (v) => set({ isPlaying: v }), setCurrentTime: (t) => set({ currentTime: t }),
  currentTrack: null, queue: [], playlists: [], streamPlaying: false,
  setCurrentTrack: (t) => set({ currentTrack: t }), setQueue: (q) => set({ queue: q }),
  setPlaylists: (p) => set({ playlists: p }), setStreamPlaying: (v) => set({ streamPlaying: v }),
  deckA: null, deckB: null, transitionScore: null, crossfade: 50,
  setDeckA: (t) => set({ deckA: t }), setDeckB: (t) => set({ deckB: t }),
  setTransitionScore: (s) => set({ transitionScore: s }), setCrossfade: (v) => set({ crossfade: v }),
  artists: [], selectedArtist: null,
  setArtists: (a) => set({ artists: a }), setSelectedArtist: (a) => set({ selectedArtist: a }),
  videoProject: null, setVideoProject: (p) => set({ videoProject: p }),
}));
