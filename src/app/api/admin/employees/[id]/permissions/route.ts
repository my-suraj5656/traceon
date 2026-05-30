import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: employeeId } = await params;

    const permissions = await prisma.fieldPermission.findMany({
      where: { employeeId },
    });

    const stages = permissions
      .filter(p => p.canEdit && p.fieldName === "*")
      .map(p => p.stageNumber);

    return NextResponse.json({ stages });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload || (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: employeeId } = await params;
    const body = await request.json();
    const { stages } = body; // Array of stage numbers

    if (!Array.isArray(stages)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const employee = await prisma.user.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Execute in transaction
    await prisma.$transaction(async (tx) => {
      // Delete old permissions
      await tx.fieldPermission.deleteMany({
        where: { employeeId },
      });

      // Insert new permissions
      if (stages.length > 0) {
        await tx.fieldPermission.createMany({
          data: stages.map((stageNum: number) => ({
            employeeId,
            stageNumber: stageNum,
            fieldName: "*",
            canView: true,
            canEdit: true,
          })),
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: payload.userId,
          action: "UPDATE_PERMISSIONS",
          entityType: "user",
          entityId: employeeId,
          newValue: { assignedStages: stages },
          ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating permissions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
