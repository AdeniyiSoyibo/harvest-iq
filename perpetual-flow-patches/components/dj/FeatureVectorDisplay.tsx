"use client";
import { useMemo } from "react";
import { usePlatformStore } from "@/lib/store";
import { extractFeatureVector } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

const DIMS = [
  {key:"bpm",            label:"BPM",             unit:"",    max:200  },
  {key:"key",            label:"Camelot Key",      unit:"",    max:12   },
  {key:"mode",           label:"Mode",             unit:"",    max:1    },
  {key:"energy",         label:"Energy",           unit:"",    max:1    },
  {key:"spectralCentroid",label:"Spectral Centroid",unit:" Hz",max:5000 },
  {key:"rmsLoudness",    label:"RMS Loudness",     unit:" dB", max:0    },
  {key:"onset",          label:"Onset Density",    unit:"",    max:10   },
  {key:"brightness",     label:"Brightness",       unit:"",    max:1    },
  {key:"danceability",   label:"Danceability",     unit:"",    max:1    },
] as const;

export function FeatureVectorDisplay() {
  const { deckA, deckB } = usePlatformStore();
  const vecA = useMemo(()=>deckA?extractFeatureVector(deckA):null,[deckA]);
  const vecB = useMemo(()=>deckB?extractFeatureVector(deckB):null,[deckB]);

  const fmt=(d:typeof DIMS[number],v:number)=>{
    if(d.key==="rmsLoudness") return `${v.toFixed(1)}${d.unit}`;
    if(d.max<=1) return v.toFixed(2);
    return `${Math.round(v)}${d.unit}`;
  };
  const pct=(d:typeof DIMS[number],v:number)=>
    d.key==="rmsLoudness"?Math.min(100,((v+23)/23)*100):Math.min(100,(v/d.max)*100);

  return (
    <Card title="9-D Feature Vectors" subtitle="per deck">
      <div className="p-4 space-y-3">
        {DIMS.map((dim)=>{
          const a=vecA?(vecA as unknown as Record<string,number>)[dim.key]:null;
          const b=vecB?(vecB as unknown as Record<string,number>)[dim.key]:null;
          return (
            <div key={dim.key}>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-[#7a9abf]">{dim.label}</span>
                <div className="flex gap-3">
                  {a!==null&&<span className="text-sky-500 font-mono">{fmt(dim,a)}</span>}
                  {b!==null&&<span className="text-purple-500 font-mono">{fmt(dim,b)}</span>}
                </div>
              </div>
              <div className="space-y-0.5">
                {a!==null&&<ProgressBar value={pct(dim,a)} size="sm" color="bg-sky-400"/>}
                {b!==null&&<ProgressBar value={pct(dim,b)} size="sm" color="bg-purple-400"/>}
              </div>
            </div>
          );
        })}
        <div className="flex gap-4 text-[10px]">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-400"/><span className="text-[#7a9abf]">Deck A</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-400"/><span className="text-[#7a9abf]">Deck B</span></div>
        </div>
      </div>
    </Card>
  );
}
