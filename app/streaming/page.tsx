"use client";
import { useEffect, useState, useRef } from "react";
import { usePlatformStore } from "@/lib/store";
import { MOCK_PLAYLISTS } from "@/lib/data";
import { StreamPlayer } from "@/components/streaming/StreamPlayer";
import { PlaylistPanel } from "@/components/streaming/PlaylistPanel";
import { FlowQueue } from "@/components/streaming/FlowQueue";
import { NowPlaying } from "@/components/streaming/NowPlaying";
import { Radio, Link2, Upload, Play } from "lucide-react";
import type { Track } from "@/lib/types";

function detectPlatform(url: string): Track["platform"] {
  if (/youtu\.?be/i.test(url)) return "youtube";
  if (/soundcloud\.com/i.test(url)) return "soundcloud";
  return "url";
}
function ytEmbed(url: string) {
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}?autoplay=1&enablejsapi=1`;
  const watch = url.match(/[?&]v=([^&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}?autoplay=1&enablejsapi=1`;
  return url;
}
function scEmbed(url: string) {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2338bdf8&auto_play=true&hide_related=false&show_comments=false`;
}

export default function StreamingPage() {
  const { setQueue, setPlaylists, queue, currentTrack, setCurrentTrack } = usePlatformStore();
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPlaylists(MOCK_PLAYLISTS);
    setQueue(MOCK_PLAYLISTS[0].tracks);
  }, [setQueue, setPlaylists]);

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setError("");
    const platform = detectPlatform(url);
    const title = url.split("/").pop()?.split("?")[0] ?? "Stream";
    const track: Track = {
      id: `stream-${Date.now()}`,
      title,
      artist: platform === "youtube" ? "YouTube" : platform === "soundcloud" ? "SoundCloud" : "Stream",
      coverUrl: "", duration: 0, bpm: 0, energy: 0.5, valence: 0.5, danceability: 0.5, key: "C",
      src: platform === "url" ? url : undefined,
      embedUrl: platform === "youtube" ? ytEmbed(url) : platform === "soundcloud" ? scEmbed(url) : undefined,
      platform,
    };
    setQueue([...queue, track]);
    setCurrentTrack(track);
    setUrlInput("");
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const tracks: Track[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("audio/") && !f.type.startsWith("video/")) continue;
      tracks.push({
        id: `upload-${Date.now()}-${f.name}`,
        title: f.name.replace(/\.[^.]+$/, ""),
        artist: "Uploaded",
        coverUrl: "", duration: 0, bpm: 0, energy: 0.5, valence: 0.5, danceability: 0.5, key: "C",
        src: URL.createObjectURL(f), platform: "file",
      });
    }
    if (!tracks.length) return;
    setQueue([...queue, ...tracks]);
    if (!currentTrack) setCurrentTrack(tracks[0]);
  };

  return (
    <div className="flex flex-col gap-5 p-5 lg:p-6">

      {/* Header */}
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shadow-sm">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1a2a3a]">Streaming</h1>
            <p className="text-xs text-[#7a9abf]">
              YouTube · SoundCloud · Spotify · Apple Music · MP3 · Any platform — paste a link to play
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick-play hero ── */}
      <div className="bg-white rounded-2xl border border-[#cdd8e8] shadow-sm p-4 space-y-3">
        <p className="text-sm font-bold text-[#1a2a3a]">Play anything — paste a link or upload a file</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a9abf]" />
            <input
              value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && addUrl()}
              placeholder="Paste YouTube, SoundCloud, MP3 URL, or any stream link…"
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"
            />
          </div>
          <button onClick={addUrl}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold transition-colors">
            <Play className="w-4 h-4" /> Play
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-dashed border-[#cdd8e8] hover:border-sky-400 text-[#7a9abf] hover:text-sky-600 text-sm font-semibold transition-colors">
            <Upload className="w-4 h-4" /> Upload
          </button>
          <input ref={fileRef} type="file" multiple accept="audio/*,video/*" className="hidden"
            onChange={e => addFiles(e.target.files)} />
        </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "YouTube", color: "text-red-500 bg-red-50 border-red-100" },
            { label: "SoundCloud", color: "text-orange-500 bg-orange-50 border-orange-100" },
            { label: "Direct MP3 / FLAC / WAV", color: "text-sky-600 bg-sky-50 border-sky-100" },
            { label: "HLS Stream (.m3u8)", color: "text-purple-600 bg-purple-50 border-purple-100" },
            { label: "Upload from device", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          ].map(p => (
            <span key={p.label} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.color}`}>{p.label}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <PlaylistPanel />
        <div className="xl:col-span-2 space-y-5">
          <NowPlaying />
          <StreamPlayer />
          <FlowQueue />
        </div>
      </div>
    </div>
  );
}
