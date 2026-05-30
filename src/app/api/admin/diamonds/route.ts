import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const diamonds = await prisma.diamond.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        stage1: true
      }
    });

    return NextResponse.json({ diamonds });
  } catch (error) {
    console.error("Error fetching diamonds:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { roughId, sourceLotId, originCountry, roughWeight, pcsCount } = body;

    if (!roughId || !sourceLotId || !originCountry || !roughWeight || !pcsCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if roughId already exists
    const existing = await prisma.diamond.findUnique({ where: { roughId } });
    if (existing) {
      return NextResponse.json({ error: "A diamond with this Rough ID already exists" }, { status: 409 });
    }

    // Execute in transaction to ensure both Diamond and Stage1 are created
    const diamond = await prisma.$transaction(async (tx) => {
      const newDiamond = await tx.diamond.create({
        data: {
          roughId,
          currentStage: 1,
          status: "IN_PROGRESS",
          stage1: {
            create: {
              roughId,
              sourceLotId,
              originCountry,
              roughWeight: parseFloat(roughWeight),
              pcsCount: parseInt(pcsCount, 10),
              completedAt: new Date(),
              completedBy: payload.fullName,
            }
          }
        },
        include: {
          stage1: true
        }
      });

      // Log the action
      await tx.auditLog.create({
        data: {
          userId: payload.userId,
          action: "CREATE",
          entityType: "diamond",
          entityId: newDiamond.id,
          newValue: { roughId, sourceLotId, originCountry, roughWeight },
          ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        }
      });

      return newDiamond;
    });

    return NextResponse.json({ success: true, diamond }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating rough diamond:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
