import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const docs = await prisma.document.findMany();
  return NextResponse.json(docs);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const doc = await prisma.document.create({ data });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
