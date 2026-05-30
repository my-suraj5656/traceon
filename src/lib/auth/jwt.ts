import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { Role } from "@/lib/design-tokens";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "traceon-dev-secret-change-in-production-2025"
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || "traceon-refresh-secret-change-in-production-2025"
);

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: Role;
  fullName: string;
}

export async function signAccessToken(payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
