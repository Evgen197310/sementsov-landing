import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/documents/${id}`, "PUT", { title: data.title });
    const doc = await prisma.document.update({
      where: { id: Number(id) },
      data: { title: data.title, slug: data.slug, content: data.content || "", fileUrl: data.fileUrl || "" },
    });
    logResponse(`/api/documents/${id}`, "PUT", 200);
    return NextResponse.json(doc);
  } catch (e) {
    logError("/api/documents/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/documents/${id}`, "DELETE");
    await prisma.document.delete({ where: { id: Number(id) } });
    logResponse(`/api/documents/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/documents/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
