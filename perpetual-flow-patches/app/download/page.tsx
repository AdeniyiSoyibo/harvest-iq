"use client";

import { useState } from "react";
import {
  Download, Shield, RefreshCw, Cpu, Lock, Zap,
  CheckCircle2, Monitor, Apple, Terminal, ChevronDown, ChevronUp, Globe,
} from "lucide-react";

const PLATFORMS = [
  { id: "win",   name: "Windows", icon: Monitor,  req: "Windows 10/11 (64-bit)",       ext: ".exe",      size: "87 MB",  grad: "from-sky-400 to-blue-600"    },
  { id: "mac",   name: "macOS",   icon: Apple,    req: "macOS 13 Ventura or later",     ext: ".dmg",      size: "94 MB",  grad: "from-slate-400 to-slate-700"  },
  { id: "linux", name: "Linux",   icon: Terminal, req: "Ubuntu 22.04 / Debian 12 / Arch", ext: ".AppImage", size: "79 MB",  grad: "from-orange-400 to-orange-600"},
];

const SECURITY = [
  { icon: RefreshCw, title: "Self-Learning Threat Engine",       color: "text-sky-500",    bg: "bg-sky-50 border-sky-200",     body: "Every session the client exchanges anonymised threat telemetry with a federated ML cluster. The on-device model continuously adapts its signatures to newly discovered attack vectors — no manual update required." },
  { icon: Shield,    title: "Zero-Trust Code Sandbox",           color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200", body: "All audio processing, plugin loading, and YouTube rendering runs in an isolated Chromium process with no host filesystem access beyond the user's project folder. Kernel-level syscall filtering blocks exploits before they can execute." },
  { icon: Lock,      title: "Immutable Core Binary",             color: "text-purple-500", bg: "bg-purple-50 border-purple-200", body: "The binary is signed with an Ed25519 key stored in HSM hardware. On every launch the full binary hash is verified against a pinned manifest — any tampering, including injected DLLs, triggers an immediate launch abort." },
  { icon: Cpu,       title: "On-Device ML Security Model",       color: "text-amber-500",  bg: "bg-amber-50 border-amber-200",  body: "A 5 MB ONNX model inspects all incoming plugin APIs, audio drivers, and network payloads in real time. Anomalous patterns trigger quarantine. The model self-improves via differential privacy-protected federated updates from every installation worldwide." },
  { icon: Globe,     title: "Encrypted Peer Telemetry Network",  color: "text-rose-500",   bg: "bg-rose-50 border-rose-200",    body: "Threat patterns found by any client are encrypted, anonymised, and shared across all installations within minutes via a gossip protocol — every user becomes part of a global collective defence system." },
  { icon: Zap,       title: "Auto-Healing Binary Patches",       color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200", body: "Critical security patches are applied in the background without interrupting your session. The patcher applies minimal binary diffs, verifies each with a Merkle proof, and rolls back automatically if verification fails." },
];

const FEATURES = [
  "Full MIDI hardware control of audio AND YouTube video decks",
  "Sub-10 ms YouTube playback via sandboxed Chromium engine",
  "Offline beat production — works without internet after activation",
  "Native VST3 / AU plugin host for third-party instruments",
  "Pioneer, Denon, Traktor, Serato DJ controller mapping",
  "GPU-accelerated stem separation (<30 s per track)",
  "Beat marketplace — buy, sell, license beats directly",
  "A&R label CRM sync — push artist data to label workflows",
  "32-bit / 96 kHz high-fidelity audio engine",
  "Multi-monitor video editor with hardware-accelerated preview",
  "Covers 20+ genres: Trap, House, Afrobeats, Drill, R&B, Lo-Fi, DnB, Jungle, Bossa, Ambient, Synthwave, Grime + more",
  "Self-learning algorithm that improves mix suggestions over time",
];

const FAQ = [
  { q: "Is the app free?", a: "Core app is free. Full DJ hardware MIDI mapping, stem separation, and unlimited video exports require Producer Pro ($19.99/mo) or higher." },
  { q: "How does self-learning security work without exposing my data?", a: "We use federated learning + differential privacy. Only heavily anonymised, encrypted gradient updates leave your device. No audio, project, or personal data is ever transmitted." },
  { q: "Can I use it offline?", a: "Yes — Production, DJ mode, and video editing work fully offline after initial activation. Streaming and A&R discovery require internet." },
  { q: "Does it work with my DJ controller?", a: "Yes — Pioneer CDJ/DJM, Denon SC/X, Native Instruments, and any generic MIDI device work out of the box. Custom mappings can be saved and shared." },
];

export default function DownloadPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6 p-5 lg:p-6 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="gradient-header rounded-2xl px-6 py-8 border border-sky-100 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg mx-auto mb-4">
          <Download className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#1a2a3a] mb-2">Perceptual Flow Desktop</h1>
        <p className="text-sm text-[#4a6580] max-w-xl mx-auto leading-relaxed">
          Unlimited production, hardware DJ control, YouTube video mixing, and an{" "}
          <strong>AI-powered self-learning security engine</strong> that automatically hardens
          itself against every new threat — impossible to corrupt.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-[#4a6580]">
          {["Free to download","No credit card required","Works offline","Self-hardening security"].map((t) => (
            <span key={t} className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{t}
            </span>
          ))}
        </div>
      </div>

      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLATFORMS.map(({ id, name, icon: Icon, req, ext, size, grad }) => (
          <div key={id} className="bg-white rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-2 bg-gradient-to-r ${grad}`} />
            <div className="p-5 flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-sm mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-[#1a2a3a]">{name}</h3>
              <p className="text-xs text-[#7a9abf] mt-0.5">{req}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#4a6580]">
                <span>v1.4.2</span><span>·</span><span>{size}</span><span>·</span><span className="font-mono">{ext}</span>
              </div>
              <a href={`#download-${id}`}
                className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${grad} flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm`}
              >
                <Download className="w-4 h-4" /> Download for {name}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#e8eef5] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1a2a3a]">Self-Learning, Unhackable Security</h2>
            <p className="text-xs text-[#7a9abf]">Six layers of adaptive AI-driven protection that improve with every installation worldwide</p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECURITY.map(({ icon: Icon, title, color, bg, body }) => (
            <div key={title} className={`rounded-xl border p-4 ${bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                <h3 className={`text-xs font-bold ${color}`}>{title}</h3>
              </div>
              <p className="text-xs text-[#4a6580] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#e8eef5]">
          <h2 className="text-sm font-bold text-[#1a2a3a]">What you get in the desktop app</h2>
          <p className="text-xs text-[#7a9abf]">Everything on the web platform, plus exclusive desktop-only capabilities</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-start gap-2.5 text-xs text-[#1a2a3a]">
              <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />{f}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-[#cdd8e8] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#e8eef5]">
          <h2 className="text-sm font-bold text-[#1a2a3a]">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-[#e8eef5]">
          {FAQ.map(({ q, a }, i) => (
            <div key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#f8fafc] transition-colors"
              >
                <span className="text-sm font-medium text-[#1a2a3a]">{q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#7a9abf]" /> : <ChevronDown className="w-4 h-4 text-[#7a9abf]" />}
              </button>
              {openFaq === i && <div className="px-6 pb-4"><p className="text-sm text-[#4a6580] leading-relaxed">{a}</p></div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="gradient-header rounded-2xl px-6 py-5 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#1a2a3a]">Ready to take full control?</p>
          <p className="text-xs text-[#4a6580]">Download free · Activate with your account · Hardware DJ control in minutes</p>
        </div>
        <a href="#download-win"
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-600 hover:opacity-90 shadow-sm"
        >
          <Download className="w-4 h-4" /> Download Now — Free
        </a>
      </div>
    </div>
  );
}
