"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BarChart2, TrendingUp, Globe, Users, Music } from "lucide-react";

export function MarketFitPanel() {
  const { selectedArtist: a } = usePlatformStore();
  if (!a) return <Card title="Market-Fit Scoring"><div className="p-4 text-center text-xs text-[#7a9abf] py-6">Select an artist</div></Card>;

  const dims = [
    {label:"Streaming Traction", icon:Music,      score:Math.min(100,Math.round(Math.log10(a.monthlyListeners+1)*20)), note:"Listener volume vs genre cohort"},
    {label:"Growth Velocity",    icon:TrendingUp, score:Math.min(100,a.growthRate*2),                                   note:"Month-over-month listener growth"},
    {label:"Genre Market Size",  icon:Globe,      score:a.genre.includes("Hip-Hop")||a.genre.includes("R&B")?88:a.genre.includes("Electronic")||a.genre.includes("Afrobeats")?79:55, note:"Addressable market for primary genre"},
    {label:"Audience Retention", icon:Users,      score:Math.round(a.marketFitScore*0.9+5),                             note:"Repeat listener behaviour signal"},
    {label:"Overall Market Fit", icon:BarChart2,  score:a.marketFitScore,                                               note:"Composite weighted score"},
  ];

  return (
    <Card title="Market-Fit Scoring" subtitle={`${a.name}`}>
      <div className="p-4 space-y-3">
        {dims.map(({label,icon:Icon,score,note})=>(
          <div key={label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-[#7a9abf]"/><span className="text-[#1a2a3a] font-medium">{label}</span></div>
              <span className={`font-bold ${score>=80?"text-emerald-600":score>=60?"text-amber-500":"text-rose-500"}`}>{score}</span>
            </div>
            <ProgressBar value={score} size="sm" color={score>=80?"bg-emerald-400":score>=60?"bg-amber-400":"bg-rose-400"}/>
            <p className="text-[10px] text-[#7a9abf] mt-0.5">{note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
