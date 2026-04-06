import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/publications/${id}`, "PUT", { title: data.title });
    const pub = await prisma.publication.update({
      where: { id: Number(id) },
      data: { title: data.title, slug: data.slug, content: data.content || "", section: data.section || "", attachments: data.attachments || "" },
    });
    logResponse(`/api/publications/${id}`, "PUT", 200);
    return NextResponse.json(pub);
  } catch (e) {
    logError("/api/publications/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/publications/${id}`, "DELETE");
    await prisma.publication.delete({ where: { id: Number(id) } });
    logResponse(`/api/publications/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/publications/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
