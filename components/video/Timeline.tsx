"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlignJustify } from "lucide-react";

const TYPE_COLOR: Record<string,string> = { beat:"bg-sky-400", drop:"bg-rose-400", phrase:"bg-orange-400", custom:"bg-purple-400" };

export function Timeline() {
  const { videoProject, currentTrack } = usePlatformStore();
  if (!videoProject) return null;
  const total = videoProject.duration;

  return (
    <Card title="Timeline" subtitle={`${total}s total`}>
      <div className="p-4 space-y-3">
        <div className="flex text-[10px] text-[#7a9abf] select-none">
          {Array.from({length:11},(_,i)=><div key={i} className="flex-1 text-center">{Math.round((i/10)*total)}s</div>)}
        </div>
        {/* Waveform */}
        <div>
          <p className="text-[10px] text-[#7a9abf] mb-1">Audio</p>
          <div className="relative h-10 bg-[#f0f4f8] rounded-xl overflow-hidden border border-[#e8eef5] flex items-end gap-px px-1">
            {currentTrack&&Array.from({length:64},(_,i)=>{
              const v=0.2+0.75*Math.abs(Math.sin(i*0.4));
              return <div key={i} className="flex-1 bg-sky-300/60 rounded-sm" style={{height:`${v*100}%`}}/>;
            })}
            {videoProject.syncPoints.slice(0,30).map((sp,i)=>(
              <div key={i} className={`absolute top-0 bottom-0 w-px opacity-60 ${sp.type==="drop"?"bg-rose-400":sp.type==="phrase"?"bg-orange-400":"bg-sky-200"}`}
                style={{left:`${(sp.time/total)*100}%`}} title={`${sp.type} @ ${sp.time}s`}/>
            ))}
          </div>
        </div>
        {/* Clips */}
        <div>
          <p className="text-[10px] text-[#7a9abf] mb-1">Clips</p>
          <div className="relative h-10 bg-[#f0f4f8] rounded-xl border border-[#e8eef5] overflow-hidden">
            {videoProject.clips.map(clip=>{
              const left=(clip.startTime/total)*100;
              const width=((clip.endTime-clip.startTime)/total)*100;
              return (
                <div key={clip.id} className="absolute top-1 bottom-1 rounded-lg bg-orange-100 border border-orange-300 flex items-center px-1 overflow-hidden cursor-pointer hover:bg-orange-200 transition-colors"
                  style={{left:`${left}%`,width:`${width}%`}} title={clip.label}>
                  <p className="text-[10px] text-orange-700 font-semibold truncate">{clip.label}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-4 text-[10px]">
          {[{color:"bg-orange-400",label:"Phrase"},{color:"bg-rose-400",label:"Drop"},{color:"bg-sky-200",label:"Beat"}].map(({color,label})=>(
            <div key={label} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${color}`}/><span className="text-[#7a9abf]">{label}</span></div>
          ))}
        </div>
      </div>
    </Card>
  );
}
