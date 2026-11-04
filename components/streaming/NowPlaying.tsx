"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDuration } from "@/lib/utils";

export function NowPlaying() {
  const { currentTrack, streamPlaying, streamCurrentTime, streamDuration } = usePlatformStore();
  if (!currentTrack) return null;

  const progress = streamDuration > 0 ? (streamCurrentTime / streamDuration) * 100 : 0;
  const hasSrc = !!currentTrack.src || !!currentTrack.embedUrl;

  return (
    <Card glow title="Now Playing" subtitle="Flow-optimized track">
      <div className="p-4 space-y-3">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-2xl flex-shrink-0 relative">
            🎵
            {streamPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#1a2a3a] truncate">{currentTrack.title}</p>
            <p className="text-sm text-[#4a6580] truncate">{currentTrack.artist}</p>
            {currentTrack.album && <p className="text-xs text-[#7a9abf] truncate">{currentTrack.album}</p>}
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {currentTrack.bpm > 0 && <Badge variant="sky">{currentTrack.bpm} BPM</Badge>}
              {currentTrack.key && <Badge variant="outline">{currentTrack.key}</Badge>}
              {currentTrack.platform && currentTrack.platform !== "mock" && (
                <Badge variant="outline">{currentTrack.platform.toUpperCase()}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar (only when direct audio is playing) */}
        {hasSrc && currentTrack.platform !== "youtube" && currentTrack.platform !== "soundcloud" && (
          <div>
            <div className="h-1.5 bg-[#e8eef5] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-purple-500 rounded-full transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#7a9abf] mt-1">
              <span>{formatDuration(Math.floor(streamCurrentTime))}</span>
              <span>{formatDuration(Math.floor(streamDuration))}</span>
            </div>
          </div>
        )}

        {/* Audio feature bars (only if real data) */}
        {currentTrack.energy > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Energy",  value: currentTrack.energy },
              { label: "Valence", value: currentTrack.valence },
              { label: "Dance",   value: currentTrack.danceability },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#7a9abf]">{label}</span>
                  <span className="text-[#1a2a3a] font-semibold">{Math.round(value * 100)}</span>
                </div>
                <ProgressBar
                  value={value * 100}
                  size="sm"
                  color={value >= 0.7 ? "bg-emerald-400" : value >= 0.4 ? "bg-sky-400" : "bg-purple-400"}
                />
              </div>
            ))}
          </div>
        )}

        {/* Waveform animation */}
        <div className="flex items-end gap-1 h-4">
          {[0.6, 0.9, 0.7, 1.0, 0.8, 0.5, 0.85].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full ${streamPlaying ? "wave-bar bg-sky-400" : "bg-[#cdd8e8]"}`}
              style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
          <span className="text-[10px] text-[#7a9abf] ml-2">
            {streamPlaying ? "Playing" : "Paused"}
          </span>
        </div>
      </div>
    </Card>
  );
}
