"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Film, Plus, Trash2, GripVertical } from "lucide-react";
import type { VideoClip } from "@/lib/types";

export function ClipBin() {
  const { videoProject, setVideoProject } = usePlatformStore();
  const clips = videoProject?.clips ?? [];
  const deleteClip = (id: string) => {
    if (!videoProject) return;
    setVideoProject({...videoProject, clips: clips.filter(c=>c.id!==id)});
  };

  return (
    <Card title="Clip Bin" subtitle={`${clips.length} clips`} className="h-full">
      <div className="p-4 space-y-2">
        {clips.map(clip=>(
          <div key={clip.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-[#e8eef5] hover:border-orange-200 group transition-colors">
            <GripVertical className="w-3.5 h-3.5 text-[#cdd8e8] cursor-grab flex-shrink-0"/>
            <div className="w-9 h-7 rounded-lg bg-gradient-to-br from-orange-200 to-sky-200 flex items-center justify-center text-xs flex-shrink-0">🎬</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1a2a3a] truncate">{clip.label}</p>
              <p className="text-[10px] text-[#7a9abf]">{clip.startTime}s–{clip.endTime}s · {clip.endTime-clip.startTime}s</p>
            </div>
            <button onClick={()=>deleteClip(clip.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 text-[#cdd8e8] hover:text-rose-400 transition-all">
              <Trash2 className="w-3 h-3"/>
            </button>
          </div>
        ))}
        <Button variant="secondary" className="w-full mt-1"><Plus className="w-3.5 h-3.5"/>Import Clip</Button>
      </div>
    </Card>
  );
}
