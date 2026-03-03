import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    if (data._type === "category") {
      const cat = await prisma.mediaCategory.update({
        where: { id: Number(id) },
        data: { name: data.name, slug: data.slug, description: data.description || "" },
      });
      return NextResponse.json(cat);
    }
    const article = await prisma.mediaArticle.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        source: sanitizeUrl(data.source),
        tags: data.tags || "",
        categoryId: data.categoryId || null,
      },
    });
    return NextResponse.json(article);
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
      await prisma.mediaArticle.updateMany({ where: { categoryId: Number(id) }, data: { categoryId: null } });
      await prisma.mediaCategory.delete({ where: { id: Number(id) } });
    } else {
      await prisma.mediaArticle.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
