"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ArrowRight, ChevronDown } from "lucide-react";

const RECS = [
  {parameter:"Low-End EQ",    current:-2,  suggested:-4,  reason:"808 and kick clash in 60–80 Hz region. Cut kick at 65 Hz by 2 dB."},
  {parameter:"Reverb Decay",  current:1.8, suggested:1.2, reason:"Lead melody tail bleeds into percussion — shorten reverb to tighten groove."},
  {parameter:"Stereo Width",  current:80,  suggested:60,  reason:"Narrow mid-range slightly to maintain mono compatibility."},
  {parameter:"Comp Threshold",current:-18, suggested:-12, reason:"Drums are over-compressed; raise threshold to restore transients."},
  {parameter:"High Shelf",    current:0,   suggested:2,   reason:"Add 2 dB air shelf at 12 kHz for presence in streaming playback."},
];

export function MixAdvisor() {
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string|null>(null);

  return (
    <Card title="AI Mix Advisor" subtitle={`${RECS.length} recommendations`}>
      <div className="p-4 space-y-2">
        {RECS.map((rec) => {
          const done = applied.has(rec.parameter);
          const isOpen = open===rec.parameter;
          return (
            <div key={rec.parameter} className={`rounded-xl border transition-colors ${done?"border-emerald-200 bg-emerald-50":"border-[#e8eef5] hover:border-sky-200"}`}>
              <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={()=>setOpen(isOpen?null:rec.parameter)}>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#1a2a3a]">{rec.parameter}</p>
                  <p className="text-[10px] text-[#7a9abf]">{rec.current} → {rec.suggested}</p>
                </div>
                <div className="flex items-center gap-2">
                  {done ? <Badge variant="success">Applied</Badge> : (
                    <Button variant="primary" size="sm" onClick={e=>{e.stopPropagation();setApplied(p=>new Set(p).add(rec.parameter));}}>
                      Apply <ArrowRight className="w-3 h-3"/>
                    </Button>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-[#7a9abf] transition-transform ${isOpen?"rotate-180":""}`}/>
                </div>
              </div>
              {isOpen && <div className="px-3 pb-3"><p className="text-xs text-[#4a6580] leading-relaxed">{rec.reason}</p></div>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
