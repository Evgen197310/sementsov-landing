import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(team);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const member = await prisma.teamMember.create({ data });
    return NextResponse.json(member);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
