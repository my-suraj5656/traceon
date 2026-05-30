import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const excluded = Array.from({ length: 10 }, (_, i) =>
      `RGH-26-${String(i + 1).padStart(3, "0")}`
    );

    const diamonds = await prisma.diamond.findMany({
      where: {
        status: "COMPLETED",
        roughId: { notIn: excluded },
      },
      select: {
        id: true,
        roughId: true,
        diamonddnaId: true,
        stage1:  { select: { originCountry: true } },
        stage5:  { select: { rawImageUrls: true } },
        stage13: { select: { finalCarat: true, finalColor: true, finalClarity: true } },
        stage14: { select: { finalImageSet: true } },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ diamonds });
  } catch {
    return NextResponse.json({ diamonds: [] });
  }
}
