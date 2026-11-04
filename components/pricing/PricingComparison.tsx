"use client";

import { Check, Minus } from "lucide-react";

const FEATURES = [
  ["Beat production",           true,  true,  false, false],
  ["Stem mixer",                false, true,  false, false],
  ["AI mix advisor",            false, true,  false, false],
  ["Beat marketplace",          true,  true,  true,  true ],
  ["Stem pack export",          false, true,  false, true ],
  ["Streaming",                 true,  false, true,  true ],
  ["Flow playlists",            false, false, true,  true ],
  ["Offline mode",              false, false, true,  false],
  ["DJ mode",                   true,  true,  false, true ],
  ["MIDI signals",              false, true,  false, true ],
  ["Set builder",               false, true,  false, true ],
  ["A&R discovery",             false, false, false, true ],
  ["Market-fit API",            false, false, false, true ],
  ["Talent matching",           false, false, false, true ],
  ["Video editor",              true,  true,  false, true ],
  ["AV sync detection",         false, true,  false, true ],
  ["API access",                false, false, false, true ],
  ["Priority support",          false, true,  false, true ],
  ["Dedicated account manager", false, false, false, true ],
];

const TIERS = ["Free", "Producer Pro", "Listener Premium", "A&R Enterprise"];
const TIER_COLORS = ["text-[#4b5066]", "text-[#7c5cd8]", "text-[#22d3ee]", "text-[#f59e0b]"];

export function PricingComparison() {
  return (
    <div className="bg-[#13161e] border border-[#1f2332] rounded-xl overflow-hidden">
      <h2 className="text-base font-semibold text-white px-6 py-4 border-b border-[#1f2332]">Feature Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[#1f2332]">
              <th className="text-left px-6 py-3 text-xs text-[#4b5066] font-medium w-48">Feature</th>
              {TIERS.map((tier, i) => (
                <th key={tier} className={`px-4 py-3 text-xs font-semibold text-center ${TIER_COLORS[i]}`}>{tier}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2332]">
            {FEATURES.map(([label, ...values]) => (
              <tr key={label as string} className="hover:bg-[#1f2332]/30 transition-colors">
                <td className="px-6 py-2.5 text-xs text-[#4b5066]">{label as string}</td>
                {(values as boolean[]).map((v, i) => (
                  <td key={i} className="px-4 py-2.5 text-center">
                    {v
                      ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                      : <Minus className="w-4 h-4 text-[#1f2332] mx-auto" />
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
