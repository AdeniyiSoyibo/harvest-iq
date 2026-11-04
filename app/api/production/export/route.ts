import { NextRequest, NextResponse } from "next/server";
import { MOCK_BEATS } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { beatId, licenseType, formats } = await req.json();
  const beat = MOCK_BEATS.find((b) => b.id === beatId) ?? MOCK_BEATS[0];
  const formatList: string[] = formats ?? ["wav", "mp3", "midi"];

  const manifest = {
    beatId: beat.id,
    title: beat.title,
    licenseType: licenseType ?? "basic",
    exportedAt: new Date().toISOString(),
    stems: beat.stems.map((stem) => ({
      name: stem.name,
      type: stem.type,
      files: formatList.map((fmt) => ({
        format: fmt,
        url: `/exports/${beat.id}/${stem.id}.${fmt}`,
        size: Math.round(Math.random() * 8 + 2) + "MB",
      })),
    })),
  };

  return new NextResponse(JSON.stringify(manifest), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${beat.title.replace(/\s+/g, "_")}_stems.json"`,
    },
  });
}
