import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { trackAId, trackBId, vectorA, vectorB } = await req.json();
  if (!trackAId||!trackBId||!vectorA||!vectorB) return NextResponse.json({error:"Missing fields"},{status:400});
  const t0=Date.now();
  const W={bpm:0.35,key:0.25,energy:0.20,brightness:0.10,danceability:0.08,spectralCentroid:0.01,rmsLoudness:0.01};
  const bpmScore=Math.max(0,1-Math.abs(vectorA.bpm-vectorB.bpm)/40);
  const keyDiff=Math.min(Math.abs(vectorA.key-vectorB.key),12-Math.abs(vectorA.key-vectorB.key));
  const keyScore=keyDiff<=1?1:keyDiff<=2?0.6:0.2;
  const energyScore=1-Math.abs(vectorA.energy-vectorB.energy);
  const brightScore=1-Math.abs(vectorA.brightness-vectorB.brightness);
  const danceScore=1-Math.abs(vectorA.danceability-vectorB.danceability);
  const raw=W.bpm*bpmScore+W.key*keyScore+W.energy*energyScore+W.brightness*brightScore+W.danceability*danceScore;
  const score=Math.round(raw*100); const confidence=Math.min(1,0.5+raw*0.5); const latencyMs=Date.now()-t0;
  const signals=[{channel:1,cc:7,value:Math.round(bpmScore*127),label:"EQ High Blend"},{channel:1,cc:8,value:Math.round(keyScore*127),label:"Key Harmonic Mix"},{channel:1,cc:9,value:Math.round(energyScore*127),label:"Energy Crossfade"},{channel:2,cc:10,value:Math.round(confidence*127),label:"Crossfader Pos"}];
  return NextResponse.json({trackAId,trackBId,score,confidence,latencyMs,signals});
}
