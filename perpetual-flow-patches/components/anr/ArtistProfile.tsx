"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import { ExternalLink, Users, TrendingUp, Tag, MapPin, Music } from "lucide-react";

export function ArtistProfile() {
  const { selectedArtist } = usePlatformStore();
  if (!selectedArtist) return (
    <Card className="flex flex-col items-center justify-center h-48"><Users className="w-8 h-8 text-[#cdd8e8] mb-2"/><p className="text-sm text-[#7a9abf]">Select an artist to view their profile</p></Card>
  );
  const a = selectedArtist;
  return (
    <Card title="Artist Profile">
      <div className="p-4 space-y-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-3xl flex-shrink-0">🎤</div>
          <div>
            <h2 className="text-lg font-bold text-[#1a2a3a]">{a.name}</h2>
            <div className="flex items-center gap-1 text-xs text-[#7a9abf] mt-0.5"><MapPin className="w-3 h-3"/>{a.location}</div>
            <div className="flex flex-wrap gap-1 mt-1.5">{a.genre.map(g=><Badge key={g} variant="sky">{g}</Badge>)}<Badge variant="outline">{a.subgenre}</Badge></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[{icon:Users,label:"Listeners",value:formatNumber(a.monthlyListeners),color:"text-sky-600"},{icon:TrendingUp,label:"Growth",value:`+${a.growthRate}%`,color:"text-emerald-600"},{icon:Tag,label:"Market Fit",value:`${a.marketFitScore}/100`,color:a.marketFitScore>=80?"text-emerald-600":"text-amber-500"}].map(({icon:Icon,label,value,color})=>(
            <div key={label} className="bg-[#f0f4f8] rounded-xl p-3 text-center"><Icon className={`w-4 h-4 mx-auto mb-1 ${color}`}/><p className={`text-sm font-bold ${color}`}>{value}</p><p className="text-[10px] text-[#7a9abf]">{label}</p></div>
          ))}
        </div>
        <p className="text-sm text-[#4a6580] leading-relaxed">{a.bio}</p>
        <div>
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-1.5">Label Interest</p>
          <div className="flex flex-wrap gap-1.5">{a.labelInterest.map(l=><Badge key={l} variant="default">{l}</Badge>)}</div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-1.5">Social Presence</p>
          <div className="flex flex-wrap gap-1.5">{Object.keys(a.socialLinks).map(p=><Button key={p} variant="ghost" size="sm" className="capitalize">{p}</Button>)}</div>
        </div>
        {a.tracks.length>0 && (
          <div>
            <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-1.5 flex items-center gap-1"><Music className="w-3 h-3"/>Featured Tracks</p>
            {a.tracks.map(t=>(
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f0f4f8]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-200 to-purple-200 flex items-center justify-center text-sm">🎵</div>
                <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-[#1a2a3a] truncate">{t.title}</p><p className="text-[10px] text-[#7a9abf]">{t.bpm} BPM · {t.key}</p></div>
                <Badge variant="sky">{Math.round(t.energy*100)} energy</Badge>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          {a.portfolioUrl && <Button variant="ghost" size="sm"><ExternalLink className="w-3.5 h-3.5"/>Portfolio</Button>}
          <Button variant="primary" size="sm" className="flex-1">+ Shortlist</Button>
        </div>
      </div>
    </Card>
  );
}
