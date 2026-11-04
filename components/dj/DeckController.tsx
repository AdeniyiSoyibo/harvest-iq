"use client";
import { usePlatformStore } from "@/lib/store";
import { MOCK_TRACKS } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";
import { Play, Pause, ChevronDown, Upload } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

// Shared Web Audio context — one per page, both decks share it so crossfade works
let sharedAudioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
    sharedAudioCtx = new AudioContext();
  }
  if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
  return sharedAudioCtx;
}

// Each deck exposes a GainNode so the crossfader can control volume
export const deckGains: Record<"A" | "B", GainNode | null> = { A: null, B: null };

export function DeckController({ side }: { side: "A" | "B" }) {
  const { deckA, deckB, setDeckA, setDeckB } = usePlatformStore();
  const track = side === "A" ? deckA : deckB;
  const setTrack = side === "A" ? setDeckA : setDeckB;

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bpmAdj, setBpmAdj] = useState(0);
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);

  const grad  = side === "A" ? "from-sky-400 to-blue-500"     : "from-purple-400 to-indigo-500";
  const bar   = side === "A" ? "bg-sky-400"                   : "bg-purple-400";
  const text  = side === "A" ? "text-sky-600"                 : "text-purple-600";
  const label = side === "A" ? "DECK A"                       : "DECK B";

  // Wire Web Audio — gain starts at 1.0, crossfader controls it externally
  const ensureAudioGraph = useCallback(() => {
    const el = audioRef.current;
    if (!el || sourceRef.current) return;
    const ctx = getAudioCtx();
    const source = ctx.createMediaElementSource(el);
    const gain = ctx.createGain();
    gain.gain.value = 1.0; // CrossfaderModule sets the real value
    source.connect(gain);
    gain.connect(ctx.destination);
    sourceRef.current = source;
    gainRef.current = gain;
    deckGains[side] = gain; // expose to CrossfaderModule
  }, [side]);

  // Handle file upload
  const handleFile = useCallback((file: File) => {
    if (uploadedURL) URL.revokeObjectURL(uploadedURL);
    const url = URL.createObjectURL(file);
    setUploadedURL(url);
    setUploadedName(file.name.replace(/\.[^.]+$/, ""));
    setPlaying(false);
    setProgress(0);
    sourceRef.current = null; // reset so graph is rewired
  }, [uploadedURL]);

  // Load src into audio element
  const activeSrc = uploadedURL ?? null;
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !activeSrc) return;
    el.src = activeSrc;
    el.load();
    el.onloadedmetadata = () => setDuration(el.duration);
    sourceRef.current = null;
    // Pre-wire audio graph so crossfader works before first play
    ensureAudioGraph();
  }, [activeSrc]); // eslint-disable-line

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !activeSrc) return;
    ensureAudioGraph();
    if (el.paused) {
      el.play().then(() => {
        setPlaying(true);
        const tick = () => {
          setProgress((el.currentTime / (el.duration || 1)) * 100);
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - r.left) / r.width) * duration;
  };

  const displayTitle = uploadedName ?? track?.title ?? null;

  return (
    <Card className={playing ? "deck-active" : ""}>
      <audio ref={audioRef} onEnded={() => { setPlaying(false); setProgress(0); cancelAnimationFrame(rafRef.current); }} />

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e8eef5] flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gradient-to-r ${grad} text-white`}>{label}</span>
        {playing && <Badge variant="success">Live</Badge>}
        <div className="flex-1" />

        {/* Upload button */}
        <button onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border border-[#cdd8e8] text-[#7a9abf] hover:border-sky-300 hover:text-sky-500 transition-colors">
          <Upload className="w-3 h-3" /> Upload
        </button>
        <input ref={fileInputRef} type="file" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {/* Track selector */}
        <div className="relative">
          <select value={track?.id ?? ""} onChange={e => { const t = MOCK_TRACKS.find(x => x.id === e.target.value); if (t) setTrack(t); }}
            className="appearance-none bg-[#f0f4f8] border border-[#cdd8e8] rounded-xl px-3 py-1.5 text-xs text-[#1a2a3a] pr-7 focus:outline-none focus:border-sky-400">
            <option value="">Select track…</option>
            {MOCK_TRACKS.map(t => <option key={t.id} value={t.id}>{t.title} — {t.artist}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#7a9abf] pointer-events-none" />
        </div>
      </div>

      {/* Body */}
      {(track || uploadedName) ? (
        <div className="p-4 space-y-3">
          {/* Metadata */}
          {track && (
            <div className="grid grid-cols-3 gap-2 text-center">
              {[{ l: "BPM", v: track.bpm + bpmAdj }, { l: "KEY", v: track.key }, { l: "DUR", v: formatDuration(track.duration) }].map(({ l, v }) => (
                <div key={l} className="bg-[#f0f4f8] rounded-xl py-2.5 border border-[#e8eef5]">
                  <div className="text-[9px] font-bold text-[#7a9abf] uppercase">{l}</div>
                  <div className={`text-sm font-mono font-bold ${text} mt-0.5`}>{v}</div>
                </div>
              ))}
            </div>
          )}
          {uploadedName && !track && (
            <div className="px-3 py-2 rounded-xl bg-[#f0f4f8] border border-[#e8eef5] text-xs text-[#4a6580] truncate">
              🎵 {uploadedName}
            </div>
          )}

          {/* Waveform / progress bar */}
          <div className="h-12 flex items-end gap-px bg-[#f0f4f8] rounded-xl px-2 py-1.5 cursor-pointer" onClick={seek}>
            {Array.from({ length: 48 }, (_, i) => {
              const v = 0.3 + 0.65 * Math.abs(Math.sin(i * 0.35 + (side === "A" ? 0 : 1)));
              return <div key={i} className={`flex-1 rounded-sm ${(i / 48) * 100 < progress ? bar : "bg-[#cdd8e8]"}`} style={{ height: `${Math.max(10, v * 100)}%` }} />;
            })}
          </div>

          {/* BPM adjust (mock tracks only) */}
          {track && (
            <div>
              <div className="flex justify-between text-[10px] text-[#7a9abf] mb-1">
                <span>BPM Adjust</span>
                <span className={`font-mono font-bold ${text}`}>{track.bpm + bpmAdj}{bpmAdj !== 0 && ` (${bpmAdj > 0 ? "+" : ""}${bpmAdj})`}</span>
              </div>
              <input type="range" min={-8} max={8} step={0.5} value={bpmAdj} onChange={e => setBpmAdj(Number(e.target.value))} className="w-full h-1" />
            </div>
          )}

          {/* Play button */}
          <button onClick={togglePlay}
            className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r ${grad} hover:opacity-90 shadow-sm transition-opacity`}>
            {playing ? <><Pause className="w-4 h-4" />Pause Deck {side}</> : <><Play className="w-4 h-4" />Cue &amp; Play Deck {side}</>}
          </button>

          {/* Crossfader position indicator */}
          <div className="text-[10px] text-center text-[#7a9abf]">
            {playing ? <span className="text-emerald-500 font-semibold">▶ Playing</span> : <span>Cued — press play</span>}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f4f8] flex items-center justify-center mx-auto">
            <Upload className={`w-5 h-5 ${side === "A" ? "text-sky-400" : "text-purple-400"}`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1a2a3a]">Load Deck {side}</p>
            <p className="text-[10px] text-[#7a9abf] mt-0.5">Pick a demo track from the dropdown above, or upload your own audio file</p>
          </div>
          <button onClick={() => fileInputRef.current?.click()}
            className={`mx-auto flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-dashed text-xs font-semibold transition-colors ${side === "A" ? "border-sky-300 hover:border-sky-500 text-sky-500 hover:bg-sky-50" : "border-purple-300 hover:border-purple-500 text-purple-500 hover:bg-purple-50"}`}>
            <Upload className="w-3.5 h-3.5" /> Upload MP3 / WAV
          </button>
          <p className="text-[10px] text-[#cdd8e8]">or select from the dropdown ↑</p>
        </div>
      )}
    </Card>
  );
}
