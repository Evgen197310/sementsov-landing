import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAllCases, insertCaseItem, updateCaseItem, deleteCaseItem } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const cases = getAllCases();
  return NextResponse.json(cases);
}

export async function POST(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const id = uuidv4();
    insertCaseItem({
      id,
      icon: data.icon || "Scale",
      title: data.title || "",
      category: data.category || null,
      description: data.description || null,
      sort_order: data.sort_order ?? 0,
      links: (data.links || []).map((l: { text: string; url: string }) => ({ id: uuidv4(), case_id: id, text: l.text, url: l.url })),
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    if (data.links) {
      data.links = data.links.map((l: { id?: string; text: string; url: string }) => ({
        id: l.id || uuidv4(),
        case_id: data.id,
        text: l.text,
        url: l.url,
      }));
    }
    updateCaseItem(data.id, data);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    deleteCaseItem(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
