"use client";
import { usePlatformStore } from "@/lib/store";
import { MOCK_BEATS } from "@/lib/data";
import { formatDuration } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

export function BeatLibrary() {
  const { beats, currentBeat, setCurrentBeat } = usePlatformStore();
  return (
    <Card title="Beat Library" subtitle={`${beats.length} beats · 8 genres`} className="h-full">
      <div className="p-4 space-y-2">
        <Button variant="primary" size="sm" className="w-full mb-1">+ New Beat</Button>
        {beats.map((beat) => {
          const active = currentBeat?.id === beat.id;
          return (
            <div key={beat.id} onClick={()=>setCurrentBeat(beat)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active?"bg-sky-50 border border-sky-200":"hover:bg-[#f0f4f8]"}`}
            >
              <div className="flex items-end gap-px w-10 h-8 flex-shrink-0">
                {beat.waveform.slice(0,16).map((v,i)=>(
                  <div key={i} className={`flex-1 rounded-sm ${active?"bg-sky-400":"bg-[#cdd8e8]"}`} style={{height:`${Math.max(15,v*100)}%`}}/>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a2a3a] truncate">{beat.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="sky">{beat.genre}</Badge>
                  <span className="text-[10px] text-[#7a9abf]">{beat.bpm} BPM · {beat.key}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 text-[10px] text-[#7a9abf]"><Clock className="w-3 h-3"/>{formatDuration(beat.duration)}</div>
                {beat.price && <p className="text-[10px] text-emerald-600 font-bold mt-0.5">${beat.price}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
