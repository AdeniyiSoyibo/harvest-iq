"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Play, Zap } from "lucide-react";

export function PlaylistPanel() {
  const { playlists, setQueue, setCurrentTrack } = usePlatformStore();
  return (
    <Card title="Flow Playlists" subtitle={`${playlists.length} curated`}>
      <div className="p-4 space-y-3">
        {playlists.map((pl)=>(
          <div key={pl.id} className="p-3 rounded-xl border border-[#e8eef5] hover:border-sky-200 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a2a3a]">{pl.name}</p>
                <p className="text-xs text-[#7a9abf] mt-0.5">{pl.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={()=>{setQueue(pl.tracks);if(pl.tracks.length>0)setCurrentTrack(pl.tracks[0]);}}><Play className="w-3.5 h-3.5"/></Button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-[#7a9abf]">{pl.tracks.length} tracks</span>
              <div className="flex items-center gap-1"><Zap className="w-3 h-3 text-emerald-500"/><span className="text-[10px] text-emerald-600 font-semibold">Flow {pl.flowScore}</span></div>
            </div>
            <div className="flex gap-1 mt-2">
              {pl.tracks.slice(0,4).map(t=>(
                <div key={t.id} className="flex-1 h-6 rounded bg-gradient-to-br from-sky-200 to-purple-200 flex items-center justify-center text-[8px] text-[#4a6580]" title={t.title}>{t.artist.slice(0,3)}</div>
              ))}
            </div>
          </div>
        ))}
        <Button variant="secondary" className="w-full">+ Create Playlist</Button>
      </div>
    </Card>
  );
}
