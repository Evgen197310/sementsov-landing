import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { logRequest, logResponse, logError } from "@/lib/logger";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  logRequest("/api/services", "GET", { category });
  const where = category ? { category: { slug: category } } : {};
  const services = await prisma.service.findMany({ where, orderBy: { order: "asc" }, include: { category: true, faqs: { orderBy: { order: "asc" } } } });
  const categories = await prisma.serviceCategory.findMany({ orderBy: { id: "asc" } });
  logResponse("/api/services", "GET", 200, { services: services.length, categories: categories.length });
  return NextResponse.json({ services, categories });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logRequest("/api/services", "POST", { title: data.title, slug: data.slug });
    const service = await prisma.service.create({
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
    logResponse("/api/services", "POST", 200, { id: service.id });
    return NextResponse.json(service);
  } catch (e) {
    logError("/api/services", "POST", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
