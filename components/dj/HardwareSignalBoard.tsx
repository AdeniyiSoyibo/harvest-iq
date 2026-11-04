"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Terminal } from "lucide-react";

export function HardwareSignalBoard() {
  const { transitionScore } = usePlatformStore();
  const signals = transitionScore?.signals ?? [];

  return (
    <Card title="Hardware Signals" subtitle="MIDI CC output">
      <div className="p-4">
        {signals.length>0 ? (
          <div className="space-y-2">
            {signals.map((sig,i)=>(
              <div key={i} className="p-3 rounded-xl bg-[#f0f4f8] border border-[#e8eef5] font-mono text-xs">
                <div className="flex justify-between mb-1"><span className="text-emerald-600 font-semibold">{sig.label}</span><span className="text-[#7a9abf]">CH{sig.channel}</span></div>
                <div className="flex items-center gap-2">
                  <span className="text-[#7a9abf]">CC {sig.cc}</span>
                  <div className="flex-1 h-1.5 bg-[#e8eef5] rounded-full overflow-hidden"><div className="h-full bg-emerald-400 rounded-full" style={{width:`${(sig.value/127)*100}%`}}/></div>
                  <span className="text-[#1a2a3a] font-bold w-7 text-right">{sig.value}</span>
                </div>
              </div>
            ))}
            <div className="mt-2 p-2 rounded-xl bg-[#f0f4f8] border border-[#e8eef5]">
              <p className="text-[10px] text-[#7a9abf] mb-1">MIDI Output Preview</p>
              {signals.map((sig,i)=>(
                <p key={i} className="text-[10px] font-mono text-emerald-600/80">
                  {`0xB${sig.channel-1} 0x${sig.cc.toString(16).padStart(2,"0").toUpperCase()} 0x${sig.value.toString(16).padStart(2,"0").toUpperCase()}`}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#7a9abf] text-center py-8">Run the transition model to generate hardware control signals.</p>
        )}
      </div>
    </Card>
  );
}
