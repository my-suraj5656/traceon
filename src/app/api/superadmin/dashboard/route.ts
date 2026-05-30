import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await verifyAccessToken(token);
    if (!payload || payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [adminCount, employeeCount, diamondCount, completedDiamondCount, recentLogs] = await Promise.all([
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "EMPLOYEE" } }),
      prisma.diamond.count(),
      prisma.diamond.count({ where: { status: "COMPLETED" } }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, role: true } } },
      }),
    ]);

    const stats = {
      adminCount,
      employeeCount,
      diamondCount,
      completedDiamondCount,
    };

    const recentActions = recentLogs.map((log) => {
      // Format time
      const diffMs = Date.now() - log.createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      let timeStr = "Just now";
      if (diffDays > 0) timeStr = diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
      else if (diffHours > 0) timeStr = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      else if (diffMins > 0) timeStr = `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;

      return {
        user: log.user ? log.user.fullName : "System",
        role: log.user ? log.user.role : "SYSTEM",
        action: log.action.replace(/_/g, " "),
        target: `${log.entityType} ${log.entityId || ""}`.trim(),
        time: timeStr,
      };
    });

    return NextResponse.json({ stats, recentActions });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
