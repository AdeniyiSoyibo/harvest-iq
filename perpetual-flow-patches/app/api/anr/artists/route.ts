import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const p=new URL(req.url).searchParams;
  const genre=p.get("genre"); const minFit=Number(p.get("minFit")??0); const sortBy=p.get("sortBy")??"marketFitScore";
  const artists=[
    {id:"a1",name:"Kira Vault", genre:["Electronic","Synthwave"],  marketFitScore:87,growthRate:34,monthlyListeners:127400},
    {id:"a2",name:"Axiom",      genre:["Drum & Bass","Jungle"],     marketFitScore:79,growthRate:21,monthlyListeners:89200 },
    {id:"a3",name:"Demi Nox",   genre:["Hip-Hop","R&B"],            marketFitScore:92,growthRate:58,monthlyListeners:213000},
    {id:"a4",name:"Meld",       genre:["Ambient","Experimental"],   marketFitScore:61,growthRate:12,monthlyListeners:44300 },
    {id:"a5",name:"Afro.V",     genre:["Afrobeats","Afropop"],      marketFitScore:95,growthRate:76,monthlyListeners:318000},
    {id:"a6",name:"ShotClock",  genre:["Drill","Grime"],             marketFitScore:83,growthRate:44,monthlyListeners:156000},
  ].filter(a=>(!genre||a.genre.includes(genre))&&a.marketFitScore>=minFit)
   .sort((a,b)=>sortBy==="growth"?b.growthRate-a.growthRate:sortBy==="listeners"?b.monthlyListeners-a.monthlyListeners:b.marketFitScore-a.marketFitScore);
  return NextResponse.json({total:artists.length,artists});
}
