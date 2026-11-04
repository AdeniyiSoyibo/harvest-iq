"use client";
import { useState, useEffect, useRef } from "react";
import { usePlatformStore } from "@/lib/store";
import { useUser } from "@/lib/userContext";
import { Card } from "@/components/ui/Card";
import { Volume2, VolumeX, Lock } from "lucide-react";

// Default stems generated for any uploaded beat
const DEFAULT_STEMS = [
  { id: "drums",   name: "Drums",   type: "drums",   color: "#ef4444", volume: 80, muted: false, solo: false },
  { id: "bass",    name: "Bass",    type: "bass",    color: "#f97316", volume: 75, muted: false, solo: false },
  { id: "melody",  name: "Melody",  type: "melody",  color: "#38bdf8", volume: 70, muted: false, solo: false },
  { id: "vocals",  name: "Vocals",  type: "vocals",  color: "#a855f7", volume: 65, muted: false, solo: false },
  { id: "fx",      name: "FX",      type: "fx",      color: "#10b981", volume: 50, muted: false, solo: false },
];

type StemRow = typeof DEFAULT_STEMS[0];

// Tier access: free gets 2 stems, paid gets all 5
const FREE_STEMS = ["drums", "bass"];

export function StemMixer() {
  const { currentBeat } = usePlatformStore();
  const { user } = useUser();
  const isPaid = user && user.tier !== "free";

  // Use mock stems if beat has them, else default stems for uploaded
  const initialStems: StemRow[] = (currentBeat?.stems?.length
    ? currentBeat.stems.map((s: any) => ({
        id: s.id, name: s.name, type: s.type,
        color: s.color ?? "#38bdf8",
        volume: s.volume ?? 80, muted: s.muted ?? false, solo: s.solo ?? false,
      }))
    : DEFAULT_STEMS
  );

  const [stems, setStems] = useState<StemRow[]>(initialStems);
  const [eqValues, setEqValues] = useState<Record<string, { low: number; mid: number; high: number }>>(
    Object.fromEntries(initialStems.map(s => [s.id, { low: 0, mid: 0, high: 0 }]))
  );
  const [showEQ, setShowEQ] = useState<string | null>(null);

  // Reset stems when beat changes
  useEffect(() => {
    const next = currentBeat?.stems?.length
      ? currentBeat.stems.map((s: any) => ({
          id: s.id, name: s.name, type: s.type,
          color: s.color ?? "#38bdf8",
          volume: s.volume ?? 80, muted: s.muted ?? false, solo: s.solo ?? false,
        }))
      : DEFAULT_STEMS;
    setStems(next);
    setEqValues(Object.fromEntries(next.map((s: StemRow) => [s.id, { low: 0, mid: 0, high: 0 }])));
    setShowEQ(null);
  }, [currentBeat?.id]);

  if (!currentBeat) return null;

  const anySolo = stems.some(s => s.solo);

  const update = (id: string, patch: Partial<StemRow>) => {
    setStems(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  };

  const updateEQ = (id: string, band: "low" | "mid" | "high", val: number) => {
    setEqValues(prev => ({ ...prev, [id]: { ...prev[id], [band]: val } }));
  };

  // Effective volume considering solo/mute
  const effectiveVol = (stem: StemRow) => {
    if (stem.muted) return 0;
    if (anySolo && !stem.solo) return 0;
    return stem.volume;
  };

  return (
    <Card title="Stem Mixer" subtitle={isPaid ? `${stems.length} stems · EQ · Solo · Mute` : `${FREE_STEMS.length} stems (Free) · Upgrade for full access`}>
      <div className="p-4 space-y-1">

        {/* Upgrade banner for free users */}
        {!isPaid && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Free plan: Drums &amp; Bass only. <a href="/pricing" className="font-bold underline">Upgrade to Pro</a> for Melody, Vocals &amp; FX stems + EQ.</span>
          </div>
        )}

        {stems.map((stem) => {
          const locked = !isPaid && !FREE_STEMS.includes(stem.id);
          const vol = effectiveVol(stem);
          const eq = eqValues[stem.id] ?? { low: 0, mid: 0, high: 0 };

          return (
            <div key={stem.id} className={`rounded-xl border transition-all ${locked ? "opacity-40 pointer-events-none border-[#e8eef5]" : "border-[#e8eef5] hover:border-sky-100"}`}>
              {/* Main row */}
              <div className="flex items-center gap-2 px-3 py-2">
                {/* Color bar + level indicator */}
                <div className="relative w-1 h-9 rounded-full flex-shrink-0 bg-[#e8eef5]">
                  <div className="absolute bottom-0 left-0 right-0 rounded-full transition-all"
                    style={{ backgroundColor: stem.color, height: `${vol}%` }} />
                </div>

                {/* Name */}
                <span className="text-xs font-semibold text-[#1a2a3a] w-14 truncate">{stem.name}</span>

                {/* Volume fader */}
                <input type="range" min={0} max={100} value={stem.volume}
                  onChange={e => update(stem.id, { volume: Number(e.target.value) })}
                  className="flex-1 h-1.5 cursor-pointer"
                  style={{ accentColor: stem.color }} />

                {/* Volume % */}
                <span className="text-[10px] text-[#7a9abf] w-7 text-right font-mono">{stem.volume}</span>

                {/* Mute */}
                <button onClick={() => update(stem.id, { muted: !stem.muted })}
                  className={`p-1.5 rounded-lg transition-colors ${stem.muted ? "bg-rose-50 text-rose-500" : "hover:bg-[#e8eef5] text-[#7a9abf]"}`}
                  title="Mute">
                  {stem.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Solo */}
                <button onClick={() => update(stem.id, { solo: !stem.solo })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${stem.solo ? "bg-amber-50 text-amber-500 border border-amber-200" : "hover:bg-[#e8eef5] text-[#7a9abf]"}`}
                  title="Solo">S</button>

                {/* EQ toggle (paid only) */}
                {isPaid && (
                  <button onClick={() => setShowEQ(showEQ === stem.id ? null : stem.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${showEQ === stem.id ? "bg-sky-50 text-sky-500 border border-sky-200" : "hover:bg-[#e8eef5] text-[#7a9abf]"}`}
                    title="EQ">EQ</button>
                )}

                {locked && <Lock className="w-3 h-3 text-[#cdd8e8] ml-1" />}
              </div>

              {/* EQ panel */}
              {isPaid && showEQ === stem.id && (
                <div className="px-3 pb-3 pt-0 grid grid-cols-3 gap-3 border-t border-[#f0f4f8]">
                  {(["low", "mid", "high"] as const).map(band => (
                    <div key={band} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-[#7a9abf] capitalize">{band}</span>
                      <input type="range" min={-12} max={12} value={eq[band]}
                        onChange={e => updateEQ(stem.id, band, Number(e.target.value))}
                        className="w-full h-1" style={{ accentColor: stem.color }} />
                      <span className="text-[10px] font-mono text-[#7a9abf]">{eq[band] > 0 ? "+" : ""}{eq[band]} dB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Master output level */}
        <div className="pt-2 border-t border-[#f0f4f8] mt-2">
          <div className="flex items-center gap-2 px-1">
            <span className="text-[10px] font-semibold text-[#7a9abf] w-14">MASTER</span>
            <div className="flex-1 flex gap-0.5 h-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={`flex-1 rounded-sm ${
                  i < 14 ? "bg-emerald-400" : i < 17 ? "bg-amber-400" : "bg-rose-400"
                }`} style={{ opacity: stems.some(s => effectiveVol(s) > i * 5) ? 1 : 0.15 }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
}
