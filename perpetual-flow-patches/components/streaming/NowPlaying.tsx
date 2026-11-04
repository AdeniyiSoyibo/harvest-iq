"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function NowPlaying() {
  const { currentTrack } = usePlatformStore();
  if (!currentTrack) return null;
  return (
    <Card glow title="Now Playing" subtitle="Flow-optimized track">
      <div className="p-4 space-y-3">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center text-2xl flex-shrink-0">🎵</div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#1a2a3a] truncate">{currentTrack.title}</p>
            <p className="text-sm text-[#4a6580] truncate">{currentTrack.artist}</p>
            {currentTrack.album && <p className="text-xs text-[#7a9abf] truncate">{currentTrack.album}</p>}
            <div className="flex gap-1 mt-1.5"><Badge variant="sky">{currentTrack.bpm} BPM</Badge><Badge variant="outline">{currentTrack.key}</Badge></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{label:"Energy",value:currentTrack.energy},{label:"Valence",value:currentTrack.valence},{label:"Dance",value:currentTrack.danceability}].map(({label,value})=>(
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-1"><span className="text-[#7a9abf]">{label}</span><span className="text-[#1a2a3a] font-semibold">{Math.round(value*100)}</span></div>
              <ProgressBar value={value*100} size="sm" color={value>=0.7?"bg-emerald-400":value>=0.4?"bg-sky-400":"bg-purple-400"}/>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-1 h-4">
          {[0.6,0.9,0.7,1.0,0.8,0.5,0.85].map((h,i)=>(
            <div key={i} className="w-1 bg-sky-400 rounded-full wave-bar" style={{height:`${h*100}%`,animationDelay:`${i*0.1}s`}}/>
          ))}
          <span className="text-[10px] text-[#7a9abf] ml-2">Playing</span>
        </div>
      </div>
    </Card>
  );
}
