"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useState, useRef, useEffect } from "react";
import { deckGains } from "./DeckController";

// ── Equal-power crossfade (professional DJ standard) ─────────────────────────
// At centre both decks are at 70.7% (not 50%) — no volume dip in the middle.
function equalPowerGains(x: number): { a: number; b: number } {
  const angle = (x / 100) * (Math.PI / 2);
  return { a: Math.cos(angle), b: Math.sin(angle) };
}

// Apply gains via Web Audio scheduler for smooth, click-free transitions
function applyGains(x: number, durationSec: number) {
  // Hard 0/1 at extremes — no floating-point residual sound
  const aVal = x === 100 ? 0 : x === 0 ? 1 : Math.cos((x / 100) * (Math.PI / 2));
  const bVal = x === 0   ? 0 : x === 100 ? 1 : Math.sin((x / 100) * (Math.PI / 2));
  const tryApply = (side: "A" | "B", value: number) => {
    const g = deckGains[side];
    if (!g) return;
    const ctx = g.context;
    if (ctx.state === "suspended") (ctx as AudioContext).resume();
    const now = ctx.currentTime;
    g.gain.cancelScheduledValues(now);
    if (durationSec <= 0.05) {
      g.gain.setValueAtTime(value, now);
    } else {
      g.gain.setValueAtTime(g.gain.value, now);
      g.gain.linearRampToValueAtTime(value, now + durationSec);
    }
  };
  tryApply("A", aVal);
  tryApply("B", bVal);
}

const TRANSITION_TIMES: { label: string; sec: number }[] = [
  { label: "Instant", sec: 0 },
  { label: "1s",  sec: 1 },
  { label: "2s",  sec: 2 },
  { label: "4s",  sec: 4 },
  { label: "8s",  sec: 8 },
];

export function CrossfaderModule() {
  const { crossfade, setCrossfade, deckA, deckB } = usePlatformStore();
  const [transTime, setTransTime] = useState(2);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Re-apply gains whenever crossfade changes OR a deck connects its gain node
  useEffect(() => {
    applyGains(crossfade, 0);
    const id = setInterval(() => applyGains(crossfade, 0), 300);
    return () => clearInterval(id);
  }, [crossfade]);

  const { a: aGain, b: bGain } = equalPowerGains(crossfade);
  const aPct = Math.round(aGain * 100);
  const bPct = Math.round(bGain * 100);

  const moveTo = (target: number, overrideDur?: number) => {
    const dur = overrideDur ?? transTime;
    const start = crossfade;
    const delta = target - start;
    if (delta === 0) return;

    if (dur <= 0.05) {
      setCrossfade(target);
      applyGains(target, 0);
      return;
    }

    // Animate UI slider in sync with audio ramp
    const steps = Math.max(20, Math.round(dur * 60));
    let step = 0;
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      step++;
      const t = step / steps;
      // Ease in-out cubic for smooth feel
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const current = Math.round(start + delta * eased);
      setCrossfade(current);
      if (step >= steps) {
        clearInterval(autoRef.current!);
        setCrossfade(target);
      }
    }, (dur * 1000) / steps);

    applyGains(target, dur);
  };

  const onSlider = (val: number) => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
    setCrossfade(val);
    applyGains(val, 0.04); // tiny ramp for click-free manual movement
  };

  const crossLabel = crossfade === 50
    ? "Center — Equal Mix"
    : crossfade < 50
    ? `Deck A +${Math.round((50 - crossfade) * 2)}%`
    : `Deck B +${Math.round((crossfade - 50) * 2)}%`;

  return (
    <Card title="Crossfader" subtitle="Equal-power curve · smooth transitions">
      <div className="p-4 space-y-4">

        {/* Label row */}
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-sky-600">DECK A</span>
          <Badge>{crossLabel}</Badge>
          <span className="text-purple-600">DECK B</span>
        </div>

        {/* Fader track */}
        <div className="relative h-10 flex items-center">
          {/* Gradient fill */}
          <div className="absolute inset-x-0 h-3 top-1/2 -translate-y-1/2 rounded-full overflow-hidden pointer-events-none"
            style={{ background: `linear-gradient(to right, rgba(56,189,248,0.35) ${crossfade}%, rgba(124,92,216,0.35) ${crossfade}%)` }} />
          <input
            type="range" min={0} max={100} value={crossfade}
            onChange={e => onSlider(Number(e.target.value))}
            className="relative w-full h-3 z-10 bg-transparent cursor-pointer"
            style={{ accentColor: "#38bdf8" }}
          />
        </div>

        {/* Level meters */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "a", label: deckA?.title ?? "Deck A", pct: aPct, color: "bg-sky-400", text: "text-sky-500", grad: "from-sky-300 to-sky-500" },
            { id: "b", label: deckB?.title ?? "Deck B", pct: bPct, color: "bg-purple-400", text: "text-purple-500", grad: "from-purple-300 to-purple-500" },
          ].map(({ id, label, pct, text, grad }) => (
            <div key={id}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#7a9abf] truncate max-w-[70%]">{label}</span>
                <span className={`font-mono font-bold ${text}`}>{pct}%</span>
              </div>
              <div className="h-2 bg-[#e8eef5] rounded-full overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${grad} transition-none`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Transition time selector */}
        <div>
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-1.5">Transition Speed</p>
          <div className="flex gap-1.5 flex-wrap">
            {TRANSITION_TIMES.map(t => (
              <button key={t.sec} onClick={() => setTransTime(t.sec)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  transTime === t.sec ? "bg-sky-500 text-white" : "bg-[#f0f4f8] border border-[#cdd8e8] text-[#4a6580] hover:border-sky-300"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Snap buttons — use selected transition time */}
        <div>
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-1.5">Snap To</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { v: 0,   label: "Full A" },
              { v: 25,  label: "A Mix"  },
              { v: 50,  label: "Center" },
              { v: 75,  label: "B Mix"  },
              { v: 100, label: "Full B" },
            ].map(({ v, label }) => (
              <button key={v} onClick={() => moveTo(v)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  crossfade === v
                    ? "bg-sky-500 text-white shadow-sm"
                    : "bg-[#f0f4f8] border border-[#cdd8e8] text-[#4a6580] hover:border-sky-400 hover:text-sky-600"
                }`}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#cdd8e8] mt-1.5 text-center">Snap buttons use the selected transition speed above</p>
        </div>

      </div>
    </Card>
  );
}
