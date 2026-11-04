"use client";

import { useEffect } from "react";
import { usePlatformStore } from "@/lib/store";
import { MOCK_TRACKS } from "@/lib/data";
import { DeckController } from "@/components/dj/DeckController";
import { CrossfaderModule } from "@/components/dj/CrossfaderModule";
import { TransitionPanel } from "@/components/dj/TransitionPanel";
import { FeatureVectorDisplay } from "@/components/dj/FeatureVectorDisplay";
import { HardwareSignalBoard } from "@/components/dj/HardwareSignalBoard";
import { SetBuilder } from "@/components/dj/SetBuilder";
import { YouTubeMixPanel } from "@/components/dj/YouTubeMixPanel";
import { Music2 } from "lucide-react";

export default function DJPage() {
  const { setDeckA, setDeckB } = usePlatformStore();

  useEffect(() => {
    setDeckA(MOCK_TRACKS[0]);
    setDeckB(MOCK_TRACKS[2]);
  }, [setDeckA, setDeckB]);

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6">
      {/* Header */}
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-sm">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">DJ Mode</h1>
            <p className="text-xs text-[#7a9abf]">9-dimensional feature vectors · genre-conditioned regression model · hardware MIDI signals &lt;500ms · YouTube video mixing</p>
          </div>
        </div>
      </div>

      {/* Audio decks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DeckController side="A" />
        <DeckController side="B" />
      </div>

      <CrossfaderModule />

      {/* Analysis row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TransitionPanel />
        <FeatureVectorDisplay />
        <HardwareSignalBoard />
      </div>

      <SetBuilder />

      {/* YouTube Video Mixing section */}
      <div className="gradient-header rounded-2xl px-5 py-3 border border-sky-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white text-xs font-bold">YT</span>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#1a2a3a]">YouTube Video Mixer</h2>
          <p className="text-[11px] text-[#7a9abf]">Mix music videos from YouTube across two virtual decks with crossfader control · paste any URL or video ID</p>
        </div>
      </div>
      <YouTubeMixPanel />
    </div>
  );
}
