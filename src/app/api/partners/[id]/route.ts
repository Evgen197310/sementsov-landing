import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeUrl } from "@/lib/validation";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/partners/${id}`, "PUT", { name: data.name });
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
    logResponse(`/api/partners/${id}`, "PUT", 200);
    return NextResponse.json(partner);
  } catch (e) {
    logError("/api/partners/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/partners/${id}`, "DELETE");
    await prisma.partner.delete({ where: { id: Number(id) } });
    logResponse(`/api/partners/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/partners/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
