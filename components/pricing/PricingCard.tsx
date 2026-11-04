"use client";

import { useState } from "react";
import type { PricingPlan } from "@/lib/types";
import { Check } from "lucide-react";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  const [annual, setAnnual] = useState(false);
  const price = annual ? plan.annualPrice : plan.price;

  return (
    <div className={`relative flex flex-col rounded-2xl p-5 border transition-all ${plan.highlight ? "border-[#7c5cd8] bg-[#7c5cd8]/5" : "border-[#1f2332] bg-[#13161e]"}`}>
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#7c5cd8] rounded-full text-[10px] font-semibold text-white">
          Most Popular
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          {price === 0 ? (
            <span className="text-3xl font-bold text-white">Free</span>
          ) : (
            <>
              <span className="text-3xl font-bold text-white">${price.toFixed(2)}</span>
              <span className="text-xs text-[#4b5066]">/mo</span>
            </>
          )}
        </div>
        {price > 0 && (
          <button
            onClick={() => setAnnual(!annual)}
            className="mt-1 text-[10px] text-[#4b5066] hover:text-white transition-colors"
          >
            {annual ? "← Switch to monthly" : "Save 20% annually"}
          </button>
        )}
      </div>

      <ul className="space-y-2 flex-1 mb-5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-[#4b5066]">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${plan.highlight ? "bg-[#7c5cd8] hover:bg-[#6b4ec8] text-white" : "bg-[#1f2332] hover:bg-[#2a2f44] text-white"}`}>
        {plan.price === 0 ? "Get started free" : "Get started"}
      </button>
    </div>
  );
}
