"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PlaySquare, RefreshCw, Link2, Volume2, Bookmark, ChevronLeft, ChevronRight, Headphones } from "lucide-react";

interface CuePoint { id: number; label: string; time: number; }
interface YTDeck { videoId: string; title: string; volume: number; cues: CuePoint[]; _startTime?: number; }

const PRESETS = [
  { id: "dQw4w9WgXcQ", title: "Classic House Set" },
  { id: "3JZ_D3ELwOQ", title: "Techno DJ Set" },
  { id: "ylXk1LBvIqU", title: "Afrobeats Mix" },
  { id: "hT_nvWreIhg", title: "Hip-Hop Megamix" },
  { id: "2Vv-BfVoq4g", title: "EDM / Future Bass" },
  { id: "09R8_2nJtjg", title: "Lo-Fi Chill Beats" },
  { id: "kffacxfA7G4", title: "Drill Set" },
  { id: "tgbNymZ7vqY", title: "Afropop Party" },
];

const FADE_SPEEDS = [
  { label: "Cut", ms: 0 },
  { label: "1s",  ms: 1000 },
  { label: "4s",  ms: 4000 },
  { label: "8s",  ms: 8000 },
];

// ── Video Sample Pads (8 synthesised hits) ────────────────────────────────────
function getVidCtx(): AudioContext {
  const w = window as Window & { _vidAudioCtx?: AudioContext };
  if (!w._vidAudioCtx || w._vidAudioCtx.state === "closed") w._vidAudioCtx = new AudioContext();
  if (w._vidAudioCtx.state === "suspended") w._vidAudioCtx.resume();
  return w._vidAudioCtx;
}

const VIDEO_PADS = [
  { label: "Airhorn",  color: "bg-sky-500",    play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.setValueAtTime(220, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2); o.start(); o.stop(ctx.currentTime + 1.2); } },
  { label: "Siren",    color: "bg-red-500",     play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(400, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4); o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.8); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0); o.start(); o.stop(ctx.currentTime + 1.0); } },
  { label: "Riser",    color: "bg-purple-500",  play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.setValueAtTime(80, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 2.5); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5); o.start(); o.stop(ctx.currentTime + 2.5); } },
  { label: "Drop",     color: "bg-orange-500",  play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(2000, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8); o.start(); o.stop(ctx.currentTime + 0.8); } },
  { label: "Scratch",  color: "bg-green-500",   play: () => { const ctx = getVidCtx(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.08); const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; s.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); s.start(); } },
  { label: "Rewind",   color: "bg-yellow-500",  play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.setValueAtTime(1200, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6); o.start(); o.stop(ctx.currentTime + 0.6); } },
  { label: "Stutter",  color: "bg-pink-500",    play: () => { const ctx = getVidCtx(); for (let i = 0; i < 8; i++) { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "square"; o.frequency.value = 220; const t = ctx.currentTime + i * 0.06; g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); o.start(t); o.stop(t + 0.05); } } },
  { label: "Big Room", color: "bg-indigo-500",  play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(60, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15); g.gain.setValueAtTime(0.9, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); o.start(); o.stop(ctx.currentTime + 0.5); } },
];

