import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getUserById, type User } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "sementsov-default-secret-change-me";
const TOKEN_COOKIE = "admin_token";
const TOKEN_EXPIRY = "7d";

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<(Omit<User, "password_hash"> & { role: string }) | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = getUserById(payload.userId);
  if (!user) return null;

  return { id: user.id, username: user.username, role: user.role, created_at: user.created_at };
}

export function getTokenFromRequest(request: Request): string | null {
  // Check cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${TOKEN_COOKIE}=([^;]+)`));
  if (match) return match[1];

  // Check Authorization header
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7);

  return null;
}

export function getUserFromRequest(request: Request): JwtPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
