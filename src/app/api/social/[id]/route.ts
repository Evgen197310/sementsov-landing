import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/social/${id}`, "PUT", { platform: data.platform });
    const link = await prisma.socialLink.update({
      where: { id: Number(id) },
      data: {
        platform: data.platform,
        url: data.url,
        icon: data.icon || "",
        order: data.order ?? 0,
      },
    });
    logResponse(`/api/social/${id}`, "PUT", 200);
    return NextResponse.json(link);
  } catch (e) {
    logError("/api/social/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/social/${id}`, "DELETE");
    await prisma.socialLink.delete({ where: { id: Number(id) } });
    logResponse(`/api/social/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/social/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
