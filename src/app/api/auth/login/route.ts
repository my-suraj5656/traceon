import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        { error: `Account is locked. Try again in ${minutesLeft} minutes.` },
        { status: 423 }
      );
    }

    // Check account status
    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Account has been suspended. Contact your administrator." },
        { status: 403 }
      );
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      // Increment failed attempts
      const failedAttempts = user.failedLoginAttempts + 1;
      const updateData: Record<string, unknown> = {
        failedLoginAttempts: failedAttempts,
      };

      // Lock after 5 failed attempts (30 min lockout)
      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        updateData.status = "LOCKED";
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      return NextResponse.json(
        {
          error: "Invalid email or password",
          attemptsRemaining: Math.max(0, 5 - failedAttempts),
        },
        { status: 401 }
      );
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        status: user.status === "LOCKED" ? "ACTIVE" : user.status,
      },
    });

    // Generate tokens
    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE",
      fullName: user.fullName,
    });

    const refreshToken = await signRefreshToken(user.id);

    // Store hashed refresh token
    const hashedRefresh = await hashPassword(refreshToken);
    await prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefresh,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entityType: "user",
        entityId: user.id,
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    // Set cookies
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto,
        mustChangePassword: user.mustChangePassword,
      },
      accessToken,
    });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
