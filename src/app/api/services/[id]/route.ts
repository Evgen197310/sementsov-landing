import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    logRequest(`/api/services/${id}`, "PUT", { title: data.title });
    await prisma.serviceFaq.deleteMany({ where: { serviceId: Number(id) } });
    const service = await prisma.service.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        content: data.content || "",
        icon: data.icon || "",
        order: data.order ?? 0,
        categoryId: data.categoryId,
        faqs: data.faqs?.length
          ? { create: data.faqs.map((f: { question: string; answer: string; order?: number }, i: number) => ({ question: f.question, answer: f.answer, order: f.order ?? i })) }
          : undefined,
      },
    });
    logResponse(`/api/services/${id}`, "PUT", 200);
    return NextResponse.json(service);
  } catch (e) {
    logError("/api/services/[id]", "PUT", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    logRequest(`/api/services/${id}`, "DELETE");
    await prisma.service.delete({ where: { id: Number(id) } });
    logResponse(`/api/services/${id}`, "DELETE", 200);
    return NextResponse.json({ success: true });
  } catch (e) {
    logError("/api/services/[id]", "DELETE", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
