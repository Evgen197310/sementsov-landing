import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/practice/${id}`, "PUT", { _type: data._type, title: data.title || data.name });
    if (data._type === "category") {
      const cat = await prisma.practiceCategory.update({
        where: { id: Number(id) },
        data: { name: data.name, slug: data.slug, description: data.description || "", attachments: data.attachments || "" },
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
        attachments: data.attachments || "",
        categoryId: data.categoryId || null,
      },
    });
    logResponse(`/api/practice/${id}`, "PUT", 200);
    return NextResponse.json(c);
  } catch (e) {
    logError("/api/practice/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    logRequest(`/api/practice/${id}`, "DELETE", { type });
    if (type === "category") {
      await prisma.practiceCase.updateMany({ where: { categoryId: Number(id) }, data: { categoryId: null } });
      await prisma.practiceCategory.delete({ where: { id: Number(id) } });
    } else {
      await prisma.practiceCase.delete({ where: { id: Number(id) } });
    }
    logResponse(`/api/practice/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/practice/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
