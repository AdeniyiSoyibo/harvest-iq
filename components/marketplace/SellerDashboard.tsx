"use client";

import { useState } from "react";
import { MARKETPLACE_BEATS } from "@/lib/marketplaceData";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import { DollarSign, Music2, BarChart2, TrendingUp, Plus, Upload } from "lucide-react";

const STATS = [
  { label: "Total Revenue",   value: "$12,840",  sub: "+18% this month", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Beats Sold",      value: "247",       sub: "across 3 licenses",icon: Music2,     color: "text-sky-500",    bg: "bg-sky-50"     },
  { label: "Avg Sale Value",  value: "$52.00",    sub: "mix of tiers",     icon: BarChart2,  color: "text-purple-500", bg: "bg-purple-50"  },
  { label: "Pending Payout",  value: "$1,820",    sub: "next: Nov 1",      icon: TrendingUp, color: "text-amber-500",  bg: "bg-amber-50"   },
];

const TABS = ["Overview", "My Beats", "Payouts"];

export function SellerDashboard() {
  const [tab, setTab] = useState("Overview");

  return (
    <div className="space-y-4">

      {/* Upload CTA */}
      <div className="gradient-header rounded-2xl px-5 py-4 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#1a2a3a]">Start selling your beats</p>
          <p className="text-xs text-[#4a6580] mt-0.5">Upload MP3 or WAV · Set 3 license tiers · Keep 85% of every sale · Global reach</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex-shrink-0">
          <Upload className="w-4 h-4" /> Upload a Beat
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f0f4f8] p-1 rounded-xl w-fit border border-[#e8eef5]">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? "bg-white text-[#1a2a3a] shadow-sm" : "text-[#7a9abf] hover:text-[#4a6580]"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ label, value, sub, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white border border-[#cdd8e8] rounded-2xl p-4 shadow-sm">
                <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-xl font-bold text-[#1a2a3a]">{value}</div>
                <div className="text-xs text-[#7a9abf] mt-0.5">{label}</div>
                <div className="text-[10px] text-emerald-600 mt-1 font-semibold">{sub}</div>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <Card title="Revenue — Last 30 Days" subtitle="Daily sales across all license tiers">
            <div className="p-4 h-36 flex items-end gap-1">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-emerald-200 hover:bg-emerald-400 rounded-sm transition-colors cursor-pointer"
                  style={{ height: `${20 + Math.abs(Math.sin(i * 0.6)) * 80}%` }}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
          </Card>
        </>
      )}

      {tab === "My Beats" && (
        <Card title="Your Beats" subtitle="Manage your catalog">
          <div className="divide-y divide-[#f0f4f8]">
            {MARKETPLACE_BEATS.slice(0, 5).map((beat) => (
              <div key={beat.id} className="flex items-center gap-4 px-4 py-3">
                {/* Mini waveform */}
                <div className="w-14 h-8 flex items-end gap-px bg-[#f0f4f8] rounded-lg px-1 py-1 flex-shrink-0">
                  {beat.waveform.slice(0, 12).map((amp, i) => (
                    <div key={i} className="flex-1 bg-emerald-300 rounded-sm" style={{ height: `${Math.max(15, amp * 100)}%` }} />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[#1a2a3a] truncate">{beat.title}</div>
                  <div className="text-xs text-[#7a9abf]">{beat.genre} · {beat.bpm} BPM · {formatNumber(beat.plays)} plays</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-emerald-600">+$320</div>
                  <div className="text-[10px] text-[#7a9abf]">{beat.likes} likes</div>
                </div>
              </div>
            ))}
            <div className="px-4 py-3">
              <button className="flex items-center gap-2 text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add another beat
              </button>
            </div>
          </div>
        </Card>
      )}

      {tab === "Payouts" && (
        <Card title="Payout History" subtitle="85% of every sale — paid monthly">
          <div className="divide-y divide-[#f0f4f8]">
            {[
              { period: "October 2026",   amount: "$2,140.00", status: "Pending",    color: "text-amber-600",   bg: "bg-amber-50"  },
              { period: "September 2026", amount: "$1,890.00", status: "Processing", color: "text-sky-600",     bg: "bg-sky-50"    },
              { period: "August 2026",    amount: "$2,310.00", status: "Paid",       color: "text-emerald-600", bg: "bg-emerald-50"},
              { period: "July 2026",      amount: "$1,650.00", status: "Paid",       color: "text-emerald-600", bg: "bg-emerald-50"},
            ].map(({ period, amount, status, color, bg }) => (
              <div key={period} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-[#1a2a3a]">{period}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg} ${color}`}>{status}</span>
                </div>
                <span className="text-base font-bold text-[#1a2a3a]">{amount}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
