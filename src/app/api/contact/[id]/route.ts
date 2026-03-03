import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/contact/${id}`, "PUT", data);
    const msg = await prisma.contactMessage.update({
      where: { id: Number(id) },
      data: { read: data.read ?? true },
    });
    logResponse(`/api/contact/${id}`, "PUT", 200);
    return NextResponse.json(msg);
  } catch (e) {
    logError("/api/contact/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/contact/${id}`, "DELETE");
    await prisma.contactMessage.delete({ where: { id: Number(id) } });
    logResponse(`/api/contact/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/contact/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
