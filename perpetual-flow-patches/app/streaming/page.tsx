"use client";
import { useEffect } from "react";
import { usePlatformStore } from "@/lib/store";
import { MOCK_TRACKS, MOCK_PLAYLISTS } from "@/lib/data";
import { StreamPlayer } from "@/components/streaming/StreamPlayer";
import { PlaylistPanel } from "@/components/streaming/PlaylistPanel";
import { FlowQueue } from "@/components/streaming/FlowQueue";
import { NowPlaying } from "@/components/streaming/NowPlaying";
import { Radio } from "lucide-react";

export default function StreamingPage() {
  const { setQueue, setPlaylists, setCurrentTrack } = usePlatformStore();
  useEffect(() => { setQueue(MOCK_TRACKS); setPlaylists(MOCK_PLAYLISTS); setCurrentTrack(MOCK_TRACKS[0]); }, [setQueue,setPlaylists,setCurrentTrack]);

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6">
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shadow-sm">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">Streaming</h1>
            <p className="text-xs text-[#7a9abf]">Flow-optimized playlists · Dynamic crossfades · Perceptual continuity · 20 tracks / 20 genres</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <PlaylistPanel />
        <div className="xl:col-span-2 space-y-5">
          <NowPlaying />
          <StreamPlayer />
          <FlowQueue />
        </div>
      </div>
    </div>
  );
}
