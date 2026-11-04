"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { formatDuration } from "@/lib/utils";
import type { Track } from "@/lib/types";
import {
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle,
  Volume2, Upload, Link2, Music, X, Radio, ExternalLink
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
function detectPlatform(url: string): Track["platform"] {
  if (/youtu\.?be/i.test(url)) return "youtube";
  if (/soundcloud\.com/i.test(url)) return "soundcloud";
  return "url";
}

function youtubeEmbedUrl(url: string): string {
  // handle youtu.be/ID and youtube.com/watch?v=ID and /embed/ID
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}?autoplay=1&enablejsapi=1`;
  const watch = url.match(/[?&]v=([^&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}?autoplay=1&enablejsapi=1`;
  const embed = url.match(/embed\/([^?&]+)/);
  if (embed) return `https://www.youtube.com/embed/${embed[1]}?autoplay=1&enablejsapi=1`;
  return url;
}

function soundcloudEmbedUrl(url: string): string {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2338bdf8&auto_play=true&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
}

// ── component ─────────────────────────────────────────────────────────────────
export function StreamPlayer() {
  const {
    currentTrack, setCurrentTrack, queue, setQueue,
    streamPlaying, setStreamPlaying,
    streamCurrentTime, setStreamCurrentTime,
    streamDuration, setStreamDuration,
  } = usePlatformStore();

  const [volume, setVolume]         = useState(80);
  const [crossfade, setCrossfadeVal] = useState(3);
  const [repeat, setRepeat]         = useState(false);
  const [shuffle, setShuffle]       = useState(false);
  const [urlInput, setUrlInput]     = useState("");
  const [urlError, setUrlError]     = useState("");
  const [dragging, setDragging]     = useState(false);
  const [embedTrack, setEmbedTrack] = useState<Track | null>(null);

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rafRef      = useRef<number>(0);

  const activeIdx = queue.findIndex(t => t.id === currentTrack?.id);
  const progress  = streamDuration > 0 ? (streamCurrentTime / streamDuration) * 100 : 0;

  // ── when currentTrack changes, load into audio or set embed ───────────────
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    setStreamCurrentTime(0);
    setStreamDuration(0);
    setUrlError("");

    const track = currentTrack;
    if (!track) { setStreamPlaying(false); setEmbedTrack(null); return; }

    const platform = track.platform ?? (track.src ? "file" : "mock");

    if (platform === "youtube" || platform === "soundcloud") {
      setEmbedTrack(track);
      setStreamPlaying(true); // embed handles its own playback
      return;
    }

    setEmbedTrack(null);
    const el = audioRef.current;
    if (!el) return;

    if (!track.src) {
      // mock track — no audio, just show metadata
      setStreamPlaying(false);
      return;
    }

    el.src = track.src;
    el.volume = volume / 100;
    el.load();
    el.onloadedmetadata = () => setStreamDuration(el.duration || 0);
    el.onerror = () => {
      setUrlError(`Cannot play "${track.title}" — format unsupported or URL blocked (CORS)`);
      setStreamPlaying(false);
    };
    el.play().then(() => {
      setStreamPlaying(true);
      const tick = () => {
        setStreamCurrentTime(el.currentTime);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }).catch(() => setStreamPlaying(false));

    return () => { cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // ── volume sync ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  // ── play / pause toggle ────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!currentTrack) return;

    if (currentTrack.platform === "youtube" || currentTrack.platform === "soundcloud") {
      // embeds handle play/pause internally — we can't control them via JS easily
      return;
    }

    if (!el || !currentTrack.src) return;

    if (el.paused) {
      el.play().then(() => {
        setStreamPlaying(true);
        const tick = () => {
          setStreamCurrentTime(el.currentTime);
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      }).catch(() => setStreamPlaying(false));
    } else {
      el.pause();
      setStreamPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  }, [currentTrack, setStreamPlaying, setStreamCurrentTime]);

  // ── navigation ─────────────────────────────────────────────────────────────
  const skipTo = useCallback((idx: number) => {
    const target = queue[Math.max(0, Math.min(queue.length - 1, idx))];
    if (target) setCurrentTrack(target);
  }, [queue, setCurrentTrack]);

  const next = useCallback(() => {
    if (!queue.length) return;
    const idx = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (activeIdx + 1) % queue.length;
    skipTo(idx);
  }, [queue, shuffle, activeIdx, skipTo]);

  const prev = useCallback(() => skipTo(activeIdx > 0 ? activeIdx - 1 : 0), [activeIdx, skipTo]);

  // ── seek ────────────────────────────────────────────────────────────────────
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !streamDuration) return;
    const r = e.currentTarget.getBoundingClientRect();
    const t = ((e.clientX - r.left) / r.width) * streamDuration;
    el.currentTime = t;
    setStreamCurrentTime(t);
  };

  // ── file upload ─────────────────────────────────────────────────────────────
  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newTracks: Track[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("audio/") && !f.type.startsWith("video/")) continue;
      newTracks.push({
        id: `upload-${Date.now()}-${f.name}`,
        title: f.name.replace(/\.[^.]+$/, ""),
        artist: "Uploaded",
        coverUrl: "",
        duration: 0,
        bpm: 0, energy: 0.5, valence: 0.5, danceability: 0.5, key: "C",
        src: URL.createObjectURL(f),
        platform: "file",
      });
    }
    if (!newTracks.length) return;
    setQueue([...queue, ...newTracks]);
    if (!currentTrack) setCurrentTrack(newTracks[0]);
  }, [queue, currentTrack, setQueue, setCurrentTrack]);

  // ── URL / stream import ─────────────────────────────────────────────────────
  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setUrlError("");
    const platform = detectPlatform(url);
    const title = url.split("/").pop()?.split("?")[0] ?? "Stream";

    let embedUrl: string | undefined;
    if (platform === "youtube") embedUrl = youtubeEmbedUrl(url);
    if (platform === "soundcloud") embedUrl = soundcloudEmbedUrl(url);

    const track: Track = {
      id: `stream-${Date.now()}`,
      title,
      artist: platform === "youtube" ? "YouTube" : platform === "soundcloud" ? "SoundCloud" : "Stream",
      coverUrl: "",
      duration: 0,
      bpm: 0, energy: 0.5, valence: 0.5, danceability: 0.5, key: "C",
      src: platform === "url" ? url : undefined,
      embedUrl,
      platform,
    };
    const updated = [...queue, track];
    setQueue(updated);
    if (!currentTrack) setCurrentTrack(track);
    setUrlInput("");
  };

  const removeTrack = (id: string) => {
    const next = queue.filter(t => t.id !== id);
    setQueue(next);
    if (currentTrack?.id === id) setCurrentTrack(next[0] ?? null);
  };

  const platformIcon = (p?: Track["platform"]) => {
    if (p === "youtube")     return <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 rounded">YT</span>;
    if (p === "soundcloud")  return <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1 rounded">SC</span>;
    if (p === "file")        return <span className="text-[9px] font-bold text-sky-500 bg-sky-50 px-1 rounded">FILE</span>;
    if (p === "url")         return <span className="text-[9px] font-bold text-purple-500 bg-purple-50 px-1 rounded">URL</span>;
    return <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1 rounded">MOCK</span>;
  };

  const isEmbed = embedTrack && (currentTrack?.platform === "youtube" || currentTrack?.platform === "soundcloud");
  const canDirectPlay = currentTrack?.src && !isEmbed;
  const isMock = currentTrack && !currentTrack.src && !currentTrack.embedUrl;

  return (
    <Card title="Universal Music Player" subtitle="Files · YouTube · SoundCloud · Direct URL · Any format">
      <audio
        ref={audioRef}
        onEnded={() => { if (repeat) audioRef.current?.play(); else next(); }}
      />

      <div className="p-4 space-y-4">

        {/* ── Import row ── */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed text-sm font-medium transition-all ${
              dragging ? "border-sky-400 bg-sky-50 text-sky-600" : "border-[#cdd8e8] text-[#7a9abf] hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50"
            }`}>
            <Upload className="w-4 h-4" /> Upload / Drop
          </button>
          <input ref={fileInputRef} type="file" multiple accept="audio/*,video/*" className="hidden"
            onChange={e => addFiles(e.target.files)} />

          <div className="flex flex-1 min-w-[240px] gap-1">
            <div className="relative flex-1">
              <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]" />
              <input
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addUrl()}
                placeholder="YouTube · SoundCloud · MP3 URL · Any stream…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400"
              />
            </div>
            <button onClick={addUrl}
              className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors">
              Add
            </button>
          </div>
        </div>

        {/* ── Platform hint pills ── */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "YouTube", hint: "youtube.com/watch?v=… or youtu.be/…", color: "text-red-500 bg-red-50 border-red-100" },
            { label: "SoundCloud", hint: "soundcloud.com/artist/track", color: "text-orange-500 bg-orange-50 border-orange-100" },
            { label: "Direct MP3/M4A/OGG/FLAC", hint: "Any direct audio URL", color: "text-sky-600 bg-sky-50 border-sky-100" },
            { label: "HLS Stream", hint: ".m3u8 live radio streams", color: "text-purple-600 bg-purple-50 border-purple-100" },
          ].map(p => (
            <span key={p.label} className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${p.color}`}>{p.label}</span>
          ))}
        </div>

        {urlError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{urlError}</p>}

        {/* ── Embed player (YouTube / SoundCloud) ── */}
        {isEmbed && embedTrack && (
          <div className="rounded-xl overflow-hidden border border-[#e8eef5]">
            {embedTrack.platform === "youtube" ? (
              <iframe
                src={embedTrack.embedUrl}
                className="w-full"
                style={{ height: 215 }}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={embedTrack.title}
              />
            ) : (
              <iframe
                src={embedTrack.embedUrl}
                className="w-full"
                style={{ height: 166 }}
                allow="autoplay"
                title={embedTrack.title}
              />
            )}
            <div className="px-3 py-2 bg-[#f0f4f8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {platformIcon(embedTrack.platform)}
                <span className="text-xs font-semibold text-[#1a2a3a] truncate max-w-[200px]">{embedTrack.title}</span>
              </div>
              <a href={embedTrack.src ?? ""} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-[#7a9abf] hover:text-sky-500">
                <ExternalLink className="w-3 h-3" /> Open
              </a>
            </div>
          </div>
        )}

        {/* ── Now playing (direct audio) ── */}
        {!isEmbed && currentTrack && (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#f0f4f8] border border-[#e8eef5]">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Music className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-[#1a2a3a] truncate">{currentTrack.title}</p>
                  {platformIcon(currentTrack.platform)}
                </div>
                <p className="text-xs text-[#7a9abf] truncate">{currentTrack.artist}</p>
              </div>
              {queue.length > 0 && (
                <span className="text-[10px] text-[#7a9abf] font-mono flex-shrink-0">
                  {activeIdx + 1}/{queue.length}
                </span>
              )}
            </div>

            {isMock && (
              <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                📋 This is a mock track with no audio source. Upload a file or paste a stream URL to hear audio.
              </p>
            )}

            {/* Progress bar */}
            {canDirectPlay && (
              <div>
                <div className="h-2 bg-[#e8eef5] rounded-full cursor-pointer overflow-hidden" onClick={seek}>
                  <div className="h-full bg-gradient-to-r from-sky-400 to-purple-500 rounded-full transition-none"
                    style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#7a9abf] mt-1">
                  <span>{formatDuration(Math.floor(streamCurrentTime))}</span>
                  <span>{formatDuration(Math.floor(streamDuration))}</span>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-xl transition-colors ${shuffle ? "text-sky-500 bg-sky-50" : "text-[#7a9abf] hover:bg-[#f0f4f8]"}`}>
                <Shuffle className="w-4 h-4" />
              </button>
              <button onClick={prev} className="p-2 rounded-xl text-[#4a6580] hover:bg-[#f0f4f8] transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                disabled={!!isMock || !!isEmbed}
                className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md transition-opacity ${
                  isMock || isEmbed
                    ? "bg-[#cdd8e8] cursor-not-allowed"
                    : "bg-gradient-to-br from-sky-400 to-blue-600 hover:opacity-90"
                }`}>
                {streamPlaying && canDirectPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={next} className="p-2 rounded-xl text-[#4a6580] hover:bg-[#f0f4f8] transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
              <button onClick={() => setRepeat(!repeat)}
                className={`p-2 rounded-xl transition-colors ${repeat ? "text-sky-500 bg-sky-50" : "text-[#7a9abf] hover:bg-[#f0f4f8]"}`}>
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Volume + Crossfade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#7a9abf] flex items-center gap-1 mb-1">
                  <Volume2 className="w-3 h-3" /> Volume {volume}%
                </label>
                <input type="range" min={0} max={100} value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-full h-1.5" style={{ accentColor: "#38bdf8" }} />
              </div>
              <div>
                <label className="text-[10px] text-[#7a9abf] mb-1 block">Auto-crossfade {crossfade}s</label>
                <input type="range" min={0} max={12} step={0.5} value={crossfade}
                  onChange={e => setCrossfadeVal(Number(e.target.value))}
                  className="w-full h-1.5" style={{ accentColor: "#38bdf8" }} />
              </div>
            </div>
          </>
        )}

        {/* ── Empty state ── */}
        {!currentTrack && (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-[#cdd8e8]">
            <Radio className="w-10 h-10" />
            <p className="text-sm text-[#7a9abf]">Nothing loaded yet</p>
            <p className="text-xs text-[#cdd8e8] text-center">
              Upload audio files, paste a YouTube/SoundCloud link,<br />
              or click Play on a playlist in the left panel
            </p>
          </div>
        )}

        {/* ── Queue list ── */}
        {queue.length > 0 && (
          <div className="border-t border-[#f0f4f8] pt-3 space-y-1 max-h-52 overflow-y-auto">
            <p className="text-[10px] font-semibold text-[#7a9abf] uppercase px-1 mb-2">
              Queue · {queue.length} tracks
            </p>
            {queue.map((t, i) => {
              const isActive = t.id === currentTrack?.id;
              return (
                <div key={t.id} onClick={() => setCurrentTrack(t)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all group ${
                    isActive ? "bg-sky-50 border border-sky-200" : "hover:bg-[#f0f4f8]"
                  }`}>
                  <span className={`text-[10px] font-mono w-4 flex-shrink-0 ${isActive ? "text-sky-500" : "text-[#cdd8e8]"}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-[#1a2a3a] truncate">{t.title}</p>
                      {platformIcon(t.platform)}
                    </div>
                    <p className="text-[10px] text-[#7a9abf] truncate">{t.artist}</p>
                  </div>
                  {isActive && streamPlaying && (
                    <div className="flex items-end gap-px h-4 w-4 flex-shrink-0">
                      {[0, 1, 2].map(j => (
                        <div key={j} className="flex-1 bg-sky-400 rounded-sm wave-bar"
                          style={{ animationDelay: `${j * 0.1}s` }} />
                      ))}
                    </div>
                  )}
                  <button onClick={e => { e.stopPropagation(); removeTrack(t.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-50 hover:text-rose-500 text-[#cdd8e8] transition-all flex-shrink-0">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </Card>
  );
}
