import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Search by diamonddnaId or roughId
    const diamond = await prisma.diamond.findFirst({
      where: {
        OR: [
          { diamonddnaId: id },
          { roughId: id },
          { id: id },
        ],
      },
      include: {
        stage1: true,
        stage2: true,
        stage3: true,
        stage4: true,
        stage5: true,
        stage6: true,
        stage7: true,
        stage8: true,
        stage9: true,
        stage10: true,
        stage11: true,
        stage12: true,
        stage13: true,
        stage14: true,
      },
    });

    if (!diamond) {
      return NextResponse.json(
        { error: "Diamond not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ diamond });
  } catch (error) {
    console.error("Diamond fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
