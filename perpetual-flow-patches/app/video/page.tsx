"use client";
import { useEffect } from "react";
import { usePlatformStore } from "@/lib/store";
import { MOCK_TRACKS, MOCK_VIDEO_PROJECT } from "@/lib/data";
import { VideoPreview } from "@/components/video/VideoPreview";
import { ClipBin } from "@/components/video/ClipBin";
import { Timeline } from "@/components/video/Timeline";
import { SyncPointsPanel } from "@/components/video/SyncPointsPanel";
import { Film } from "lucide-react";

export default function VideoPage() {
  const { setVideoProject, setCurrentTrack } = usePlatformStore();
  useEffect(() => { setCurrentTrack(MOCK_TRACKS[0]); setVideoProject(MOCK_VIDEO_PROJECT); }, [setVideoProject,setCurrentTrack]);

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6">
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">Video Editor</h1>
            <p className="text-xs text-[#7a9abf]">Audiovisual synchronization · Beat-aligned cuts · Timeline editing · Content creation</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><VideoPreview /></div>
        <ClipBin />
      </div>
      <Timeline />
      <SyncPointsPanel />
    </div>
  );
}
