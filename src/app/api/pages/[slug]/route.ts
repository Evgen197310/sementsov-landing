import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await request.json();
    const page = await prisma.page.update({ where: { slug }, data: { title: data.title, content: data.content } });
    return NextResponse.json(page);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
