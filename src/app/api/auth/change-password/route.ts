import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, validatePasswordStrength } from "@/lib/auth/password";
import { verifyAccessToken } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { password } = body;

    const validation = validatePasswordStrength(password);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors[0] }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: payload.userId as string },
      data: {
        passwordHash,
        mustChangePassword: false,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: payload.userId as string,
        action: "CHANGE_PASSWORD",
        entityType: "user",
        entityId: payload.userId as string,
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
