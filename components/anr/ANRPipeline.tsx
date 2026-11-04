"use client";

import { useState } from "react";
import { usePlatformStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const STAGES = ["Discovered", "Outreach", "Demo Review", "Negotiation", "Signed"];

type PipelineItem = {
  id: string;
  name: string;
  stage: string;
  score: number;
};

export function ANRPipeline() {
  const { artists } = usePlatformStore();

  const [pipeline, setPipeline] = useState<PipelineItem[]>(
    artists.map((a, i) => ({
      id: a.id,
      name: a.name,
      stage: STAGES[i % STAGES.length],
      score: a.marketFitScore,
    }))
  );

  const moveForward = (id: string) => {
    setPipeline((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const idx = STAGES.indexOf(item.stage);
      return { ...item, stage: STAGES[Math.min(idx + 1, STAGES.length - 1)] };
    }));
  };

  return (
    <Card title="A&R Pipeline">
      <div className="overflow-x-auto">
        <div className="flex gap-3 p-4 min-w-max">
          {STAGES.map((stage) => {
            const items = pipeline.filter((p) => p.stage === stage);
            return (
              <div key={stage} className="w-40 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#4b5066]">{stage}</span>
                  <Badge>{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id}
                      className="bg-[#0d0f14] border border-[#1f2332] rounded-lg p-2.5 space-y-1.5"
                    >
                      <div className="text-xs font-medium text-white">{item.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-400">{item.score}</span>
                        {stage !== "Signed" && (
                          <button
                            onClick={() => moveForward(item.id)}
                            className="text-[10px] text-[#2255ff] hover:underline"
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="h-12 border border-dashed border-[#1f2332] rounded-lg" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
