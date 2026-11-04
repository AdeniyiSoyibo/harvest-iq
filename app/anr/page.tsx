"use client";

import { useState } from "react";
import {
  Users, Star, TrendingUp, Globe, Music, Play, ExternalLink,
  Send, CheckCircle, Lock, ChevronDown, ChevronUp, Zap, Award,
  BarChart2, Plus, Search, Filter, Radio
} from "lucide-react";
import { useUser } from "@/lib/userContext";
import { usePlatformStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import type { Track } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Artist {
  id: string; name: string; role: string; genre: string[]; subgenre: string;
  location: string; monthlyListeners: number; growthRate: number;
  marketFitScore: number; bio: string; avatarInitials: string; avatarColor: string;
  tracks: { title: string; plays: number; }[];
  socialLinks: Record<string, string>;
  labelInterest: string[];
  connectFee: number; // USD — what labels pay Perpetual Flow to unlock contact
  tier: "emerging" | "rising" | "established";
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ARTISTS: Artist[] = [
  {
    id:"a1", name:"Nova Reign", role:"Producer / Songwriter", avatarInitials:"NR", avatarColor:"#38bdf8",
    genre:["Hip-Hop","Trap"], subgenre:"Dark Trap", location:"Atlanta, GA",
    monthlyListeners:42000, growthRate:38, marketFitScore:91,
    bio:"Multi-genre producer with a signature dark atmospheric sound. 3 placements on major label projects in 2026.",
    tracks:[{title:"Phantom Grid",plays:128000},{title:"Cold Nights",plays:94000},{title:"Gravity Pull",plays:71000}],
    socialLinks:{spotify:"#",instagram:"#",soundcloud:"#"},
    labelInterest:["Interscope","Republic","300 Ent."], connectFee:299, tier:"rising",
  },
  {
    id:"a2", name:"Zara Haze", role:"Singer / Songwriter", avatarInitials:"ZH", avatarColor:"#a78bfa",
    genre:["R&B","Soul"], subgenre:"Alt R&B", location:"London, UK",
    monthlyListeners:87000, growthRate:22, marketFitScore:88,
    bio:"Cinematic R&B vocals with neo-soul production sensibility. Featured on 2 Spotify editorial playlists.",
    tracks:[{title:"Velvet Frequency",plays:310000},{title:"Amber Haze",plays:198000},{title:"Slow Motion",plays:145000}],
    socialLinks:{spotify:"#",apple:"#",tiktok:"#"},
    labelInterest:["Def Jam","Warner Music","Epic"], connectFee:499, tier:"established",
  },
  {
    id:"a3", name:"Kira Vault", role:"Producer / DJ", avatarInitials:"KV", avatarColor:"#34d399",
    genre:["House","Electronic"], subgenre:"Melodic House", location:"Berlin, DE",
    monthlyListeners:31000, growthRate:55, marketFitScore:85,
    bio:"Upcoming Berlin-based producer with a unique blend of melodic house and ambient techno elements.",
    tracks:[{title:"Neon Cathedral",plays:88000},{title:"Orbital Zen",plays:52000},{title:"Glass Road",plays:39000}],
    socialLinks:{soundcloud:"#",beatport:"#",instagram:"#"},
    labelInterest:["Toolroom","Armada","Defected"], connectFee:199, tier:"rising",
  },
  {
    id:"a4", name:"Axiom", role:"Producer", avatarInitials:"AX", avatarColor:"#f472b6",
    genre:["DnB","Bass Music"], subgenre:"Liquid DnB", location:"Bristol, UK",
    monthlyListeners:19000, growthRate:72, marketFitScore:79,
    bio:"Up-and-coming liquid drum and bass producer with razor-sharp mixing skills and cinematic sound design.",
    tracks:[{title:"Liquid Static",plays:44000},{title:"Zero Gravity",plays:28000},{title:"Refraction",plays:21000}],
    socialLinks:{soundcloud:"#",youtube:"#"},
    labelInterest:["Hospital Records","Metalheadz"], connectFee:149, tier:"emerging",
  },
  {
    id:"a5", name:"Afro.V", role:"Producer / Songwriter", avatarInitials:"AV", avatarColor:"#fb923c",
    genre:["Afrobeats","Dancehall"], subgenre:"Afro-Fusion", location:"Lagos, NG",
    monthlyListeners:134000, growthRate:18, marketFitScore:94,
    bio:"One of the most streamed Afrobeats producers of the last 12 months with cross-genre collaborations reaching global markets.",
    tracks:[{title:"Lagos Motion",plays:520000},{title:"Street Oracle",plays:340000},{title:"Sunrise Riddim",plays:290000}],
    socialLinks:{spotify:"#",apple:"#",instagram:"#",youtube:"#"},
    labelInterest:["Columbia","Sony Afrobeats","Empire"], connectFee:599, tier:"established",
  },
  {
    id:"a6", name:"Demi Nox", role:"Singer / Songwriter", avatarInitials:"DN", avatarColor:"#facc15",
    genre:["Pop","R&B"], subgenre:"Dark Pop", location:"Los Angeles, CA",
    monthlyListeners:58000, growthRate:44, marketFitScore:87,
    bio:"Dark pop songwriter blending cinematic production with confessional lyricism. Viral TikTok moments in Q3 2026.",
    tracks:[{title:"Velvet Frequency",plays:220000},{title:"Echo Chamber",plays:175000},{title:"The Last Goodbye",plays:132000}],
    socialLinks:{tiktok:"#",spotify:"#",instagram:"#"},
    labelInterest:["Atlantic","Island Records"], connectFee:349, tier:"rising",
  },
];

const GENRES = ["All","Hip-Hop","R&B","House","DnB","Afrobeats","Pop","Electronic","Soul"];
const TIERS = ["All","emerging","rising","established"];

function fmt(n: number) {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n/1000).toFixed(0)}K`;
  return `${n}`;
}

function ScoreBar({ value, color = "bg-sky-400" }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#e8eef5] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width:`${value}%` }} />
      </div>
      <span className="text-xs font-bold text-[#1a2a3a] w-8 text-right">{value}</span>
    </div>
  );
}

function TierBadge({ tier }: { tier: Artist["tier"] }) {
  const map = {
    emerging:   "bg-sky-100 text-sky-700",
    rising:     "bg-purple-100 text-purple-700",
    established:"bg-green-100 text-green-700",
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${map[tier]}`}>{tier}</span>;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ANRPage() {
  const { hasAccess } = useUser();
  const isPro = hasAccess("anr_enterprise");
  const { addToQueue, setCurrentTrack } = usePlatformStore();
  const router = useRouter();

  const [selected, setSelected] = useState<Artist | null>(ARTISTS[0]);
  const [genre, setGenre]       = useState("All");
  const [tierF, setTierF]       = useState("All");
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState<"marketFit"|"listeners"|"growth">("marketFit");
  const [contacted, setContacted] = useState<string[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);

  const filtered = ARTISTS
    .filter(a =>
      (genre === "All" || a.genre.includes(genre)) &&
      (tierF === "All" || a.tier === tierF) &&
      (search === "" || a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.genre.join(" ").toLowerCase().includes(search.toLowerCase()) ||
        a.location.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortBy === "listeners" ? b.monthlyListeners - a.monthlyListeners :
      sortBy === "growth"    ? b.growthRate - a.growthRate :
                               b.marketFitScore - a.marketFitScore
    );

  const handleConnect = (artist: Artist) => {
    setConnecting(artist.id);
    setTimeout(() => {
      setContacted(c => [...c, artist.id]);
      setConnecting(null);
    }, 1400);
  };

  const totalRevenue = contacted.length * 299; // simplified avg

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 bg-[#f0f4f8] min-h-screen">

      {/* Header */}
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#1a2a3a]">A&R Discovery</h1>
            <p className="text-xs text-[#7a9abf]">Discover emerging songwriters & producers · Connect with top talent · Labels pay to unlock contact — Perpetual Flow earns on every connection</p>
          </div>
          {/* Revenue tracker */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex-shrink-0">
            <Zap className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-[10px] text-green-600 font-semibold">Platform Revenue</div>
              <div className="text-sm font-bold text-green-700">${totalRevenue.toLocaleString()} earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon:Users,    label:"Talent Roster",    value:`${ARTISTS.length}`,  sub:"active profiles"     },
          { icon:TrendingUp,label:"Avg Growth",      value:`+${Math.round(ARTISTS.reduce((s,a)=>s+a.growthRate,0)/ARTISTS.length)}%`, sub:"month over month" },
          { icon:Star,     label:"Top Market Fit",   value:`${Math.max(...ARTISTS.map(a=>a.marketFitScore))}`, sub:"score out of 100" },
          { icon:Award,    label:"Connections Made", value:`${contacted.length}`, sub:"label introductions" },
        ].map(({ icon:Icon, label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-[#cdd8e8] bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-sky-500" />
              <span className="text-[10px] text-[#7a9abf] font-semibold uppercase">{label}</span>
            </div>
            <div className="text-xl font-bold text-[#1a2a3a]">{value}</div>
            <div className="text-[10px] text-[#7a9abf]">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ── ROSTER PANEL ──────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {/* Search + filter */}
          <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm p-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search artists, genre, city…"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-sky-400" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {GENRES.map(g => (
                <button key={g} onClick={() => setGenre(g)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${genre===g?"bg-sky-500 text-white border-transparent":"bg-[#f0f4f8] border-[#cdd8e8] text-[#4a6580] hover:border-sky-400"}`}>
                  {g}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="text-[10px] text-[#7a9abf] font-semibold self-center">Tier:</span>
              {TIERS.map(t => (
                <button key={t} onClick={() => setTierF(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors capitalize ${tierF===t?"bg-rose-500 text-white border-transparent":"bg-[#f0f4f8] border-[#cdd8e8] text-[#4a6580] hover:border-rose-400"}`}>
                  {t}
                </button>
              ))}
              <span className="text-[10px] text-[#7a9abf] font-semibold self-center ml-2">Sort:</span>
              {([["marketFit","Fit"],["listeners","🎧"],["growth","📈"]] as const).map(([k,l]) => (
                <button key={k} onClick={() => setSortBy(k)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${sortBy===k?"bg-purple-500 text-white border-transparent":"bg-[#f0f4f8] border-[#cdd8e8] text-[#4a6580] hover:border-purple-400"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Artist cards */}
          <div className="space-y-2">
            {filtered.length === 0 && <p className="text-xs text-[#7a9abf] text-center py-4">No artists match filters.</p>}
            {filtered.map(a => (
              <button key={a.id} onClick={() => setSelected(a)}
                className={`w-full text-left rounded-2xl border shadow-sm p-3 transition-all ${selected?.id===a.id?"border-sky-400 bg-sky-50":"border-[#cdd8e8] bg-white hover:border-sky-300"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: a.avatarColor }}>
                    {a.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-[#1a2a3a]">{a.name}</span>
                      <TierBadge tier={a.tier} />
                      {contacted.includes(a.id) && <span className="text-[10px] text-green-600 font-bold">● Connected</span>}
                    </div>
                    <div className="text-[10px] text-[#7a9abf]">{a.role} · {a.location}</div>
                    <div className="text-[10px] text-[#4a6580]">{a.genre.join(", ")} · {fmt(a.monthlyListeners)} listeners</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-bold text-[#1a2a3a]">{a.marketFitScore}</div>
                    <div className="text-[9px] text-[#7a9abf]">fit score</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── ARTIST PROFILE ────────────────────────────────────────────────── */}
        {selected ? (
          <div className="xl:col-span-2 space-y-3">
            {/* Profile card */}
            <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-rose-400 to-orange-400" />
              <div className="px-5 pb-4 -mt-8">
                <div className="flex items-end gap-4">
                  <div className="w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center text-xl font-bold text-white shadow-sm flex-shrink-0"
                    style={{ background: selected.avatarColor }}>
                    {selected.avatarInitials}
                  </div>
                  <div className="flex-1 pt-8 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-[#1a2a3a]">{selected.name}</h2>
                      <TierBadge tier={selected.tier} />
                    </div>
                    <p className="text-xs text-[#7a9abf]">{selected.role} · {selected.location}</p>
                    <p className="text-[11px] text-[#4a6580] mt-1">{selected.genre.join(", ")} · {selected.subgenre}</p>
                  </div>
                </div>
                <p className="text-xs text-[#4a6580] mt-3 leading-relaxed">{selected.bio}</p>

                {/* Social + label interest */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.keys(selected.socialLinks).map(s => (
                    <a key={s} href={selected.socialLinks[s]}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f0f4f8] border border-[#e8eef5] text-[10px] font-semibold text-[#4a6580] hover:border-sky-400 hover:bg-sky-50 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      {s.charAt(0).toUpperCase()+s.slice(1)}
                    </a>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-[#7a9abf] font-semibold self-center">Label interest:</span>
                  {selected.labelInterest.map(l => (
                    <span key={l} className="text-[10px] bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-semibold">{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats + tracks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Stats */}
              <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm p-4 space-y-3">
                <p className="text-xs font-bold text-[#1a2a3a]">Platform Metrics</p>
                {[
                  { l:"Monthly Listeners", v:fmt(selected.monthlyListeners), bar: Math.min(100, selected.monthlyListeners/1500), color:"bg-sky-400" },
                  { l:"Growth Rate",       v:`+${selected.growthRate}% MoM`,  bar: Math.min(100, selected.growthRate*1.3),        color:"bg-green-400" },
                  { l:"Market Fit Score",  v:`${selected.marketFitScore}/100`, bar: selected.marketFitScore,                       color:"bg-rose-400"  },
                ].map(({ l, v, bar, color }) => (
                  <div key={l}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#7a9abf] font-semibold">{l}</span>
                      <span className="font-bold text-[#1a2a3a]">{v}</span>
                    </div>
                    <ScoreBar value={Math.round(bar)} color={color} />
                  </div>
                ))}
              </div>

              {/* Top tracks */}
              <div className="rounded-2xl border border-[#cdd8e8] bg-white shadow-sm p-4 space-y-2">
                <p className="text-xs font-bold text-[#1a2a3a]">Top Tracks</p>
                {selected.tracks.map((t, i) => {
                  const streamTrack: Track = {
                    id: `anr-${selected.id}-${i}`,
                    title: t.title,
                    artist: selected.name,
                    coverUrl: "",
                    duration: 0,
                    bpm: 0, energy: 0.5, valence: 0.5, danceability: 0.5, key: "C",
                    platform: "mock",
                  };
                  return (
                    <div key={t.title} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f4f8] border border-[#e8eef5]">
                      <span className="text-[10px] font-bold text-[#7a9abf] w-4">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1a2a3a] truncate">{t.title}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <Play className="w-3 h-3 text-[#7a9abf]" />
                          <span className="text-[10px] font-mono text-[#7a9abf]">{fmt(t.plays)}</span>
                        </div>
                        <button
                          onClick={() => { addToQueue([streamTrack]); setCurrentTrack(streamTrack); router.push("/streaming"); }}
                          title="Send to Streaming"
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 text-[9px] font-bold transition-colors">
                          <Radio className="w-2.5 h-2.5" /> Stream
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connect CTA — monetisation */}
            <div className={`rounded-2xl border shadow-sm p-4 ${contacted.includes(selected.id) ? "border-green-300 bg-green-50" : "border-rose-200 bg-rose-50"}`}>
              {contacted.includes(selected.id) ? (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-700">Connection Initiated</p>
                    <p className="text-xs text-green-600 mt-0.5">Introduction sent to {selected.name}. Perpetual Flow earned <strong>${selected.connectFee}</strong> on this connection.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1a2a3a]">Connect with {selected.name}</p>
                    <p className="text-xs text-[#4a6580] mt-0.5">
                      Unlock contact details, booking info, and direct introduction. Perpetual Flow earns <strong className="text-rose-600">${selected.connectFee}</strong> per connection.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["Contact Info","Direct Intro","Booking Terms","Exclusivity Window"].map(f => (
                        <span key={f} className="text-[10px] bg-white border border-rose-200 text-rose-700 px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => handleConnect(selected)}
                    disabled={connecting === selected.id}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold text-sm transition-colors flex-shrink-0 shadow-sm">
                    {connecting === selected.id ? (
                      <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Connecting…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Connect — ${selected.connectFee}</>
                    )}
                  </button>
                </div>
              )}
              {!isPro && !contacted.includes(selected.id) && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-sky-700 bg-sky-50 border border-sky-200 rounded-xl px-3 py-1.5">
                  <Zap className="w-3.5 h-3.5 flex-shrink-0" />
                  Enterprise plan unlocks full contact details &amp; booking info. Connect is free in test mode.
                </div>
              )}
            </div>

            {/* Pro promo modal */}
            {showPromo && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-amber-800">Upgrade to A&R Enterprise</p>
                  <button onClick={() => setShowPromo(false)} className="text-amber-600 hover:text-amber-800 text-lg leading-none">×</button>
                </div>
                <p className="text-xs text-amber-700">Unlock unlimited artist connections, direct introductions, booking negotiation, and Perpetual Flow revenue sharing.</p>
                <div className="flex gap-2 flex-wrap">
                  {["Unlimited connections","Direct contact unlock","Label intro emails","Revenue share 70/30","Priority talent alerts"].map(f => (
                    <span key={f} className="text-[10px] bg-white border border-amber-300 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{f}</span>
                  ))}
                </div>
                <a href="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors mt-1">
                  <Zap className="w-3.5 h-3.5" /> View Enterprise Plan →
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="xl:col-span-2 flex items-center justify-center rounded-2xl border border-dashed border-[#cdd8e8] bg-white h-64">
            <p className="text-sm text-[#7a9abf]">Select an artist to view their profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
