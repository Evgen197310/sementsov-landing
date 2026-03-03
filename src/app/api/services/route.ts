import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const where = category ? { category: { slug: category } } : {};
  const services = await prisma.service.findMany({ where, orderBy: { order: "asc" }, include: { category: true } });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const service = await prisma.service.create({ data });
    return NextResponse.json(service);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
