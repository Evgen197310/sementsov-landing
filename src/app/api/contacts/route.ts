import { NextResponse } from "next/server";
import { getContacts, updateContacts } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const contacts = getContacts();
  return NextResponse.json(contacts);
}

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    updateContacts(data);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
