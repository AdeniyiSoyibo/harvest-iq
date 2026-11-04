"use client";
import { useMemo } from "react";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Sparkles } from "lucide-react";
import type { Artist } from "@/lib/types";

function computeMatches(a: Artist) {
  const labels: Record<string,{fit:number;reasons:string[]}> = {
    "Ninja Tune":          {fit:a.genre.some(g=>["Electronic","Ambient"].includes(g))?88:42, reasons:["Electronic catalog alignment","Independent distribution preference"]},
    "RCA Records":         {fit:a.genre.some(g=>["Hip-Hop","R&B"].includes(g))?91:38,         reasons:["Mainstream R&B/Hip-Hop roster","Strong streaming infrastructure"]},
    "Mau5trap":            {fit:a.genre.includes("Electronic")?79:30,                          reasons:["Electronic/dance-forward label","Festival circuit exposure"]},
    "Interscope":          {fit:a.growthRate>=40?85:55,                                        reasons:["High-growth artist acquisitions","TikTok virality pipeline"]},
    "Def Jam Africa":      {fit:a.genre.includes("Afrobeats")||a.genre.includes("Afropop")?92:28, reasons:["Afrobeats/Afropop specialists","Pan-African distribution network"]},
    "Ghostly International":{fit:a.genre.some(g=>["Ambient","Experimental","Neo-Classical"].includes(g))?82:25, reasons:["Experimental and ambient specialists","Artist-first culture"]},
  };
  return Object.entries(labels).map(([label,{fit,reasons}])=>({label,fit,reasons})).sort((a,b)=>b.fit-a.fit).slice(0,4);
}

export function TalentMatchPanel() {
  const { selectedArtist } = usePlatformStore();
  const matches = useMemo(()=>selectedArtist?computeMatches(selectedArtist):[], [selectedArtist]);

  if (!selectedArtist) return <Card title="Talent Matching"><div className="p-4 text-center text-xs text-[#7a9abf] py-6">Select an artist</div></Card>;

  return (
    <Card title="Talent Matching" subtitle="AI label matching">
      <div className="p-4 space-y-3">
        {matches.map(({label,fit,reasons})=>(
          <div key={label} className="p-3 rounded-xl border border-[#e8eef5] hover:border-amber-200 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#1a2a3a]">{label}</span>
              <span className={`text-xs font-bold ${fit>=80?"text-emerald-600":fit>=60?"text-amber-500":"text-[#7a9abf]"}`}>{fit}% fit</span>
            </div>
            <ProgressBar value={fit} size="sm" color={fit>=80?"bg-emerald-400":"bg-amber-400"}/>
            <ul className="mt-2 space-y-0.5">
              {reasons.map(r=><li key={r} className="text-[10px] text-[#4a6580] flex items-start gap-1.5"><span className="text-amber-400">·</span>{r}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
