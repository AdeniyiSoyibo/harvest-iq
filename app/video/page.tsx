"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Film, Play, Square, SkipBack, SkipForward, Plus, Trash2,
  Music, Scissors, ZapOff, Zap, Download, Upload, ChevronLeft,
  ChevronRight, AlignLeft, Clock, Layers, Check, RefreshCw
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Clip {
  id: string; label: string; color: string;
  start: number; // seconds from project start
  dur: number;   // duration in seconds
  src?: string;  // optional blob URL for uploaded video
}

interface SyncPoint {
  id: string; time: number; // seconds
  type: "beat" | "drop" | "cut" | "custom";
  label: string;
}

interface Track { id: string; name: string; clips: Clip[]; }

// ── Constants ─────────────────────────────────────────────────────────────────
const CLIP_COLORS = [
  "#38bdf8","#a78bfa","#34d399","#f472b6",
  "#fb923c","#facc15","#f87171","#818cf8",
];

const SYNC_COLORS: Record<string, string> = {
  beat:"#38bdf8", drop:"#f87171", cut:"#34d399", custom:"#a78bfa"
};

const INIT_CLIPS: Clip[] = [
  { id:"c1", label:"Opening",   color:CLIP_COLORS[0], start:0,  dur:8  },
  { id:"c2", label:"Verse 1",   color:CLIP_COLORS[1], start:8,  dur:12 },
  { id:"c3", label:"Chorus",    color:CLIP_COLORS[2], start:20, dur:10 },
  { id:"c4", label:"Bridge",    color:CLIP_COLORS[3], start:30, dur:8  },
  { id:"c5", label:"Drop",      color:CLIP_COLORS[4], start:38, dur:10 },
  { id:"c6", label:"Outro",     color:CLIP_COLORS[5], start:48, dur:12 },
];

const INIT_SYNC: SyncPoint[] = [
  { id:"s1", time:0,  type:"beat",   label:"Intro hit"   },
  { id:"s2", time:8,  type:"cut",    label:"Verse cut"   },
  { id:"s3", time:20, type:"drop",   label:"Chorus drop" },
  { id:"s4", time:38, type:"drop",   label:"Big drop"    },
  { id:"s5", time:48, type:"beat",   label:"Outro beat"  },
];

const TOTAL = 60; // seconds
const PX_PER_SEC = 14; // timeline scale

