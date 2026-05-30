import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
}

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
}
