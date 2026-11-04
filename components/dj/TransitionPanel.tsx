"use client";

import { useState, useCallback } from "react";
import { usePlatformStore } from "@/lib/store";
import { computeTransitionScore, extractFeatureVector } from "@/lib/data";
import { Cpu, Zap, Clock, Music } from "lucide-react";

// Genre-conditioned weight descriptions surfaced to the UI
const GENRE_PROFILE: Record<string, { label: string; emphasis: string; color: string }> = {
  // Electronic / Club
  "Dm":  { label: "House / Techno / Baile Funk", emphasis: "BPM-dominant weighting",          color: "text-sky-500"    },
  "Am":  { label: "Trap / Hip-Hop / K-Trap",     emphasis: "Key-dominant weighting",           color: "text-purple-500" },
  "Gm":  { label: "Jungle / DnB / Reggae",       emphasis: "BPM + energy weighting",           color: "text-indigo-500" },
  "Cm":  { label: "Drill / Grime / K-Trap",      emphasis: "Energy-dominant weighting",        color: "text-rose-500"   },
  "Bbm": { label: "R&B / Soul / Dancehall",       emphasis: "Valence + danceability weighting", color: "text-pink-500"   },
  "E":   { label: "Afrobeats / Highlife / Samba", emphasis: "Danceability-dominant weighting",  color: "text-amber-500"  },
  "C":   { label: "Ambient / Lo-Fi",              emphasis: "Brightness + onset weighting",     color: "text-teal-500"   },
  "F#m": { label: "Lo-Fi / Nu-Jazz",              emphasis: "Spectral centroid weighting",      color: "text-lime-600"   },
  // Caribbean / Latin
  "Bb":  { label: "Dancehall / Bashment",         emphasis: "Danceability + groove weighting",  color: "text-yellow-500" },
  "D":   { label: "Soca / Power Soca",            emphasis: "Danceability-max weighting",       color: "text-orange-500" },
  "G":   { label: "Highlife / Bossa / Cumbia",    emphasis: "Melody-forward weighting",         color: "text-emerald-600"},
  "Ab":  { label: "Amapiano / K-R&B",             emphasis: "Groove + log-drum onset weighting",color: "text-green-600"  },
  "Fm":  { label: "Boom Bap Hip-Hop",             emphasis: "BPM + key integrity weighting",    color: "text-violet-500" },
  "F":   { label: "Bossa Nova / Dembow / Cumbia", emphasis: "Onset + spectral weighting",       color: "text-cyan-600"   },
  "default": { label: "Multi-genre",             emphasis: "Balanced 9-D weighting",           color: "text-[#4a6580]"  },
};

function scoreColor(s: number) {
  return s >= 80 ? "text-emerald-600" : s >= 60 ? "text-amber-500" : "text-rose-500";
}
function scoreBg(s: number) {
  return s >= 80 ? "bg-emerald-50 border-emerald-200 text-emerald-600"
       : s >= 60 ? "bg-amber-50 border-amber-200 text-amber-600"
       : "bg-rose-50 border-rose-200 text-rose-600";
}
function scoreLabel(s: number) {
  return s >= 80 ? "Excellent" : s >= 60 ? "Acceptable" : "Poor Mix";
}

export function TransitionPanel() {
  const { deckA, deckB, transitionScore, setTransitionScore } = usePlatformStore();
  const [computing, setComputing] = useState(false);

  const analyze = useCallback(async () => {
    if (!deckA || !deckB) return;
    setComputing(true);
    await new Promise((r) => setTimeout(r, 120));
    const result = computeTransitionScore(deckA, deckB);
    setTransitionScore({ ...result, trackAId: deckA.id, trackBId: deckB.id, signals: [] });
    setComputing(false);
  }, [deckA, deckB, setTransitionScore]);

  const ts = transitionScore;
  const profile = deckA ? (GENRE_PROFILE[deckA.key] ?? GENRE_PROFILE.default) : null;

  return (
    <div className="bg-white rounded-2xl border border-[#cdd8e8] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#e8eef5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-bold text-[#1a2a3a]">Transition Score</h3>
        </div>
        {ts && (
          <div className="flex items-center gap-1 text-xs text-[#7a9abf]">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{ts.computedMs + 120}ms</span>
            {(ts.computedMs + 120) < 500 && <span className="text-emerald-500 font-semibold">✓ &lt;500ms</span>}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Genre-conditioned model info */}
        {profile && deckA && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 text-xs">
            <Music className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#1a2a3a]">Genre model: </span>
              <span className={`font-semibold ${profile.color}`}>{profile.label}</span>
              <span className="text-[#7a9abf]"> · {profile.emphasis}</span>
              <span className="text-[#7a9abf]"> · Deck A key: </span>
              <span className="font-mono font-semibold text-[#1a2a3a]">{deckA.key}</span>
            </div>
          </div>
        )}

        {/* Analyze button */}
        <button
          onClick={analyze}
          disabled={!deckA || !deckB || computing}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Zap className="w-4 h-4" />
          {computing ? "Running regression model…" : "Run Genre-Conditioned Model"}
        </button>

        {ts ? (
          <div className="space-y-3">
            {/* Score */}
            <div className={`rounded-xl border p-4 text-center ${scoreBg(ts.score)}`}>
              <p className={`text-4xl font-extrabold font-mono ${scoreColor(ts.score)}`}>{ts.score}</p>
              <p className="text-xs mt-1 font-medium">{scoreLabel(ts.score)} transition</p>
            </div>

            {/* Confidence bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#7a9abf]">Model confidence</span>
                <span className="text-[#1a2a3a] font-semibold">{Math.round(ts.confidence * 100)}%</span>
              </div>
              <div className="h-2 bg-[#e8eef5] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${ts.confidence >= 0.8 ? "bg-emerald-400" : "bg-amber-400"}`}
                  style={{ width: `${ts.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* BPM delta */}
            {deckA && deckB && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#f0f4f8] rounded-xl p-2.5 text-center">
                  <p className="text-[#7a9abf]">BPM delta</p>
                  <p className="font-mono font-bold text-[#1a2a3a] mt-0.5">
                    {Math.abs(deckA.bpm - deckB.bpm)} BPM
                  </p>
                </div>
                <div className="bg-[#f0f4f8] rounded-xl p-2.5 text-center">
                  <p className="text-[#7a9abf]">Key compat.</p>
                  <p className="font-mono font-bold text-[#1a2a3a] mt-0.5">
                    {deckA.key} → {deckB.key}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-[#7a9abf] text-center py-4">
            Load tracks on both decks and run the model to generate a score.
          </p>
        )}
      </div>
    </div>
  );
}
