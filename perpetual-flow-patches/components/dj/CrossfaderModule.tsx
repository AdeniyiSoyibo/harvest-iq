"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Zap } from "lucide-react";

export function CrossfaderModule() {
  const { crossfade, setCrossfade, deckA, deckB } = usePlatformStore();
  const aPct = 100 - crossfade;
  const bPct = crossfade;

  return (
    <Card title="Crossfader">
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-sky-600">DECK A</span>
          <Badge>{crossfade===50?"Center":crossfade<50?`A +${(50-crossfade)*2}%`:`B +${(crossfade-50)*2}%`}</Badge>
          <span className="text-purple-600">DECK B</span>
        </div>
        <div className="relative h-10 flex items-center">
          <div className="absolute inset-0 rounded-full h-2 top-1/2 -translate-y-1/2 overflow-hidden"
            style={{background:`linear-gradient(to right,rgba(56,189,248,0.3) ${aPct}%,rgba(124,92,216,0.3) ${aPct}%)`}}/>
          <input type="range" min={0} max={100} value={crossfade} onChange={e=>setCrossfade(Number(e.target.value))} className="relative w-full h-2 z-10 bg-transparent"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[{label:deckA?.title??"No track",pct:aPct,color:"bg-sky-400",text:"text-sky-500"},{label:deckB?.title??"No track",pct:bPct,color:"bg-purple-400",text:"text-purple-500"}].map(({label,pct,color,text})=>(
            <div key={label}>
              <div className="flex justify-between text-[10px] mb-1"><span className="text-[#7a9abf] truncate max-w-[80%]">{label}</span><span className={`font-mono font-bold ${text}`}>{pct}%</span></div>
              <div className="h-1.5 bg-[#e8eef5] rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full transition-all`} style={{width:`${pct}%`}}/></div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-center">
          {[0,25,50,75,100].map(v=>(
            <button key={v} onClick={()=>setCrossfade(v)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${crossfade===v?"bg-sky-500 text-white":"bg-[#f0f4f8] border border-[#cdd8e8] text-[#4a6580] hover:border-sky-300"}`}>
              {v===0?"A":v===100?"B":v}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
