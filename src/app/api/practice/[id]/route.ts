import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    if (data._type === "category") {
      const cat = await prisma.practiceCategory.update({
        where: { id: Number(id) },
        data: { name: data.name, slug: data.slug, description: data.description || "" },
      });
      return NextResponse.json(cat);
    }
    const c = await prisma.practiceCase.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        situation: data.situation || "",
        actions: data.actions || "",
        result: data.result || "",
        tags: data.tags || "",
        categoryId: data.categoryId || null,
      },
    });
    return NextResponse.json(c);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    if (type === "category") {
      await prisma.practiceCase.updateMany({ where: { categoryId: Number(id) }, data: { categoryId: null } });
      await prisma.practiceCategory.delete({ where: { id: Number(id) } });
    } else {
      await prisma.practiceCase.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
