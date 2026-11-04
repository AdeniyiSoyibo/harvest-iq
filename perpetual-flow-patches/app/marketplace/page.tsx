"use client";
import { useState } from "react";
import { MOCK_BEATS } from "@/lib/data";
import { formatDuration } from "@/lib/utils";
import { Store, Search, ShoppingCart, Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const GENRES = ["All","Trap","House","Lo-Fi","Afrobeats","R&B","Ambient","Drill","Jungle"];

export default function MarketplacePage() {
  const [q,setQ]=useState(""); const [genre,setGenre]=useState("All"); const [cart,setCart]=useState<Set<string>>(new Set());

  const filtered = MOCK_BEATS.filter(b=>(genre==="All"||b.genre===genre)&&(!q||b.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6 max-w-5xl mx-auto">
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
            <Store className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">Beat Marketplace</h1>
            <p className="text-xs text-[#7a9abf]">Buy, sell, and license beats · 15% platform commission · Instant download</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search beats…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"/>
        </div>
        <div className="flex gap-1 flex-wrap">
          {GENRES.map(g=><button key={g} onClick={()=>setGenre(g)} className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-colors ${genre===g?"bg-emerald-500 text-white":"text-[#4a6580] hover:bg-[#e8eef5]"}`}>{g}</button>)}
        </div>
        {cart.size>0 && <Button variant="primary" size="sm"><ShoppingCart className="w-3.5 h-3.5"/>{cart.size} in cart</Button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(beat=>{
          const inCart=cart.has(beat.id);
          return (
            <div key={beat.id} className="bg-white rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Waveform preview */}
              <div className="h-16 flex items-end gap-px bg-gradient-to-br from-sky-50 to-purple-50 px-3 py-2">
                {beat.waveform.slice(0,32).map((v,i)=>(
                  <div key={i} className="flex-1 rounded-sm bg-sky-300" style={{height:`${Math.max(15,v*100)}%`}}/>
                ))}
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-[#1a2a3a] truncate">{beat.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant="sky">{beat.genre}</Badge>
                  <span className="text-[10px] text-[#7a9abf]">{beat.bpm} BPM · {beat.key}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-base font-extrabold text-emerald-600">${beat.price}</p>
                    <p className="text-[10px] text-[#7a9abf]">{formatDuration(beat.duration)} · {beat.mood}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="sm"><Play className="w-3.5 h-3.5"/></Button>
                    <Button variant={inCart?"secondary":"primary"} size="sm"
                      onClick={()=>{const n=new Set(cart);inCart?n.delete(beat.id):n.add(beat.id);setCart(n);}}>
                      {inCart?"Added":"Buy"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sell CTA */}
      <div className="gradient-header rounded-2xl px-6 py-5 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#1a2a3a]">Sell your beats here</p>
          <p className="text-xs text-[#4a6580]">List your beats · Keep 85% · Instant payout · Global reach</p>
        </div>
        <Button variant="primary">List a Beat</Button>
      </div>
    </div>
  );
}
