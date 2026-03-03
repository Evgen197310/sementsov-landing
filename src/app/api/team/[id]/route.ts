import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const member = await prisma.teamMember.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        slug: data.slug,
        position: data.position || "",
        specialization: data.specialization || "",
        bio: data.bio || "",
        education: data.education || "",
        experience: data.experience || "",
        photo: data.photo || "",
        website: data.website || "",
        order: data.order ?? 0,
      },
    });
    return NextResponse.json(member);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.teamMember.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
