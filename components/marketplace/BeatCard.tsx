"use client";

import type { MarketplaceBeat } from "@/lib/types";
import { formatDuration, formatNumber } from "@/lib/utils";
import { Play, Heart, ShoppingCart, Pause } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useState } from "react";

interface BeatCardProps {
  beat: MarketplaceBeat;
  view: "grid" | "list";
  onPurchase: () => void;
}

export function BeatCard({ beat, view, onPurchase }: BeatCardProps) {
  const [liked, setLiked] = useState(false);
  const [playing, setPlaying] = useState(false);

  const minPrice = Math.min(...beat.licenses.map((l) => l.price));

  if (view === "list") {
    return (
      <div className="flex items-center gap-4 bg-white border border-[#cdd8e8] rounded-xl px-4 py-3 hover:border-emerald-300 hover:shadow-sm transition-all">
        <button
          onClick={() => setPlaying(!playing)}
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
            playing ? "bg-emerald-500 text-white" : "bg-[#f0f4f8] hover:bg-emerald-500 hover:text-white text-[#7a9abf]"
          }`}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1a2a3a] truncate">{beat.title}</span>
            <Badge variant="sky">{beat.genre}</Badge>
          </div>
          <div className="text-xs text-[#7a9abf]">{beat.producer} · {beat.bpm} BPM · {beat.key}</div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-[#7a9abf] hidden sm:block">{formatNumber(beat.plays)} plays</span>
          <button
            onClick={() => setLiked(!liked)}
            className={`p-1 transition-colors ${liked ? "text-rose-500" : "text-[#cdd8e8] hover:text-rose-400"}`}
          >
            <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onPurchase}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />${minPrice.toFixed(2)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#cdd8e8] rounded-2xl overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all group">
      {/* Waveform header */}
      <div className="h-16 bg-gradient-to-br from-sky-50 to-emerald-50 px-3 flex items-end gap-px pb-2 pt-3 relative">
        {beat.waveform.slice(0, 40).map((amp, i) => (
          <div
            key={i}
            className="flex-1 bg-[#cdd8e8] group-hover:bg-emerald-300 transition-colors rounded-sm"
            style={{ height: `${Math.max(10, amp * 100)}%` }}
          />
        ))}
        <button
          onClick={() => setPlaying(!playing)}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md ${
            playing ? "bg-emerald-500" : "bg-white/90 hover:bg-emerald-500"
          } text-[#1a2a3a] hover:text-white`}
        >
          {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
      </div>

      <div className="p-3 space-y-2">
        <div>
          <div className="text-sm font-semibold text-[#1a2a3a] truncate">{beat.title}</div>
          <div className="text-xs text-[#7a9abf]">{beat.producer}</div>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <Badge variant="sky">{beat.genre}</Badge>
          <span className="text-[10px] text-[#7a9abf]">{beat.bpm} BPM · {beat.key}</span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#7a9abf]">
          <span>{formatNumber(beat.plays)} plays</span>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{formatNumber(beat.likes)}</span>
          </div>
          <span>{formatDuration(beat.duration)}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#f0f4f8]">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-1 transition-colors ${liked ? "text-rose-500" : "text-[#cdd8e8] hover:text-rose-400"}`}
          >
            <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={onPurchase}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />From ${minPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
