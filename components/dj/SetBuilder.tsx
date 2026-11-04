"use client";
import { useState } from "react";
import { usePlatformStore } from "@/lib/store";
import { MOCK_TRACKS } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListMusic, Plus, Trash2 } from "lucide-react";
import type { Track } from "@/lib/types";

export function SetBuilder() {
  const { deckA, deckB, addToQueue, setCurrentTrack } = usePlatformStore();
  const [setList, setSetList] = useState<Track[]>([]);
  const [sent, setSent] = useState(false);

  const add = (t: Track|null) => { if(t&&!setList.find(s=>s.id===t.id)) setSetList(p=>[...p,t]); };
  const remove = (id: string) => setSetList(p=>p.filter(s=>s.id!==id));
  const moveUp = (i: number) => {
    if (i === 0) return;
    setSetList(p => { const n=[...p]; [n[i-1],n[i]]=[n[i],n[i-1]]; return n; });
  };

  const sendToStreaming = () => {
    if (!setList.length) return;
    addToQueue(setList);
    setCurrentTrack(setList[0]);
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  const totalBPMs = setList.length > 1
    ? `${Math.min(...setList.map(t=>t.bpm))}–${Math.max(...setList.map(t=>t.bpm))} BPM`
    : null;

  return (
    <Card title="Set Builder" subtitle="Build, reorder, and send your DJ set to Streaming">
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="secondary" size="sm" onClick={()=>add(deckA)} disabled={!deckA}>+ Deck A</Button>
          <Button variant="secondary" size="sm" onClick={()=>add(deckB)} disabled={!deckB}>+ Deck B</Button>
          <Button variant="ghost" size="sm" onClick={()=>setSetList([])}>Clear</Button>
          {totalBPMs && <span className="text-[10px] text-[#7a9abf] font-mono ml-1">{totalBPMs} · {setList.length} tracks</span>}
          <div className="flex gap-2 ml-auto">
            <Button
              variant="secondary" size="sm"
              onClick={sendToStreaming}
              disabled={!setList.length}
            >
              → Send to Streaming
            </Button>
            <Button variant="primary" size="sm" disabled={!setList.length}>Export Set</Button>
          </div>
        </div>
        {sent && (
          <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold fade-in">
            ✓ Set added to Streaming queue
          </div>
        )}
        {setList.length===0 ? (
          <div className="py-8 text-center"><ListMusic className="w-8 h-8 text-[#cdd8e8] mx-auto mb-2"/><p className="text-xs text-[#7a9abf]">Add tracks from the decks above to build your set</p></div>
        ) : (
          <div className="space-y-1.5">
            {setList.map((t,i)=>(
              <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f0f4f8] border border-[#e8eef5] group">
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={()=>moveUp(i)} disabled={i===0} className="text-[#cdd8e8] hover:text-sky-400 disabled:opacity-20 leading-none text-xs">▲</button>
                  <span className="text-[10px] text-[#7a9abf] font-mono text-center">{i+1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1a2a3a] truncate">{t.title}</p>
                  <p className="text-[10px] text-[#7a9abf]">{t.artist} · {t.bpm} BPM · {t.key}</p>
                </div>
                <button onClick={()=>remove(t.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 text-[#cdd8e8] hover:text-rose-400 transition-all"><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
