"use client";

import { Card } from "@/components/ui/Card";
import { DollarSign, Percent, Code, Building } from "lucide-react";

const STREAMS = [
  { icon: DollarSign, label: "Subscriptions",       desc: "Freemium → Pro/Premium/Enterprise",                  value: "Primary" },
  { icon: Percent,    label: "Beat Marketplace",     desc: "15% commission on every sale",                       value: "15% cut" },
  { icon: Code,       label: "Developer API",        desc: "Per-call pricing beyond free quota",                  value: "$0.002/req" },
  { icon: Building,   label: "OEM Licensing",        desc: "Platform integrations for DAWs and hardware",         value: "Custom" },
  { icon: DollarSign, label: "Label Catalog Licensing", desc: "White-label A&R tools for music labels",           value: "Enterprise" },
  { icon: Building,   label: "Enterprise Agreements",desc: "SLA + dedicated support for large orgs",              value: "Custom" },
];

export function RevenueStreams() {
  return (
    <div className="bg-[#13161e] border border-[#1f2332] rounded-xl p-6">
      <h2 className="text-base font-semibold text-white mb-4">Revenue Streams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STREAMS.map(({ icon: Icon, label, desc, value }) => (
          <div key={label} className="flex items-start gap-3 p-4 bg-[#0d0f14] rounded-xl border border-[#1f2332]">
            <div className="w-8 h-8 rounded-lg bg-[#2255ff]/15 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-[#2255ff]" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{label}</div>
              <div className="text-xs text-[#4b5066] mt-0.5">{desc}</div>
              <div className="text-xs font-semibold text-[#7c5cd8] mt-1">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
