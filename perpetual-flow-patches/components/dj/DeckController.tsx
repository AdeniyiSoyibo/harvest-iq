"use client";
import { usePlatformStore } from "@/lib/store";
import { MOCK_TRACKS } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDuration } from "@/lib/utils";
import { Play, Pause, ChevronDown } from "lucide-react";
import { useState } from "react";

export function DeckController({ side }: { side: "A"|"B" }) {
  const { deckA, deckB, setDeckA, setDeckB, isPlaying, setIsPlaying } = usePlatformStore();
  const track = side==="A" ? deckA : deckB;
  const setTrack = side==="A" ? setDeckA : setDeckB;
  const [progress, setProgress] = useState(side==="A"?28:0);
  const [bpmAdj, setBpmAdj] = useState(0);
  const grad = side==="A" ? "from-sky-400 to-blue-500" : "from-purple-400 to-indigo-500";
  const bar  = side==="A" ? "bg-sky-400" : "bg-purple-400";
  const text = side==="A" ? "text-sky-600" : "text-purple-600";

  return (
    <Card className={isPlaying&&side==="A"?"deck-active":""}>
      <div className="px-4 py-3 border-b border-[#e8eef5] flex items-center gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gradient-to-r ${grad} text-white`}>DECK {side}</span>
        {isPlaying && side==="A" && <Badge variant="success">Live</Badge>}
        <div className="flex-1"/>
        <div className="relative">
          <select value={track?.id??""} onChange={e=>{const t=MOCK_TRACKS.find(x=>x.id===e.target.value);if(t)setTrack(t);}}
            className="appearance-none bg-[#f0f4f8] border border-[#cdd8e8] rounded-xl px-3 py-1.5 text-xs text-[#1a2a3a] pr-7 focus:outline-none focus:border-sky-400">
            <option value="">Select track…</option>
            {MOCK_TRACKS.map(t=><option key={t.id} value={t.id}>{t.title} — {t.artist}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7a9abf] pointer-events-none"/>
        </div>
      </div>
      {track ? (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{l:"BPM",v:track.bpm+bpmAdj},{l:"KEY",v:track.key},{l:"DUR",v:formatDuration(track.duration)}].map(({l,v})=>(
              <div key={l} className="bg-[#f0f4f8] rounded-xl py-2.5 border border-[#e8eef5]">
                <div className="text-[9px] font-bold text-[#7a9abf] uppercase">{l}</div>
                <div className={`text-sm font-mono font-bold ${text} mt-0.5`}>{v}</div>
              </div>
            ))}
          </div>
          <div className="h-12 flex items-end gap-px bg-[#f0f4f8] rounded-xl px-2 py-1.5 cursor-pointer" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round(((e.clientX-r.left)/r.width)*100));}}>
            {Array.from({length:48},(_,i)=>{
              const v=0.3+0.65*Math.abs(Math.sin(i*0.35+(side==="A"?0:1)));
              return <div key={i} className={`flex-1 rounded-sm ${(i/48)*100<progress?bar:"bg-[#cdd8e8]"}`} style={{height:`${Math.max(10,v*100)}%`}}/>;
            })}
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-[#7a9abf] mb-1"><span>BPM Adjust</span><span className={`font-mono font-bold ${text}`}>{track.bpm+bpmAdj}{bpmAdj!==0&&` (${bpmAdj>0?"+":""}${bpmAdj})`}</span></div>
            <input type="range" min={-8} max={8} step={0.5} value={bpmAdj} onChange={e=>setBpmAdj(Number(e.target.value))} className="w-full h-1"/>
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-[#7a9abf] mb-1"><span>Energy</span><span>{Math.round(track.energy*100)}%</span></div>
            <div className="h-2 bg-[#e8eef5] rounded-full overflow-hidden"><div className={`h-full rounded-full bg-gradient-to-r ${grad}`} style={{width:`${track.energy*100}%`}}/></div>
          </div>
          <button onClick={()=>setIsPlaying(!isPlaying)} className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r ${grad} hover:opacity-90 shadow-sm`}>
            {isPlaying&&side==="A"?<><Pause className="w-4 h-4"/>Pause</>:<><Play className="w-4 h-4"/>Cue & Play Deck {side}</>}
          </button>
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-[#7a9abf]">Select a track to load deck {side}</div>
      )}
    </Card>
  );
}
