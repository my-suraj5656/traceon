import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Normalize query: strip spaces/dashes/underscores (crucial for voice recognition)
    const cleanQuery = query.replace(/[\s\-_]/g, "").toUpperCase();

    // Raw SQL: find diamonds where packetBarcode normalized = cleanQuery
    // Handles voice stripping dashes ("ABT0771" matching "ABT077-1")
    const normalizedPacketRows = cleanQuery.length >= 2
      ? await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT d.id FROM diamonds d
          JOIN stage_3 s3 ON s3.diamond_id = d.id
          WHERE UPPER(REGEXP_REPLACE(COALESCE(s3.packet_barcode, ''), '[^A-Z0-9]', '', 'g')) = ${cleanQuery}
        `
      : [];
    const normalizedPacketIds = normalizedPacketRows.map((r) => r.id);

    const diamonds = await prisma.diamond.findMany({
      where: {
        OR: [
          { roughId: { contains: query, mode: "insensitive" } },
          { diamonddnaId: { contains: query, mode: "insensitive" } },
          { roughId: { contains: cleanQuery, mode: "insensitive" } },
          { diamonddnaId: { contains: cleanQuery, mode: "insensitive" } },
          { stage3: { packetBarcode: { contains: query, mode: "insensitive" } } },
          { stage3: { packetBarcode: { contains: cleanQuery, mode: "insensitive" } } },
          ...(normalizedPacketIds.length > 0 ? [{ id: { in: normalizedPacketIds } }] : []),
        ],
      },
      select: {
        id: true,
        roughId: true,
        diamonddnaId: true,
        currentStage: true,
        status: true,
        stage3: { select: { packetBarcode: true } },
        stage1: {
          select: {
            originCountry: true,
            roughWeight: true,
          },
        },
        stage13: {
          select: {
            finalCarat: true,
          },
        },
      },
      take: 10,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ diamonds });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
