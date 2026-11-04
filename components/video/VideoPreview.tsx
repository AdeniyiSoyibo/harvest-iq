"use client";
import { useState } from "react";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Play, Pause, Maximize, Download } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export function VideoPreview() {
  const { videoProject, currentTrack } = usePlatformStore();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = videoProject?.duration ?? 0;
  const elapsed = Math.round((progress/100)*duration);
  const activeClip = videoProject?.clips.find(c=>elapsed>=c.startTime&&elapsed<c.endTime);

  return (
    <Card title="Preview">
      <div className="p-4 space-y-3">
        <div className="relative w-full aspect-video bg-[#f0f4f8] rounded-xl border border-[#e8eef5] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-sky-100/50"/>
          {activeClip ? (
            <div className="text-center z-10"><p className="text-2xl mb-1">🎬</p><p className="text-sm font-semibold text-[#1a2a3a]">{activeClip.label}</p><p className="text-xs text-[#7a9abf]">{activeClip.startTime}s – {activeClip.endTime}s</p></div>
          ) : (
            <div className="text-center z-10 text-[#7a9abf]"><p className="text-2xl mb-1">📽</p><p className="text-sm">No clip at this position</p></div>
          )}
          {playing && (
            <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-4">
              {[0.5,0.9,0.7,1,0.6].map((h,i)=><div key={i} className="w-0.5 bg-orange-400 rounded-full wave-bar" style={{height:`${h*100}%`,animationDelay:`${i*0.12}s`}}/>)}
            </div>
          )}
        </div>
        <div>
          <div className="h-2 bg-[#e8eef5] rounded-full cursor-pointer overflow-hidden" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round(((e.clientX-r.left)/r.width)*100));}}>
            <div className="h-full bg-gradient-to-r from-orange-400 to-sky-400 rounded-full transition-all" style={{width:`${progress}%`}}/>
          </div>
          <div className="flex justify-between text-[10px] text-[#7a9abf] mt-1"><span>{elapsed}s</span><span>{duration}s</span></div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" onClick={()=>setProgress(0)}>↤</Button>
          <Button variant="primary" size="md" className="w-10 h-10 rounded-full p-0" onClick={()=>setPlaying(!playing)}>
            {playing?<Pause className="w-4 h-4"/>:<Play className="w-4 h-4"/>}
          </Button>
          <Button variant="secondary" size="sm" onClick={()=>setProgress(100)}>↦</Button>
          <Button variant="primary" size="sm" className="ml-4"><Download className="w-3.5 h-3.5"/>Export</Button>
        </div>
        {currentTrack && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs">
            <span className="text-[#7a9abf]">Audio:</span>
            <span className="text-[#1a2a3a] font-semibold">{currentTrack.title}</span>
            <span className="text-[#7a9abf]">— {currentTrack.artist}</span>
            <Badge variant="success" className="ml-auto">Synced</Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
