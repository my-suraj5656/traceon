import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";

// Routes that require authentication
const protectedRoutes = ["/superadmin", "/admin", "/employee"];

// Role-based route access
const roleRouteMap: Record<string, string[]> = {
  SUPER_ADMIN: ["/superadmin", "/admin", "/employee"],
  ADMIN: ["/admin"],
  EMPLOYEE: ["/employee"],
};

// Login pages that must remain publicly accessible
const publicAuthPages = ["/superadmin/login", "/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login pages through unconditionally
  if (publicAuthPages.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Check if the route requires authentication
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Extract token from cookies or Authorization header
  const token =
    request.cookies.get("access_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    // Redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = await verifyAccessToken(token);

  if (!payload) {
    // Invalid token — redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    return response;
  }

  // Check role-based access
  const allowedRoutes = roleRouteMap[payload.role] || [];
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role
    const dashboardMap: Record<string, string> = {
      SUPER_ADMIN: "/superadmin",
      ADMIN: "/admin",
      EMPLOYEE: "/employee",
    };
    const dashUrl = dashboardMap[payload.role] || "/";
    return NextResponse.redirect(new URL(dashUrl, request.url));
  }

  // Attach user info to headers for downstream use
  const response = NextResponse.next();
  response.headers.set("x-user-id", payload.userId);
  response.headers.set("x-user-role", payload.role);
  response.headers.set("x-user-email", payload.email);

  return response;
}

export const config = {
  matcher: [
    "/superadmin",
    "/superadmin/:path*",
    "/admin",
    "/admin/:path*",
    "/employee",
    "/employee/:path*",
  ],
};
