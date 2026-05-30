import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { verifyAccessToken } from "@/lib/auth/jwt";

// Helper to verify Super Admin
async function verifySuperAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    if (!payload || payload.role !== "SUPER_ADMIN") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifySuperAdmin(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        fullName: true,
        email: true,
        contactNumber: true,
        status: true,
        createdAt: true,
        _count: {
          select: { createdUsers: true } // Number of employees created
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifySuperAdmin(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { fullName, email, phone } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Default password for new admins
    const defaultPassword = "ChangeMe123!";
    const passwordHash = await hashPassword(defaultPassword);

    const newAdmin = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        contactNumber: phone || null,
        passwordHash,
        role: "ADMIN",
        mustChangePassword: true,
        createdById: user.userId,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: "CREATE_ADMIN",
        entityType: "user",
        entityId: newAdmin.id,
        newValue: { email: newAdmin.email, role: "ADMIN" },
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      }
    });

    return NextResponse.json({ 
      admin: {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        contactNumber: newAdmin.contactNumber,
        status: newAdmin.status,
        createdAt: newAdmin.createdAt,
        _count: { createdUsers: 0 }
      },
      message: "Admin created successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
