"use client";
import { useEffect } from "react";
import { usePlatformStore } from "@/lib/store";
import { MOCK_ARTISTS } from "@/lib/data";
import { DiscoveryDashboard } from "@/components/anr/DiscoveryDashboard";
import { ArtistProfile } from "@/components/anr/ArtistProfile";
import { MarketFitPanel } from "@/components/anr/MarketFitPanel";
import { TalentMatchPanel } from "@/components/anr/TalentMatchPanel";
import { Users } from "lucide-react";

export default function ANRPage() {
  const { setArtists } = usePlatformStore();
  useEffect(() => { setArtists(MOCK_ARTISTS); }, [setArtists]);

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6">
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center shadow-sm">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">A&R Mode</h1>
            <p className="text-xs text-[#7a9abf]">New Artist Discovery · Market-fit scoring · Talent matching · Portfolio hosting · 12 genres tracked</p>
          </div>
        </div>
      </div>
      <DiscoveryDashboard />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><ArtistProfile /></div>
        <div className="space-y-5"><MarketFitPanel /><TalentMatchPanel /></div>
      </div>
    </div>
  );
}
