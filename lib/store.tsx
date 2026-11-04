"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { PlatformMode, Beat, Track, Playlist, Artist, TransitionScore, VideoProject } from "./types";

interface PlatformState {
  activeMode: PlatformMode; setMode: (m: PlatformMode) => void;
  currentBeat: Beat | null; beats: Beat[]; isPlaying: boolean; currentTime: number;
  setCurrentBeat: (b: Beat) => void; setBeats: (b: Beat[]) => void;
  setIsPlaying: (v: boolean) => void; setCurrentTime: (t: number) => void;
  // ── Streaming ──────────────────────────────────────────────────────────────
  currentTrack: Track | null; queue: Track[]; playlists: Playlist[]; streamPlaying: boolean;
  streamCurrentTime: number; streamDuration: number;
  setCurrentTrack: (t: Track | null) => void; setQueue: (q: Track[]) => void;
  setPlaylists: (p: Playlist[]) => void; setStreamPlaying: (v: boolean) => void;
  setStreamCurrentTime: (t: number) => void; setStreamDuration: (d: number) => void;
  /** Append tracks to the queue (used by cross-linking from other modes) */
  addToQueue: (tracks: Track[]) => void;
  // ── DJ ─────────────────────────────────────────────────────────────────────
  deckA: Track | null; deckB: Track | null; transitionScore: TransitionScore | null; crossfade: number;
  setDeckA: (t: Track | null) => void; setDeckB: (t: Track | null) => void;
  setTransitionScore: (s: TransitionScore | null) => void; setCrossfade: (v: number) => void;
  artists: Artist[]; selectedArtist: Artist | null;
  setArtists: (a: Artist[]) => void; setSelectedArtist: (a: Artist | null) => void;
  videoProject: VideoProject | null; setVideoProject: (p: VideoProject | null) => void;
}

const StoreContext = createContext<PlatformState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [activeMode, setMode] = useState<PlatformMode>("production");
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [streamPlaying, setStreamPlaying] = useState(false);
  const [streamCurrentTime, setStreamCurrentTime] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const addToQueue = (tracks: Track[]) => setQueue(prev => {
    const existingIds = new Set(prev.map(t => t.id));
    return [...prev, ...tracks.filter(t => !existingIds.has(t.id))];
  });
  const [deckA, setDeckA] = useState<Track | null>(null);
  const [deckB, setDeckB] = useState<Track | null>(null);
  const [transitionScore, setTransitionScore] = useState<TransitionScore | null>(null);
  const [crossfade, setCrossfade] = useState(50);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [videoProject, setVideoProject] = useState<VideoProject | null>(null);

  return (
    <StoreContext.Provider value={{
      activeMode, setMode, currentBeat, setCurrentBeat, beats, setBeats,
      isPlaying, setIsPlaying, currentTime, setCurrentTime,
      currentTrack, setCurrentTrack, queue, setQueue, playlists, setPlaylists,
      streamPlaying, setStreamPlaying, streamCurrentTime, setStreamCurrentTime,
      streamDuration, setStreamDuration, addToQueue, deckA, setDeckA, deckB, setDeckB,
      transitionScore, setTransitionScore, crossfade, setCrossfade,
      artists, setArtists, selectedArtist, setSelectedArtist,
      videoProject, setVideoProject,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function usePlatformStore(): PlatformState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("usePlatformStore must be used within StoreProvider");
  return ctx;
}

// ── Legacy HarvestIQ stubs (re-exported for client-component compatibility) ───
export type {
  Language, Channel, AnswerStatus, Trace, Message, Farmer, Conversation, Escalation,
} from "./store-legacy";
export { farmers, addMessage, getConversation, getAllConversations, getFarmer, createEscalation, getEscalations, resolveEscalation } from "./store-legacy";
