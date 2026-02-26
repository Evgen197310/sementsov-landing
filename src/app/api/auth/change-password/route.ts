import { NextResponse } from "next/server";
import { getUserFromRequest, verifyPassword, hashPassword } from "@/lib/auth";
import { getUserById, updateUserPassword } from "@/lib/db";

export async function POST(request: Request) {
  const caller = getUserFromRequest(request);
  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Текущий и новый пароль обязательны" }, { status: 400 });
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ error: "Новый пароль должен быть не менее 4 символов" }, { status: 400 });
    }

    const user = getUserById(caller.userId);
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    if (!verifyPassword(currentPassword, user.password_hash)) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 403 });
    }

    updateUserPassword(user.id, hashPassword(newPassword));
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
