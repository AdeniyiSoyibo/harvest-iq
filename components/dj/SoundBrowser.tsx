"use client";
import { useState } from "react";

// ── All sounds synthesised via Web Audio — no files needed ───────────────────
function ctx(): AudioContext {
  const w = window as any;
  if (!w._djCtx || w._djCtx.state === "closed") w._djCtx = new AudioContext();
  if (w._djCtx.state === "suspended") w._djCtx.resume();
  return w._djCtx;
}

type SoundDef = { id: string; label: string; fn: () => void };

// ── DRUMS ────────────────────────────────────────────────────────────────────
function kick() {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain();
  o.connect(g); g.connect(c.destination);
  o.type = "sine"; o.frequency.setValueAtTime(150, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.25);
  g.gain.setValueAtTime(1, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
  o.start(); o.stop(c.currentTime + 0.3);
}
function snare() {
  const c = ctx(); const buf = c.createBuffer(1, c.sampleRate * 0.2, c.sampleRate);
  const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); const g = c.createGain(); const f = c.createBiquadFilter();
  src.buffer = buf; f.type = "bandpass"; f.frequency.value = 2500; f.Q.value = 0.5;
  src.connect(f); f.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0.6, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.18);
  src.start(); src.stop(c.currentTime + 0.2);
}
function hihat(open = false) {
  const c = ctx(); const buf = c.createBuffer(1, c.sampleRate * (open ? 0.4 : 0.08), c.sampleRate);
  const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); const g = c.createGain(); const f = c.createBiquadFilter();
  src.buffer = buf; f.type = "highpass"; f.frequency.value = 7000;
  src.connect(f); f.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0.4, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + (open ? 0.35 : 0.07));
  src.start(); src.stop(c.currentTime + (open ? 0.4 : 0.09));
}
function clap() {
  const c = ctx();
  for (let i = 0; i < 3; i++) {
    const buf = c.createBuffer(1, c.sampleRate * 0.05, c.sampleRate);
    const d = buf.getChannelData(0); for (let j = 0; j < d.length; j++) d[j] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); const g = c.createGain(); const f = c.createBiquadFilter();
    src.buffer = buf; f.type = "bandpass"; f.frequency.value = 1200;
    src.connect(f); f.connect(g); g.connect(c.destination);
    const t = c.currentTime + i * 0.012;
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    src.start(t); src.stop(t + 0.07);
  }
}
function rimshot() {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain();
  o.connect(g); g.connect(c.destination); o.type = "triangle"; o.frequency.value = 800;
  g.gain.setValueAtTime(0.5, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
  o.start(); o.stop(c.currentTime + 0.07);
}

// ── BASS ─────────────────────────────────────────────────────────────────────
function bassNote(freq: number, dur = 0.4) {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain(); const f = c.createBiquadFilter();
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.type = "sawtooth"; o.frequency.value = freq;
  f.type = "lowpass"; f.frequency.value = 400; f.Q.value = 8;
  g.gain.setValueAtTime(0.7, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  o.start(); o.stop(c.currentTime + dur);
}

// ── SYNTH / MELODY ───────────────────────────────────────────────────────────
function synthLead(freq: number, dur = 0.5) {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain();
  o.connect(g); g.connect(c.destination); o.type = "square"; o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.3, c.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  o.start(); o.stop(c.currentTime + dur);
}
function padChord(root: number) {
  const c = ctx(); const ratios = [1, 1.25, 1.5];
  ratios.forEach(r => {
    const o = c.createOscillator(); const g = c.createGain();
    o.connect(g); g.connect(c.destination); o.type = "sine"; o.frequency.value = root * r;
    g.gain.setValueAtTime(0, c.currentTime);
    g.gain.linearRampToValueAtTime(0.15, c.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
    o.start(); o.stop(c.currentTime + 1.6);
  });
}
function arp(root: number) {
  const notes = [root, root * 1.25, root * 1.5, root * 2];
  const c = ctx();
  notes.forEach((f, i) => {
    const o = c.createOscillator(); const g = c.createGain();
    o.connect(g); g.connect(c.destination); o.type = "triangle"; o.frequency.value = f;
    const t = c.currentTime + i * 0.12;
    g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.start(t); o.stop(t + 0.16);
  });
}

// ── INSTRUMENTS ──────────────────────────────────────────────────────────────
function piano(freq: number) {
  const c = ctx(); const o1 = c.createOscillator(); const o2 = c.createOscillator(); const g = c.createGain();
  o1.connect(g); o2.connect(g); g.connect(c.destination);
  o1.type = "sine"; o1.frequency.value = freq;
  o2.type = "sine"; o2.frequency.value = freq * 2; 
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.4, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.2);
  o1.start(); o2.start(); o1.stop(c.currentTime + 1.2); o2.stop(c.currentTime + 1.2);
}
function guitar(freq: number) {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain(); const f = c.createBiquadFilter();
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.type = "sawtooth"; o.frequency.value = freq; f.type = "peaking"; f.frequency.value = 2000; f.gain.value = 4;
  g.gain.setValueAtTime(0.3, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);
  o.start(); o.stop(c.currentTime + 0.9);
}
function brass(freq: number) {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain(); const f = c.createBiquadFilter();
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.type = "sawtooth"; o.frequency.value = freq; f.type = "lowpass"; f.frequency.value = 1500;
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.4, c.currentTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7);
  o.start(); o.stop(c.currentTime + 0.75);
}
function strings(freq: number) {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain();
  o.connect(g); g.connect(c.destination); o.type = "sawtooth"; o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.2, c.currentTime + 0.15);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.5);
  o.start(); o.stop(c.currentTime + 1.6);
}

