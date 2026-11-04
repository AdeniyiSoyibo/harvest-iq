"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";
import { Play, ArrowRight } from "lucide-react";

export function FlowQueue() {
  const { queue, currentTrack, setCurrentTrack, streamPlaying } = usePlatformStore();

  const flowBetween = (i: number) => {
    if (i >= queue.length - 1) return null;
    const a = queue[i], b = queue[i + 1];
    return Math.max(40, Math.round(100 - Math.abs(a.bpm - b.bpm) * 0.8 - Math.abs(a.energy - b.energy) * 30));
  };

  if (!queue.length) return null;

  return (
    <Card title="Flow Queue" subtitle="Click any track to play · Perceptual order">
      <div className="p-4 space-y-0.5">
        {queue.map((track, i) => {
          const active = currentTrack?.id === track.id;
          const flow = flowBetween(i);
          const hasSrc = !!track.src || !!track.embedUrl;
          return (
            <div key={track.id}>
              <div
                onClick={() => setCurrentTrack(track)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                  active ? "bg-sky-50 border border-sky-200" : "hover:bg-[#f0f4f8]"
                }`}
              >
                <span className="text-[10px] text-[#7a9abf] w-4">{i + 1}</span>
                {active && streamPlaying
                  ? <div className="flex items-end gap-px w-4 h-4">
                      {[0.6, 1, 0.7].map((h, j) => (
                        <div key={j} className="flex-1 bg-sky-400 rounded-sm wave-bar"
                          style={{ height: `${h * 100}%`, animationDelay: `${j * 0.15}s` }} />
                      ))}
                    </div>
                  : <Play className={`w-3 h-3 ${active ? "text-sky-500" : "text-[#7a9abf]"}`} />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1a2a3a] truncate">{track.title}</p>
                  <p className="text-[10px] text-[#7a9abf] truncate">{track.artist}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  {track.duration > 0 && (
                    <p className="text-[10px] text-[#7a9abf]">{formatDuration(track.duration)}</p>
                  )}
                  {track.bpm > 0 && (
                    <p className="text-[10px] text-[#7a9abf]">{track.bpm} BPM</p>
                  )}
                  {!hasSrc && (
                    <span className="text-[8px] text-amber-500 font-semibold">MOCK</span>
                  )}
                </div>
              </div>
              {flow !== null && (
                <div className="flex items-center gap-2 px-4 py-0.5">
                  <ArrowRight className="w-2.5 h-2.5 text-[#cdd8e8]" />
                  <div className="flex-1 h-px bg-[#e8eef5]" />
                  <span className={`text-[10px] font-semibold ${
                    flow >= 80 ? "text-emerald-600" : flow >= 60 ? "text-amber-500" : "text-rose-500"
                  }`}>
                    Flow {flow}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
