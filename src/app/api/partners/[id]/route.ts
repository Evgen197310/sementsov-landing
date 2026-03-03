import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const partner = await prisma.partner.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description || "",
        website: sanitizeUrl(data.website),
        email: data.email || "",
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(partner);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.partner.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