// ── VOCAL FX ──────────────────────────────────────────────────────────────────
function vocalOh(freq: number) {
  const c = ctx(); const o = c.createOscillator(); const f1 = c.createBiquadFilter(); const g = c.createGain();
  o.connect(f1); f1.connect(g); g.connect(c.destination);
  o.type = "sine"; o.frequency.value = freq; f1.type = "bandpass"; f1.frequency.value = 800; f1.Q.value = 3;
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.4, c.currentTime + 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);
  o.start(); o.stop(c.currentTime + 0.9);
}
function beatboxBass() {
  const c = ctx(); const o = c.createOscillator(); const g = c.createGain(); const f = c.createBiquadFilter();
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.type = "sine"; f.type = "lowpass"; f.frequency.value = 200;
  o.frequency.setValueAtTime(100, c.currentTime); o.frequency.exponentialRampToValueAtTime(40, c.currentTime + 0.15);
  g.gain.setValueAtTime(0.8, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  o.start(); o.stop(c.currentTime + 0.22);
}

// ── CATEGORIES & SOUNDS ──────────────────────────────────────────────────────
const CATEGORIES: { id: string; label: string; color: string; sounds: SoundDef[] }[] = [
  {
    id: "drums", label: "Drums", color: "bg-red-500",
    sounds: [
      { id: "kick",    label: "Kick",       fn: kick },
      { id: "snare",   label: "Snare",      fn: snare },
      { id: "hihat",   label: "Hi-Hat",     fn: () => hihat(false) },
      { id: "openhat", label: "Open Hat",   fn: () => hihat(true) },
      { id: "clap",    label: "Clap",       fn: clap },
      { id: "rim",     label: "Rimshot",    fn: rimshot },
    ],
  },
  {
    id: "bass", label: "Bass", color: "bg-orange-500",
    sounds: [
      { id: "bass-c",  label: "Bass C",  fn: () => bassNote(65) },
      { id: "bass-e",  label: "Bass E",  fn: () => bassNote(82) },
      { id: "bass-g",  label: "Bass G",  fn: () => bassNote(98) },
      { id: "bass-a",  label: "Bass A",  fn: () => bassNote(110) },
      { id: "bass-d",  label: "Bass D",  fn: () => bassNote(73) },
      { id: "bass-808",label: "808",     fn: () => bassNote(55, 0.8) },
    ],
  },
  {
    id: "synth", label: "Synth", color: "bg-sky-500",
    sounds: [
      { id: "lead-c",  label: "Lead C",  fn: () => synthLead(261) },
      { id: "lead-e",  label: "Lead E",  fn: () => synthLead(329) },
      { id: "lead-g",  label: "Lead G",  fn: () => synthLead(392) },
      { id: "lead-a",  label: "Lead A",  fn: () => synthLead(440) },
      { id: "pad-c",   label: "Pad C",   fn: () => padChord(130) },
      { id: "arp-c",   label: "Arp",     fn: () => arp(261) },
    ],
  },
  {
    id: "instruments", label: "Instruments", color: "bg-emerald-500",
    sounds: [
      { id: "piano-c", label: "Piano C",   fn: () => piano(261) },
      { id: "piano-g", label: "Piano G",   fn: () => piano(392) },
      { id: "guitar-e",label: "Guitar E",  fn: () => guitar(330) },
      { id: "guitar-a",label: "Guitar A",  fn: () => guitar(440) },
      { id: "brass-g", label: "Brass G",   fn: () => brass(196) },
      { id: "strings", label: "Strings C", fn: () => strings(261) },
    ],
  },
  {
    id: "vocal", label: "Vocal / FX", color: "bg-purple-500",
    sounds: [
      { id: "vox-c",   label: "Vox C",    fn: () => vocalOh(261) },
      { id: "vox-e",   label: "Vox E",    fn: () => vocalOh(329) },
      { id: "vox-g",   label: "Vox G",    fn: () => vocalOh(392) },
      { id: "beatbox", label: "Beatbox",  fn: beatboxBass },
      { id: "vox-a",   label: "Vox A",    fn: () => vocalOh(440) },
      { id: "vox-high",label: "Vox Hi",   fn: () => vocalOh(523) },
    ],
  },
];

export function SoundBrowser() {
  const [activeCategory, setActiveCategory] = useState("drums");
  const [active, setActive] = useState<string | null>(null);

  const cat = CATEGORIES.find(c => c.id === activeCategory)!;

  const trigger = (sound: SoundDef) => {
    sound.fn();
    setActive(sound.id);
    setTimeout(() => setActive(null), 200);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#cdd8e8] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#e8eef5] flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-[#1a2a3a]">Sound Browser</span>
        <span className="text-[10px] text-[#7a9abf]">Choose sounds, melodies, beats &amp; instruments to layer into your mix</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 px-4 pt-3 pb-0 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === c.id
                ? `${c.color} text-white shadow-sm`
                : "bg-[#f0f4f8] text-[#7a9abf] hover:text-[#1a2a3a]"
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Sound grid */}
      <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
        {cat.sounds.map(sound => (
          <button key={sound.id} onClick={() => trigger(sound)}
            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-semibold border-2 transition-all select-none
              ${active === sound.id
                ? `${cat.color} text-white border-transparent scale-95`
                : `bg-[#f0f4f8] border-[#e8eef5] text-[#4a6580] hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 active:scale-95`
              }`}>
            <span className="font-mono text-[11px] font-bold">{sound.label}</span>
          </button>
        ))}
      </div>

      {/* Hint */}
      <div className="px-4 pb-3 text-[10px] text-[#cdd8e8] text-center">
        All sounds play on top of your active decks · tap rapidly to layer rhythms
      </div>
    </div>
  );
}
