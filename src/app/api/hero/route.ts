import { NextResponse } from "next/server";
import { getHero, updateHero } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const hero = getHero();
  return NextResponse.json(hero);
}

export async function PUT(request: Request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    updateHero(data);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
