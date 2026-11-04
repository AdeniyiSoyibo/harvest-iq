"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { useState } from "react";

export function WaveformPlayer() {
  const { currentBeat, isPlaying, currentTime, setIsPlaying, setCurrentTime } = usePlatformStore();
  const [volume, setVolume] = useState(80);
  const progress = currentBeat ? (currentTime / currentBeat.duration) * 100 : 0;

  if (!currentBeat) return (
    <Card><div className="h-36 flex items-center justify-center text-sm text-[#7a9abf]">Select a beat from the library to start editing</div></Card>
  );

  return (
    <Card glow={isPlaying} title={currentBeat.title} subtitle={`${currentBeat.bpm} BPM · ${currentBeat.key} · ${currentBeat.genre} · ${currentBeat.mood}`}>
      <div className="p-4 space-y-3">
        <div className="flex items-end gap-px h-20 cursor-pointer select-none rounded-xl overflow-hidden bg-[#f0f4f8] px-2 py-1"
          onClick={(e)=>{ const r=e.currentTarget.getBoundingClientRect(); setCurrentTime(Math.round(((e.clientX-r.left)/r.width)*currentBeat.duration)); }}>
          {currentBeat.waveform.map((v,i)=>(
            <div key={i} className={`flex-1 rounded-sm ${(i/currentBeat.waveform.length)*100<progress?"bg-sky-400":"bg-[#cdd8e8]"}`} style={{height:`${Math.max(8,v*100)}%`}}/>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#7a9abf]">
          <span>{formatDuration(currentTime)}</span><span>{formatDuration(currentBeat.duration)}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#7a9abf]"/>
            <input type="range" min={0} max={100} value={volume} onChange={e=>setVolume(Number(e.target.value))} className="w-20 h-1"/>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={()=>setCurrentTime(0)}><SkipBack className="w-4 h-4"/></Button>
            <Button variant="primary" size="md" className="w-11 h-11 rounded-full p-0" onClick={()=>setIsPlaying(!isPlaying)}>
              {isPlaying?<Pause className="w-5 h-5"/>:<Play className="w-5 h-5"/>}
            </Button>
            <Button variant="ghost" size="sm" onClick={()=>setCurrentTime(currentBeat.duration)}><SkipForward className="w-4 h-4"/></Button>
          </div>
          <div className="w-28"/>
        </div>
      </div>
    </Card>
  );
}
