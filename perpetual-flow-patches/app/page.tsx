"use client";
import { useEffect } from "react";
import { usePlatformStore } from "@/lib/store";
import { MOCK_BEATS } from "@/lib/data";
import { BeatLibrary } from "@/components/production/BeatLibrary";
import { WaveformPlayer } from "@/components/production/WaveformPlayer";
import { StemMixer } from "@/components/production/StemMixer";
import { MixAdvisor } from "@/components/production/MixAdvisor";
import { SoundSelector } from "@/components/production/SoundSelector";
import { Disc3 } from "lucide-react";

export default function ProductionPage() {
  const { setBeats, currentBeat } = usePlatformStore();
  useEffect(() => { setBeats(MOCK_BEATS); }, [setBeats]);

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6">
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-sm">
            <Disc3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">Production Studio</h1>
            <p className="text-xs text-[#7a9abf]">AI beat production · Sound selection · Stem mixing · Mix recommendations · 20+ genres</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <BeatLibrary />
        <div className="xl:col-span-2 space-y-5">
          <WaveformPlayer />
          {currentBeat && <StemMixer />}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SoundSelector />
        <MixAdvisor />
      </div>
    </div>
  );
}
