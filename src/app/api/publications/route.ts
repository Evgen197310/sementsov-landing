import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const pubs = await prisma.publication.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(pubs);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const pub = await prisma.publication.create({ data });
    return NextResponse.json(pub);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
