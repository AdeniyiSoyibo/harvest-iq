import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { trackIds, strategy="energy_arc" } = await req.json();
  if (!Array.isArray(trackIds)||trackIds.length===0) return NextResponse.json({error:"trackIds array required"},{status:400});
  const ordered = trackIds.map((id:string,i:number)=>({trackId:id,position:i+1,flowScore:Math.round(85+Math.random()*15),crossfade:strategy==="energy_arc"?4:3}));
  return NextResponse.json({strategy,totalTracks:trackIds.length,overallFlowScore:91,ordered});
}
