"use client";
import { usePlatformStore } from "@/lib/store";
import { MOCK_BEATS } from "@/lib/data";
import { formatDuration } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock, Upload, Music, Radio } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Beat, Track } from "@/lib/types";

export function BeatLibrary() {
  const { beats, currentBeat, setCurrentBeat, setBeats, addToQueue, setCurrentTrack } = usePlatformStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  const sendBeatToStreaming = (beat: Beat) => {
    const track: Track = {
      id: `beat-${beat.id}`,
      title: beat.title,
      artist: beat.genre,
      coverUrl: "",
      duration: beat.duration,
      bpm: beat.bpm,
      energy: 0.7, valence: 0.5, danceability: 0.7, key: beat.key,
      platform: "file",
      // If beat was uploaded with a file, create a blob URL
      src: (beat as Beat & { _file?: File })._file
        ? URL.createObjectURL((beat as Beat & { _file?: File })._file!)
        : undefined,
    };
    addToQueue([track]);
    setCurrentTrack(track);
    router.push("/streaming");
  };

  const addUploadedBeat = (file: File) => {
    if (!file.type.startsWith("audio/")) return;
    const newBeat: Beat = {
      id: `upload-${Date.now()}`,
      title: file.name.replace(/\.[^.]+$/, ""),
      genre: "Uploaded",
      bpm: 0,
      key: "—",
      mood: "—",
      duration: 0,
      waveform: Array.from({ length: 80 }, () => Math.random() * 0.8 + 0.2),
      stems: [],
      tags: ["uploaded"],
      price: null,
      _file: file,
    } as unknown as Beat;
    const updated = [newBeat, ...beats];
    setBeats(updated);
    setCurrentBeat(newBeat);
  };

  return (
    <Card title="Beat Library" subtitle={`${beats.length} beats`} className="h-full">
      <div className="p-4 space-y-2">
        {/* Upload area */}
        <button
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false);
            const f = e.dataTransfer.files[0]; if (f) addUploadedBeat(f);
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-all mb-1 ${
            dragging
              ? "border-sky-400 bg-sky-50 text-sky-600"
              : "border-[#cdd8e8] text-[#7a9abf] hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50"
          }`}
        >
          <Upload className="w-4 h-4" /> Upload your beat
        </button>
        <input ref={fileInputRef} type="file" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) addUploadedBeat(f); }} />

        {/* Beat list */}
        {beats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-[#cdd8e8] gap-2">
            <Music className="w-8 h-8" />
            <p className="text-xs">No beats yet — upload one above</p>
          </div>
        )}
        {beats.map((beat) => {
          const active = currentBeat?.id === beat.id;
          return (
            <div key={beat.id} onClick={() => setCurrentBeat(beat)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                active ? "bg-sky-50 border border-sky-200" : "hover:bg-[#f0f4f8]"
              }`}
            >
              <div className="flex items-end gap-px w-10 h-8 flex-shrink-0">
                {beat.waveform.slice(0, 16).map((v, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${active ? "bg-sky-400" : "bg-[#cdd8e8]"}`}
                    style={{ height: `${Math.max(15, v * 100)}%` }} />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a2a3a] truncate">{beat.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="sky">{beat.genre}</Badge>
                  {beat.bpm > 0 && <span className="text-[10px] text-[#7a9abf]">{beat.bpm} BPM · {beat.key}</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0 space-y-1">
                {beat.duration > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-[#7a9abf]">
                    <Clock className="w-3 h-3" />{formatDuration(beat.duration)}
                  </div>
                )}
                {beat.price && <p className="text-[10px] text-emerald-600 font-bold">${beat.price}</p>}
                <button
                  onClick={e => { e.stopPropagation(); sendBeatToStreaming(beat); }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 text-[9px] font-bold transition-colors">
                  <Radio className="w-2.5 h-2.5" /> Stream
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
