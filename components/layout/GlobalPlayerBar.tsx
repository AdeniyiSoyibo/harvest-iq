"use client";

import { usePlatformStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Music } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useEffect, useState } from "react";

/**
 * Persistent mini-player bar shown at the bottom of every page when a track
 * is loaded into the streaming queue. Stays visible as users navigate between
 * modes, so playback is never interrupted.
 */
export function GlobalPlayerBar() {
  const {
    currentTrack, setCurrentTrack,
    queue, streamPlaying, setStreamPlaying,
    streamCurrentTime, streamDuration,
  } = usePlatformStore();

  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef   = useRef<number>(0);

  const activeIdx = queue.findIndex(t => t.id === currentTrack?.id);

  // Only render for mock/file tracks — embeds (YT/SC) handle their own player
  const isEmbed = currentTrack?.platform === "youtube" || currentTrack?.platform === "soundcloud";
  const hasSrc  = !!currentTrack?.src;

  if (!currentTrack) return null;

  const progress = streamDuration > 0 ? (streamCurrentTime / streamDuration) * 100 : 0;

  const skipTo = (idx: number) => {
    const target = queue[Math.max(0, Math.min(queue.length - 1, idx))];
    if (target) setCurrentTrack(target);
  };

  const dismiss = () => {
    setCurrentTrack(null);
    setStreamPlaying(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#cdd8e8] shadow-lg px-4 py-2 flex items-center gap-3">

      {/* Track info */}
      <Link href="/streaming" className="flex items-center gap-2.5 flex-1 min-w-0 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <Music className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#1a2a3a] truncate group-hover:text-sky-600 transition-colors">
            {currentTrack.title}
          </p>
          <p className="text-[10px] text-[#7a9abf] truncate">{currentTrack.artist}</p>
        </div>
      </Link>

      {/* Controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => skipTo(activeIdx - 1)}
          disabled={activeIdx <= 0}
          className="p-1.5 rounded-lg text-[#7a9abf] hover:text-[#1a2a3a] hover:bg-[#f0f4f8] disabled:opacity-30 transition-colors"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setStreamPlaying(!streamPlaying)}
          disabled={!hasSrc && !isEmbed}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${
            !hasSrc && !isEmbed
              ? "bg-[#cdd8e8] cursor-not-allowed"
              : "bg-gradient-to-br from-sky-400 to-blue-600 hover:opacity-90"
          }`}
        >
          {streamPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => skipTo(activeIdx + 1)}
          disabled={activeIdx >= queue.length - 1}
          className="p-1.5 rounded-lg text-[#7a9abf] hover:text-[#1a2a3a] hover:bg-[#f0f4f8] disabled:opacity-30 transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar — shown for direct audio */}
      {hasSrc && streamDuration > 0 && (
        <div className="hidden sm:flex flex-1 items-center gap-2 min-w-0">
          <span className="text-[10px] text-[#7a9abf] font-mono w-8 text-right flex-shrink-0">
            {formatDuration(Math.floor(streamCurrentTime))}
          </span>
          <div className="flex-1 h-1 bg-[#e8eef5] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-purple-500 rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-[#7a9abf] font-mono w-8 flex-shrink-0">
            {formatDuration(Math.floor(streamDuration))}
          </span>
        </div>
      )}

      {/* Queue badge */}
      {queue.length > 1 && (
        <span className="hidden md:block text-[10px] text-[#7a9abf] flex-shrink-0">
          {activeIdx + 1}/{queue.length}
        </span>
      )}

      {/* Volume — desktop only */}
      <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
        <Volume2 className="w-3.5 h-3.5 text-[#7a9abf]" />
        <input
          type="range" min={0} max={100} value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-20 h-1"
          style={{ accentColor: "#38bdf8" }}
        />
      </div>

      {/* Platform badge */}
      {currentTrack.platform && currentTrack.platform !== "mock" && (
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
          currentTrack.platform === "youtube"     ? "bg-red-50 text-red-500" :
          currentTrack.platform === "soundcloud"  ? "bg-orange-50 text-orange-500" :
          currentTrack.platform === "file"        ? "bg-sky-50 text-sky-500" :
          "bg-purple-50 text-purple-500"
        }`}>
          {currentTrack.platform.toUpperCase()}
        </span>
      )}

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="p-1.5 rounded-lg text-[#cdd8e8] hover:text-rose-400 hover:bg-rose-50 transition-colors flex-shrink-0"
        title="Close player"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
