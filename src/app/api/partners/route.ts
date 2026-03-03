import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const partner = await prisma.partner.create({ data });
    return NextResponse.json(partner);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
