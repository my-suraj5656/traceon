import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAccessToken(token);
    if (payload?.role !== "ADMIN" && payload?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fieldPerms = await prisma.fieldPermission.findMany({
      where: { fieldName: "*" } // We use "*" to denote full stage access for the UI matrix
    });

    // Group by employeeId -> number[]
    const permissions: Record<string, number[]> = {};
    for (const p of fieldPerms) {
      if (p.canEdit) {
        if (!permissions[p.employeeId]) permissions[p.employeeId] = [];
        if (!permissions[p.employeeId].includes(p.stageNumber)) {
          permissions[p.employeeId].push(p.stageNumber);
        }
      }
    }

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAccessToken(token);
    if (payload?.role !== "ADMIN" && payload?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { permissions } = body as { permissions: Record<string, number[]> };

    // This is a bulk overwrite for simplicity in the MVP. 
    // Delete all existing stage-level permissions and recreate them.
    await prisma.$transaction(async (tx) => {
      await tx.fieldPermission.deleteMany({
        where: { fieldName: "*" }
      });

      const newPerms = [];
      for (const [employeeId, stages] of Object.entries(permissions)) {
        for (const stageNumber of stages) {
          newPerms.push({
            employeeId,
            stageNumber,
            fieldName: "*",
            canView: true,
            canEdit: true,
          });
        }
      }

      if (newPerms.length > 0) {
        await tx.fieldPermission.createMany({
          data: newPerms
        });
      }

      await tx.auditLog.create({
        data: {
          userId: payload.userId || payload.id,
          action: "PERMISSION_CHANGE",
          entityType: "field_permission",
          newValue: { details: "Updated stage permission matrix" },
          ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        }
      });
    });

    return NextResponse.json({ message: "Permissions saved successfully" });
  } catch (error) {
    console.error("Error saving permissions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
