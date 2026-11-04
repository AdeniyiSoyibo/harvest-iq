"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";

// ── Security: validate file by magic bytes, not extension/MIME ──────────────
// Returns null if safe audio, or an error string if rejected.
async function validateAudioFile(file: File): Promise<string | null> {
  // Hard size cap: 500 MB
  if (file.size > 500 * 1024 * 1024) return "File too large (max 500 MB)";
  // Read first 12 bytes to check magic signature
  const header = await file.slice(0, 12).arrayBuffer();
  const b = new Uint8Array(header);
  const hex = (n: number) => b[n]?.toString(16).padStart(2, "0") ?? "";
  // Known audio magic bytes
  const isMP3  = b[0] === 0xFF && (b[1] & 0xE0) === 0xE0;          // MPEG sync
  const isID3  = b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33;  // ID3 tag (MP3)
  const isRIFF = hex(0)+hex(1)+hex(2)+hex(3) === "52494646";        // RIFF (WAV/AVI)
  const isWAVE = hex(8)+hex(9)+hex(10)+hex(11) === "57415645";      // WAVE chunk
  const isOGG  = hex(0)+hex(1)+hex(2)+hex(3) === "4f676753";        // OggS
  const isFLAC = hex(0)+hex(1)+hex(2)+hex(3) === "664c6143";        // fLaC
  const isAAC  = b[0] === 0xFF && (b[1] & 0xF0) === 0xF0;          // AAC ADTS
  const isM4A  = hex(4)+hex(5)+hex(6)+hex(7) === "66747970"         // ftyp (MP4/M4A/MP4V)
             || hex(0)+hex(1)+hex(2)+hex(3) === "00000018"           // MP4 variant
             || hex(0)+hex(1)+hex(2)+hex(3) === "00000020";          // MP4 variant 2
  const isAIFF = hex(0)+hex(1)+hex(2)+hex(3) === "464f524d";        // FORM (AIFF)
  const isWMA  = b[0]===0x30&&b[1]===0x26&&b[2]===0xB2&&b[3]===0x75; // ASF/WMA
  // Block known dangerous signatures: EXE, ZIP, PDF, ELF, Mach-O, MSI
  const isMZ   = b[0] === 0x4D && b[1] === 0x5A;                    // EXE/DLL
  const isELF  = b[0] === 0x7F && b[1] === 0x45;                    // Linux ELF
  const isPK   = b[0] === 0x50 && b[1] === 0x4B;                    // ZIP/JAR/DOCX
  const isPDF  = b[0] === 0x25 && b[1] === 0x50;                    // PDF
  const isMach = (b[0]===0xCE||b[0]===0xCF) && b[1]===0xFA;        // Mach-O
  if (isMZ || isELF || isPK || isPDF || isMach)
    return "Rejected: file appears to be an executable or archive, not audio";
  if (!isMP3 && !isID3 && !isOGG && !isFLAC && !isAAC && !isM4A && !isAIFF && !isWMA && !(isRIFF && isWAVE))
    return "Unrecognised audio format — supported: MP3, WAV, FLAC, OGG, AAC, M4A, MP4, AIFF, WMA";
  return null; // safe
}

