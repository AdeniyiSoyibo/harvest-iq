"use client";
import { useState } from "react";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDuration } from "@/lib/utils";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Zap } from "lucide-react";

export function StreamPlayer() {
  const { currentTrack, streamPlaying, setStreamPlaying } = usePlatformStore();
  const [progress, setProgress] = useState(34);
  const [volume, setVolume] = useState(75);
  const [crossfade, setCrossfade] = useState(3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  if (!currentTrack) return null;

  return (
    <Card title="Player">
      <div className="p-4 space-y-4">
        <div>
          <div className="h-2 bg-[#e8eef5] rounded-full cursor-pointer overflow-hidden" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round(((e.clientX-r.left)/r.width)*100));}}>
            <div className="h-full bg-gradient-to-r from-sky-400 to-purple-500 rounded-full" style={{width:`${progress}%`}}/>
          </div>
          <div className="flex justify-between text-[10px] text-[#7a9abf] mt-1">
            <span>{formatDuration(Math.round((progress/100)*currentTrack.duration))}</span>
            <span>{formatDuration(currentTrack.duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" size="sm" className={shuffle?"text-sky-500":""} onClick={()=>setShuffle(!shuffle)}><Shuffle className="w-4 h-4"/></Button>
          <Button variant="secondary" size="sm"><SkipBack className="w-4 h-4"/></Button>
          <Button variant="primary" size="md" className="w-12 h-12 rounded-full p-0" onClick={()=>setStreamPlaying(!streamPlaying)}>
            {streamPlaying?<Pause className="w-5 h-5"/>:<Play className="w-5 h-5"/>}
          </Button>
          <Button variant="secondary" size="sm"><SkipForward className="w-4 h-4"/></Button>
          <Button variant="ghost" size="sm" className={repeat?"text-sky-500":""} onClick={()=>setRepeat(!repeat)}><Repeat className="w-4 h-4"/></Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-[#7a9abf] flex items-center gap-1 mb-1"><Volume2 className="w-3 h-3"/>Volume</label>
            <input type="range" min={0} max={100} value={volume} onChange={e=>setVolume(Number(e.target.value))} className="w-full h-1"/>
          </div>
          <div>
            <label className="text-[10px] text-[#7a9abf] flex items-center gap-1 mb-1"><Zap className="w-3 h-3"/>Crossfade {crossfade}s</label>
            <input type="range" min={0} max={12} step={0.5} value={crossfade} onChange={e=>setCrossfade(Number(e.target.value))} className="w-full h-1"/>
          </div>
        </div>
      </div>
    </Card>
  );
}
