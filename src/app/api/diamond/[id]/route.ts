import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const include = {
      stage1: true, stage2: true, stage3: true, stage4: true,
      stage5: true, stage6: true, stage7: true, stage8: true,
      stage9: true, stage10: true, stage11: true, stage12: true,
      stage13: true, stage14: true,
    } as const;

    let diamond = await prisma.diamond.findFirst({
      where: {
        OR: [
          { id: id },
          { diamonddnaId: id },
          { roughId: id },
          { stage3: { packetBarcode: { equals: id, mode: "insensitive" } } },
        ]
      },
      include,
    });

    // Fallback: normalized packetBarcode lookup (voice strips dashes — "ABT0771" → "ABT077-1")
    if (!diamond) {
      const cleanId = id.replace(/[^A-Z0-9]/gi, "").toUpperCase();
      if (cleanId.length >= 3) {
        const rows = await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT d.id FROM diamonds d
          JOIN stage_3 s3 ON s3.diamond_id = d.id
          WHERE UPPER(REGEXP_REPLACE(COALESCE(s3.packet_barcode, ''), '[^A-Z0-9]', '', 'g')) = ${cleanId}
          LIMIT 1
        `;
        if (rows.length > 0) {
          diamond = await prisma.diamond.findFirst({ where: { id: rows[0].id }, include });
        }
      }
    }

    if (!diamond) {
      return NextResponse.json({ error: "Diamond not found" }, { status: 404 });
    }

    return NextResponse.json({ diamond });
  } catch (error) {
    console.error("Error fetching diamond:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
