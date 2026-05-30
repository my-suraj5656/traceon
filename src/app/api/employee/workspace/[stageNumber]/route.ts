import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest, { params }: { params: Promise<{ stageNumber: string }> }) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload || payload.role !== "EMPLOYEE") {
      // Actually, Admins might want to view this too, but let's restrict to employees or admins
      if (payload?.role !== "EMPLOYEE" && payload?.role !== "ADMIN" && payload?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const { stageNumber: stageNumberStr } = await params;
    const stageNumber = parseInt(stageNumberStr, 10);

    if (isNaN(stageNumber) || stageNumber < 1 || stageNumber > 14) {
      return NextResponse.json({ error: "Invalid stage number" }, { status: 400 });
    }

    // Verify employee has permission for this stage
    if (payload.role === "EMPLOYEE") {
      const permission = await prisma.fieldPermission.findFirst({
        where: {
          employeeId: payload.userId,
          stageNumber: stageNumber,
          canEdit: true
        }
      });

      if (!permission) {
        return NextResponse.json({ error: "You are not authorized for this stage" }, { status: 403 });
      }
    }

    // Fetch diamonds currently at this stage
    const diamonds = await prisma.diamond.findMany({
      where: {
        currentStage: stageNumber,
        status: "IN_PROGRESS"
      },
      orderBy: {
        updatedAt: "asc" // Oldest first (FIFO queue)
      },
      include: {
        stage1: true // Include rough data for context
      }
    });

    return NextResponse.json({ diamonds });
  } catch (error) {
    console.error("Error fetching workspace diamonds:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
