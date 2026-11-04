"use client";
import { useState } from "react";
import { PRICING_PLANS } from "@/lib/data";
import { Check, Star, Tag } from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-5 lg:p-6 max-w-5xl mx-auto">
      <div className="gradient-header rounded-2xl px-6 py-8 border border-sky-100 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg mx-auto mb-3">
          <Tag className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#1a2a3a] mb-1">Simple, Transparent Pricing</h1>
        <p className="text-sm text-[#4a6580]">From individual creators to enterprise labels — a plan for every use case.</p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <span className={`text-sm ${!annual?"text-[#1a2a3a] font-semibold":"text-[#7a9abf]"}`}>Monthly</span>
          <button onClick={()=>setAnnual(!annual)} className={`relative w-11 h-6 rounded-full transition-colors ${annual?"bg-sky-500":"bg-[#cdd8e8]"}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${annual?"translate-x-6":"translate-x-1"}`}/>
          </button>
          <span className={`text-sm ${annual?"text-[#1a2a3a] font-semibold":"text-[#7a9abf]"}`}>
            Annual <span className="ml-1 text-[10px] font-bold bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PRICING_PLANS.map((plan) => {
          const price = annual ? plan.annualPrice : plan.price;
          const colors: Record<string,string> = { free:"from-slate-400 to-slate-600", producer_pro:"from-sky-400 to-blue-600", listener_premium:"from-purple-400 to-indigo-600", anr_enterprise:"from-rose-400 to-orange-500" };
          const grad = colors[plan.id];
          return (
            <div key={plan.id} className={`relative flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm ${plan.highlight?"border-sky-300 ring-1 ring-sky-300/50":"border-[#cdd8e8]"}`}>
              <div className={`h-1.5 bg-gradient-to-r ${grad}`}/>
              {"highlight" in plan && plan.highlight && (
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 bg-sky-500 text-white text-[9px] font-bold px-2 py-1 rounded-full"><Star className="w-2.5 h-2.5" fill="white"/>Popular</span>
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-bold text-[#7a9abf] uppercase tracking-wide mb-1">{plan.name}</p>
                <div className="mb-4">
                  {price===0 ? <p className="text-3xl font-extrabold text-[#1a2a3a]">Free</p> : (
                    <div className="flex items-end gap-1"><span className="text-3xl font-extrabold text-[#1a2a3a]">${price}</span><span className="text-[#7a9abf] text-sm mb-1">/mo</span></div>
                  )}
                  {annual && price > 0 && <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Save {Math.round(((plan.price-plan.annualPrice)/plan.price)*100)}% vs monthly</p>}
                </div>
                <ul className="space-y-1.5 flex-1 mb-5">
                  {plan.features.map((f)=>(
                    <li key={f} className="flex items-start gap-2 text-xs text-[#4a6580]">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5"/>{f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${grad} hover:opacity-90 transition-opacity shadow-sm`}>
                  {price===0?"Get Started Free":`Subscribe — ${plan.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue streams */}
      <div className="bg-white rounded-2xl border border-[#cdd8e8] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e8eef5]">
          <h2 className="text-sm font-bold text-[#1a2a3a]">Additional Revenue Streams</h2>
          <p className="text-xs text-[#7a9abf]">Beyond subscriptions</p>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {name:"Beat Marketplace Commission",detail:"15% on every beat sold. Sellers keep 85%."},
            {name:"Developer API Fees",detail:"Rate-limited REST & WebSocket API from $0.001/request."},
            {name:"OEM Licensing",detail:"White-label the flow engine for DJ controllers & DAWs."},
            {name:"Label Catalog Licensing",detail:"Revenue-share for streaming catalog discovery."},
            {name:"Enterprise Service Agreements",detail:"Custom SLAs, dedicated infra, bespoke model fine-tuning."},
            {name:"Annual Plan Discount",detail:"20% off all paid tiers on annual billing."},
          ].map(({name,detail})=>(
            <div key={name} className="p-3 rounded-xl border border-[#e8eef5] hover:border-sky-200 transition-colors">
              <p className="text-xs font-semibold text-[#1a2a3a] mb-1">{name}</p>
              <p className="text-xs text-[#7a9abf]">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
