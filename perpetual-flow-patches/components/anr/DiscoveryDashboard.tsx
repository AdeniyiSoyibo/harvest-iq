"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatNumber, scoreBg } from "@/lib/utils";
import { TrendingUp, Search, Filter } from "lucide-react";
import { useState } from "react";

const GENRES = [
  "All",
  // Global Commercial
  "Hip-Hop","Trap","R&B","Electronic","Afrobeats","Afropop",
  // Caribbean
  "Reggae","Dancehall","Soca",
  // African Regional
  "Amapiano","Highlife","Afro House",
  // Latin / South American
  "Cumbia","Baile Funk","Dembow",
  // UK / Club
  "Drum & Bass","Jungle","Drill","Grime",
  // East Asian
  "K-Trap","K-R&B",
  // Other
  "Ambient","Nu-Jazz","Neo-Classical","World",
];

export function DiscoveryDashboard() {
  const { artists, selectedArtist, setSelectedArtist } = usePlatformStore();
  const [q,setQ]=useState(""); const [genre,setGenre]=useState("All"); const [sort,setSort]=useState<"market"|"growth"|"listeners">("market");

  const filtered = artists
    .filter(a=>(!q||a.name.toLowerCase().includes(q.toLowerCase()))&&(genre==="All"||a.genre.some(g=>g===genre)))
    .sort((a,b)=>sort==="market"?b.marketFitScore-a.marketFitScore:sort==="growth"?b.growthRate-a.growthRate:b.monthlyListeners-a.monthlyListeners);

  return (
    <Card title="New Artist Discovery Dashboard" subtitle={`${filtered.length} artists tracked`}>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search artists…"
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"/>
          </div>
          <div className="flex gap-1 flex-wrap">
            {GENRES.map(g=>(
              <button key={g} onClick={()=>setGenre(g)} className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-colors ${genre===g?"bg-rose-500 text-white":"text-[#4a6580] hover:bg-[#e8eef5]"}`}>{g}</button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#7a9abf]"/>
            {(["market","growth","listeners"] as const).map(s=>(
              <button key={s} onClick={()=>setSort(s)} className={`px-2 py-1 rounded-lg text-[10px] transition-colors ${sort===s?"bg-[#e8eef5] text-[#1a2a3a] font-semibold":"text-[#7a9abf] hover:text-[#1a2a3a]"}`}>
                {s==="market"?"Market Fit":s==="growth"?"Growth":"Listeners"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {filtered.map(artist=>{
            const active=selectedArtist?.id===artist.id;
            return (
              <div key={artist.id} onClick={()=>setSelectedArtist(active?null:artist)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${active?"border-rose-300 bg-rose-50 ring-1 ring-rose-200":"border-[#e8eef5] hover:border-rose-200"}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-lg mb-2">🎤</div>
                <p className="text-sm font-bold text-[#1a2a3a] truncate">{artist.name}</p>
                <p className="text-[10px] text-[#7a9abf] truncate">{artist.genre.join(", ")}</p>
                <p className="text-[10px] text-[#7a9abf] mt-0.5">{artist.location}</p>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <div><p className="text-[9px] text-[#7a9abf]">Listeners</p><p className="text-[10px] font-bold text-[#1a2a3a]">{formatNumber(artist.monthlyListeners)}</p></div>
                  <div><p className="text-[9px] text-[#7a9abf]">Growth</p><p className="text-[10px] font-bold text-emerald-600">+{artist.growthRate}%</p></div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-[9px] mb-1"><span className="text-[#7a9abf]">Market Fit</span><span className={`font-bold ${scoreBg(artist.marketFitScore)}`}>{artist.marketFitScore}</span></div>
                  <ProgressBar value={artist.marketFitScore} size="sm" color={artist.marketFitScore>=80?"bg-emerald-400":"bg-amber-400"}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
