"use client";

import { useState, useMemo } from "react";
import { MARKETPLACE_BEATS } from "@/lib/marketplaceData";
import { BeatCard } from "@/components/marketplace/BeatCard";
import { PurchaseModal } from "@/components/marketplace/PurchaseModal";
import { SellerDashboard } from "@/components/marketplace/SellerDashboard";
import type { MarketplaceBeat } from "@/lib/types";
import {
  Store, Search, LayoutGrid, List, TrendingUp,
  Music2, DollarSign, Upload, Filter, SlidersHorizontal,
} from "lucide-react";

const GENRES = ["All", "Trap", "Hip-Hop", "R&B", "House", "DnB", "Lo-Fi", "Afrobeats", "Ambient"];
const MOODS  = ["All", "Dark", "Chill", "Energetic", "Smooth", "Hard", "Peaceful", "Uplifting", "Intense"];
const SORT_OPTIONS = [
  { value: "trending",  label: "Trending"    },
  { value: "newest",    label: "Newest"      },
  { value: "price_asc", label: "Price: Low"  },
  { value: "price_hi",  label: "Price: High" },
  { value: "plays",     label: "Most Played" },
];

const STATS = [
  { icon: Music2,      label: "Beats Available",   value: `${MARKETPLACE_BEATS.length}`,   sub: "across all genres"     },
  { icon: TrendingUp,  label: "Total Plays",        value: "134K+",                          sub: "this month"            },
  { icon: DollarSign,  label: "Platform Revenue",   value: "$47,200",                        sub: "15% commission model"  },
  { icon: Upload,      label: "Active Sellers",     value: "284",                            sub: "producers worldwide"   },
];

type PageView = "browse" | "sell";

