import { NextRequest, NextResponse } from "next/server";
import { MARKETPLACE_BEATS } from "@/lib/marketplaceData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const genre = searchParams.get("genre");
  const mood = searchParams.get("mood");

  let beats = [...MARKETPLACE_BEATS];
  if (genre && genre !== "All") beats = beats.filter((b) => b.genre === genre);
  if (mood) beats = beats.filter((b) => b.mood === mood);

  return NextResponse.json({ beats, total: beats.length });
}

export async function POST(req: NextRequest) {
  const { beatId, licenseType, userId } = await req.json();

  const beat = MARKETPLACE_BEATS.find((b) => b.id === beatId);
  if (!beat) return NextResponse.json({ error: "Beat not found" }, { status: 404 });

  const license = beat.licenses.find((l) => l.type === licenseType);
  if (!license) return NextResponse.json({ error: "License not found" }, { status: 404 });

  const commission = Math.round(license.price * 0.15 * 100) / 100;
  const sellerPayout = Math.round((license.price - commission) * 100) / 100;

  const order = {
    id: "ord_" + Date.now(),
    beatId, userId, licenseType,
    amount: license.price,
    commission,
    sellerPayout,
    licenseKey: "PF-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({ order }, { status: 201 });
}