// ── Video Sound Browser (4 categories × 5 sounds) ────────────────────────────
const VIDEO_SOUNDS: Record<string, { label: string; play: () => void }[]> = {
  Percussion: [
    { label: "Kick",    play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(150, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); o.start(); o.stop(ctx.currentTime + 0.3); } },
    { label: "Snare",   play: () => { const ctx = getVidCtx(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06)); const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; s.connect(g); g.connect(ctx.destination); g.gain.value = 0.6; s.start(); } },
    { label: "Hi-Hat",  play: () => { const ctx = getVidCtx(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02)); const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; s.connect(g); g.connect(ctx.destination); g.gain.value = 0.3; s.start(); } },
    { label: "Clap",    play: () => { const ctx = getVidCtx(); for (let i = 0; i < 3; i++) { const b = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate); const d = b.getChannelData(0); for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * Math.exp(-j / (ctx.sampleRate * 0.015)); const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; s.connect(g); g.connect(ctx.destination); g.gain.value = 0.4; s.start(ctx.currentTime + i * 0.012); } } },
    { label: "Tom",     play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(200, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); o.start(); o.stop(ctx.currentTime + 0.3); } },
  ],
  Bass: [
    { label: "Sub Bass",  play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.value = 55; g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8); o.start(); o.stop(ctx.currentTime + 0.8); } },
    { label: "808",       play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(80, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5); g.gain.setValueAtTime(0.9, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0); o.start(); o.stop(ctx.currentTime + 1.0); } },
    { label: "Wobble",    play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), lfo = ctx.createOscillator(), lfoG = ctx.createGain(), g = ctx.createGain(); lfo.frequency.value = 4; lfoG.gain.value = 200; lfo.connect(lfoG); lfoG.connect(o.frequency); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.value = 80; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5); lfo.start(); o.start(); lfo.stop(ctx.currentTime + 1.5); o.stop(ctx.currentTime + 1.5); } },
    { label: "Punch",     play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "square"; o.frequency.setValueAtTime(120, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25); o.start(); o.stop(ctx.currentTime + 0.25); } },
    { label: "Pluck",     play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "triangle"; o.frequency.value = 110; g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); o.start(); o.stop(ctx.currentTime + 0.4); } },
  ],
  FX: [
    { label: "Whoosh",    play: () => { const ctx = getVidCtx(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (i / d.length); const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = b; f.type = "bandpass"; f.frequency.setValueAtTime(500, ctx.currentTime); f.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.5); s.connect(f); f.connect(g); g.connect(ctx.destination); g.gain.value = 0.5; s.start(); } },
    { label: "Zap",       play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.setValueAtTime(800, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2); o.start(); o.stop(ctx.currentTime + 0.2); } },
    { label: "Laser",     play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sine"; o.frequency.setValueAtTime(2000, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); o.start(); o.stop(ctx.currentTime + 0.3); } },
    { label: "Glitch",    play: () => { const ctx = getVidCtx(); for (let i = 0; i < 6; i++) { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = 200 + Math.random() * 1800; o.type = "square"; const t = ctx.currentTime + i * 0.04; g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.035); o.start(t); o.stop(t + 0.035); } } },
    { label: "Reverse",   play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.setValueAtTime(200, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.5); g.gain.setValueAtTime(0.001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.5); o.start(); o.stop(ctx.currentTime + 0.5); } },
  ],
  Vocal: [
    { label: "Hey!",    play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "triangle"; o.frequency.setValueAtTime(320, ctx.currentTime); o.frequency.setValueAtTime(260, ctx.currentTime + 0.08); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35); o.start(); o.stop(ctx.currentTime + 0.35); } },
    { label: "Yeah!",   play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "triangle"; o.frequency.setValueAtTime(280, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.25); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); o.start(); o.stop(ctx.currentTime + 0.4); } },
    { label: "Ugh",     play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "sawtooth"; o.frequency.setValueAtTime(180, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3); o.start(); o.stop(ctx.currentTime + 0.3); } },
    { label: "Ho!",     play: () => { const ctx = getVidCtx(); const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "triangle"; o.frequency.setValueAtTime(200, ctx.currentTime); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25); o.start(); o.stop(ctx.currentTime + 0.25); } },
    { label: "Come On", play: () => { const ctx = getVidCtx(); [300, 260, 220].forEach((f, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type = "triangle"; o.frequency.value = f; const t = ctx.currentTime + i * 0.12; g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1); o.start(t); o.stop(t + 0.1); }); } },
  ],
};

function parseYTId(input: string): string | null {
  const s = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  try {
    const url = new URL(s.startsWith("http") ? s : "https://" + s);
    const v = url.searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    if (url.hostname === "youtu.be") { const id = url.pathname.slice(1).split("?")[0]; if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id; }
    const m = url.pathname.match(/\/(embed|shorts|v|live)\/([A-Za-z0-9_-]{11})/);
    if (m) return m[2];
  } catch {}
  const m = s.match(/[A-Za-z0-9_-]{11}/);
  return m ? m[0] : null;
}