export default function MarketplacePage() {
  const [view, setView]             = useState<PageView>("browse");
  const [layout, setLayout]         = useState<"grid" | "list">("grid");
  const [query, setQuery]           = useState("");
  const [genre, setGenre]           = useState("All");
  const [mood, setMood]             = useState("All");
  const [sort, setSort]             = useState("trending");
  const [showFilters, setShowFilters] = useState(false);
  const [purchasing, setPurchasing] = useState<MarketplaceBeat | null>(null);

  const filtered = useMemo(() => {
    let results = MARKETPLACE_BEATS.filter((b) => {
      const matchQ  = !query || b.title.toLowerCase().includes(query.toLowerCase()) ||
                      b.producer.toLowerCase().includes(query.toLowerCase()) ||
                      b.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
      const matchG  = genre === "All" || b.genre === genre;
      const matchM  = mood === "All"  || b.mood === mood;
      return matchQ && matchG && matchM;
    });
    switch (sort) {
      case "newest":    results = [...results].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case "price_asc": results = [...results].sort((a, b) => Math.min(...a.licenses.map(l=>l.price)) - Math.min(...b.licenses.map(l=>l.price))); break;
      case "price_hi":  results = [...results].sort((a, b) => Math.min(...b.licenses.map(l=>l.price)) - Math.min(...a.licenses.map(l=>l.price))); break;
      case "plays":     results = [...results].sort((a, b) => b.plays - a.plays); break;
      default:          results = [...results].sort((a, b) => b.likes - a.likes); break;
    }
    return results;
  }, [query, genre, mood, sort]);

  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6 min-h-screen">

      {/* ── Header ── */}
      <div className="gradient-header rounded-2xl px-5 py-4 border border-sky-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#1a2a3a]">Beat Marketplace</h1>
            <p className="text-xs text-[#7a9abf]">
              Professional beat licensing · 3 tiers · Instant download · Film · TV · Ads · Labels · Artists
            </p>
          </div>
          {/* Page tabs */}
          <div className="flex gap-1 bg-white rounded-xl border border-[#cdd8e8] p-1">
            <button onClick={() => setView("browse")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${view === "browse" ? "bg-emerald-500 text-white" : "text-[#4a6580] hover:text-[#1a2a3a]"}`}>
              Browse Beats
            </button>
            <button onClick={() => setView("sell")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${view === "sell" ? "bg-emerald-500 text-white" : "text-[#4a6580] hover:text-[#1a2a3a]"}`}>
              Sell Beats
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#cdd8e8] px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] text-[#7a9abf] font-semibold uppercase">{label}</span>
            </div>
            <div className="text-xl font-bold text-[#1a2a3a]">{value}</div>
            <div className="text-[10px] text-[#7a9abf]">{sub}</div>
          </div>
        ))}
      </div>

      {view === "sell" ? (
        <SellerDashboard />
      ) : (
        <>
          {/* ── Search + Controls ── */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a9abf]" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search beats, producers, tags…"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#cdd8e8] bg-[#f0f4f8] text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none bg-white border border-[#cdd8e8] rounded-xl px-3 py-2 text-xs text-[#1a2a3a] focus:outline-none focus:border-emerald-400 cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${showFilters ? "bg-emerald-500 text-white border-transparent" : "bg-white border-[#cdd8e8] text-[#4a6580] hover:border-emerald-400"}`}>
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>

            {/* Layout toggle */}
            <div className="flex gap-1 bg-white border border-[#cdd8e8] rounded-xl p-1">
              <button onClick={() => setLayout("grid")}
                className={`p-1.5 rounded-lg transition-colors ${layout === "grid" ? "bg-emerald-500 text-white" : "text-[#7a9abf] hover:text-[#1a2a3a]"}`}>
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setLayout("list")}
                className={`p-1.5 rounded-lg transition-colors ${layout === "list" ? "bg-emerald-500 text-white" : "text-[#7a9abf] hover:text-[#1a2a3a]"}`}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Filter panel ── */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-[#cdd8e8] p-4 space-y-3 fade-in">
              <div>
                <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-2">Genre</p>
                <div className="flex flex-wrap gap-1.5">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => setGenre(g)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${genre === g ? "bg-emerald-500 text-white border-transparent" : "bg-[#f0f4f8] border-[#cdd8e8] text-[#4a6580] hover:border-emerald-400"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#7a9abf] uppercase mb-2">Mood</p>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMood(m)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${mood === m ? "bg-teal-500 text-white border-transparent" : "bg-[#f0f4f8] border-[#cdd8e8] text-[#4a6580] hover:border-teal-400"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Results count ── */}
          <p className="text-xs text-[#7a9abf]">
            {filtered.length} beat{filtered.length !== 1 ? "s" : ""} found
            {genre !== "All" || mood !== "All" || query ? " — " : ""}
            {genre !== "All" && <span className="font-semibold text-emerald-600">{genre} </span>}
            {mood  !== "All" && <span className="font-semibold text-teal-600">{mood}</span>}
          </p>

          {/* ── Beat grid / list ── */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#cdd8e8]">
              <Store className="w-10 h-10" />
              <p className="text-sm text-[#7a9abf]">No beats match your filters</p>
              <button onClick={() => { setQuery(""); setGenre("All"); setMood("All"); }}
                className="text-xs text-emerald-600 underline">Clear filters</button>
            </div>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(beat => (
                <BeatCard key={beat.id} beat={beat} view="grid" onPurchase={() => setPurchasing(beat)} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(beat => (
                <BeatCard key={beat.id} beat={beat} view="list" onPurchase={() => setPurchasing(beat)} />
              ))}
            </div>
          )}

          {/* ── Seller CTA ── */}
          <div className="gradient-header rounded-2xl px-6 py-5 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div>
              <p className="text-sm font-bold text-[#1a2a3a]">Sell your beats to labels, filmmakers & marketing agencies</p>
              <p className="text-xs text-[#4a6580] mt-0.5">
                3 license tiers · Keep 85% · Instant payouts · Global reach · Film &amp; sync licensing
              </p>
            </div>
            <button onClick={() => setView("sell")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors shadow-sm flex-shrink-0">
              <Upload className="w-4 h-4" /> List My Beats
            </button>
          </div>
        </>
      )}

      {/* ── Purchase modal ── */}
      {purchasing && <PurchaseModal beat={purchasing} onClose={() => setPurchasing(null)} />}
    </div>
  );
}