function fmt(s: number) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2,"0")}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VideoPage() {
  const [clips, setClips]       = useState<Clip[]>(INIT_CLIPS);
  const [syncPts, setSyncPts]   = useState<SyncPoint[]>(INIT_SYNC);
  const [playhead, setPlayhead] = useState(0);   // seconds
  const [playing, setPlaying]   = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom]         = useState(1);
  const [tab, setTab]           = useState<"timeline"|"sync"|"export">("timeline");
  const [snapToSync, setSnapToSync] = useState(true);
  const [exportStatus, setExportStatus] = useState<"idle"|"rendering"|"done">("idle");
  const [exportPct, setExportPct] = useState(0);
  const [uploadLabel, setUploadLabel] = useState("");

  const rafRef  = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const tlRef   = useRef<HTMLDivElement>(null);

  // playback ticker
  useEffect(() => {
    if (playing) {
      const tick = (ts: number) => {
        if (lastRef.current !== null) {
          const dt = (ts - lastRef.current) / 1000;
          setPlayhead(p => {
            const next = p + dt;
            if (next >= TOTAL) { setPlaying(false); return TOTAL; }
            return next;
          });
        }
        lastRef.current = ts;
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      lastRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing]);

  // auto-scroll timeline to playhead
  useEffect(() => {
    if (!tlRef.current) return;
    const x = playhead * PX_PER_SEC * zoom;
    const el = tlRef.current;
    if (x > el.scrollLeft + el.clientWidth - 80) el.scrollLeft = x - 80;
  }, [playhead, zoom]);

  const activeClip = clips.find(c => playhead >= c.start && playhead < c.start + c.dur);

  // ── Timeline click to seek ────────────────────────────────────────────────
  const seekTo = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tlRef.current) return;
    const rect = tlRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + tlRef.current.scrollLeft;
    const t = Math.max(0, Math.min(TOTAL, x / (PX_PER_SEC * zoom)));
    setPlayhead(t);
  }, [zoom]);

  // ── Clip operations ───────────────────────────────────────────────────────
  const addClip = () => {
    const last = clips.reduce((m, c) => Math.max(m, c.start + c.dur), 0);
    const id = `c${Date.now()}`;
    setClips(cs => [...cs, {
      id, label:`Clip ${cs.length + 1}`,
      color: CLIP_COLORS[cs.length % CLIP_COLORS.length],
      start: Math.min(last, TOTAL - 5), dur: 5,
    }]);
    setSelected(id);
  };

  const deleteClip = (id: string) => {
    setClips(cs => cs.filter(c => c.id !== id));
    if (selected === id) setSelected(null);
  };

  const splitAtPlayhead = () => {
    if (!selected) return;
    const clip = clips.find(c => c.id === selected);
    if (!clip || playhead <= clip.start || playhead >= clip.start + clip.dur) return;
    const dur1 = playhead - clip.start;
    const dur2 = clip.dur - dur1;
    const idB  = `c${Date.now()}`;
    setClips(cs => cs.flatMap(c => c.id !== selected ? [c] : [
      { ...c, dur: dur1 },
      { ...c, id: idB, label: c.label + " B", start: playhead, dur: dur2 },
    ]));
  };

  const trimStart = (id: string, delta: number) => {
    setClips(cs => cs.map(c => {
      if (c.id !== id) return c;
      const newStart = Math.max(0, c.start + delta);
      const newDur   = Math.max(1, c.dur - delta);
      return { ...c, start: newStart, dur: newDur };
    }));
  };

  const trimEnd = (id: string, delta: number) => {
    setClips(cs => cs.map(c => c.id !== id ? c : { ...c, dur: Math.max(1, c.dur + delta) }));
  };

  const renameClip = (id: string, label: string) =>
    setClips(cs => cs.map(c => c.id === id ? { ...c, label } : c));

  // ── Sync points ───────────────────────────────────────────────────────────
  const addSyncPoint = () => {
    const t = snapToSync
      ? Math.round(playhead * 4) / 4  // snap to 0.25s
      : parseFloat(playhead.toFixed(2));
    setSyncPts(ps => [...ps, { id:`s${Date.now()}`, time:t, type:"custom", label:`Cue ${ps.length+1}` }]);
  };

  const deleteSyncPt = (id: string) => setSyncPts(ps => ps.filter(p => p.id !== id));

  // ── Export simulation ─────────────────────────────────────────────────────
  const runExport = () => {
    setExportStatus("rendering"); setExportPct(0);
    let pct = 0;
    const t = setInterval(() => {
      pct += 3 + Math.random() * 5;
      setExportPct(Math.min(100, pct));
      if (pct >= 100) { clearInterval(t); setExportStatus("done"); }
    }, 80);
  };

  // ── Handle file upload ────────────────────────────────────────────────────
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url  = URL.createObjectURL(file);
    const id   = `c${Date.now()}`;
    const last = clips.reduce((m, c) => Math.max(m, c.start + c.dur), 0);
    setClips(cs => [...cs, {
      id, label: file.name.replace(/\.[^.]+$/, ""),
      color: CLIP_COLORS[cs.length % CLIP_COLORS.length],
      start: Math.min(last, TOTAL - 5), dur: 5, src: url,
    }]);
    setSelected(id);
    setUploadLabel(file.name);
  };

  const selClip = clips.find(c => c.id === selected);
  const pxS = PX_PER_SEC * zoom;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 min-h-screen bg-[#f0f4f8]">
      {/* Header */}
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">Video Editor</h1>
            <p className="text-xs text-[#7a9abf]">Beat-sync cuts · drag-free timeline · split/trim · sync markers · one-click export</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* ── PREVIEW PANEL ───────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-3">
          {/* Video canvas */}
          <div className="rounded-2xl border border-[#cdd8e8] bg-[#1a2a3a] overflow-hidden shadow-sm">
            <div className="relative w-full" style={{ paddingTop:"56.25%" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {activeClip?.src ? (
                  <video src={activeClip.src} autoPlay={playing} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center px-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: activeClip?.color ?? "#38bdf8" }}>
                      <Film className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-base">{activeClip?.label ?? "No clip"}</p>
                      <p className="text-[#7a9abf] text-xs mt-1">
                        {activeClip ? `${fmt(activeClip.start)} – ${fmt(activeClip.start + activeClip.dur)}` : "Move playhead over a clip"}
                      </p>
                    </div>
                    {playing && (
                      <div className="flex items-end gap-1 h-5">
                        {[0.5,0.9,0.7,1,0.6,0.8,0.4].map((h,i)=>(
                          <div key={i} className="w-1 rounded-full bg-orange-400 animate-pulse" style={{ height:`${h*100}%`, animationDelay:`${i*0.1}s` }} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Timecode overlay */}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-mono px-2 py-1 rounded-lg">
                  {fmt(playhead)} / {fmt(TOTAL)}
                </div>
                {/* Sync point flash */}
                {syncPts.some(s => Math.abs(s.time - playhead) < 0.15) && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse">
                    ● SYNC
                  </div>
                )}
              </div>
            </div>
            {/* Transport bar */}
            <div className="px-4 py-3 bg-[#111827] space-y-2">
              <input type="range" min={0} max={TOTAL} step={0.1} value={playhead}
                onChange={e => { setPlaying(false); setPlayhead(Number(e.target.value)); }}
                className="w-full h-1.5 accent-orange-400" />
              <div className="flex items-center gap-2">
                <button onClick={() => { setPlaying(false); setPlayhead(0); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <SkipBack className="w-4 h-4 text-white" />
                </button>
                <button onClick={() => setPlaying(p => !p)}
                  className="w-10 h-8 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors">
                  {playing ? <Square className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                </button>
                <button onClick={() => setPlayhead(TOTAL)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <SkipForward className="w-4 h-4 text-white" />
                </button>
                <button onClick={splitAtPlayhead} disabled={!selected}
                  className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-semibold transition-colors">
                  <Scissors className="w-3.5 h-3.5" /> Split
                </button>
                <button onClick={addSyncPoint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" /> Mark Sync
                </button>
                <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/60">
                  <span>Snap</span>
                  <button onClick={() => setSnapToSync(s => !s)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${snapToSync ? "bg-orange-400" : "bg-white/20"}`}>
                    <span className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all" style={{ left: snapToSync ? "calc(100% - 14px)" : "2px" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Zoom + Tab bar */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-white rounded-xl border border-[#cdd8e8] p-1">
              {(["timeline","sync","export"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${tab===t ? "bg-sky-500 text-white" : "text-[#4a6580] hover:bg-sky-50"}`}>
                  {t === "timeline" ? "Timeline" : t === "sync" ? "Sync Points" : "Export"}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-[10px] text-[#7a9abf] font-semibold">Zoom</span>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="w-7 h-7 rounded-lg bg-white border border-[#cdd8e8] flex items-center justify-center text-xs hover:bg-sky-50"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span className="text-xs font-mono text-[#1a2a3a] w-8 text-center">{zoom}×</span>
              <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className="w-7 h-7 rounded-lg bg-white border border-[#cdd8e8] flex items-center justify-center text-xs hover:bg-sky-50"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* ── TIMELINE TAB ──────────────────────────────────────────────── */}
          {tab === "timeline" && (
            <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#e8eef5] flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-[#1a2a3a]">Timeline</span>
                <span className="text-[10px] text-[#7a9abf]">Click timeline to seek · click clip to select · use controls to trim/split</span>
              </div>
              {/* Ruler */}
              <div ref={tlRef} className="overflow-x-auto relative select-none bg-[#f8fafc]"
                style={{ cursor: "col-resize" }} onClick={seekTo}>
                {/* Ruler ticks */}
                <div className="relative h-6 bg-[#f0f4f8] border-b border-[#e8eef5]" style={{ width: TOTAL * pxS + 40 }}>
                  {Array.from({ length: TOTAL + 1 }).map((_, i) => i % 5 === 0 && (
                    <div key={i} className="absolute top-0 flex flex-col items-start" style={{ left: i * pxS }}>
                      <div className="h-3 w-px bg-[#cdd8e8]" />
                      <span className="text-[9px] font-mono text-[#7a9abf] ml-0.5">{fmt(i)}</span>
                    </div>
                  ))}
                  {/* Playhead */}
                  <div className="absolute top-0 h-full w-0.5 bg-orange-500 z-20 pointer-events-none" style={{ left: playhead * pxS }}>
                    <div className="absolute -top-0.5 -left-1.5 w-3 h-3 bg-orange-500 rotate-45" />
                  </div>
                </div>

                {/* Clips track */}
                <div className="relative h-14 mx-0" style={{ width: TOTAL * pxS + 40 }}
                  onClick={e => { e.stopPropagation(); seekTo(e); }}>
                  {clips.map(c => (
                    <div key={c.id}
                      onClick={e => { e.stopPropagation(); setSelected(c.id); }}
                      className={`absolute top-2 h-10 rounded-lg flex items-center px-2 cursor-pointer transition-all border-2 ${selected===c.id ? "border-white shadow-lg scale-y-105" : "border-transparent"}`}
                      style={{ left: c.start * pxS, width: Math.max(24, c.dur * pxS - 2), background: c.color }}>
                      <span className="text-[10px] font-bold text-white truncate">{c.label}</span>
                    </div>
                  ))}
                  {/* Sync point markers */}
                  {syncPts.map(s => (
                    <div key={s.id} className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-10" style={{ left: s.time * pxS, background: SYNC_COLORS[s.type] }}>
                      <div className="absolute -top-0.5 -left-1" style={{ width:8, height:8, background: SYNC_COLORS[s.type], transform:"rotate(45deg)" }} />
                    </div>
                  ))}
                  {/* Playhead line */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-20 pointer-events-none" style={{ left: playhead * pxS }} />
                </div>
              </div>
            </div>
          )}

          {/* ── SYNC POINTS TAB ────────────────────────────────────────────── */}
          {tab === "sync" && (
            <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#e8eef5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-bold text-[#1a2a3a]">Sync Points ({syncPts.length})</span>
                </div>
                <button onClick={addSyncPoint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add at {fmt(playhead)}
                </button>
              </div>
              <div className="p-4 space-y-2">
                {syncPts.length === 0 && <p className="text-xs text-[#7a9abf]">No sync points — press "Mark Sync" during playback to set beat-aligned cut points.</p>}
                {syncPts.sort((a,b)=>a.time-b.time).map(s => (
                  <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f4f8] border border-[#e8eef5]">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: SYNC_COLORS[s.type] }} />
                    <span className="text-xs font-mono font-bold text-[#1a2a3a] w-12">{fmt(s.time)}</span>
                    <select value={s.type} onChange={e => setSyncPts(ps => ps.map(p => p.id===s.id ? {...p,type:e.target.value as SyncPoint["type"]} : p))}
                      className="text-[10px] px-2 py-1 rounded-lg border border-[#cdd8e8] bg-white text-[#4a6580] focus:outline-none">
                      {["beat","drop","cut","custom"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <input value={s.label} onChange={e => setSyncPts(ps => ps.map(p => p.id===s.id ? {...p,label:e.target.value} : p))}
                      className="flex-1 text-xs px-2 py-1 rounded-lg border border-[#cdd8e8] bg-white text-[#1a2a3a] focus:outline-none focus:border-sky-400" />
                    <button onClick={() => { setPlaying(false); setPlayhead(s.time); }}
                      className="text-[10px] px-2 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-100 font-semibold">
                      Jump
                    </button>
                    <button onClick={() => deleteSyncPt(s.id)} className="text-[#cdd8e8] hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EXPORT TAB ──────────────────────────────────────────────────── */}
          {tab === "export" && (
            <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#e8eef5] flex items-center gap-2">
                <Download className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-bold text-[#1a2a3a]">Export</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { l:"1080p MP4", d:"H.264, 30fps, stereo",    rec:true  },
                    { l:"4K MP4",   d:"H.265, 60fps, surround",   rec:false },
                    { l:"720p MP4", d:"H.264, 30fps, web optimised",rec:false},
                    { l:"GIF Loop", d:"480p, 15fps, 10s max",      rec:false },
                  ].map(({ l, d, rec }) => (
                    <div key={l} className={`px-3 py-2.5 rounded-xl border text-left ${rec?"border-orange-300 bg-orange-50":"border-[#cdd8e8]"}`}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-xs font-bold text-[#1a2a3a]">{l}</span>
                        {rec && <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1.5 rounded-full">Rec</span>}
                      </div>
                      <div className="text-[10px] text-[#7a9abf]">{d}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  {[
                    { l:"Clips",        v:`${clips.length}` },
                    { l:"Duration",     v:fmt(TOTAL)         },
                    { l:"Sync Points",  v:`${syncPts.length}` },
                  ].map(({ l, v }) => (
                    <div key={l} className="rounded-xl bg-[#f0f4f8] border border-[#e8eef5] px-3 py-2">
                      <div className="text-[#7a9abf] font-semibold">{l}</div>
                      <div className="font-bold text-sm text-[#1a2a3a]">{v}</div>
                    </div>
                  ))}
                </div>
                {exportStatus === "rendering" && (
                  <div>
                    <div className="h-2.5 rounded-full bg-[#e8eef5] overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width:`${exportPct}%` }} />
                    </div>
                    <p className="text-[10px] text-[#7a9abf] mt-1">Rendering… {Math.round(exportPct)}%</p>
                  </div>
                )}
                {exportStatus === "done" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 font-semibold">
                    <Check className="w-4 h-4" /> Export complete — file ready to download
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={runExport} disabled={exportStatus === "rendering"}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-bold transition-colors">
                    <Download className="w-4 h-4" />
                    {exportStatus === "rendering" ? "Rendering…" : exportStatus === "done" ? "Export Again" : "Export Project"}
                  </button>
                  {exportStatus === "done" && (
                    <button onClick={() => setExportStatus("idle")}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#cdd8e8] text-xs font-semibold text-[#4a6580] hover:bg-sky-50 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── CLIP BIN (right panel) ─────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Upload */}
          <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#e8eef5] flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-500" />
              <span className="text-sm font-bold text-[#1a2a3a]">Import</span>
            </div>
            <div className="p-4 space-y-2">
              <label className="flex flex-col items-center justify-center gap-2 w-full h-20 rounded-xl border-2 border-dashed border-[#cdd8e8] hover:border-sky-400 bg-[#f8fafc] cursor-pointer transition-colors">
                <Plus className="w-5 h-5 text-[#7a9abf]" />
                <span className="text-xs text-[#7a9abf]">Upload video clip</span>
                <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
              </label>
              {uploadLabel && <p className="text-[10px] text-green-600 font-semibold truncate">✓ {uploadLabel}</p>}
              <button onClick={addClip}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#cdd8e8] text-xs font-semibold text-sky-600 hover:bg-sky-50 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Blank Clip
              </button>
            </div>
          </div>

          {/* Clip list */}
          <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#e8eef5] flex items-center gap-2">
              <Film className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-[#1a2a3a]">Clips</span>
              <span className="ml-auto text-[10px] text-[#7a9abf]">{clips.length} clips · {fmt(TOTAL)}</span>
            </div>
            <div className="p-3 space-y-1.5 max-h-[400px] overflow-y-auto">
              {clips.map(c => (
                <div key={c.id}
                  onClick={() => { setSelected(c.id); setPlayhead(c.start); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all border ${selected===c.id ? "border-sky-400 bg-sky-50 shadow-sm" : "border-[#e8eef5] hover:border-sky-200 hover:bg-sky-50/50"}`}>
                  <div className="w-3 h-8 rounded-sm flex-shrink-0" style={{ background: c.color }} />
                  <div className="flex-1 min-w-0">
                    <input value={c.label} onChange={e => { e.stopPropagation(); renameClip(c.id, e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className="text-xs font-bold text-[#1a2a3a] bg-transparent w-full focus:outline-none focus:border-b focus:border-sky-400" />
                    <p className="text-[10px] text-[#7a9abf]">{fmt(c.start)} – {fmt(c.start+c.dur)} · {c.dur}s</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteClip(c.id); }}
                    className="text-[#cdd8e8] hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected clip controls */}
          {selClip && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-sky-200 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-sky-500" />
                <span className="text-sm font-bold text-[#1a2a3a]">Edit: {selClip.label}</span>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l:"Start", v:fmt(selClip.start) },
                    { l:"End",   v:fmt(selClip.start+selClip.dur) },
                    { l:"Duration", v:`${selClip.dur}s` },
                    { l:"Position", v:`${Math.round((selClip.start/TOTAL)*100)}%` },
                  ].map(({ l, v }) => (
                    <div key={l} className="bg-white rounded-lg px-2 py-1.5 border border-sky-100">
                      <div className="text-[9px] text-[#7a9abf] font-semibold">{l}</div>
                      <div className="font-mono font-bold text-[#1a2a3a] text-sm">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-[#7a9abf] uppercase">Trim Start</p>
                  <div className="flex gap-1">
                    {[-1,-0.5,0.5,1].map(d => (
                      <button key={d} onClick={() => trimStart(selClip.id, d)}
                        className="flex-1 py-1.5 rounded-lg border border-[#cdd8e8] bg-white text-[10px] font-semibold text-[#4a6580] hover:border-sky-400 hover:bg-sky-50 transition-colors">
                        {d > 0 ? `+${d}s` : `${d}s`}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-[#7a9abf] uppercase">Trim End</p>
                  <div className="flex gap-1">
                    {[-1,-0.5,0.5,1].map(d => (
                      <button key={d} onClick={() => trimEnd(selClip.id, d)}
                        className="flex-1 py-1.5 rounded-lg border border-[#cdd8e8] bg-white text-[10px] font-semibold text-[#4a6580] hover:border-sky-400 hover:bg-sky-50 transition-colors">
                        {d > 0 ? `+${d}s` : `${d}s`}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={splitAtPlayhead}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors">
                  <Scissors className="w-3.5 h-3.5" /> Split at Playhead ({fmt(playhead)})
                </button>
                <button onClick={() => deleteClip(selClip.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Clip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
