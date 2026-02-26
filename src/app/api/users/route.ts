import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAllUsers, insertUser, updateUserRole, deleteUser, countSuperadmins, getUserById } from "@/lib/db";
import { getUserFromRequest, hashPassword } from "@/lib/auth";

export async function GET(request: Request) {
  const caller = getUserFromRequest(request);
  if (!caller || caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const users = getAllUsers();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const caller = getUserFromRequest(request);
  if (!caller || caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { username, password, role } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "username and password required" }, { status: 400 });
    }
    const id = uuidv4();
    insertUser({
      id,
      username,
      password_hash: hashPassword(password),
      role: role || "admin",
    });
    return NextResponse.json({ id, username, role: role || "admin" }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("UNIQUE")) {
      return NextResponse.json({ error: "Пользователь с таким логином уже существует" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const caller = getUserFromRequest(request);
  if (!caller || caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, role } = await request.json();
    if (!id || !role) {
      return NextResponse.json({ error: "id and role required" }, { status: 400 });
    }

    // Cannot change own role
    if (id === caller.userId) {
      return NextResponse.json({ error: "Нельзя изменить свою собственную роль" }, { status: 400 });
    }

    // If demoting from superadmin, check they're not the last one
    const targetUser = getUserById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "superadmin" && role !== "superadmin") {
      const superadminCount = countSuperadmins();
      if (superadminCount <= 1) {
        return NextResponse.json({ error: "Нельзя забрать роль суперадмина у последнего суперадмина" }, { status: 400 });
      }
    }

    updateUserRole(id, role);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const caller = getUserFromRequest(request);
  if (!caller || caller.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Cannot delete self
    if (id === caller.userId) {
      return NextResponse.json({ error: "Нельзя удалить самого себя" }, { status: 400 });
    }

    // Cannot delete last superadmin
    const targetUser = getUserById(id);
    if (targetUser?.role === "superadmin") {
      const superadminCount = countSuperadmins();
      if (superadminCount <= 1) {
        return NextResponse.json({ error: "Нельзя удалить последнего суперадмина" }, { status: 400 });
      }
    }

    deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
