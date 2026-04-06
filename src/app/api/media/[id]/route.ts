import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/media/${id}`, "PUT", { _type: data._type, title: data.title || data.name });
    if (data._type === "category") {
      const cat = await prisma.mediaCategory.update({
        where: { id: Number(id) },
        data: { name: data.name, slug: data.slug, description: data.description || "", attachments: data.attachments || "" },
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
        attachments: data.attachments || "",
        categoryId: data.categoryId || null,
      },
    });
    logResponse(`/api/media/${id}`, "PUT", 200);
    return NextResponse.json(article);
  } catch (e) {
    logError("/api/media/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    logRequest(`/api/media/${id}`, "DELETE", { type });
    if (type === "category") {
      await prisma.mediaArticle.updateMany({ where: { categoryId: Number(id) }, data: { categoryId: null } });
      await prisma.mediaCategory.delete({ where: { id: Number(id) } });
    } else {
      await prisma.mediaArticle.delete({ where: { id: Number(id) } });
    }
    logResponse(`/api/media/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/media/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
