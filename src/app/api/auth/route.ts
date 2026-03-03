import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { compareSync } from "bcryptjs";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !compareSync(password, admin.passwordHash)) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

    await prisma.adminSession.create({
      data: { token, adminId: admin.id, expiresAt },
    });

    // Clean up expired sessions for this admin
    await prisma.adminSession.deleteMany({
      where: { adminId: admin.id, expiresAt: { lt: new Date() } },
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("admin_token");
  if (!tokenCookie) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await prisma.adminSession.findUnique({
    where: { token: tokenCookie.value },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } });
    }
    cookieStore.delete("admin_token");
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("admin_token");

  if (tokenCookie) {
    await prisma.adminSession.deleteMany({
      where: { token: tokenCookie.value },
    });
  }

  cookieStore.delete("admin_token");
  return NextResponse.json({ success: true });
}
