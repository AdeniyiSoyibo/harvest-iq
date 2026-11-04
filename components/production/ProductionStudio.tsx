"use client";

import { useState, useEffect, useRef } from "react";
import {
  Cpu, HardDrive, Mic2, Monitor, Layers, Zap, Shield,
  Settings, ChevronDown, ChevronUp, Activity, Headphones,
  Music, Waves, RefreshCw, Check, Lock, AlertCircle,
  Play, Square, Circle, SkipBack, Plus, Volume2, Minus
} from "lucide-react";
import { useUser } from "@/lib/userContext";

// ── Web Audio ─────────────────────────────────────────────────────────────────
function getCtx(): AudioContext {
  const w = window as Window & { _prodCtx?: AudioContext };
  if (!w._prodCtx || w._prodCtx.state === "closed") w._prodCtx = new AudioContext();
  if (w._prodCtx.state === "suspended") w._prodCtx.resume();
  return w._prodCtx;
}

function playClick(beat: number) {
  const ctx = getCtx();
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "sine";
  o.frequency.value = beat === 0 ? 1000 : 440;
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  o.start(); o.stop(ctx.currentTime + 0.04);
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Track {
  id: string; name: string; type: "audio"|"midi"|"bus";
  armed: boolean; muted: boolean; solo: boolean;
  volume: number; pan: number; color: string;
  peak: number; // simulated VU level
}
interface Plugin { id: string; name: string; category: string; enabled: boolean; tier: "free"|"pro"; }

const TRACK_COLORS = ["#38bdf8","#a78bfa","#34d399","#f472b6","#fb923c","#facc15","#f87171","#818cf8"];

const INIT_TRACKS: Track[] = [
  { id:"t1", name:"Kick / Drums", type:"audio", armed:false, muted:false, solo:false, volume:85, pan:0,   color:TRACK_COLORS[0], peak:0 },
  { id:"t2", name:"Bass",         type:"audio", armed:false, muted:false, solo:false, volume:78, pan:0,   color:TRACK_COLORS[1], peak:0 },
  { id:"t3", name:"Lead Synth",   type:"midi",  armed:false, muted:false, solo:false, volume:72, pan:-20, color:TRACK_COLORS[2], peak:0 },
  { id:"t4", name:"Vocals",       type:"audio", armed:false, muted:false, solo:false, volume:80, pan:0,   color:TRACK_COLORS[3], peak:0 },
  { id:"t5", name:"FX / Atmos",   type:"audio", armed:false, muted:false, solo:false, volume:55, pan:12,  color:TRACK_COLORS[7], peak:0 },
  { id:"t6", name:"Mix Bus",      type:"bus",   armed:false, muted:false, solo:false, volume:90, pan:0,   color:TRACK_COLORS[5], peak:0 },
];

const PLUGINS: Plugin[] = [
  { id:"p1",  name:"Parametric EQ",        category:"EQ",        enabled:true,  tier:"free" },
  { id:"p2",  name:"Dynamic Compressor",   category:"Dynamics",  enabled:true,  tier:"free" },
  { id:"p3",  name:"Brick-Wall Limiter",   category:"Dynamics",  enabled:true,  tier:"free" },
  { id:"p4",  name:"Reverb (Room/Plate)",  category:"Time",      enabled:false, tier:"free" },
  { id:"p5",  name:"Stereo Delay",         category:"Time",      enabled:false, tier:"free" },
  { id:"p6",  name:"Chorus / Flanger",     category:"Modulation",enabled:false, tier:"free" },
  { id:"p7",  name:"Auto-Align (Phase)",   category:"Utility",   enabled:false, tier:"pro"  },
  { id:"p8",  name:"Vocal Tuning (AI)",    category:"Repair",    enabled:false, tier:"pro"  },
  { id:"p9",  name:"VocAlign (Timing)",    category:"Repair",    enabled:false, tier:"pro"  },
  { id:"p10", name:"Noise Removal (RX)",   category:"Repair",    enabled:false, tier:"pro"  },
  { id:"p11", name:"Click Repair (RX)",    category:"Repair",    enabled:false, tier:"pro"  },
  { id:"p12", name:"Drum Replacement",     category:"Utility",   enabled:false, tier:"pro"  },
  { id:"p13", name:"AI Mix Assistant",     category:"AI",        enabled:false, tier:"pro"  },
  { id:"p14", name:"Room Correction",      category:"Reference", enabled:false, tier:"pro"  },
  { id:"p15", name:"Atmos Renderer (7.1.4)",category:"Immersive",enabled:false, tier:"pro"  },
  { id:"p16", name:"Multiband Compressor", category:"Dynamics",  enabled:false, tier:"pro"  },
];

const ROOM_PRESETS = [
  { id:"dry",       label:"Dry Studio",    rt60:"< 0.2s", desc:"Dead booth — zero coloration" },
  { id:"small",     label:"Small Room",    rt60:"0.3s",   desc:"Intimate treated live room" },
  { id:"midroom",   label:"Control Room",  rt60:"0.5s",   desc:"Symmetrical near-field setup" },
  { id:"live",      label:"Live Room",     rt60:"1.2s",   desc:"Bright with hardwood floor" },
  { id:"club",      label:"Club Venue",    rt60:"1.8s",   desc:"Concrete walls, crowd absorption" },
  { id:"hall",      label:"Concert Hall",  rt60:"2.2s",   desc:"Large hall, warm diffuse tail" },
  { id:"cathedral", label:"Cathedral",     rt60:"4.5s",   desc:"Dense stone reverb" },
  { id:"atmos",     label:"Atmos Room",    rt60:"0.4s",   desc:"Dolby-certified 7.1.4" },
];

const MONITOR_PRESETS = [
  { id:"genelec",  label:"Genelec 8050",  desc:"Accurate flat nearfield" },
  { id:"ns10",     label:"Yamaha NS-10",  desc:"Mid-forward — expose problems" },
  { id:"auratone", label:"Auratone 5C",   desc:"Mono mid-range check" },
  { id:"hphone",   label:"Headphones",    desc:"Crossfeed binaural compensation" },
  { id:"consumer", label:"Consumer HiFi", desc:"V-curve: boosted bass & treble" },
];

const AI_SUGGESTIONS = [
  { tag:"Low End",      msg:"Low-end buildup at 80–120Hz on Bass — high-pass at 40Hz recommended." },
  { tag:"Vocal",        msg:"Sibilance spike at 7.8kHz on Vocals — de-esser threshold –18dB." },
  { tag:"Mix Bus",      msg:"RMS averaging –9 LUFS — headroom available; try glue compression." },
  { tag:"Phase",        msg:"Stereo FX bus phase correlation near zero — check mono compatibility." },
  { tag:"Frequency",    msg:"Kick and bass fighting at 120Hz — surgical –3dB cut at 118Hz on Bass." },
  { tag:"Loudness",     msg:"True peak approaching –0.1dBTP — tighten limiter ceiling to –1dBTP." },
  { tag:"Atmos",        msg:"Height channels quiet — send reverb tail to overhead Atmos objects." },
];

const ACOUSTIC_ITEMS = [
  { icon:"🔲", label:"Bass Traps",            detail:"Floor-to-ceiling tri-corners — tames 40–250Hz modes" },
  { icon:"🟫", label:"Broadband Absorption",  detail:"4\" panels at first reflection points — 250Hz–8kHz" },
  { icon:"🔳", label:"QRD Diffusers",         detail:"Rear wall scattering — scatter highs, preserve energy" },
  { icon:"〰️", label:"Flutter Echo Control",  detail:"Angled side panels break parallel wall reflections" },
  { icon:"📈", label:"Modal Analysis (AI)",   detail:"Live room modes plotted at 20Hz intervals — auto-updated" },
  { icon:"🎙️", label:"Calibration Sweep",    detail:"Sweep mic → AI correction EQ → applied at monitor output" },
  { icon:"🤖", label:"AI Self-Calibration",   detail:"Continuous session-over-session correction curve learning" },
  { icon:"📐", label:"Symmetrical Layout",    detail:"Equilateral triangle · tweeters at ear height" },
];

// ── Small reusable UI ─────────────────────────────────────────────────────────
function Pill({ children, color = "bg-sky-100 text-sky-700" }: { children: React.ReactNode; color?: string }) {
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color} whitespace-nowrap`}>{children}</span>;
}

function Accordion({ id, label, icon: Icon, badge, open, toggle, children }: {
  id: string; label: string; icon: React.ElementType; badge?: React.ReactNode;
  open: boolean; toggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm">
      <button onClick={toggle} className="w-full flex items-center justify-between px-5 py-3.5 bg-[#f0f4f8] hover:bg-sky-50 transition-colors">
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span className="text-sm font-bold text-[#1a2a3a]">{label}</span>
          {badge}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#7a9abf]" /> : <ChevronDown className="w-4 h-4 text-[#7a9abf]" />}
      </button>
      {open && <div className="bg-white">{children}</div>}
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} role="switch" aria-checked={on}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on ? "bg-sky-500" : "bg-[#cdd8e8]"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function ProductionStudio() {
  const { hasAccess } = useUser();
  const isPro = hasAccess("producer_pro");

  // Transport
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beat, setBeat] = useState(0); // current beat in bar (0-3)
  const [bar, setBar]   = useState(1);
  const [atmos, setAtmos] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Metronome / transport tick
  useEffect(() => {
    if (playing) {
      const interval = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        setBeat(b => {
          const next = (b + 1) % 4;
          if (next === 0) setBar(br => br + 1);
          playClick(next);
          return next;
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, bpm]);

  // Tracks
  const [tracks, setTracks] = useState<Track[]>(INIT_TRACKS);
  const vuRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate VU meters when playing
  useEffect(() => {
    if (playing) {
      vuRef.current = setInterval(() => {
        setTracks(ts => ts.map(t => {
          if (t.muted) return { ...t, peak: 0 };
          const hasSolo = ts.some(x => x.solo);
          if (hasSolo && !t.solo) return { ...t, peak: 0 };
          const base = t.volume / 100;
          return { ...t, peak: Math.max(0, Math.min(1, base * (0.6 + Math.random() * 0.4))) };
        }));
      }, 80);
    } else {
      if (vuRef.current) clearInterval(vuRef.current);
      setTracks(ts => ts.map(t => ({ ...t, peak: 0 })));
    }
    return () => { if (vuRef.current) clearInterval(vuRef.current); };
  }, [playing]);

  const stopTransport = () => { setPlaying(false); setRecording(false); setBeat(0); setBar(1); };

  const updateTrack = (id: string, patch: Partial<Track>) =>
    setTracks(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));

  const addTrack = (type: "audio"|"midi"|"bus") => {
    const idx = tracks.length;
    setTracks(ts => [...ts, {
      id: `t${Date.now()}`, name: `${type === "midi" ? "MIDI" : type === "bus" ? "Bus" : "Audio"} ${idx + 1}`,
      type, armed:false, muted:false, solo:false, volume:75, pan:0,
      color: TRACK_COLORS[idx % TRACK_COLORS.length], peak:0,
    }]);
  };

  const removeTrack = (id: string) => setTracks(ts => ts.filter(t => t.id !== id));

  const hasSolo = tracks.some(t => t.solo);

  // Plugins
  const [plugins, setPlugins] = useState<Plugin[]>(PLUGINS);
  const [pluginCat, setPluginCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(PLUGINS.map(p => p.category)))];
  const visPlugins = pluginCat === "All" ? plugins : plugins.filter(p => p.category === pluginCat);
  const togglePlugin = (id: string) =>
    setPlugins(ps => ps.map(p => p.id === id && !(p.tier === "pro" && !isPro) ? { ...p, enabled: !p.enabled } : p));

  // AI suggestions
  const [aiIdx, setAiIdx] = useState(0);
  const [aiApplied, setAiApplied] = useState<number[]>([]);
  const applyAi = () => { setAiApplied(a => [...a, aiIdx]); setAiIdx(i => (i + 1) % AI_SUGGESTIONS.length); };
  const skipAi  = () => setAiIdx(i => (i + 1) % AI_SUGGESTIONS.length);

  // Room & monitors
  const [room, setRoom]         = useState("midroom");
  const [monitor, setMonitor]   = useState("genelec");
  const [calibrating, setCalib] = useState(false);
  const [calibrated, setCalibrated] = useState(false);
  const [calibPct, setCalibPct] = useState(0);

  const runCalib = () => {
    if (calibrating) return;
    setCalib(true); setCalibPct(0); setCalibrated(false);
    let pct = 0;
    const t = setInterval(() => {
      pct += 4 + Math.random() * 6;
      setCalibPct(Math.min(100, pct));
      if (pct >= 100) { clearInterval(t); setCalib(false); setCalibrated(true); }
    }, 80);
  };

  // Sections open state
  const [open, setOpen] = useState<Record<string,boolean>>({
    transport:true, mixer:true, plugins:false, ai:true, monitors:false, hw:false, acoustic:false
  });
  const tog = (k: string) => setOpen(o => ({ ...o, [k]: !o[k] }));

  // LUFS meter (simulated, updates when playing)
  const [lufs, setLufs] = useState(-14);
  useEffect(() => {
    if (!playing) { setLufs(-14); return; }
    const t = setInterval(() => setLufs(l => Math.max(-24, Math.min(-6, l + (Math.random() - 0.5) * 0.4))), 300);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div className="space-y-3">

      {/* ── TRANSPORT ───────────────────────────────────────────────────────── */}
      <Accordion id="transport" label="DAW Engine & Transport" icon={Activity}
        badge={playing ? <Pill color="bg-red-100 text-red-600">● REC LIVE</Pill> : <Pill color="bg-green-100 text-green-700">Ready</Pill>}
        open={open.transport} toggle={() => tog("transport")}>
        <div className="p-5 space-y-4">
          {/* Transport controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={stopTransport}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#f0f4f8] hover:bg-red-50 border border-[#cdd8e8] hover:border-red-300 transition-colors" title="Stop">
              <Square className="w-4 h-4 text-[#4a6580]" />
            </button>
            <button onClick={() => { stopTransport(); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#f0f4f8] hover:bg-sky-50 border border-[#cdd8e8] transition-colors" title="Rewind">
              <SkipBack className="w-4 h-4 text-[#4a6580]" />
            </button>
            <button onClick={() => setPlaying(p => !p)}
              className={`w-12 h-9 flex items-center justify-center rounded-xl font-bold text-white transition-colors shadow-sm ${playing ? "bg-amber-500 hover:bg-amber-600" : "bg-sky-500 hover:bg-sky-600"}`} title="Play / Pause">
              {playing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={() => { if (!playing) setPlaying(true); setRecording(r => !r); }}
              className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${recording ? "bg-red-500 border-transparent text-white animate-pulse" : "bg-[#f0f4f8] border-[#cdd8e8] hover:bg-red-50 hover:border-red-300"}`} title="Record">
              <Circle className={`w-4 h-4 ${recording ? "text-white" : "text-red-400"}`} />
            </button>

            {/* Beat counter */}
            <div className="flex items-center gap-1 bg-[#1a2a3a] rounded-xl px-3 py-1.5">
              <span className="text-[10px] text-[#7a9abf] font-mono">BAR</span>
              <span className="text-sm font-mono font-bold text-white w-5 text-center">{bar}</span>
              <span className="text-[10px] text-[#7a9abf] font-mono ml-1">BEAT</span>
              {[0,1,2,3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full mx-0.5 transition-colors ${playing && beat === i ? "bg-sky-400" : "bg-[#3a4a5a]"}`} />
              ))}
            </div>

            {/* BPM */}
            <div className="flex items-center gap-1 ml-auto">
              <button onClick={() => setBpm(b => Math.max(40, b - 1))} className="w-7 h-7 rounded-lg bg-[#f0f4f8] border border-[#cdd8e8] flex items-center justify-center hover:bg-sky-50"><Minus className="w-3 h-3 text-[#4a6580]" /></button>
              <div className="flex flex-col items-center">
                <input type="number" min={40} max={300} value={bpm} onChange={e => setBpm(Number(e.target.value))}
                  className="w-14 text-center px-1 py-1 text-sm font-mono font-bold text-[#1a2a3a] bg-[#f0f4f8] border border-[#cdd8e8] rounded-lg focus:outline-none focus:border-sky-400" />
                <span className="text-[9px] text-[#7a9abf]">BPM</span>
              </div>
              <button onClick={() => setBpm(b => Math.min(300, b + 1))} className="w-7 h-7 rounded-lg bg-[#f0f4f8] border border-[#cdd8e8] flex items-center justify-center hover:bg-sky-50"><Plus className="w-3 h-3 text-[#4a6580]" /></button>
            </div>

            <div className="flex items-center gap-2">
              <Pill color="bg-[#f0f4f8] text-[#4a6580]">4/4</Pill>
              <Pill color="bg-[#f0f4f8] text-[#4a6580]">44.1kHz · 24-bit</Pill>
              <button onClick={() => setAtmos(a => !a)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-colors ${atmos ? "bg-purple-500 text-white border-transparent" : "border-[#cdd8e8] text-[#4a6580] hover:border-purple-400"}`}>
                Dolby Atmos
              </button>
            </div>
          </div>

          {/* Master meter */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            {[
              { l:"LUFS",       v:`${lufs.toFixed(1)}`,  ok: lufs > -16 && lufs < -8 },
              { l:"True Peak",  v:"-1.1 dBTP",           ok:true  },
              { l:"D.Range",    v:"DR11",                 ok:true  },
              { l:"Latency",    v:"2.3 ms",               ok:true  },
              { l:"CPU",        v:playing ? `${12 + Math.round(Math.random()*8)}%` : "6%", ok:true },
            ].map(({ l, v, ok }) => (
              <div key={l} className={`rounded-xl px-3 py-2 border ${ok ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="text-[#7a9abf] font-semibold">{l}</div>
                <div className={`font-mono font-bold text-sm ${ok ? "text-green-700" : "text-red-600"}`}>{v}</div>
              </div>
            ))}
          </div>
          {atmos && (
            <div className="rounded-xl bg-purple-50 border border-purple-200 px-4 py-2 text-[11px] text-purple-700">
              <span className="font-bold">Dolby Atmos 7.1.4 active — </span>
              {["Bed (7.1.0)", "Kick (floor)", "Vocal (centre)", "FX (L/R overhead)", "Reverb (all objects)"].map(o => (
                <span key={o} className="mr-2 font-mono">{o}</span>
              ))}
            </div>
          )}
        </div>
      </Accordion>

      {/* ── MULTI-TRACK MIXER ───────────────────────────────────────────────── */}
      <Accordion id="mixer" label="Multi-Track Mixer" icon={Layers}
        badge={<Pill>{tracks.length} tracks</Pill>}
        open={open.mixer} toggle={() => tog("mixer")}>
        <div className="p-4 space-y-2">
          {/* Track rows */}
          <div className="space-y-1.5">
            {tracks.map(t => {
              const active = !t.muted && (!hasSolo || t.solo);
              const vuW = active && playing ? t.peak : 0;
              const vuColor = vuW > 0.85 ? "#f87171" : vuW > 0.7 ? "#fbbf24" : "#34d399";
              return (
                <div key={t.id} className={`grid items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${t.armed ? "border-red-300 bg-red-50" : t.solo ? "border-green-300 bg-green-50" : t.muted ? "border-[#e8eef5] bg-[#f8fafc]" : "border-[#e8eef5] bg-[#f0f4f8]"}`}
                  style={{ gridTemplateColumns: "8px 1fr auto auto auto auto 90px 70px 32px 20px" }}>
                  {/* Color bar */}
                  <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: t.color }} />
                  {/* Name */}
                  <div>
                    <div className={`text-xs font-bold ${t.muted ? "text-[#aab8c8]" : "text-[#1a2a3a]"}`}>{t.name}</div>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${t.type==="midi"?"bg-purple-100 text-purple-600":t.type==="bus"?"bg-yellow-100 text-yellow-600":"bg-sky-100 text-sky-600"}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </div>
                  {/* ARM */}
                  <button onClick={() => updateTrack(t.id, { armed: !t.armed })}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-colors ${t.armed ? "bg-red-500 text-white" : "bg-white border border-[#cdd8e8] text-[#7a9abf] hover:border-red-300"}`}>R</button>
                  {/* MUTE */}
                  <button onClick={() => updateTrack(t.id, { muted: !t.muted })}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-colors ${t.muted ? "bg-yellow-400 text-white" : "bg-white border border-[#cdd8e8] text-[#7a9abf] hover:border-yellow-300"}`}>M</button>
                  {/* SOLO */}
                  <button onClick={() => updateTrack(t.id, { solo: !t.solo })}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-colors ${t.solo ? "bg-green-500 text-white" : "bg-white border border-[#cdd8e8] text-[#7a9abf] hover:border-green-300"}`}>S</button>
                  {/* Volume fader */}
                  <Volume2 className="w-3.5 h-3.5 text-[#7a9abf] flex-shrink-0" />
                  <div className="flex items-center gap-1.5">
                    <input type="range" min={0} max={100} value={t.volume}
                      onChange={e => updateTrack(t.id, { volume: Number(e.target.value) })}
                      className="flex-1 h-1.5 accent-sky-500" style={{ accentColor: t.color }} />
                    <span className="text-[10px] font-mono text-[#7a9abf] w-7 text-right">{t.volume}</span>
                  </div>
                  {/* VU meter */}
                  <div className="h-2.5 rounded-full bg-[#e8eef5] overflow-hidden w-full">
                    <div className="h-full rounded-full transition-all duration-75" style={{ width:`${vuW*100}%`, background: vuColor }} />
                  </div>
                  {/* Delete */}
                  <button onClick={() => removeTrack(t.id)} className="text-[#cdd8e8] hover:text-red-400 transition-colors text-sm leading-none">×</button>
                </div>
              );
            })}
          </div>
          {/* Add track */}
          <div className="flex gap-2 pt-1">
            {(["audio","midi","bus"] as const).map(type => (
              <button key={type} onClick={() => addTrack(type)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors
                  ${type==="midi"?"text-purple-600 border-purple-200 hover:bg-purple-50":type==="bus"?"text-yellow-600 border-yellow-200 hover:bg-yellow-50":"text-sky-600 border-sky-200 hover:bg-sky-50"}`}>
                <Plus className="w-3.5 h-3.5" />
                {type.charAt(0).toUpperCase()+type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Accordion>

      {/* ── PLUGIN RACK ────────────────────────────────────────────────────── */}
      <Accordion id="plugins" label="Plugin Rack" icon={Music}
        badge={<Pill color="bg-purple-100 text-purple-700">{plugins.filter(p=>p.enabled).length} active</Pill>}
        open={open.plugins} toggle={() => tog("plugins")}>
        <div className="p-4 space-y-3">
          {/* Category tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setPluginCat(c)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${pluginCat===c?"bg-sky-500 text-white border-transparent":"bg-[#f0f4f8] border-[#cdd8e8] text-[#4a6580] hover:border-sky-400"}`}>
                {c}
              </button>
            ))}
          </div>
          {/* Plugin grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {visPlugins.map(p => {
              const blocked = p.tier === "pro" && !isPro;
              return (
                <div key={p.id} onClick={() => !blocked && togglePlugin(p.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border cursor-pointer transition-all
                    ${p.enabled ? "border-sky-300 bg-sky-50 shadow-sm" : "border-[#cdd8e8] bg-white hover:border-sky-200"}
                    ${blocked ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.enabled ? "bg-green-400" : "bg-[#cdd8e8]"}`} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#1a2a3a] truncate">{p.name}</div>
                      <div className="text-[9px] text-[#7a9abf]">{p.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                    {p.tier === "pro" && <Pill color="bg-yellow-100 text-yellow-600">Pro</Pill>}
                    {blocked ? <Lock className="w-3.5 h-3.5 text-[#cdd8e8]" /> : (
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${p.enabled ? "bg-sky-500" : "bg-[#cdd8e8]"}`}>
                        <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all" style={{ left: p.enabled ? "calc(100% - 14px)" : "2px" }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!isPro && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              Pro plugins (AI, Repair, Immersive) require the Producer Pro plan.
            </div>
          )}
        </div>
      </Accordion>

      {/* ── AI MIX ASSISTANT ───────────────────────────────────────────────── */}
      <Accordion id="ai" label="AI Mix Assistant" icon={Zap}
        badge={<Pill color="bg-green-100 text-green-700">Always Learning</Pill>}
        open={open.ai} toggle={() => tog("ai")}>
        <div className="p-4 space-y-3">
          <div className="bg-[#f0f4f8] rounded-xl p-3 border border-[#cdd8e8]">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
              <div>
                <Pill color="bg-sky-100 text-sky-700">{AI_SUGGESTIONS[aiIdx].tag}</Pill>
                <p className="text-xs text-[#1a2a3a] mt-1">{AI_SUGGESTIONS[aiIdx].msg}</p>
              </div>
            </div>
            {aiApplied.includes(aiIdx) && (
              <div className="mt-2 flex items-center gap-1 text-[11px] text-green-600 font-semibold">
                <Check className="w-3.5 h-3.5" /> Fix applied to session
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={applyAi} disabled={aiApplied.includes(aiIdx)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-bold transition-colors">
              <Check className="w-3.5 h-3.5" /> Apply Fix
            </button>
            <button onClick={skipAi}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#cdd8e8] hover:bg-sky-50 text-[#4a6580] text-xs font-semibold transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Next
            </button>
          </div>
          {/* Analysis readouts */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { l:"LUFS",    v:`${lufs.toFixed(1)}`,     ok: lufs > -17 },
              { l:"True Pk", v:"-1.1 dBTP",              ok:true  },
              { l:"DR",      v:"DR11",                    ok:true  },
              { l:"Width",   v:"74%",                     ok:true  },
              { l:"Phase",   v:"0.82",                    ok:true  },
              { l:"Mono",    v:"Pass ✓",                  ok:true  },
            ].map(({ l, v, ok }) => (
              <div key={l} className={`rounded-xl px-2 py-2 text-center border ${ok?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
                <div className="text-[9px] text-[#7a9abf] font-semibold">{l}</div>
                <div className={`text-sm font-mono font-bold ${ok?"text-green-700":"text-red-600"}`}>{v}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#7a9abf]">{aiApplied.length} fix{aiApplied.length !== 1 ? "es" : ""} applied this session · AI continuously analyzes mix against loudness standards, phase coherence, and genre references.</p>
        </div>
      </Accordion>

      {/* ── REFERENCE MONITORS ─────────────────────────────────────────────── */}
      <Accordion id="monitors" label="Reference Monitor Simulation" icon={Monitor}
        open={open.monitors} toggle={() => tog("monitors")}>
        <div className="p-4 space-y-2">
          <p className="text-xs text-[#7a9abf]">Simulate how your mix translates across playback systems. Frequency compensation is applied to the monitor output chain.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {MONITOR_PRESETS.map(m => (
              <button key={m.id} onClick={() => setMonitor(m.id)}
                className={`text-left px-3 py-2.5 rounded-xl border transition-colors ${monitor===m.id ? "border-sky-400 bg-sky-50 shadow-sm" : "border-[#cdd8e8] hover:border-sky-300"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#1a2a3a] leading-tight">{m.label}</span>
                  {monitor===m.id && <Check className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />}
                </div>
                <div className="text-[10px] text-[#7a9abf] leading-tight">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </Accordion>

      {/* ── HARDWARE ───────────────────────────────────────────────────────── */}
      <Accordion id="hw" label="Hardware & Studio Setup" icon={Cpu} open={open.hw} toggle={() => tog("hw")}>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { Icon:Cpu,        label:"Workstation",              desc:"Apple M3 Max / Intel i9 · 128GB RAM · 8TB NVMe",   tier:"pro"  as const },
              { Icon:HardDrive,  label:"Audio Interface (TB4)",    desc:"32-in/32-out · 24-bit/192kHz · < 1ms round-trip", tier:"pro"  as const },
              { Icon:Mic2,       label:"Preamps (48V phantom)",    desc:"Class-A discrete · 4ch · EIN < –128 dB",          tier:"free" as const },
              { Icon:Monitor,    label:"Studio Monitors",          desc:"Calibrated stereo pair · room-corrected",          tier:"free" as const },
              { Icon:Headphones, label:"Reference Headphones",     desc:"Open-back + closed-back · crossfeed corrected",    tier:"free" as const },
              { Icon:Settings,   label:"Motorized Fader Surface",  desc:"16-ch DAW controller · HUI/MCU",                  tier:"pro"  as const },
              { Icon:Settings,   label:"Monitor Controller",       desc:"Speaker switching · Dim/Mute · Mono sum",          tier:"free" as const },
              { Icon:Zap,        label:"Hardware Bus Compressor",  desc:"VCA glue on mix bus · SSL G-style",                tier:"pro"  as const },
              { Icon:Shield,     label:"500-Series Rack",          desc:"API 550-style analog EQ per channel",              tier:"pro"  as const },
              { Icon:Shield,     label:"Macro Shortcut Deck",      desc:"Elgato Stream Deck · 32 workflow keys",            tier:"free" as const },
            ].map(({ Icon, label, desc, tier }) => {
              const blocked = tier === "pro" && !isPro;
              return (
                <div key={label} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${blocked?"border-[#e8eef5] opacity-60":"border-[#cdd8e8]"}`}>
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-[#1a2a3a]">{label}</span>
                      {tier==="pro" && <Pill color="bg-yellow-100 text-yellow-600">Pro</Pill>}
                      {blocked && <Lock className="w-3 h-3 text-[#cdd8e8]" />}
                    </div>
                    <div className="text-[10px] text-[#7a9abf] mt-0.5">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Accordion>

      {/* ── ACOUSTIC ENVIRONMENT ───────────────────────────────────────────── */}
      <Accordion id="acoustic" label="Acoustic Environment — World-Class Room" icon={Waves}
        badge={<Pill color="bg-green-100 text-green-700">AI Self-Calibrating</Pill>}
        open={open.acoustic} toggle={() => tog("acoustic")}>
        <div className="p-4 space-y-4">
          {/* Room presets */}
          <div>
            <p className="text-xs font-bold text-[#1a2a3a] mb-2">Room / Venue</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROOM_PRESETS.map(r => (
                <button key={r.id} onClick={() => setRoom(r.id)}
                  className={`text-left px-3 py-2 rounded-xl border transition-colors ${room===r.id?"border-sky-400 bg-sky-50 shadow-sm":"border-[#cdd8e8] hover:border-sky-300"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1a2a3a]">{r.label}</span>
                    {room===r.id && <Check className="w-3 h-3 text-sky-500" />}
                  </div>
                  <div className="text-[10px] font-mono text-sky-500 mt-0.5">RT60 {r.rt60}</div>
                  <div className="text-[10px] text-[#7a9abf] leading-tight">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Treatment spec */}
          <div>
            <p className="text-xs font-bold text-[#1a2a3a] mb-2">Acoustic Treatment</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {ACOUSTIC_ITEMS.map(item => (
                <div key={item.label} className="flex items-start gap-2 px-3 py-2 rounded-xl bg-[#f0f4f8] border border-[#e8eef5]">
                  <span className="text-base flex-shrink-0 leading-none mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-[#1a2a3a]">{item.label}</div>
                    <div className="text-[10px] text-[#7a9abf] leading-tight">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calibration */}
          <div className="rounded-xl bg-[#f0f4f8] border border-[#cdd8e8] p-3 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#1a2a3a]">Room Correction Calibration</p>
                <p className="text-[10px] text-[#7a9abf]">Sweep mic → AI correction EQ → applied to monitor output. Auto-updates each session.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {calibrated && <Pill color="bg-green-100 text-green-700">✓ Calibrated</Pill>}
                <button onClick={runCalib} disabled={calibrating}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-colors ${calibrating?"bg-[#7a9abf] cursor-wait":"bg-sky-500 hover:bg-sky-600"}`}>
                  {calibrating ? "Sweeping…" : calibrated ? "Re-calibrate" : "Run Calibration"}
                </button>
              </div>
            </div>
            {calibrating && (
              <div>
                <div className="h-2 rounded-full bg-[#e8eef5] overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full transition-all" style={{ width:`${calibPct}%` }} />
                </div>
                <p className="text-[10px] text-[#7a9abf] mt-1">Sweeping 20Hz – 20kHz… {Math.round(calibPct)}%</p>
              </div>
            )}
            {calibrated && !calibrating && (
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {[["40Hz","+3.2"],["80Hz","−1.8"],["250Hz","+0.4"],["1kHz","−0.2"],["4kHz","+1.1"],["8kHz","−0.9"],["12kHz","+0.3"],["16kHz","+0.6"]].map(([f,c]) => (
                  <div key={f} className="bg-white border border-[#e8eef5] rounded-lg p-1.5 text-center">
                    <div className="text-[9px] text-[#7a9abf]">{f}</div>
                    <div className={`text-[11px] font-mono font-bold ${c.startsWith("+")?"text-green-600":"text-red-500"}`}>{c}dB</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Accordion>
    </div>
  );
}
