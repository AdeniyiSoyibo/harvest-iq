import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { trackId, bpm, duration } = await req.json();
  if (!trackId||!bpm||!duration) return NextResponse.json({error:"trackId, bpm, duration required"},{status:400});
  const beatInterval=60/bpm;
  const syncPoints:object[]=[];
  for(let t=0;t<duration;t+=beatInterval*16) syncPoints.push({time:parseFloat(t.toFixed(3)),type:"phrase",confidence:0.95});
  syncPoints.push({time:parseFloat((duration*0.30).toFixed(3)),type:"drop",confidence:0.88});
  syncPoints.push({time:parseFloat((duration*0.65).toFixed(3)),type:"drop",confidence:0.84});
  syncPoints.sort((a:any,b:any)=>a.time-b.time);
  return NextResponse.json({trackId,totalPoints:syncPoints.length,syncPoints});
}
