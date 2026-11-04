"use client";

import { useState } from "react";
import type { MarketplaceBeat, LicenseType } from "@/lib/types";
import { X, Check, ChevronDown, ChevronUp, ShoppingCart, Shield, Zap, Star } from "lucide-react";
import { useUser } from "@/lib/userContext";

const LICENSE_COLORS: Record<LicenseType, { bg: string; border: string; badge: string; label: string }> = {
  basic:     { bg: "bg-sky-50",    border: "border-sky-300",    badge: "bg-sky-100 text-sky-700",     label: "Basic"     },
  premium:   { bg: "bg-purple-50", border: "border-purple-300", badge: "bg-purple-100 text-purple-700", label: "Premium"  },
  exclusive: { bg: "bg-amber-50",  border: "border-amber-300",  badge: "bg-amber-100 text-amber-700",  label: "Exclusive" },
};

const LICENSE_ICONS: Record<LicenseType, React.ReactNode> = {
  basic:     <Shield className="w-4 h-4 text-sky-500" />,
  premium:   <Zap    className="w-4 h-4 text-purple-500" />,
  exclusive: <Star   className="w-4 h-4 text-amber-500" />,
};

export function PurchaseModal({ beat, onClose }: { beat: MarketplaceBeat; onClose: () => void }) {
  const [step, setStep]       = useState<"license" | "checkout" | "success">("license");
  const [selected, setSelected] = useState<LicenseType>("basic");
  const [expanded, setExpanded] = useState<LicenseType | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const selectedLicense = beat.licenses.find((l) => l.type === selected)!;
  const commission = Math.round(selectedLicense.price * 0.15 * 100) / 100;
  const producerEarns = Math.round((selectedLicense.price - commission) * 100) / 100;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beatId: beat.id, licenseType: selected, userId: user?.id ?? "guest" }),
      });
      setStep("success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border border-[#cdd8e8] rounded-2xl w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eef5]">
          <div>
            <h2 className="text-sm font-bold text-[#1a2a3a]">
              {step === "success" ? "Purchase Complete" : `License "${beat.title}"`}
            </h2>
            {step !== "success" && (
              <p className="text-xs text-[#7a9abf] mt-0.5">{beat.producer} · {beat.genre} · {beat.bpm} BPM</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 text-[#7a9abf] hover:text-[#1a2a3a] hover:bg-[#f0f4f8] rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success state */}
        {step === "success" ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <p className="text-base font-bold text-[#1a2a3a]">License Activated</p>
              <p className="text-xs text-[#7a9abf] mt-1">
                Your <span className="font-semibold capitalize">{selected}</span> license for{" "}
                <span className="font-semibold">"{beat.title}"</span> is active.
                Check your email for download links.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-700 text-left space-y-1">
              {selectedLicense.includes.map(inc => (
                <div key={inc} className="flex items-center gap-2">
                  <Check className="w-3 h-3" /> {inc}
                </div>
              ))}
            </div>
            <button onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">
              Done
            </button>
          </div>

        /* License selection */
        ) : step === "license" ? (
          <div className="p-5 space-y-3">
            {beat.licenses.map((lic) => {
              const colors = LICENSE_COLORS[lic.type];
              const isSelected = selected === lic.type;
              return (
                <div key={lic.type}>
                  <button
                    onClick={() => setSelected(lic.type)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                      isSelected ? `${colors.border} ${colors.bg}` : "border-[#e8eef5] hover:border-[#cdd8e8]"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      {LICENSE_ICONS[lic.type]}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1a2a3a] capitalize">{lic.type} License</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                            {lic.streams} streams
                          </span>
                        </div>
                        <div className="text-xs text-[#7a9abf]">{typeof lic.copies === "number" ? lic.copies.toLocaleString() : lic.copies} copies</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-base font-bold text-[#1a2a3a]">${lic.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(expanded === lic.type ? null : lic.type); }}
                        className="p-1 text-[#7a9abf] hover:text-[#1a2a3a]"
                      >
                        {expanded === lic.type ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </button>
                  {expanded === lic.type && (
                    <div className="mt-1 px-4 py-3 bg-[#f7f9fc] rounded-xl border border-[#e8eef5]">
                      <ul className="space-y-1.5">
                        {lic.includes.map((inc) => (
                          <li key={inc} className="flex items-center gap-2 text-xs text-[#4a6580]">
                            <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />{inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Commission breakdown */}
            <div className="bg-[#f7f9fc] rounded-xl p-3 space-y-1.5 border border-[#e8eef5]">
              <div className="flex justify-between text-xs text-[#7a9abf]">
                <span>Platform commission (15%)</span>
                <span>${commission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#4a6580]">
                <span>Producer earns</span>
                <span className="font-semibold text-emerald-600">${producerEarns.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setStep("checkout")}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Continue — ${selectedLicense.price.toFixed(2)}
            </button>
          </div>

        /* Checkout */
        ) : (
          <div className="p-5 space-y-4">
            <div className="bg-[#f7f9fc] rounded-xl p-4 space-y-2 border border-[#e8eef5]">
              <div className="flex justify-between text-sm">
                <span className="text-[#7a9abf]">Beat</span>
                <span className="font-semibold text-[#1a2a3a]">{beat.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7a9abf]">Producer</span>
                <span className="text-[#1a2a3a]">{beat.producer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#7a9abf]">License</span>
                <span className="font-semibold text-[#1a2a3a] capitalize">{selected}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-[#e8eef5] pt-2">
                <span className="font-bold text-[#1a2a3a]">Total</span>
                <span className="font-bold text-emerald-600 text-base">${selectedLicense.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                placeholder="Card number"
                className="w-full bg-white border border-[#cdd8e8] rounded-xl px-3 py-2.5 text-sm text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-emerald-400"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="MM / YY"
                  className="w-full bg-white border border-[#cdd8e8] rounded-xl px-3 py-2.5 text-sm text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-emerald-400"
                />
                <input
                  placeholder="CVC"
                  className="w-full bg-white border border-[#cdd8e8] rounded-xl px-3 py-2.5 text-sm text-[#1a2a3a] placeholder:text-[#7a9abf] focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              {loading ? "Processing…" : `Pay $${selectedLicense.price.toFixed(2)}`}
            </button>

            <button onClick={() => setStep("license")}
              className="w-full text-xs text-[#7a9abf] hover:text-[#4a6580] py-1 transition-colors">
              ← Back to license selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