export function WaveformPlayer() {
  const { currentBeat, isPlaying, setIsPlaying } = usePlatformStore();
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [bars, setBars] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayBars = bars.length ? bars : (currentBeat?.waveform ?? []);

  // Generate waveform bars from ArrayBuffer
  const buildWaveform = useCallback(async (buf: ArrayBuffer) => {
    try {
      const AudioCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
      const ctx = new AudioCtx(1, 44100, 44100);
      const decoded = await ctx.decodeAudioData(buf.slice(0));
      const raw = decoded.getChannelData(0);
      const N = 80;
      const step = Math.floor(raw.length / N);
      const result: number[] = [];
      for (let i = 0; i < N; i++) {
        let peak = 0;
        for (let j = 0; j < step; j++) peak = Math.max(peak, Math.abs(raw[i * step + j] ?? 0));
        result.push(peak);
      }
      setBars(result);
    } catch {
      // Fallback: random waveform so UI still renders
      setBars(Array.from({ length: 80 }, (_, i) => 0.3 + 0.5 * Math.abs(Math.sin(i * 0.4))));
    }
  }, []);

  // Handle file selection (from input or drag-drop)
  const handleFile = useCallback(async (file: File) => {
    setLoadError(null);
    const err = await validateAudioFile(file);
    if (err) { setLoadError(err); return; }
    if (audioURL) URL.revokeObjectURL(audioURL);
    const url = URL.createObjectURL(file);
    setAudioURL(url);
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    setBars([]);
    setCurrentTime(0);
    setDuration(0);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) buildWaveform(e.target.result);
    };
    reader.onerror = () => setBars(Array.from({ length: 80 }, (_, i) => 0.3 + 0.5 * Math.abs(Math.sin(i * 0.4))));
    reader.readAsArrayBuffer(file);
  }, [audioURL, buildWaveform]);

  // Wire audio element when URL changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioURL) return;
    el.src = audioURL;
    el.volume = volume / 100;
    el.load();
    const onMeta = () => setDuration(el.duration);
    el.addEventListener("loadedmetadata", onMeta);
    return () => el.removeEventListener("loadedmetadata", onMeta);
  }, [audioURL]); // eslint-disable-line

  // Tick — updates currentTime while playing
  const startTick = () => {
    const tick = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  // Direct play/pause — must be called from user gesture, not useEffect
  const togglePlay = () => {
    const el = audioRef.current;
    if (!el || !audioURL) return;
    if (el.paused) {
      el.play().then(() => { setIsPlaying(true); startTick(); }).catch(() => setIsPlaying(false));
    } else {
      el.pause();
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  };

  // Volume
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume / 100; }, [volume]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    const t = Math.max(0, Math.min(duration, ((e.clientX - r.left) / r.width) * duration));
    el.currentTime = t;
    setCurrentTime(t);
  };

  const dropProps = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); },
  };

  // Empty state
  if (!currentBeat && !audioURL) return (
    <Card>
      <div className="h-48 flex flex-col items-center justify-center gap-3" {...dropProps}>
        <div className={`w-full h-full flex flex-col items-center justify-center gap-3 rounded-xl transition-all ${dragging ? "bg-sky-50 border-2 border-dashed border-sky-400" : ""}`}>
          <Upload className="w-8 h-8 text-[#cdd8e8]" />
          <p className="text-sm text-[#7a9abf] font-medium">Drop an audio file here</p>
          <p className="text-xs text-[#cdd8e8]">or</p>
          <button onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition-colors shadow-sm">
            Browse files
          </button>
          <p className="text-[11px] text-[#cdd8e8]">MP3 · WAV · FLAC · OGG · AAC · M4A · MP4 · AIFF · WMA</p>
          {loadError && <p className="text-xs text-red-500 mt-1">{loadError}</p>}
        </div>
        <input ref={fileInputRef} type="file" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    </Card>
  );

  const title = fileName ?? currentBeat?.title ?? "";
  const meta = fileName ? `Uploaded · ${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}`
    : currentBeat ? `${currentBeat.bpm} BPM · ${currentBeat.key} · ${currentBeat.genre}` : "";

  return (
    <Card glow={isPlaying} title={title} subtitle={meta}>
      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setCurrentTime(0); }} />
      <div className="p-4 space-y-3">
        {/* Upload/replace row */}
        <div className="flex items-center gap-2" {...dropProps}>
          <button onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              dragging ? "border-sky-400 bg-sky-50 text-sky-600" : "border-[#cdd8e8] text-[#7a9abf] hover:border-sky-300 hover:text-sky-500"
            }`}>
            <Upload className="w-3 h-3" /> {fileName ? "Replace file" : "Upload audio"}
          </button>
          {fileName && <span className="text-[11px] text-[#7a9abf] truncate max-w-[180px]">{fileName}</span>}
          {loadError && <span className="text-[11px] text-red-500">{loadError}</span>}
          <input ref={fileInputRef} type="file" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>

        {/* Waveform */}
        <div className="flex items-end gap-px h-20 cursor-pointer select-none rounded-xl overflow-hidden bg-[#f0f4f8] px-2 py-1" onClick={seek}>
          {displayBars.length > 0 ? displayBars.map((v, i) => (
            <div key={i} className={`flex-1 rounded-sm transition-colors ${(i / displayBars.length) * 100 < progress ? "bg-sky-400" : "bg-[#cdd8e8]"}`}
              style={{ height: `${Math.max(8, v * 100)}%` }} />
          )) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[#cdd8e8]">
              {audioURL ? "Analysing waveform…" : "Click waveform to seek"}
            </div>
          )}
        </div>

        {/* Time */}
        <div className="flex justify-between text-xs text-[#7a9abf]">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(Math.floor(duration || currentBeat?.duration || 0))}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-[#7a9abf]" />
            <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-20 h-1" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; setCurrentTime(0); } }}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button variant="primary" size="md" className="w-11 h-11 rounded-full p-0"
              onClick={togglePlay}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { if (audioRef.current && duration) { audioRef.current.currentTime = duration - 0.1; setCurrentTime(duration); } }}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
          <div className="w-28" />
        </div>
      </div>
    </Card>
  );
}