function ytSearch(q: string) { return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`; }

function equalPower(x: number): { a: number; b: number } {
  const angle = (x / 100) * (Math.PI / 2);
  const a = x === 100 ? 0 : x === 0 ? 1 : Math.cos(angle);
  const b = x === 0   ? 0 : x === 100 ? 1 : Math.sin(angle);
  return { a: Math.round(a * 100), b: Math.round(b * 100) };
}

export function YouTubeMixPanel() {
  const [deckA, setDeckA] = useState<YTDeck>({ videoId: "dQw4w9WgXcQ", title: "Classic House Set", volume: 80, cues: [] });
  const [deckB, setDeckB] = useState<YTDeck>({ videoId: "ylXk1LBvIqU", title: "Afrobeats Mix", volume: 80, cues: [] });
  const [crossfade, setCrossfade] = useState(50);
  const [fadeSpeedMs, setFadeSpeedMs] = useState(0);
  const [urlA, setUrlA] = useState(""); const [urlB, setUrlB] = useState("");
  const [errA, setErrA] = useState(""); const [errB, setErrB] = useState("");
  const [searchA, setSearchA] = useState(""); const [searchB, setSearchB] = useState("");
  const [cueTimeA, setCueTimeA] = useState(""); const [cueTimeB, setCueTimeB] = useState("");
  const [activePad, setActivePad] = useState<number | null>(null);
  const [soundCat, setSoundCat] = useState<string>("Percussion");
  const [vidPads, setVidPads] = useState(() => VIDEO_PADS.map(p => ({ ...p, custom: false })));
  const [loadingPad, setLoadingPad] = useState<number | null>(null);
  // DJ CUE: independently mark a deck as headphone-only (pre-listen before bringing it live)
  const [cueA, setCueA] = useState(false);
  const [cueB, setCueB] = useState(false);
  const fadingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { a: aGain, b: bGain } = equalPower(crossfade);

  // CUE deck = headphones only (DJ pre-listens). LIVE deck = main speakers to audience.
  // If a deck is in CUE, its main-out = 0. Crossfader still blends non-cued decks normally.
  const aIsCue = cueA;
  const bIsCue = cueB;
  const aOut = aIsCue ? 0 : Math.round((aGain / 100) * deckA.volume);
  const bOut = bIsCue ? 0 : Math.round((bGain / 100) * deckB.volume);
  // For crossfader label: use the non-cued side as "live"
  const live = (!aIsCue && bIsCue) ? "A" : (aIsCue && !bIsCue) ? "B" : crossfade === 0 ? "A" : crossfade === 100 ? "B" : "both";

  const sweepTo = useCallback((target: number) => {
    if (fadingRef.current) clearInterval(fadingRef.current);
    if (fadeSpeedMs === 0) { setCrossfade(target); return; }
    const steps = Math.max(1, Math.round(fadeSpeedMs / 30));
    let step = 0;
    fadingRef.current = setInterval(() => {
      step++;
      setCrossfade(prev => {
        const next = prev + (target - prev) * (step / steps);
        return step >= steps ? target : Math.round(next);
      });
      if (step >= steps) { clearInterval(fadingRef.current!); fadingRef.current = null; }
    }, 30);
  }, [fadeSpeedMs]);

  const handleUrl = (side: "A" | "B", val: string) => {
    side === "A" ? setUrlA(val) : setUrlB(val);
    side === "A" ? setErrA("") : setErrB("");
    if (val.trim().length < 10) return;
    if (val.includes("/results")) { (side === "A" ? setErrA : setErrB)("Paste a direct video URL, not search results."); return; }
    const id = parseYTId(val);
    if (!id) { (side === "A" ? setErrA : setErrB)("No video ID found — paste a direct YouTube link."); return; }
    const update: YTDeck = { videoId: id, title: `Video ${id}`, volume: 80, cues: [] };
    side === "A" ? (setDeckA(update), setUrlA("")) : (setDeckB(update), setUrlB(""));
  };

  const addCue = (side: "A" | "B", rawTime: string) => {
    const t = parseFloat(rawTime);
    if (isNaN(t) || t < 0) return;
    const deck = side === "A" ? deckA : deckB;
    const setDeck = side === "A" ? setDeckA : setDeckB;
    setDeck({ ...deck, cues: [...deck.cues, { id: Date.now(), label: `CUE ${deck.cues.length + 1}`, time: t }] });
    side === "A" ? setCueTimeA("") : setCueTimeB("");
  };

  const removeCue = (side: "A" | "B", id: number) => {
    const deck = side === "A" ? deckA : deckB;
    const setDeck = side === "A" ? setDeckA : setDeckB;
    setDeck({ ...deck, cues: deck.cues.filter(c => c.id !== id) });
  };

  const renderDeck = (side: "A" | "B") => {
    const deck = side === "A" ? deckA : deckB;
    const setDeck = side === "A" ? setDeckA : setDeckB;
    const url = side === "A" ? urlA : urlB;
    const err = side === "A" ? errA : errB;
    const search = side === "A" ? searchA : searchB;
    const setSearch = side === "A" ? setSearchA : setSearchB;
    const cueTime = side === "A" ? cueTimeA : cueTimeB;
    const setCueTime = side === "A" ? setCueTimeA : setCueTimeB;
    const outVol = side === "A" ? aOut : bOut;
    const gain = side === "A" ? aGain : bGain;
    const isCue = side === "A" ? aIsCue : bIsCue;
    const isLive = live === side || live === "both";
    const grad = side === "A" ? "from-sky-400 to-blue-500" : "from-purple-400 to-indigo-500";
    const border = isCue ? "border-amber-300" : side === "A" ? "border-sky-200" : "border-purple-200";
    const accent = side === "A" ? "text-sky-600" : "text-purple-600";
    const accentBg = side === "A" ? "bg-sky-500" : "bg-purple-500";
    const embedSrc = `https://www.youtube.com/embed/${deck.videoId}?controls=1&rel=0&modestbranding=1&autoplay=1${deck._startTime != null ? `&start=${Math.floor(deck._startTime)}` : ""}`;

    return (
      <div key={side} className={`rounded-2xl border-2 ${border} bg-white overflow-hidden shadow-sm flex flex-col transition-all`}>
        <div className={`px-4 py-2 bg-gradient-to-r ${grad} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Video Deck {side}</span>
            {isLive && live !== "both" && <span className="bg-green-400 text-green-900 text-[10px] font-bold px-2 py-0.5 rounded-full">● LIVE</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/80 font-mono">Out {outVol}%</span>
            {/* CUE toggle — DJ pre-listens in headphones, silences main speakers */}
            <button
              onClick={() => side === "A" ? setCueA(v => !v) : setCueB(v => !v)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${isCue ? "bg-amber-400 text-amber-900" : "bg-white/20 text-white/80 hover:bg-white/30"}`}
              title={isCue ? "CUE active — headphones only. Click to send to main speakers." : "Click to pre-listen on headphones (removes from main out)"}>
              <Headphones className="w-3 h-3" /> {isCue ? "CUE ON" : "CUE"}
            </button>
          </div>
        </div>

        {isCue && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center gap-2 text-[11px] text-amber-700">
            <Headphones className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Cue monitor — audible in headphones only. Main speakers off.</span>
          </div>
        )}

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe key={`${deck.videoId}-${deck._startTime ?? 0}`} src={embedSrc}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen title={deck.title} />
        </div>

        <div className={`px-4 py-1.5 border-b border-[#e8eef5] text-xs font-semibold ${accent} truncate`}>{deck.title}</div>

        <div className="px-4 pt-2 pb-1 flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-[#7a9abf] flex-shrink-0" />
          <input type="range" min={0} max={100} value={deck.volume}
            onChange={e => setDeck({ ...deck, volume: Number(e.target.value) })}
            className="flex-1 h-1 accent-sky-500" />
          <span className="text-[10px] text-[#7a9abf] w-7 text-right">{deck.volume}%</span>
        </div>

        {/* Cue Points */}
        <div className="px-4 pt-2 pb-3 space-y-2 border-t border-[#f0f4f8]">
          <p className="text-[10px] font-bold text-[#7a9abf] uppercase flex items-center gap-1">
            <Bookmark className="w-3 h-3" /> Cue Points
          </p>
          {deck.cues.length === 0 && <p className="text-[10px] text-[#aab8c8]">No cues — enter seconds and click Set.</p>}
          <div className="flex flex-wrap gap-1">
            {deck.cues.map(c => (
              <div key={c.id} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] ${accentBg} text-white`}>
                <button onClick={() => setDeck(d => ({ ...d, _startTime: c.time }))} className="font-semibold hover:underline" title={`Jump to ${c.time}s`}>
                  {c.label} <span className="font-mono opacity-80">{c.time}s</span>
                </button>
                <button onClick={() => removeCue(side, c.id)} className="ml-1 opacity-70 hover:opacity-100">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="number" min={0} placeholder="Time (sec)" value={cueTime}
              onChange={e => setCueTime(e.target.value)}
              className="w-24 px-2 py-1.5 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400" />
            <button onClick={() => addCue(side, cueTime)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${grad} hover:opacity-90`}>
              Set Cue
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="px-4 pt-2 pb-1 border-t border-[#f0f4f8]">
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-1.5">Quick Load</p>
          <div className="flex flex-wrap gap-1">
            {PRESETS.map(p => (
              <button key={p.id} onClick={() => setDeck({ ...deck, videoId: p.id, title: p.title, cues: [], _startTime: undefined })}
                className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${deck.videoId === p.id ? `bg-gradient-to-r ${grad} text-white border-transparent` : "border-[#cdd8e8] text-[#4a6580] hover:border-sky-300 hover:text-sky-700"}`}>
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* URL + Search */}
        <div className="px-4 py-3 space-y-2 border-t border-[#f0f4f8]">
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase">Paste URL — loads instantly</p>
          <div className="relative">
            <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]" />
            <input value={url} onChange={e => handleUrl(side, e.target.value)}
              onPaste={e => { const v = e.clipboardData.getData("text"); setTimeout(() => handleUrl(side, v), 0); }}
              placeholder="youtube.com/watch?v=… or youtu.be/… or ID"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400" />
          </div>
          {err && <p className="text-[11px] text-red-500">{err}</p>}
          <div className="flex gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && search.trim()) window.open(ytSearch(search), "_blank"); }}
              placeholder="Search for a music video…"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400" />
            <a href={search.trim() ? ytSearch(search) : "#"} target="_blank" rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${grad} hover:opacity-90 whitespace-nowrap`}>
              Search →
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-[#e8eef5] flex items-center gap-2">
        <PlaySquare className="w-4 h-4 text-red-500" />
        <h3 className="text-sm font-bold text-[#1a2a3a]">Video Mixer</h3>
        <span className="text-[10px] text-[#7a9abf] ml-1">Cue &amp; crossfade · auto live/monitor routing · sample pads · sound browser</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Decks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {renderDeck("A")}
          {renderDeck("B")}
        </div>

        {/* Crossfader */}
        <div className="bg-[#f0f4f8] rounded-2xl p-4 border border-[#cdd8e8]">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className={live === "A" ? "text-green-600" : "text-sky-600"}>DECK A {live === "A" ? "● LIVE" : live === "B" ? "◎ CUE" : ""}</span>
            <span className="text-[10px] text-[#4a6580]">
              {crossfade === 0 ? "Full A — B in headphones" : crossfade === 100 ? "Full B — A in headphones" : crossfade === 50 ? "Center (equal power)" : crossfade < 50 ? `A +${(50 - crossfade) * 2}%` : `B +${(crossfade - 50) * 2}%`}
            </span>
            <span className={live === "B" ? "text-green-600" : "text-purple-600"}>DECK B {live === "B" ? "● LIVE" : live === "A" ? "◎ CUE" : ""}</span>
          </div>
          <input type="range" min={0} max={100} value={crossfade}
            onChange={e => setCrossfade(Number(e.target.value))}
            className="w-full h-2 accent-sky-500" />

          <div className="grid grid-cols-2 gap-4 mt-3">
            {([
              { label: "Deck A", vol: aOut, gain: aGain, isCue: aIsCue, color: "bg-sky-400", text: "text-sky-500" },
              { label: "Deck B", vol: bOut, gain: bGain, isCue: bIsCue, color: "bg-purple-400", text: "text-purple-500" },
            ] as const).map(({ label, vol, gain, isCue, color, text }) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] text-[#7a9abf] mb-1">
                  <span className="flex items-center gap-1">{label} {isCue && <Headphones className="w-3 h-3 text-amber-500" />}</span>
                  <span className={`font-mono ${isCue ? "text-amber-500" : text}`}>{isCue ? `CUE (${vol}% monitor)` : `${vol}% out`}</span>
                </div>
                <div className="h-1.5 bg-[#e8eef5] rounded-full overflow-hidden">
                  <div className={`h-full ${isCue ? "bg-amber-400" : color} rounded-full transition-all`} style={{ width: `${isCue ? gain : gain}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Snap buttons */}
          <div className="flex gap-2 justify-center mt-3">
            {[
              { v: 0,   l: "Full A", icon: <ChevronLeft className="w-3 h-3" /> },
              { v: 25,  l: "A Mix",  icon: null },
              { v: 50,  l: "Center", icon: null },
              { v: 75,  l: "B Mix",  icon: null },
              { v: 100, l: "Full B", icon: <ChevronRight className="w-3 h-3" /> },
            ].map(({ v, l, icon }) => (
              <button key={v} onClick={() => sweepTo(v)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${crossfade === v ? "bg-sky-500 text-white" : "bg-white border border-[#cdd8e8] text-[#4a6580] hover:border-sky-400"}`}>
                {icon}{l}
              </button>
            ))}
          </div>

          {/* Transition speed */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] text-[#7a9abf] font-semibold uppercase">Transition</span>
            {FADE_SPEEDS.map(({ label, ms }) => (
              <button key={ms} onClick={() => setFadeSpeedMs(ms)}
                className={`px-3 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${fadeSpeedMs === ms ? "bg-sky-500 text-white border-transparent" : "bg-white border-[#cdd8e8] text-[#4a6580] hover:border-sky-400"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sample Pads */}
        <div className="bg-[#f0f4f8] rounded-2xl p-4 border border-[#cdd8e8]">
          <p className="text-xs font-bold text-[#1a2a3a] mb-3">Video Sample Pads</p>
          <div className="grid grid-cols-4 gap-2">
            {vidPads.map((pad, i) => (
              <div key={i} className="relative group">
                <button
                  onPointerDown={() => { setActivePad(i); pad.play(); }}
                  onPointerUp={() => setActivePad(null)}
                  onPointerLeave={() => setActivePad(null)}
                  disabled={loadingPad === i}
                  className={`w-full h-14 rounded-xl text-xs font-bold text-white transition-all select-none ${pad.color} ${activePad === i ? "scale-95 brightness-75" : "hover:brightness-110 active:scale-95"} shadow-sm ${loadingPad === i ? "opacity-60 cursor-wait" : ""}`}>
                  <div>{loadingPad === i ? "⏳" : pad.custom ? "🎵" : "▶"}</div>
                  <div className="truncate px-1">{pad.label}</div>
                  {pad.custom && <div className="text-[8px] opacity-70">custom</div>}
                </button>
                <div className="absolute inset-x-0 -bottom-0.5 hidden group-hover:flex gap-0.5 px-0.5 pb-0.5 z-10">
                  <label className="flex-1 flex items-center justify-center py-1 rounded-b-xl bg-black/70 text-white text-[9px] font-bold cursor-pointer hover:bg-black/90 transition-colors" title="Load your own audio onto this pad">
                    📂
                    <input type="file" accept="audio/*" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0]; if (!file) return;
                      setLoadingPad(i);
                      try {
                        const buf = await file.arrayBuffer();
                        const ctx = getVidCtx();
                        const audioBuf = await ctx.decodeAudioData(buf);
                        const name = file.name.replace(/\.[^.]+$/, "").slice(0, 10);
                        setVidPads(ps => ps.map((p, idx) => idx !== i ? p : { ...p, label: name, custom: true, play: () => { const s = ctx.createBufferSource(); s.buffer = audioBuf; s.connect(ctx.destination); s.start(); } }));
                      } catch { /* ignore decode error */ } finally { setLoadingPad(null); e.target.value = ""; }
                    }} />
                  </label>
                  {pad.custom && (
                    <button onClick={() => setVidPads(ps => ps.map((p, idx) => idx !== i ? p : { ...VIDEO_PADS[i], custom: false }))}
                      className="flex-1 flex items-center justify-center py-1 rounded-b-xl bg-black/70 text-white text-[9px] font-bold hover:bg-black/90 transition-colors" title="Reset to default synth sound">
                      ↺
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-[#7a9abf]">Hover a pad → 📂 to load your MP3/WAV · ↺ to restore default</p>
        </div>

        {/* Sound Browser */}
        <div className="bg-[#f0f4f8] rounded-2xl p-4 border border-[#cdd8e8]">
          <p className="text-xs font-bold text-[#1a2a3a] mb-3">Video Sound Browser</p>
          <div className="flex gap-2 mb-3 flex-wrap">
            {Object.keys(VIDEO_SOUNDS).map(cat => (
              <button key={cat} onClick={() => setSoundCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${soundCat === cat ? "bg-sky-500 text-white border-transparent" : "bg-white border-[#cdd8e8] text-[#4a6580] hover:border-sky-400"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {VIDEO_SOUNDS[soundCat].map((snd, i) => (
              <button key={i} onClick={() => snd.play()}
                className="py-3 rounded-xl bg-white border border-[#cdd8e8] text-xs font-semibold text-[#1a2a3a] hover:border-sky-400 hover:bg-sky-50 active:scale-95 transition-all shadow-sm">
                {snd.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
          <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span><strong>Desktop App:</strong> Full MIDI control, BPM sync &amp; hardware cue buttons in the <a href="/download" className="underline font-semibold">Perpetual Flow desktop app →</a></span>
        </div>
      </div>
    </div>
  );
}
