import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = await verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        fieldPermissions: true,
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const stages = user.fieldPermissions
      .filter(p => p.canEdit && p.fieldName === "*")
      .map(p => p.stageNumber);

    return NextResponse.json({ 
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        roleLabel: user.roleLabel,
        permittedStages: stages.sort((a, b) => a - b),
      }
    });
  } catch (error) {
    console.error("Error fetching me:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
