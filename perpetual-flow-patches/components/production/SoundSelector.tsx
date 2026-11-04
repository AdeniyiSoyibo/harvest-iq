"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Plus } from "lucide-react";

const SOUNDS = [
  {id:"snd1",name:"808 Thump XL",    category:"Bass",   tags:["sub","trap"],   match:97},
  {id:"snd2",name:"Trap Hi-Hat Roll", category:"Drums",  tags:["hats","roll"],  match:94},
  {id:"snd3",name:"Cinematic Pluck",  category:"Melody", tags:["pluck","dark"], match:89},
  {id:"snd4",name:"Atmospheric Pad",  category:"Harmony",tags:["pad","wide"],   match:85},
  {id:"snd5",name:"Vinyl Crackle",    category:"FX",     tags:["texture","lofi"],match:78},
  {id:"snd6",name:"Afro Perc Loop",   category:"Drums",  tags:["afrobeats","perc"],match:82},
  {id:"snd7",name:"Reese Bass",       category:"Bass",   tags:["dnb","jungle"], match:75},
  {id:"snd8",name:"Drill Slide 808",  category:"Bass",   tags:["drill","808"],  match:91},
];
const CATS = ["All","Drums","Bass","Melody","Harmony","FX"];

export function SoundSelector() {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("All"); const [sel, setSel] = useState<Set<string>>(new Set());
  const filtered = SOUNDS.filter(s=>(cat==="All"||s.category===cat)&&(!q||s.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <Card title="AI Sound Selector" subtitle="Genre-matched sounds">
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search sounds…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"/>
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors ${cat===c?"bg-sky-500 text-white":"text-[#4a6580] hover:bg-[#e8eef5]"}`}>{c}</button>
          ))}
        </div>
        <div className="space-y-1.5">
          {filtered.map(s=>{
            const on=sel.has(s.id);
            return (
              <div key={s.id} onClick={()=>{const n=new Set(sel);on?n.delete(s.id):n.add(s.id);setSel(n);}}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${on?"bg-sky-50 border border-sky-200":"hover:bg-[#f0f4f8]"}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1a2a3a] truncate">{s.name}</p>
                  <div className="flex gap-1 mt-0.5">{s.tags.slice(0,2).map(t=><Badge key={t} variant="outline">{t}</Badge>)}</div>
                </div>
                <p className={`text-xs font-bold flex-shrink-0 ${s.match>=90?"text-emerald-600":s.match>=75?"text-amber-500":"text-[#7a9abf]"}`}>{s.match}%</p>
                {on && <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0"><Plus className="w-3 h-3 text-white"/></div>}
              </div>
            );
          })}
        </div>
        {sel.size>0 && <Button variant="primary" className="w-full">Add {sel.size} sound{sel.size>1?"s":""} to beat</Button>}
      </div>
    </Card>
  );
}
