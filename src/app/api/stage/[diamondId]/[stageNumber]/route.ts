import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ diamondId: string; stageNumber: string }> }
) {
  try {
    const { diamondId, stageNumber } = await params;
    const stageNum = parseInt(stageNumber, 10);
    const body = await req.json();

    const diamond = await prisma.diamond.findFirst({
      where: { OR: [{ id: diamondId }, { diamonddnaId: diamondId }] },
    });
    if (!diamond) return NextResponse.json({ error: "Diamond not found" }, { status: 404 });

    const completedAt = new Date();

    const stageHandlers: Record<number, () => Promise<unknown>> = {
      5: () => prisma.stage5.upsert({
        where: { diamondId: diamond.id },
        create: { diamondId: diamond.id, video360Url: body.video360Url, rawImageUrls: body.rawImageUrls, completedAt },
        update: { video360Url: body.video360Url, rawImageUrls: body.rawImageUrls, completedAt },
      }),
      8: () => prisma.stage8.upsert({
        where: { diamondId: diamond.id },
        create: { diamondId: diamond.id, galaxyFile: body.galaxyFile, sarinFile: body.sarinFile, completedAt },
        update: { galaxyFile: body.galaxyFile, sarinFile: body.sarinFile, completedAt },
      }),
      14: () => prisma.stage14.upsert({
        where: { diamondId: diamond.id },
        create: { diamondId: diamond.id, finalImageSet: body.finalImageSet, final360Video: body.final360Video, completedAt },
        update: { finalImageSet: body.finalImageSet, final360Video: body.final360Video, completedAt },
      }),
    };

    const handler = stageHandlers[stageNum];
    if (!handler) return NextResponse.json({ error: "Stage not supported" }, { status: 400 });

    const result = await handler();
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
