"use client";

import { useState } from "react";
import type { Beat } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Download, Lock } from "lucide-react";
import { useUser } from "@/lib/userContext";

const FORMATS = ["WAV", "MP3", "MIDI", "AIF"];
const LICENSES = [
  { id: "basic",     label: "Basic Lease",   desc: "100K streams, 2500 copies" },
  { id: "premium",   label: "Premium Lease", desc: "500K streams, music video rights" },
  { id: "exclusive", label: "Exclusive",     desc: "Full ownership, unlimited use", pro: true },
];

export function StemExport({ beat }: { beat: Beat }) {
  const [selectedFormats, setSelectedFormats] = useState(["WAV"]);
  const [license, setLicense] = useState("basic");
  const [exporting, setExporting] = useState(false);
  const { hasAccess } = useUser();

  const toggleFormat = (fmt: string) =>
    setSelectedFormats((prev) => prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]);

  const handleExport = async () => {
    const exclusiveLicense = license === "exclusive";
    if (exclusiveLicense && !hasAccess("producer_pro")) return;

    setExporting(true);
    try {
      const res = await fetch("/api/production/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ beatId: beat.id, licenseType: license, formats: selectedFormats.map((f) => f.toLowerCase()) }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${beat.title.replace(/\s+/g, "_")}_stems.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card title="Stem Export">
      <div className="p-4 space-y-4">
        <div>
          <p className="text-xs text-[#4b5066] mb-2">Formats</p>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => toggleFormat(fmt)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedFormats.includes(fmt) ? "bg-[#2255ff] text-white" : "bg-[#1f2332] text-[#4b5066]"}`}
              >{fmt}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-[#4b5066] mb-2">License</p>
          <div className="space-y-2">
            {LICENSES.map((lic) => {
              const locked = lic.pro && !hasAccess("producer_pro");
              return (
                <button
                  key={lic.id}
                  onClick={() => !locked && setLicense(lic.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${locked ? "opacity-50 cursor-not-allowed" : ""} ${license === lic.id ? "border-[#2255ff] bg-[#2255ff]/10" : "border-[#1f2332] hover:border-[#2255ff]/50"}`}
                >
                  <div className="text-left">
                    <div className="text-xs font-medium text-white flex items-center gap-1.5">
                      {lic.label}
                      {locked && <Lock className="w-3 h-3" />}
                    </div>
                    <div className="text-[10px] text-[#4b5066]">{lic.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting || selectedFormats.length === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2255ff] hover:bg-[#1a44e8] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Exporting…" : "Export Stems"}
        </button>
      </div>
    </Card>
  );
}
