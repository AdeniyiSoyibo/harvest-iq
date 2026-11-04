"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "Can I switch plans at any time?",               a: "Yes. Upgrades take effect immediately; downgrades apply at the next billing cycle." },
  { q: "What does the 15% marketplace commission cover?", a: "Payment processing, license key generation, hosting, and fraud protection." },
  { q: "Is there a free trial for paid tiers?",          a: "All paid tiers include a 14-day free trial with no credit card required." },
  { q: "How does the annual discount work?",             a: "Pay annually and save 20% compared to monthly billing. Billed as a single upfront charge." },
  { q: "Can I use beats commercially on the Free tier?", a: "Free tier beats are for demo and non-commercial use only. Upgrade for commercial rights." },
  { q: "What is the A&R Enterprise API rate limit?",     a: "Enterprise API access includes 50,000 requests/month. Higher limits available via custom agreement." },
  { q: "Do you offer student or non-profit discounts?",  a: "Yes — contact us for 50% education/non-profit pricing." },
];

export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-[#13161e] border border-[#1f2332] rounded-xl overflow-hidden">
      <h2 className="text-base font-semibold text-white px-6 py-4 border-b border-[#1f2332]">FAQ</h2>
      <div className="divide-y divide-[#1f2332]">
        {FAQS.map(({ q, a }, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#1f2332]/30 transition-colors"
            >
              <span className="text-sm text-white">{q}</span>
              <ChevronDown className={`w-4 h-4 text-[#4b5066] transition-transform flex-shrink-0 ml-4 ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-xs text-[#4b5066] leading-relaxed">{a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
