import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { verifyAccessToken } from "@/lib/auth/jwt";

// Helper to verify Admin or Super Admin
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyAccessToken(token);
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      select: {
        id: true,
        fullName: true,
        email: true,
        roleLabel: true,
        contactNumber: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { fullName, email, phone, roleLabel } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Default password for new employees
    const defaultPassword = "ChangeMe123!";
    const passwordHash = await hashPassword(defaultPassword);

    const newEmployee = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        contactNumber: phone || null,
        roleLabel: roleLabel?.trim() || "General Employee",
        passwordHash,
        role: "EMPLOYEE",
        mustChangePassword: true,
        createdById: user.userId,
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: "CREATE_EMPLOYEE",
        entityType: "user",
        entityId: newEmployee.id,
        newValue: { email: newEmployee.email, role: "EMPLOYEE", roleLabel: newEmployee.roleLabel },
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      }
    });

    return NextResponse.json({ 
      employee: {
        id: newEmployee.id,
        fullName: newEmployee.fullName,
        email: newEmployee.email,
        roleLabel: newEmployee.roleLabel,
        contactNumber: newEmployee.contactNumber,
        status: newEmployee.status,
        createdAt: newEmployee.createdAt,
      },
      message: "Employee created successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
