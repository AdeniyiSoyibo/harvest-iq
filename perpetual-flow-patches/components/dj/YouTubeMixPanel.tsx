"use client";

import { useState } from "react";
import { RefreshCw, Link2, Volume2, Layers } from "lucide-react";

interface YTDeck {
  videoId: string;
  title: string;
  volume: number;
}

const PRESET_VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "Classic House Set (Live)" },
  { id: "3JZ_D3ELwOQ", title: "Techno DJ Set — Club Mix" },
  { id: "ylXk1LBvIqU", title: "Afrobeats Mix — Summer 2026" },
  { id: "hT_nvWreIhg", title: "Hip-Hop Video Megamix" },
  { id: "2Vv-BfVoq4g", title: "EDM / Future Bass Visuals" },
  { id: "09R8_2nJtjg", title: "Lo-Fi Hip-Hop Chill Beats" },
  { id: "kffacxfA7G4", title: "Drill Set — UK/Chicago" },
  { id: "tgbNymZ7vqY", title: "Afropop Party Mix 2026" },
];

function parseYouTubeId(input: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = input.match(p);
    if (m) return m[1];
  }
  return null;
}

export function YouTubeMixPanel() {
  const [deckA, setDeckA] = useState<YTDeck>({
    videoId: "dQw4w9WgXcQ", title: "Classic House Set (Live)", volume: 80,
  });
  const [deckB, setDeckB] = useState<YTDeck>({
    videoId: "ylXk1LBvIqU", title: "Afrobeats Mix — Summer 2026", volume: 80,
  });
  const [crossfade, setCrossfade] = useState(50);
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");

  const aVol = Math.round(((100 - crossfade) / 100) * deckA.volume);
  const bVol = Math.round((crossfade / 100) * deckB.volume);

  const loadUrl = (deck: "A" | "B") => {
    const raw = deck === "A" ? urlA : urlB;
    const id = parseYouTubeId(raw.trim());
    if (!id) return;
    const update = { videoId: id, title: `Custom Video (${id})`, volume: 80 };
    deck === "A" ? (setDeckA(update), setUrlA("")) : (setDeckB(update), setUrlB(""));
  };

  const DeckPanel = ({
    deck, setDeck, url, setUrl, side,
  }: {
    deck: YTDeck;
    setDeck: (d: YTDeck) => void;
    url: string;
    setUrl: (v: string) => void;
    side: "A" | "B";
    vol: number;
  }) => {
    const grad = side === "A" ? "from-sky-400 to-blue-500" : "from-purple-400 to-indigo-500";
    const border = side === "A" ? "border-sky-200" : "border-purple-200";
    const accent = side === "A" ? "text-sky-600" : "text-purple-600";
    return (
      <div className={`rounded-2xl border ${border} bg-white overflow-hidden shadow-sm`}>
        <div className={`px-4 py-2 bg-gradient-to-r ${grad} flex items-center justify-between`}>
          <span className="text-xs font-bold text-white">Video Deck {side}</span>
          <span className="text-[10px] text-white/80 font-mono">{side === "A" ? aVol : bVol}% out</span>
        </div>
        {/* Embed */}
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            key={deck.videoId}
            src={`https://www.youtube.com/embed/${deck.videoId}?controls=1&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={deck.title}
          />
        </div>
        <div className={`px-4 py-1.5 border-b border-[#e8eef5] text-xs font-semibold ${accent} truncate`}>
          {deck.title}
        </div>
        {/* Presets */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-1.5">Quick Load</p>
          <div className="flex flex-wrap gap-1">
            {PRESET_VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => setDeck({ ...deck, videoId: v.id, title: v.title })}
                className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${
                  deck.videoId === v.id
                    ? `bg-gradient-to-r ${grad} text-white border-transparent`
                    : "border-[#cdd8e8] text-[#4a6580] hover:border-sky-300 hover:text-sky-700"
                }`}
              >
                {v.title.split("—")[0].trim()}
              </button>
            ))}
          </div>
        </div>
        {/* Custom URL */}
        <div className="px-4 py-3 space-y-2">
          <p className="text-[10px] font-semibold text-[#7a9abf] uppercase">Load YouTube URL / ID</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadUrl(side)}
                placeholder="youtube.com/watch?v=… or video ID"
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"
              />
            </div>
            <button
              onClick={() => loadUrl(side)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${grad} hover:opacity-90`}
            >
              Load
            </button>
          </div>
          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#7a9abf] flex-shrink-0" />
            <input
              type="range" min={0} max={100} value={deck.volume}
              onChange={(e) => setDeck({ ...deck, volume: Number(e.target.value) })}
              className="flex-1 h-1 accent-sky-500"
            />
            <span className="text-[10px] text-[#7a9abf] w-7 text-right">{deck.volume}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-[#e8eef5] flex items-center gap-2">
        <span className="w-4 h-4 text-xs font-bold text-red-500 flex-shrink-0">▶</span>
        <h3 className="text-sm font-bold text-[#1a2a3a]">YouTube Video Mixer</h3>
        <span className="text-[10px] text-[#7a9abf] ml-1">Mix music videos from YouTube across two virtual decks</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Info */}
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-700">
          <span className="w-4 h-4 text-xs font-bold text-red-500 flex-shrink-0 mt-0.5">▶</span>
          Paste any YouTube URL or pick a preset. Use the crossfader to blend between decks.
          Full MIDI hardware control of video mixing is available in the{" "}
          <a href="/download" className="underline font-semibold ml-0.5">desktop app →</a>
        </div>

        {/* Decks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DeckPanel deck={deckA} setDeck={setDeckA} url={urlA} setUrl={setUrlA} side="A" vol={aVol} />
          <DeckPanel deck={deckB} setDeck={setDeckB} url={urlB} setUrl={setUrlB} side="B" vol={bVol} />
        </div>

        {/* Crossfader */}
        <div className="bg-[#f0f4f8] rounded-2xl p-4 border border-[#cdd8e8]">
          <div className="flex justify-between text-xs font-bold mb-2">
            <span className="text-sky-600">DECK A</span>
            <div className="flex items-center gap-1.5 text-[#4a6580]">
              <Layers className="w-3.5 h-3.5 text-[#7a9abf]" />
              <span className="text-[10px]">{crossfade === 50 ? "Center" : crossfade < 50 ? `A +${(50 - crossfade) * 2}%` : `B +${(crossfade - 50) * 2}%`}</span>
            </div>
            <span className="text-purple-600">DECK B</span>
          </div>
          <input
            type="range" min={0} max={100} value={crossfade}
            onChange={(e) => setCrossfade(Number(e.target.value))}
            className="w-full h-2 accent-sky-500"
          />
          {/* Output meters */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[
              { label: "Deck A", vol: aVol, color: "bg-sky-400", text: "text-sky-500" },
              { label: "Deck B", vol: bVol, color: "bg-purple-400", text: "text-purple-500" },
            ].map(({ label, vol, color, text }) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] text-[#7a9abf] mb-1">
                  <span>{label} output</span><span className={`font-mono ${text}`}>{vol}%</span>
                </div>
                <div className="h-1.5 bg-[#e8eef5] rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${vol}%` }} />
                </div>
              </div>
            ))}
          </div>
          {/* Snap */}
          <div className="flex gap-2 justify-center mt-3">
            {[0, 25, 50, 75, 100].map((v) => (
              <button key={v} onClick={() => setCrossfade(v)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  crossfade === v ? "bg-sky-500 text-white" : "bg-white border border-[#cdd8e8] text-[#4a6580] hover:border-sky-300"
                }`}
              >
                {v === 0 ? "A" : v === 100 ? "B" : v}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop note */}
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
          <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span><strong>Desktop Client:</strong> Full MIDI hardware control, BPM sync, cue points, and loop points for YouTube video mixing are in the{" "}
            <a href="/download" className="underline font-semibold">Perceptual Flow desktop app →</a>
          </span>
        </div>
      </div>
    </div>
  );
}
