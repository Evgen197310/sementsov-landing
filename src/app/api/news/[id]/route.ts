import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/news/${id}`, "PUT", { title: data.title });
    const article = await prisma.newsArticle.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        section: data.section || "news",
        attachments: data.attachments || "",
      },
    });
    logResponse(`/api/news/${id}`, "PUT", 200);
    return NextResponse.json(article);
  } catch (e) {
    logError("/api/news/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/news/${id}`, "DELETE");
    await prisma.newsArticle.delete({ where: { id: Number(id) } });
    logResponse(`/api/news/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/news/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
