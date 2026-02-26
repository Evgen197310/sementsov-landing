import { NextResponse } from "next/server";
import { getAbout, updateAbout, getAllAdvantages, insertAdvantage, updateAdvantage, deleteAdvantage } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const about = getAbout();
  const advantages = getAllAdvantages();
  return NextResponse.json({ about, advantages });
}

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();

    if (data.about) {
      updateAbout(data.about);
    }

    if (data.advantages && Array.isArray(data.advantages)) {
      const existing = getAllAdvantages();
      const existingIds = new Set(existing.map(a => a.id));
      const newIds = new Set(data.advantages.map((a: { id?: string }) => a.id).filter(Boolean));

      // Delete removed advantages
      for (const ex of existing) {
        if (!newIds.has(ex.id)) {
          deleteAdvantage(ex.id);
        }
      }

      // Upsert advantages
      for (let i = 0; i < data.advantages.length; i++) {
        const adv = data.advantages[i];
        if (adv.id && existingIds.has(adv.id)) {
          updateAdvantage(adv.id, { ...adv, sort_order: i });
        } else {
          insertAdvantage({ id: adv.id || uuidv4(), icon: adv.icon, title: adv.title, description: adv.description, sort_order: i });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
