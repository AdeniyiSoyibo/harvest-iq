"use client";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Zap } from "lucide-react";

const TYPE_BADGE: Record<string,React.ReactNode> = {
  beat:   <Badge variant="sky">Beat</Badge>,
  drop:   <Badge variant="danger">Drop</Badge>,
  phrase: <Badge variant="warning">Phrase</Badge>,
  custom: <Badge variant="accent">Custom</Badge>,
};

export function SyncPointsPanel() {
  const { videoProject } = usePlatformStore();
  const pts = videoProject?.syncPoints ?? [];

  return (
    <Card title="Audiovisual Sync Points" subtitle={`${pts.length} detected`}>
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#e8eef5]">
              {["#","Time","Type","Confidence","Action"].map(h=><th key={h} className="text-left pb-2 text-[#7a9abf] font-semibold pr-4">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {pts.map((sp,i)=>(
              <tr key={i} className="border-b border-[#f0f4f8] hover:bg-[#f8fafc]">
                <td className="py-1.5 text-[#7a9abf] pr-4">{i+1}</td>
                <td className="py-1.5 font-mono text-[#1a2a3a] pr-4">{sp.time.toFixed(2)}s</td>
                <td className="py-1.5 pr-4">{TYPE_BADGE[sp.type]??<Badge>{sp.type}</Badge>}</td>
                <td className="py-1.5 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-[#e8eef5] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${sp.confidence>=0.9?"bg-emerald-400":sp.confidence>=0.7?"bg-amber-400":"bg-rose-400"}`} style={{width:`${sp.confidence*100}%`}}/>
                    </div>
                    <span className="text-[#7a9abf]">{Math.round(sp.confidence*100)}%</span>
                  </div>
                </td>
                <td className="py-1.5"><button className="text-sky-500 hover:text-sky-700 text-[10px] font-semibold">Add Cut</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
