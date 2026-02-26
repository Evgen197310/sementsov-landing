import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { order } = await request.json(); // array of { id, sort_order }
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "order array required" }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare("UPDATE team SET sort_order = ? WHERE id = ?");
    const updateMany = db.transaction((items: { id: string; sort_order: number }[]) => {
      for (const item of items) {
        stmt.run(item.sort_order, item.id);
      }
    });
    updateMany(order);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
