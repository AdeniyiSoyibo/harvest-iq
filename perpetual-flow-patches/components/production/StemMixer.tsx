"use client";
import { useState } from "react";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Volume2, VolumeX } from "lucide-react";
import type { Stem } from "@/lib/types";

export function StemMixer() {
  const { currentBeat, setCurrentBeat } = usePlatformStore();
  const [stems, setStems] = useState<Stem[]>(currentBeat?.stems ?? []);
  if (!currentBeat) return null;

  const update = (id: string, patch: Partial<Stem>) => {
    const next = stems.map((s) => s.id===id ? {...s,...patch} : s);
    setStems(next); setCurrentBeat({...currentBeat, stems: next});
  };

  return (
    <Card title="Stem Mixer" subtitle={`${stems.length} stems`}>
      <div className="p-4 space-y-2.5">
        {stems.map((stem) => (
          <div key={stem.id} className="flex items-center gap-3">
            <div className="w-1 h-9 rounded-full flex-shrink-0" style={{backgroundColor:stem.color}}/>
            <span className="text-xs font-semibold text-[#1a2a3a] w-16 truncate">{stem.name}</span>
            <span className="text-[10px] text-[#7a9abf] w-14 capitalize">{stem.type}</span>
            <input type="range" min={0} max={100} value={stem.volume} onChange={e=>update(stem.id,{volume:Number(e.target.value)})} className="flex-1 h-1" style={{accentColor:stem.color}}/>
            <span className="text-[10px] text-[#7a9abf] w-7 text-right">{stem.volume}</span>
            <button onClick={()=>update(stem.id,{muted:!stem.muted})} className={`p-1.5 rounded-lg transition-colors ${stem.muted?"bg-rose-50 text-rose-500":"hover:bg-[#e8eef5] text-[#7a9abf]"}`}>
              {stem.muted?<VolumeX className="w-3.5 h-3.5"/>:<Volume2 className="w-3.5 h-3.5"/>}
            </button>
            <button onClick={()=>update(stem.id,{solo:!stem.solo})} className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${stem.solo?"bg-amber-50 text-amber-500":"hover:bg-[#e8eef5] text-[#7a9abf]"}`}>S</button>
          </div>
        ))}
      </div>
    </Card>
  );
}
